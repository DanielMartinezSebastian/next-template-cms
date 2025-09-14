import { getRequestConfig } from 'next-intl/server';
import { translationManager } from './translation-manager';
import { routing } from '@/i18n/routing';

/**
 * Hybrid translation loader that supports both static files and database
 * This replaces the default next-intl request configuration
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This function runs on each request
  let locale = await requestLocale;

  // Validate and fallback locale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Pre-load critical translations for performance
  await translationManager.preloadCriticalTranslations(locale);

  // Create a proxy object that intercepts translation requests
  const messages = createTranslationProxy(locale);

  return {
    locale,
    messages,
    // Add custom formatters if needed
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 5,
        },
      },
    },
    // Handle missing translations
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Translation error:', error);
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(part => part != null).join('.');

      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${path} (${error.message})`);
        return `🚨 ${path}`;
      }

      return path;
    },
  };
});

/**
 * Creates a proxy object that dynamically loads translations
 * This allows us to intercept translation requests and route them
 * to our hybrid translation system
 */
function createTranslationProxy(locale: string): any {
  const cache = new Map<string, any>();

  return new Proxy(
    {},
    {
      get(target, namespace: string) {
        if (typeof namespace !== 'string') {
          return undefined;
        }

        // Return cached namespace if available
        if (cache.has(namespace)) {
          return cache.get(namespace);
        }

        // Create a proxy for the namespace
        const namespaceProxy = new Proxy(
          {},
          {
            get(nsTarget, key: string) {
              if (typeof key !== 'string') {
                return undefined;
              }

              // Create a getter that returns a promise-like object
              // This is a bit of a hack to make it work with next-intl's sync API
              const translationKey = `${namespace}.${key}`;

              // For nested objects, return another proxy
              if (key.includes('.') || !isLeafKey(key)) {
                return createNestedProxy(namespace, key, locale);
              }

              // For leaf values, we need to synchronously return the translation
              // Since our system is async, we need to pre-load these values
              return getTranslationSync(key, locale, namespace);
            },

            // Support for Object.keys() and iteration
            ownKeys(nsTarget) {
              // Return known keys for this namespace
              return getNamespaceKeys(namespace, locale);
            },

            has(nsTarget, key) {
              return hasTranslation(namespace, key as string, locale);
            },
          }
        );

        cache.set(namespace, namespaceProxy);
        return namespaceProxy;
      },

      // Support for Object.keys() at the root level
      ownKeys(target) {
        return ['HomePage', 'Navigation', 'Common', 'AdminPanel', 'SEO']; // Known namespaces
      },

      has(target, namespace) {
        return (
          typeof namespace === 'string' &&
          ['HomePage', 'Navigation', 'Common', 'AdminPanel', 'SEO'].includes(namespace)
        );
      },
    }
  );
}

/**
 * Creates a nested proxy for complex translation objects
 */
function createNestedProxy(namespace: string, basePath: string, locale: string): any {
  return new Proxy(
    {},
    {
      get(target, key: string) {
        if (typeof key !== 'string') {
          return undefined;
        }

        const fullPath = `${basePath}.${key}`;

        // If this could be a nested object, return another proxy
        if (!isLeafKey(key)) {
          return createNestedProxy(namespace, fullPath, locale);
        }

        // Otherwise return the translation
        return getTranslationSync(fullPath, locale, namespace);
      },
    }
  );
}

// Cache for synchronous translation access
const syncTranslationCache = new Map<string, string>();
const cacheLoadPromises = new Map<string, Promise<void>>();

/**
 * Synchronously get a translation (required by next-intl)
 * This relies on pre-loaded cache data
 */
function getTranslationSync(key: string, locale: string, namespace: string): string {
  const cacheKey = `${namespace}:${locale}:${key}`;

  if (syncTranslationCache.has(cacheKey)) {
    return syncTranslationCache.get(cacheKey)!;
  }

  // If not in cache, trigger async load for next time
  const loadKey = `${namespace}:${locale}`;
  if (!cacheLoadPromises.has(loadKey)) {
    const loadPromise = loadNamespaceToCache(namespace, locale);
    cacheLoadPromises.set(loadKey, loadPromise);
  }

  // Return key as fallback
  return key;
}

/**
 * Asynchronously load a namespace into the sync cache
 */
async function loadNamespaceToCache(namespace: string, locale: string): Promise<void> {
  try {
    const translations = await translationManager.getNamespace(namespace, locale);

    for (const [key, value] of Object.entries(translations)) {
      const cacheKey = `${namespace}:${locale}:${key}`;
      syncTranslationCache.set(cacheKey, value);
    }
  } catch (error) {
    console.error(`Failed to load namespace ${namespace} for ${locale}:`, error);
  }
}

/**
 * Get known keys for a namespace
 */
function getNamespaceKeys(namespace: string, locale: string): string[] {
  const keys: string[] = [];
  const prefix = `${namespace}:${locale}:`;

  for (const cacheKey of syncTranslationCache.keys()) {
    if (cacheKey.startsWith(prefix)) {
      const key = cacheKey.slice(prefix.length);
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Check if a translation exists
 */
function hasTranslation(namespace: string, key: string, locale: string): boolean {
  const cacheKey = `${namespace}:${locale}:${key}`;
  return syncTranslationCache.has(cacheKey);
}

/**
 * Helper to determine if a key is a leaf value (not an object)
 */
function isLeafKey(key: string): boolean {
  // Simple heuristic: leaf keys are typically lowercase or contain underscores
  return /^[a-z_]+$/.test(key) || key.includes('_');
}

// Export helper functions for testing and debugging
export { createTranslationProxy, loadNamespaceToCache, getTranslationSync };
