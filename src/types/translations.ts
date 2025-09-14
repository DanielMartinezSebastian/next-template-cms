/**
 * Core types for the hybrid translation system
 * Supports both static JSON files and dynamic database translations
 */

export type TranslationStrategy = 'static' | 'dynamic' | 'hybrid';

export interface TranslationConfig {
  strategy: TranslationStrategy;
  cacheTimeout: number; // seconds
  fallbackToStatic: boolean;
  preloadKeys: string[];
  priority: 'performance' | 'freshness' | 'balanced';
}

export interface TranslationMetadata {
  version: number;
  lastModified: Date;
  author?: string;
  category?: string;
  description?: string;
  tags?: string[];
}

export interface Translation {
  id: string;
  namespace: string;
  key: string;
  locale: string;
  value: string;
  metadata?: TranslationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationProvider {
  getTranslation(key: string, locale: string, namespace: string): Promise<string | null>;
  getNamespace(namespace: string, locale: string): Promise<Record<string, string>>;
  getAllNamespaces(locale: string): Promise<Record<string, Record<string, string>>>;
  warmCache(namespace: string, locale: string): Promise<void>;
  invalidateCache(namespace?: string, locale?: string): Promise<void>;
  getMetrics(): Promise<TranslationMetrics>;
}

export interface TranslationMetrics {
  cacheHitRate: number;
  avgResponseTime: number;
  totalRequests: number;
  errorRate: number;
  lastUpdated: Date;
}

export interface CacheLayer {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export interface TranslationCacheConfig {
  memory: {
    enabled: boolean;
    maxSize: number;
    ttl: number; // seconds
  };
  redis: {
    enabled: boolean;
    ttl: number; // seconds
    keyPrefix: string;
  };
  edge: {
    enabled: boolean;
    ttl: number; // seconds
  };
}

export interface TranslationSystemConfig {
  defaultStrategy: TranslationStrategy;
  namespaceConfigs: Record<string, TranslationConfig>;
  cache: TranslationCacheConfig;
  fallback: {
    enabled: boolean;
    staticFilesPath: string;
  };
  database: {
    enabled: boolean;
    connectionString?: string;
  };
  monitoring: {
    enabled: boolean;
    metricsEndpoint?: string;
  };
}

export type TranslationKey = string;
export type LocaleCode = string;
export type NamespaceName = string;
