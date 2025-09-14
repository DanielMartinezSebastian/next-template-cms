import { TranslationProvider, TranslationMetrics } from "@/types/translations";
import { MemoryCache } from "@/lib/cache/memory-cache";
import path from "path";
import fs from "fs/promises";

export class FileTranslationProvider implements TranslationProvider {
  private cache: MemoryCache;
  private basePath: string;
  private metrics: TranslationMetrics;
  private requestCount = 0;
  private errorCount = 0;
  private totalResponseTime = 0;
  private cacheHits = 0;

  constructor(
    basePath = "./messages",
    cacheConfig = { maxSize: 50 * 1024 * 1024, ttl: 300 }
  ) {
    this.basePath = basePath;
    this.cache = new MemoryCache(cacheConfig.maxSize, cacheConfig.ttl);
    this.metrics = {
      cacheHitRate: 0,
      avgResponseTime: 0,
      totalRequests: 0,
      errorRate: 0,
      lastUpdated: new Date(),
    };
  }

  async getTranslation(
    key: string,
    locale: string,
    namespace: string
  ): Promise<string | null> {
    const startTime = Date.now();
    this.requestCount++;

    try {
      // Check cache first
      const cacheKey = `${namespace}:${locale}`;
      let namespaceData =
        await this.cache.get<Record<string, string>>(cacheKey);

      if (namespaceData) {
        this.cacheHits++;
      } else {
        // Load from file
        namespaceData = await this.loadNamespaceFromFile(namespace, locale);
        if (namespaceData) {
          await this.cache.set(cacheKey, namespaceData, 300); // 5 min cache
        }
      }

      const value = this.getNestedValue(namespaceData, key);
      this.updateMetrics(startTime);
      return value || null;
    } catch (error) {
      this.errorCount++;
      this.updateMetrics(startTime);
      console.error(
        `Error getting translation ${namespace}:${key} for ${locale}:`,
        error
      );
      return null;
    }
  }

  async getNamespace(
    namespace: string,
    locale: string
  ): Promise<Record<string, string>> {
    const startTime = Date.now();
    this.requestCount++;

    try {
      const cacheKey = `${namespace}:${locale}`;
      let namespaceData =
        await this.cache.get<Record<string, string>>(cacheKey);

      if (namespaceData) {
        this.cacheHits++;
        this.updateMetrics(startTime);
        return namespaceData;
      }

      namespaceData = await this.loadNamespaceFromFile(namespace, locale);
      if (namespaceData) {
        await this.cache.set(cacheKey, namespaceData, 300);
        this.updateMetrics(startTime);
        return namespaceData;
      }

      this.updateMetrics(startTime);
      return {};
    } catch (error) {
      this.errorCount++;
      this.updateMetrics(startTime);
      console.error(
        `Error getting namespace ${namespace} for ${locale}:`,
        error
      );
      return {};
    }
  }

  async getAllNamespaces(
    locale: string
  ): Promise<Record<string, Record<string, string>>> {
    const startTime = Date.now();
    this.requestCount++;

    try {
      const filePath = path.join(this.basePath, `${locale}.json`);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      this.updateMetrics(startTime);
      return data;
    } catch (error) {
      this.errorCount++;
      this.updateMetrics(startTime);
      console.error(`Error getting all namespaces for ${locale}:`, error);
      return {};
    }
  }

  async warmCache(namespace: string, locale: string): Promise<void> {
    try {
      const data = await this.loadNamespaceFromFile(namespace, locale);
      if (data) {
        const cacheKey = `${namespace}:${locale}`;
        await this.cache.set(cacheKey, data, 300);
      }
    } catch (error) {
      console.error(`Error warming cache for ${namespace}:${locale}:`, error);
    }
  }

  async invalidateCache(namespace?: string, locale?: string): Promise<void> {
    if (namespace && locale) {
      await this.cache.del(`${namespace}:${locale}`);
    } else if (namespace) {
      await this.cache.clear(`${namespace}:*`);
    } else if (locale) {
      await this.cache.clear(`*:${locale}`);
    } else {
      await this.cache.clear();
    }
  }

  async getMetrics(): Promise<TranslationMetrics> {
    return {
      ...this.metrics,
      lastUpdated: new Date(),
    };
  }

  private async loadNamespaceFromFile(
    namespace: string,
    locale: string
  ): Promise<Record<string, string> | null> {
    try {
      // Intentar cargar archivo específico por namespace primero
      const specificFilePath = path.join(
        this.basePath,
        locale,
        `${namespace.toLowerCase()}.json`
      );

      try {
        const specificContent = await fs.readFile(specificFilePath, "utf-8");
        const specificData = JSON.parse(specificContent);
        return this.flattenObject(specificData);
      } catch {
        // Fallback al archivo general si no existe el específico
        const generalFilePath = path.join(this.basePath, `${locale}.json`);

        try {
          const generalContent = await fs.readFile(generalFilePath, "utf-8");
          const generalData = JSON.parse(generalContent);

          if (generalData[namespace]) {
            return this.flattenObject(generalData[namespace]);
          }
        } catch {
          // Si tampoco existe el archivo general, reportar error
          console.error(
            `No translation file found for namespace ${namespace} and locale ${locale}`
          );
        }
      }

      return null;
    } catch (error) {
      console.error(
        `Error loading namespace ${namespace} from file for ${locale}:`,
        error
      );
      return null;
    }
  }

  private getNestedValue(
    obj: Record<string, unknown> | null,
    key: string
  ): string | undefined {
    if (!obj) return undefined;

    // Support nested keys like 'features.visual_editor'
    const keys = key.split(".");
    let current: unknown = obj;

    for (const k of keys) {
      if (
        current &&
        typeof current === "object" &&
        current !== null &&
        k in current
      ) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }

    return typeof current === "string" ? current : undefined;
  }

  private flattenObject(
    obj: Record<string, unknown>,
    prefix = ""
  ): Record<string, string> {
    const flattened: Record<string, string> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          Object.assign(
            flattened,
            this.flattenObject(value as Record<string, unknown>, newKey)
          );
        } else {
          flattened[newKey] = String(value);
        }
      }
    }

    return flattened;
  }

  private updateMetrics(startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.totalResponseTime += responseTime;

    this.metrics = {
      cacheHitRate:
        this.requestCount > 0 ? this.cacheHits / this.requestCount : 0,
      avgResponseTime:
        this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0,
      totalRequests: this.requestCount,
      errorRate:
        this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      lastUpdated: new Date(),
    };
  }
}
