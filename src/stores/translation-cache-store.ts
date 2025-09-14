/**
 * Translation Cache Store Types and Implementation
 * Manages translation caching, metrics, and loading states
 */

import type { TranslationMetrics } from '@/types/translations';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

// Translation cache entry type
export interface TranslationCacheEntry {
  translations: Record<string, string>;
  lastFetched: Date;
  ttl: number;
}

// Translation cache state interface
export interface TranslationCacheState {
  // State
  cachedTranslations: Map<string, Record<string, string>>;
  cacheMetrics: TranslationMetrics;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCachedTranslations: (key: string, translations: Record<string, string>) => void;
  getCachedTranslations: (key: string) => Record<string, string> | null;
  removeCachedTranslations: (key: string) => void;
  clearCache: () => void;
  updateMetrics: (metrics: Partial<TranslationMetrics>) => void;
  incrementRequests: () => void;
  incrementHits: () => void;
  incrementErrors: () => void;
  updateResponseTime: (time: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getCacheSize: () => number;
  getCacheKeys: () => string[];
  isCacheExpired: (key: string, ttl?: number) => boolean;
  refreshCache: (key: string) => void;
}

// Default metrics
const defaultMetrics: TranslationMetrics = {
  cacheHitRate: 0,
  avgResponseTime: 0,
  totalRequests: 0,
  errorRate: 0,
  lastUpdated: new Date(),
};

// State creator for the translation cache store
const createTranslationCacheSlice: StateCreator<
  TranslationCacheState,
  [['zustand/devtools', never]],
  [],
  TranslationCacheState
> = (set, get) => ({
  // Initial state
  cachedTranslations: new Map(),
  cacheMetrics: defaultMetrics,
  isLoading: false,
  error: null,

  // Cache management actions
  setCachedTranslations: (key, translations) =>
    set(
      state => {
        const newMap = new Map(state.cachedTranslations);
        newMap.set(key, translations);
        return { cachedTranslations: newMap };
      },
      false,
      'setCachedTranslations'
    ),

  getCachedTranslations: key => {
    const { cachedTranslations } = get();
    return cachedTranslations.get(key) || null;
  },

  removeCachedTranslations: key =>
    set(
      state => {
        const newMap = new Map(state.cachedTranslations);
        newMap.delete(key);
        return { cachedTranslations: newMap };
      },
      false,
      'removeCachedTranslations'
    ),

  clearCache: () =>
    set(
      {
        cachedTranslations: new Map(),
        cacheMetrics: { ...defaultMetrics, lastUpdated: new Date() },
      },
      false,
      'clearCache'
    ),

  // Metrics actions
  updateMetrics: metrics =>
    set(
      state => ({
        cacheMetrics: {
          ...state.cacheMetrics,
          ...metrics,
          lastUpdated: new Date(),
        },
      }),
      false,
      'updateMetrics'
    ),

  incrementRequests: () => {
    const { cacheMetrics } = get();
    get().updateMetrics({
      totalRequests: cacheMetrics.totalRequests + 1,
    });
  },

  incrementHits: () => {
    const { cacheMetrics } = get();
    const newTotalRequests = cacheMetrics.totalRequests + 1;
    const totalHits = Math.round(cacheMetrics.cacheHitRate * cacheMetrics.totalRequests) + 1;

    get().updateMetrics({
      totalRequests: newTotalRequests,
      cacheHitRate: totalHits / newTotalRequests,
    });
  },

  incrementErrors: () => {
    const { cacheMetrics } = get();
    const newTotalRequests = cacheMetrics.totalRequests + 1;
    const totalErrors = Math.round(cacheMetrics.errorRate * cacheMetrics.totalRequests) + 1;

    get().updateMetrics({
      totalRequests: newTotalRequests,
      errorRate: totalErrors / newTotalRequests,
    });
  },

  updateResponseTime: time => {
    const { cacheMetrics } = get();
    const newAvgTime =
      cacheMetrics.totalRequests === 0
        ? time
        : (cacheMetrics.avgResponseTime * cacheMetrics.totalRequests + time) /
          (cacheMetrics.totalRequests + 1);

    get().updateMetrics({
      avgResponseTime: newAvgTime,
    });
  },

  // Loading and error actions
  setLoading: loading => set({ isLoading: loading }, false, 'setLoading'),
  setError: error => set({ error }, false, 'setError'),
  clearError: () => set({ error: null }, false, 'clearError'),

  // Utility actions
  getCacheSize: () => {
    const { cachedTranslations } = get();
    return cachedTranslations.size;
  },

  getCacheKeys: () => {
    const { cachedTranslations } = get();
    return Array.from(cachedTranslations.keys());
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isCacheExpired: (key, _ttl = 300) => {
    // Default 5 minutes TTL
    const { cachedTranslations } = get();
    const entry = cachedTranslations.get(key);

    if (!entry) return true;

    // For now, we don't have expiration timestamps in the Map
    // This would need to be enhanced to store entry metadata
    // _ttl parameter is prepared for future use (prefixed with _ to indicate unused)
    return false;
  },

  refreshCache: key => {
    const { removeCachedTranslations } = get();
    removeCachedTranslations(key);
  },
});

// Create the translation cache store
export const useTranslationCacheStore = create<TranslationCacheState>()(
  devtools(createTranslationCacheSlice, {
    name: 'translation-cache-store',
  })
);

// Selector hooks for better performance
export const useCachedTranslations = () =>
  useTranslationCacheStore(state => state.cachedTranslations);

export const useCacheMetrics = () => useTranslationCacheStore(state => state.cacheMetrics);

export const useCacheLoading = () => useTranslationCacheStore(state => state.isLoading);

export const useCacheError = () => useTranslationCacheStore(state => state.error);

export const useCacheSize = () => useTranslationCacheStore(state => state.getCacheSize());

export const useCacheKeys = () => useTranslationCacheStore(state => state.getCacheKeys());

// Action hooks - using store directly to avoid infinite loops
export const useCacheActions = () => {
  const setCachedTranslations = useTranslationCacheStore(state => state.setCachedTranslations);
  const getCachedTranslations = useTranslationCacheStore(state => state.getCachedTranslations);
  const removeCachedTranslations = useTranslationCacheStore(
    state => state.removeCachedTranslations
  );
  const clearCache = useTranslationCacheStore(state => state.clearCache);
  const updateMetrics = useTranslationCacheStore(state => state.updateMetrics);
  const incrementRequests = useTranslationCacheStore(state => state.incrementRequests);
  const incrementHits = useTranslationCacheStore(state => state.incrementHits);
  const incrementErrors = useTranslationCacheStore(state => state.incrementErrors);
  const updateResponseTime = useTranslationCacheStore(state => state.updateResponseTime);
  const setLoading = useTranslationCacheStore(state => state.setLoading);
  const setError = useTranslationCacheStore(state => state.setError);
  const clearError = useTranslationCacheStore(state => state.clearError);
  const isCacheExpired = useTranslationCacheStore(state => state.isCacheExpired);
  const refreshCache = useTranslationCacheStore(state => state.refreshCache);

  return {
    setCachedTranslations,
    getCachedTranslations,
    removeCachedTranslations,
    clearCache,
    updateMetrics,
    incrementRequests,
    incrementHits,
    incrementErrors,
    updateResponseTime,
    setLoading,
    setError,
    clearError,
    isCacheExpired,
    refreshCache,
  };
};
