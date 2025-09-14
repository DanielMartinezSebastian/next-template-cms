/**
 * Translation Files Index
 *
 * This file defines which translation files exist and how they should be loaded.
 * Add new translation files here when you create them.
 *
 * Structure:
 * - filename: The JSON file name (without .json extension)
 * - namespace: The namespace to use in components (null = spread at root level)
 * - description: What this file contains (for documentation)
 */

export interface TranslationFileConfig {
  filename: string;
  namespace: string | null;
  description: string;
}

export const TRANSLATION_FILES: TranslationFileConfig[] = [
  {
    filename: "common",
    namespace: null, // Spread at root level for direct access
    description: "Common UI elements: navigation, buttons, status messages",
  },
  {
    filename: "home",
    namespace: "Home",
    description: "Homepage content: hero, features, CTAs",
  },
  {
    filename: "admin",
    namespace: "Admin",
    description: "Admin panel: dashboard, management, settings",
  },
  // Add new translation files here:
  // {
  //   filename: 'auth',
  //   namespace: 'Auth',
  //   description: 'Authentication: login, register, password reset'
  // },
  // {
  //   filename: 'product',
  //   namespace: 'Product',
  //   description: 'Product pages: details, catalog, search'
  // }
];

// FUTURE: Database compatibility mapping
// Each namespace here will automatically work with the hybrid system:
// - namespace: null (common) → static strategy (always from files)
// - namespace: 'Home' → hybrid strategy (files + database override)
// - namespace: 'Admin' → dynamic strategy (database first, files fallback)
//
// The TranslationManager will use this configuration to determine
// the loading strategy for each namespace when DATABASE_URL is set.

// Helper function to get all available namespaces
export function getAvailableNamespaces(): string[] {
  return TRANSLATION_FILES.map((file) => file.namespace).filter(
    (namespace): namespace is string => namespace !== null
  );
}

// Helper function to get files that should be spread at root
export function getCommonFiles(): string[] {
  return TRANSLATION_FILES.filter((file) => file.namespace === null).map(
    (file) => file.filename
  );
}

// Helper function to validate if a translation file is configured
export function isConfiguredFile(filename: string): boolean {
  return TRANSLATION_FILES.some((file) => file.filename === filename);
}
