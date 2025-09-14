// PAGE-BASED CONFIGURATION
// Updated to load page-specific translation files from new structure

import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }

  try {
    // Load translations from the new page-based structure
    const messages = {
      // Load common translations (navigation, buttons, etc.)
      ...(await import(`../../messages/${locale}/common.json`)).default,
      
      // Load page-specific translations as namespaces
      Home: (await import(`../../messages/${locale}/home.json`)).default,
      Admin: (await import(`../../messages/${locale}/admin.json`)).default,
    };

    return {
      locale,
      messages,
      // Add custom formatters
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }
        },
        number: {
          precise: {
            maximumFractionDigits: 5
          }
        }
      },
      // Handle missing translations with development feedback
      onError(error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Translation error:', error);
        }
      },
      getMessageFallback({namespace, key, error}) {
        const path = [namespace, key].filter((part) => part != null).join('.');
        
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation: ${path} (${error.message})`);
          return `🚨 ${path}`;
        }
        
        return path;
      }
    };
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error);
    
    // Fallback: try to load legacy files
    try {
      const fallbackMessages = (await import(`../../messages/${locale}.json`)).default;
      console.warn(`Loaded fallback translations for ${locale}`);
      return {
        locale,
        messages: fallbackMessages
      };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return {
        locale,
        messages: {}
      };
    }
  }
});

// HYBRID SYSTEM INTEGRATION:
// For database integration, replace this with:
// import hybridConfig from '@/lib/translations/next-intl-hybrid';
// export default hybridConfig;
