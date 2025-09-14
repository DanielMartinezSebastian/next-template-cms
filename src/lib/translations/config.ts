import { TranslationSystemConfig, TranslationConfig } from '@/types/translations';

// Default configuration for each namespace
const defaultNamespaceConfig: TranslationConfig = {
  strategy: 'static',
  cacheTimeout: 300, // 5 minutes
  fallbackToStatic: true,
  preloadKeys: [],
  priority: 'balanced',
};

// Namespace-specific configurations
export const namespaceConfigs: Record<string, TranslationConfig> = {
  // Traducciones compartidas - siempre estáticas y rápidas
  Common: {
    strategy: 'static',
    cacheTimeout: 3600, // 1 hora
    fallbackToStatic: true,
    preloadKeys: ['navigation.home', 'navigation.admin', 'buttons.save', 'buttons.cancel'],
    priority: 'performance',
  },

  // Página de inicio - híbrida para flexibilidad
  Home: {
    strategy: 'hybrid',
    cacheTimeout: 300, // 5 minutos
    fallbackToStatic: true,
    preloadKeys: ['hero.title', 'hero.subtitle'],
    priority: 'balanced',
  },

  // Panel de administración - dinámico para actualizaciones frecuentes
  Admin: {
    strategy: 'dynamic',
    cacheTimeout: 60, // 1 minuto
    fallbackToStatic: true,
    preloadKeys: [],
    priority: 'freshness',
  },

  // Contenido de usuario - siempre dinámico
  UserContent: {
    strategy: 'dynamic',
    cacheTimeout: 0, // Sin cache
    fallbackToStatic: false,
    preloadKeys: [],
    priority: 'freshness',
  },

  // SEO content - híbrido
  SEO: {
    strategy: 'hybrid',
    cacheTimeout: 1800, // 30 minutos
    fallbackToStatic: true,
    preloadKeys: ['title', 'description'],
    priority: 'performance',
  },
};

// Main system configuration
export const translationSystemConfig: TranslationSystemConfig = {
  defaultStrategy: 'static',
  namespaceConfigs,

  cache: {
    memory: {
      enabled: true,
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 300, // 5 minutes
    },
    redis: {
      enabled: false, // Will be enabled when Redis is available
      ttl: 3600, // 1 hour
      keyPrefix: 'trans:',
    },
    edge: {
      enabled: false, // For CDN caching
      ttl: 86400, // 24 hours
    },
  },

  fallback: {
    enabled: true,
    staticFilesPath: './messages',
  },

  database: {
    enabled: false, // Will be enabled when Prisma is set up
    connectionString: process.env.DATABASE_URL,
  },

  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    metricsEndpoint: '/api/translation-metrics',
  },
};

// Helper function to get configuration for a namespace
export function getNamespaceConfig(namespace: string): TranslationConfig {
  return namespaceConfigs[namespace] || defaultNamespaceConfig;
}

// Helper function to determine if a namespace should use database
export function shouldUseDatabase(namespace: string): boolean {
  const config = getNamespaceConfig(namespace);
  return (
    translationSystemConfig.database.enabled &&
    (config.strategy === 'dynamic' || config.strategy === 'hybrid')
  );
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
