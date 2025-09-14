import { TranslationProvider, TranslationMetrics } from '@/types/translations';
import { FileTranslationProvider } from '@/lib/providers/file-translation-provider';
import { translationSystemConfig, getNamespaceConfig, shouldUseDatabase } from './config';

export class TranslationManager {
  private fileProvider: FileTranslationProvider;
  private databaseProvider: TranslationProvider | null = null;
  private static instance: TranslationManager | null = null;

  private constructor() {
    this.fileProvider = new FileTranslationProvider(
      translationSystemConfig.fallback.staticFilesPath,
      {
        maxSize: translationSystemConfig.cache.memory.maxSize,
        ttl: translationSystemConfig.cache.memory.ttl
      }
    );
    
    // TODO: Initialize database provider when Prisma is set up
    // this.databaseProvider = new DatabaseTranslationProvider();
  }

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance;
  }

  async getTranslation(
    key: string, 
    locale: string, 
    namespace: string
  ): Promise<string | null> {
    const config = getNamespaceConfig(namespace);
    
    try {
      // Strategy 1: Try database if configured for dynamic/hybrid
      if (shouldUseDatabase(namespace) && this.databaseProvider) {
        const dbValue = await this.databaseProvider.getTranslation(key, locale, namespace);
        if (dbValue !== null) {
          return dbValue;
        }
        
        // If hybrid strategy and DB fails, fall back to static
        if (config.strategy === 'hybrid' && config.fallbackToStatic) {
          const staticValue = await this.fileProvider.getTranslation(key, locale, namespace);
          return staticValue;
        }
      }
      
      // Strategy 2: Use static files (default for static strategy or fallback)
      const staticValue = await this.fileProvider.getTranslation(key, locale, namespace);
      return staticValue;
      
    } catch (error) {
      console.error(`Error getting translation ${namespace}:${key} for ${locale}:`, error);
      
      // Last resort: try static files if not already tried
      if (shouldUseDatabase(namespace) && config.fallbackToStatic) {
        try {
          return await this.fileProvider.getTranslation(key, locale, namespace);
        } catch (fallbackError) {
          console.error('Fallback to static files also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }

  async getNamespace(
    namespace: string, 
    locale: string
  ): Promise<Record<string, string>> {
    const config = getNamespaceConfig(namespace);
    
    try {
      // Try database first for dynamic/hybrid namespaces
      if (shouldUseDatabase(namespace) && this.databaseProvider) {
        const dbNamespace = await this.databaseProvider.getNamespace(namespace, locale);
        if (Object.keys(dbNamespace).length > 0) {
          return dbNamespace;
        }
        
        // Fallback to static for hybrid strategy
        if (config.strategy === 'hybrid' && config.fallbackToStatic) {
          return await this.fileProvider.getNamespace(namespace, locale);
        }
      }
      
      // Use static files
      return await this.fileProvider.getNamespace(namespace, locale);
      
    } catch (error) {
      console.error(`Error getting namespace ${namespace} for ${locale}:`, error);
      
      // Fallback to static
      if (shouldUseDatabase(namespace) && config.fallbackToStatic) {
        try {
          return await this.fileProvider.getNamespace(namespace, locale);
        } catch (fallbackError) {
          console.error('Fallback to static files failed:', fallbackError);
        }
      }
      
      return {};
    }
  }

  async preloadCriticalTranslations(locale: string): Promise<void> {
    const promises: Promise<void>[] = [];
    
    for (const [namespace, config] of Object.entries(translationSystemConfig.namespaceConfigs)) {
      if (config.preloadKeys.length > 0) {
        promises.push(this.warmCache(namespace, locale));
      }
    }
    
    await Promise.allSettled(promises);
  }

  async warmCache(namespace: string, locale: string): Promise<void> {
    try {
      // Warm both providers if available
      await this.fileProvider.warmCache(namespace, locale);
      
      if (shouldUseDatabase(namespace) && this.databaseProvider) {
        await this.databaseProvider.warmCache(namespace, locale);
      }
    } catch (error) {
      console.error(`Error warming cache for ${namespace}:${locale}:`, error);
    }
  }

  async invalidateCache(namespace?: string, locale?: string): Promise<void> {
    try {
      await this.fileProvider.invalidateCache(namespace, locale);
      
      if (this.databaseProvider) {
        await this.databaseProvider.invalidateCache(namespace, locale);
      }
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }

  async getMetrics(): Promise<{
    file: TranslationMetrics;
    database?: TranslationMetrics;
    system: {
      providersActive: number;
      databaseEnabled: boolean;
      cacheEnabled: boolean;
    };
  }> {
    const metrics = {
      file: await this.fileProvider.getMetrics(),
      system: {
        providersActive: this.databaseProvider ? 2 : 1,
        databaseEnabled: translationSystemConfig.database.enabled,
        cacheEnabled: translationSystemConfig.cache.memory.enabled
      }
    };

    if (this.databaseProvider) {
      return {
        ...metrics,
        database: await this.databaseProvider.getMetrics()
      };
    }

    return metrics;
  }

  // Method to set database provider when Prisma is ready
  setDatabaseProvider(provider: TranslationProvider): void {
    this.databaseProvider = provider;
  }

  // Health check method
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    providers: {
      file: 'ok' | 'error';
      database: 'ok' | 'error' | 'disabled';
    };
    latency: {
      file: number;
      database?: number;
    };
  }> {
    const result = {
      status: 'healthy' as const,
      providers: {
        file: 'ok' as const,
        database: 'disabled' as const
      },
      latency: {
        file: 0
      }
    };

    // Test file provider
    try {
      const start = Date.now();
      await this.fileProvider.getTranslation('title', 'en', 'HomePage');
      result.latency.file = Date.now() - start;
    } catch (error) {
      result.providers.file = 'error';
      result.status = 'degraded';
    }

    // Test database provider if available
    if (this.databaseProvider) {
      try {
        const start = Date.now();
        await this.databaseProvider.getTranslation('title', 'en', 'HomePage');
        result.latency.database = Date.now() - start;
        result.providers.database = 'ok';
      } catch (error) {
        result.providers.database = 'error';
        if (result.providers.file === 'error') {
          result.status = 'unhealthy';
        } else {
          result.status = 'degraded';
        }
      }
    }

    return result;
  }
}

// Export singleton instance
export const translationManager = TranslationManager.getInstance();
