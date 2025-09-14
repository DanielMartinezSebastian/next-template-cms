/**
 * User Preferences Store Types and Implementation
 * Manages user settings, theme, locale and editor preferences
 */

import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Locale code type - redefining here to avoid circular imports
export type LocaleCode = string;

// User preferences state interface
export interface UserPreferencesState {
  // State
  locale: LocaleCode;
  theme: 'light' | 'dark' | 'system';
  editorSettings: {
    showGrid: boolean;
    snapToGrid: boolean;
    showComponentBorders: boolean;
    autoSave: boolean;
    autoSaveInterval: number; // seconds
  };
  uiSettings: {
    sidebarCollapsed: boolean;
    toolbarPosition: 'top' | 'bottom' | 'floating';
    panelLayout: 'horizontal' | 'vertical';
  };

  // Actions
  setLocale: (locale: LocaleCode) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateEditorSettings: (settings: Partial<UserPreferencesState['editorSettings']>) => void;
  updateUiSettings: (settings: Partial<UserPreferencesState['uiSettings']>) => void;
  toggleSidebar: () => void;
  toggleGrid: () => void;
  toggleComponentBorders: () => void;
  toggleSnapToGrid: () => void;
  toggleAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;
  resetToDefaults: () => void;
}

// Default preferences
const defaultPreferences: Omit<
  UserPreferencesState,
  | 'setLocale'
  | 'setTheme'
  | 'updateEditorSettings'
  | 'updateUiSettings'
  | 'toggleSidebar'
  | 'toggleGrid'
  | 'toggleComponentBorders'
  | 'toggleSnapToGrid'
  | 'toggleAutoSave'
  | 'setAutoSaveInterval'
  | 'resetToDefaults'
> = {
  locale: 'en',
  theme: 'system',
  editorSettings: {
    showGrid: true,
    snapToGrid: true,
    showComponentBorders: true,
    autoSave: true,
    autoSaveInterval: 30, // 30 seconds
  },
  uiSettings: {
    sidebarCollapsed: false,
    toolbarPosition: 'top',
    panelLayout: 'horizontal',
  },
};

// State creator for the user preferences store
const createUserPreferencesSlice: StateCreator<
  UserPreferencesState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  UserPreferencesState
> = (set, get) => ({
  // Initial state
  ...defaultPreferences,

  // Locale actions
  setLocale: locale => set({ locale }, false, 'setLocale'),

  // Theme actions
  setTheme: theme => set({ theme }, false, 'setTheme'),

  // Editor settings actions
  updateEditorSettings: settings =>
    set(
      state => ({
        editorSettings: { ...state.editorSettings, ...settings },
      }),
      false,
      'updateEditorSettings'
    ),

  // UI settings actions
  updateUiSettings: settings =>
    set(
      state => ({
        uiSettings: { ...state.uiSettings, ...settings },
      }),
      false,
      'updateUiSettings'
    ),

  // Toggle actions
  toggleSidebar: () => {
    const { uiSettings } = get();
    get().updateUiSettings({
      sidebarCollapsed: !uiSettings.sidebarCollapsed,
    });
  },

  toggleGrid: () => {
    const { editorSettings } = get();
    get().updateEditorSettings({
      showGrid: !editorSettings.showGrid,
    });
  },

  toggleComponentBorders: () => {
    const { editorSettings } = get();
    get().updateEditorSettings({
      showComponentBorders: !editorSettings.showComponentBorders,
    });
  },

  toggleSnapToGrid: () => {
    const { editorSettings } = get();
    get().updateEditorSettings({
      snapToGrid: !editorSettings.snapToGrid,
    });
  },

  toggleAutoSave: () => {
    const { editorSettings } = get();
    get().updateEditorSettings({
      autoSave: !editorSettings.autoSave,
    });
  },

  setAutoSaveInterval: interval => {
    // Ensure interval is between 5 and 300 seconds (5 mins)
    const clampedInterval = Math.max(5, Math.min(300, interval));
    get().updateEditorSettings({ autoSaveInterval: clampedInterval });
  },

  // Reset actions
  resetToDefaults: () => set(defaultPreferences, false, 'resetToDefaults'),
});

// Create the user preferences store
export const useUserPreferencesStore = create<UserPreferencesState>()(
  devtools(
    persist(createUserPreferencesSlice, {
      name: 'user-preferences-store',
      partialize: state => ({
        locale: state.locale,
        theme: state.theme,
        editorSettings: state.editorSettings,
        uiSettings: state.uiSettings,
      }),
    }),
    {
      name: 'user-preferences-store',
    }
  )
);

// Selector hooks for better performance
export const useLocale = () => useUserPreferencesStore(state => state.locale);

export const useTheme = () => useUserPreferencesStore(state => state.theme);

export const useEditorSettings = () => useUserPreferencesStore(state => state.editorSettings);

export const useUiSettings = () => useUserPreferencesStore(state => state.uiSettings);

export const useSidebarCollapsed = () =>
  useUserPreferencesStore(state => state.uiSettings.sidebarCollapsed);

export const useToolbarPosition = () =>
  useUserPreferencesStore(state => state.uiSettings.toolbarPosition);

export const usePanelLayout = () => useUserPreferencesStore(state => state.uiSettings.panelLayout);

export const useAutoSave = () =>
  useUserPreferencesStore(state => ({
    enabled: state.editorSettings.autoSave,
    interval: state.editorSettings.autoSaveInterval,
  }));

// Action hooks - using store directly to avoid infinite loops
export const usePreferencesActions = () => {
  const setLocale = useUserPreferencesStore(state => state.setLocale);
  const setTheme = useUserPreferencesStore(state => state.setTheme);
  const updateEditorSettings = useUserPreferencesStore(state => state.updateEditorSettings);
  const updateUiSettings = useUserPreferencesStore(state => state.updateUiSettings);
  const toggleSidebar = useUserPreferencesStore(state => state.toggleSidebar);
  const toggleGrid = useUserPreferencesStore(state => state.toggleGrid);
  const toggleComponentBorders = useUserPreferencesStore(state => state.toggleComponentBorders);
  const toggleSnapToGrid = useUserPreferencesStore(state => state.toggleSnapToGrid);
  const toggleAutoSave = useUserPreferencesStore(state => state.toggleAutoSave);
  const setAutoSaveInterval = useUserPreferencesStore(state => state.setAutoSaveInterval);
  const resetToDefaults = useUserPreferencesStore(state => state.resetToDefaults);

  return {
    setLocale,
    setTheme,
    updateEditorSettings,
    updateUiSettings,
    toggleSidebar,
    toggleGrid,
    toggleComponentBorders,
    toggleSnapToGrid,
    toggleAutoSave,
    setAutoSaveInterval,
    resetToDefaults,
  };
};
