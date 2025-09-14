/**
 * Store Index - Central exports for all Zustand stores
 * Following best practices for modular store organization
 */

// Page management store
export {
  useCurrentPage,
  usePageActions,
  usePageError,
  usePageLoading,
  usePageStore,
  usePages,
  type PageComponent,
  type PageConfig,
  type PageStoreState,
} from './page-store';

// Edit mode and visual editor store
export {
  useDraggedComponent,
  useEditHistory,
  useEditModeActions,
  useEditModeEnabled,
  useEditModeStore,
  usePreviewMode,
  useSelectedComponent,
  type EditAction,
  type EditModeState,
} from './edit-mode-store';

// User preferences and settings store
export {
  useAutoSave,
  useEditorSettings,
  useLocale,
  usePanelLayout,
  usePreferencesActions,
  useSidebarCollapsed,
  useTheme,
  useToolbarPosition,
  useUiSettings,
  useUserPreferencesStore,
  type LocaleCode,
  type UserPreferencesState,
} from './user-preferences-store';

// Translation cache and metrics store
export {
  useCacheActions,
  useCacheError,
  useCacheKeys,
  useCacheLoading,
  useCacheMetrics,
  useCacheSize,
  useCachedTranslations,
  useTranslationCacheStore,
  type TranslationCacheEntry,
  type TranslationCacheState,
} from './translation-cache-store';

// Re-export commonly used types
export type { TranslationMetrics } from '@/types/translations';

/**
 * Store Usage Guidelines:
 *
 * 1. Use specific selector hooks (useCurrentPage, useEditModeEnabled) for better performance
 * 2. Use action hooks (usePageActions, useEditModeActions) to access store methods
 * 3. Prefer granular selectors over accessing entire store state
 * 4. All stores support devtools for debugging in development
 * 5. Page and User Preferences stores persist state to localStorage
 * 6. Edit Mode and Translation Cache stores are session-only
 *
 * Example usage:
 *
 * ```tsx
 * import { useCurrentPage, usePageActions } from '@/stores';
 *
 * function PageEditor() {
 *   const currentPage = useCurrentPage();
 *   const { setCurrentPage, addComponent } = usePageActions();
 *
 *   // Component logic...
 * }
 * ```
 */
