import { TranslationSystemConfig, TranslationConfig } from '@/types/translations';

// Default configuration for each namespace
const defaultNamespaceConfig: TranslationConfig = {
  strategy: 'static',
  cacheTimeout: 300, // 5 minutes
  fallbackToStatic: true,
  preloadKeys: [],
  priority: 'balanced'
};

// Namespace-specific configurations
export const namespaceConfigs: Record<string, TranslationConfig> = {
  // Critical UI elements - always static for performance
  'Navigation': {
    strategy: 'static',
    cacheTimeout: 3600, // 1 hour
    fallbackToStatic: true,
    preloadKeys: ['home', 'admin', 'docs', 'language_switcher'],
    priority: 'performance'
  },
  
  'Common': {
    strategy: 'static',
    cacheTimeout: 3600, // 1 hour
    fallbackToStatic: true,
    preloadKeys: ['loading', 'error', 'save', 'cancel'],
    priority: 'performance'
  },

  // Homepage can be hybrid - some content from DB
  'HomePage': {
    strategy: 'hybrid',
    cacheTimeout: 300, // 5 minutes
    fallbackToStatic: true,
    preloadKeys: ['title', 'subtitle'],
    priority: 'balanced'
  },

  // Admin panel - fresh content from DB
  'AdminPanel': {
    strategy: 'dynamic',
    cacheTimeout: 60, // 1 minute
    fallbackToStatic: true,
    preloadKeys: [],
    priority: 'freshness'
  },

  // User-generated content - always from DB
  'UserContent': {
    strategy: 'dynamic',
    cacheTimeout: 0, // No cache
    fallbackToStatic: false,
    preloadKeys: [],
    priority: 'freshness'
  },

  // SEO content - hybrid approach
  'SEO': {
    strategy: 'hybrid',
    cacheTimeout: 1800, // 30 minutes
    fallbackToStatic: true,
    preloadKeys: ['title', 'description'],
    priority: 'performance'
  }
};

// Main system configuration
export const translationSystemConfig: TranslationSystemConfig = {
  defaultStrategy: 'static',
  namespaceConfigs,
  
  cache: {
    memory: {
      enabled: true,
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 300 // 5 minutes
    },
    redis: {
      enabled: false, // Will be enabled when Redis is available
      ttl: 3600, // 1 hour
      keyPrefix: 'trans:'
    },
    edge: {
      enabled: false, // For CDN caching
      ttl: 86400 // 24 hours
    }
  },

  fallback: {
    enabled: true,
    staticFilesPath: './messages'
  },

  database: {
    enabled: false, // Will be enabled when Prisma is set up
    connectionString: process.env.DATABASE_URL
  },

  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    metricsEndpoint: '/api/translation-metrics'
  }
};

// Helper function to get configuration for a namespace
export function getNamespaceConfig(namespace: string): TranslationConfig {
  return namespaceConfigs[namespace] || defaultNamespaceConfig;
}

// Helper function to determine if a namespace should use database
export function shouldUseDatabase(namespace: string): boolean {
  const config = getNamespaceConfig(namespace);
  return translationSystemConfig.database.enabled && 
         (config.strategy === 'dynamic' || config.strategy === 'hybrid');
}

// Helper function to determine cache TTL for a namespace
export function getCacheTTL(namespace: string): number {
  const config = getNamespaceConfig(namespace);
  return config.cacheTimeout;
}

// Environment-based configuration overrides
if (process.env.NODE_ENV === 'development') {
  // Shorter cache times in development
  Object.keys(namespaceConfigs).forEach(namespace => {
    namespaceConfigs[namespace].cacheTimeout = Math.min(
      namespaceConfigs[namespace].cacheTimeout,
      60 // Max 1 minute in development
    );
  });
}

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable Redis in production if available
  if (process.env.REDIS_URL) {
    translationSystemConfig.cache.redis.enabled = true;
  }
  
  // Enable database if available
  if (process.env.DATABASE_URL) {
    translationSystemConfig.database.enabled = true;
  }
}
