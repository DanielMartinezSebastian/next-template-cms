import { prisma } from '@/lib/db';
import { MemoryCache } from '@/lib/cache/memory-cache';
import { TranslationProvider, TranslationMetrics } from '@/types/translations';

export class DatabaseTranslationProvider implements TranslationProvider {
  private cache: MemoryCache;
  private metrics: TranslationMetrics;

  constructor(cacheOptions = { maxSize: 50 * 1024 * 1024, ttl: 900 }) {
    this.cache = new MemoryCache(cacheOptions.maxSize, cacheOptions.ttl);
    this.metrics = {
      cacheHitRate: 0,
      avgResponseTime: 0,
      totalRequests: 0,
      errorRate: 0,
      lastUpdated: new Date(),
    };
  }

  async getTranslation(key: string, locale: string, namespace: string): Promise<string | null> {
    const cacheKey = `${locale}:${namespace}:${key}`;

    // Check cache first
    const cached = await this.cache.get<string>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      // Get locale and namespace IDs
      const localeRecord = await prisma.locale.findUnique({
        where: { code: locale },
      });

      const namespaceRecord = await prisma.namespace.findUnique({
        where: { name: namespace },
      });

      if (!localeRecord || !namespaceRecord) {
        this.cache.set(cacheKey, null);
        return null;
      }

      // Get translation
      const translation = await prisma.translation.findUnique({
        where: {
          key_localeId_namespaceId: {
            key,
            localeId: localeRecord.id,
            namespaceId: namespaceRecord.id,
          },
        },
      });

      const value = translation?.value || null;

      // Update usage statistics
      if (translation) {
        await prisma.translation.update({
          where: { id: translation.id },
          data: {
            lastUsedAt: new Date(),
            usageCount: {
              increment: 1,
            },
          },
        });
      }

      // Cache the result
      this.cache.set(cacheKey, value);
      return value;
    } catch (error) {
      console.error('Database translation fetch error:', error);
      return null;
    }
  }

  async getNamespace(namespace: string, locale: string): Promise<Record<string, string>> {
    const cacheKey = `namespace:${locale}:${namespace}`;

    // Check cache first
    const cached = await this.cache.get<Record<string, string>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get locale and namespace records
      const localeRecord = await prisma.locale.findUnique({
        where: { code: locale },
      });

      const namespaceRecord = await prisma.namespace.findUnique({
        where: { name: namespace },
      });

      if (!localeRecord || !namespaceRecord) {
        this.cache.set(cacheKey, {});
        return {};
      }

      // Get all translations for this namespace and locale
      const translations = await prisma.translation.findMany({
        where: {
          localeId: localeRecord.id,
          namespaceId: namespaceRecord.id,
          isActive: true,
        },
        select: {
          key: true,
          value: true,
        },
      });

      // Build the namespace object
      const namespaceData: Record<string, string> = {};
      translations.forEach((translation: { key: string; value: string }) => {
        namespaceData[translation.key] = translation.value;
      });

      // Cache the result
      this.cache.set(cacheKey, namespaceData);
      return namespaceData;
    } catch (error) {
      console.error('Database namespace fetch error:', error);
      return {};
    }
  }

  async getAllNamespaces(locale: string): Promise<Record<string, Record<string, string>>> {
    const cacheKey = `all-namespaces:${locale}`;

    // Check cache first
    const cached = await this.cache.get<Record<string, Record<string, string>>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get locale record
      const localeRecord = await prisma.locale.findUnique({
        where: { code: locale },
      });

      if (!localeRecord) {
        return {};
      }

      // Get all active namespaces with their translations
      const namespaces = await prisma.namespace.findMany({
        where: { isActive: true },
        include: {
          translations: {
            where: {
              localeId: localeRecord.id,
              isActive: true,
            },
            select: {
              key: true,
              value: true,
            },
          },
        },
      });

      // Build the result object
      const result: Record<string, Record<string, string>> = {};
      namespaces.forEach((namespace: { name: string; translations: Array<{ key: string; value: string }> }) => {
        const namespaceData: Record<string, string> = {};
        namespace.translations.forEach((translation: { key: string; value: string }) => {
          namespaceData[translation.key] = translation.value;
        });
        result[namespace.name] = namespaceData;
      });

      // Cache the result
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Database getAllNamespaces error:', error);
      return {};
    }
  }

  async setTranslation(
    key: string,
    value: string,
    locale: string,
    namespace: string
  ): Promise<boolean> {
    try {
      // Ensure locale and namespace exist
      const localeRecord = await prisma.locale.upsert({
        where: { code: locale },
        update: {},
        create: {
          code: locale,
          name: locale.toUpperCase(),
          isActive: true,
        },
      });

      const namespaceRecord = await prisma.namespace.upsert({
        where: { name: namespace },
        update: {},
        create: {
          name: namespace,
          description: `Auto-created namespace: ${namespace}`,
          isActive: true,
        },
      });

      // Upsert the translation
      await prisma.translation.upsert({
        where: {
          key_localeId_namespaceId: {
            key,
            localeId: localeRecord.id,
            namespaceId: namespaceRecord.id,
          },
        },
        update: {
          value,
          isActive: true,
        },
        create: {
          key,
          value,
          localeId: localeRecord.id,
          namespaceId: namespaceRecord.id,
          isActive: true,
        },
      });

      // Invalidate cache
      const cacheKey = `${locale}:${namespace}:${key}`;
      const namespaceCacheKey = `namespace:${locale}:${namespace}`;
      this.cache.del(cacheKey);
      this.cache.del(namespaceCacheKey);

      return true;
    } catch (error) {
      console.error('Database translation set error:', error);
      return false;
    }
  }

  async warmCache(namespace: string, locale: string): Promise<void> {
    // Pre-load the entire namespace into cache
    await this.getNamespace(namespace, locale);
  }

  async invalidateCache(namespace?: string, locale?: string): Promise<void> {
    if (namespace && locale) {
      // Invalidate specific namespace
      const namespaceCacheKey = `namespace:${locale}:${namespace}`;
      this.cache.del(namespaceCacheKey);

      // Invalidate all keys in this namespace
      const pattern = `${locale}:${namespace}:`;
      this.cache.clear(pattern);
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  async getMetrics(): Promise<TranslationMetrics> {
    try {
      // Get total translations count
      const totalTranslations = await prisma.translation.count({
        where: { isActive: true },
      });

      return {
        cacheHitRate: 0.85, // Placeholder - should be calculated from actual cache stats
        avgResponseTime: 50, // Placeholder - should track actual response times
        totalRequests: totalTranslations,
        errorRate: 0.01, // Placeholder - should track actual errors
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Database metrics error:', error);
      return {
        cacheHitRate: 0,
        avgResponseTime: 0,
        totalRequests: 0,
        errorRate: 1.0,
        lastUpdated: new Date(),
      };
    }
  }

  async healthCheck(): Promise<{ status: 'ok' | 'error'; latency: number }> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        latency: Date.now() - start,
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: 'error',
        latency: Date.now() - start,
      };
    }
  }
}
