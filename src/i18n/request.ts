// PAGE-BASED CONFIGURATION
// Updated to load translation files using static imports based on index configuration

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { TRANSLATION_FILES } from '../../messages';
import type { AbstractIntlMessages } from 'next-intl';

// Static imports for all translation files
// English translations
import enCommon from '../../messages/en/common.json';
import enHome from '../../messages/en/home.json';
import enAdmin from '../../messages/en/admin.json';

// Spanish translations
import esCommon from '../../messages/es/common.json';
import esHome from '../../messages/es/home.json';
import esAdmin from '../../messages/es/admin.json';

// Translation file registry - maps locale and filename to actual content
const TRANSLATION_REGISTRY = {
  en: {
    common: enCommon,
    home: enHome,
    admin: enAdmin,
  },
  es: {
    common: esCommon,
    home: esHome,
    admin: esAdmin,
  },
} as const;

/**
 * Loads translation files based on the index configuration
 * Uses static imports for optimal performance and reliability
 * Automatically maps files defined in messages/index.ts to imported content
 */
function loadDynamicTranslations(locale: string): AbstractIntlMessages {
  const messages: Record<string, AbstractIntlMessages> = {};
  const loadedFiles: string[] = [];
  const failedFiles: string[] = [];

  // Get the registry for this locale
  const localeRegistry = TRANSLATION_REGISTRY[locale as keyof typeof TRANSLATION_REGISTRY];

  if (!localeRegistry) {
    console.error(`❌ No translation registry found for locale: ${locale}`);
    return {};
  }

  // Load each file defined in the index
  for (const fileConfig of TRANSLATION_FILES) {
    const { filename, namespace } = fileConfig;

    try {
      const content = localeRegistry[filename as keyof typeof localeRegistry];

      if (!content) {
        failedFiles.push(filename);
        console.warn(
          `⚠️ Translation file ${filename}.json not found in registry for locale ${locale}`
        );
        continue;
      }

      if (namespace === null) {
        // Spread common translations at root level
        Object.assign(messages, content);
        loadedFiles.push(`${filename} (root level)`);
      } else {
        // Use configured namespace
        messages[namespace] = content;
        loadedFiles.push(`${filename} → ${namespace}`);
      }
    } catch (error) {
      failedFiles.push(filename);
      console.warn(`⚠️ Error processing translation file ${filename} for locale ${locale}:`, error);
    }
  }

  if (loadedFiles.length > 0) {
    console.warn(`✅ Loaded ${loadedFiles.length} translation files for ${locale}:`, loadedFiles);
  }

  if (failedFiles.length > 0) {
    console.warn(`⚠️ Failed to load ${failedFiles.length} files for ${locale}:`, failedFiles);
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    locale = routing.defaultLocale;
  }

  try {
    // Load translations dynamically from the page-based structure
    const messages = await loadDynamicTranslations(locale);

    return {
      locale,
      messages,
      // Add custom formatters
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
      // Handle missing translations with development feedback
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
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);

    return {
      locale,
      messages: {},
    };
  }
});

// INDEX-BASED SYSTEM:
// Translation files are automatically loaded based on messages/index.ts configuration
// To add new translation files:
// 1. Create JSON files in messages/en/ and messages/es/
// 2. Add static imports above
// 3. Add to TRANSLATION_REGISTRY
// 4. Add to TRANSLATION_FILES in messages/index.ts
//
// For future database integration, replace this with:
// import hybridConfig from '@/lib/translations/next-intl-hybrid';
// export default hybridConfig;
