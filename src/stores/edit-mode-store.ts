/**
 * Edit Mode Store Types and Implementation
 * Manages visual editor state, selection, and edit history
 */

import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

// Edit action types
export interface EditAction {
  id: string;
  type: 'add' | 'remove' | 'update' | 'move';
  componentId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  timestamp: Date;
}

// Edit mode state interface
export interface EditModeState {
  // State
  enabled: boolean;
  selectedComponentId: string | null;
  draggedComponentId: string | null;
  editHistory: EditAction[];
  currentHistoryIndex: number;
  isPreviewMode: boolean;

  // Actions
  enableEditMode: () => void;
  disableEditMode: () => void;
  toggleEditMode: () => void;
  setSelectedComponent: (componentId: string | null) => void;
  setDraggedComponent: (componentId: string | null) => void;
  enterPreviewMode: () => void;
  exitPreviewMode: () => void;
  togglePreviewMode: () => void;

  // History management
  addHistoryAction: (action: Omit<EditAction, 'id' | 'timestamp'>) => void;
  undo: () => EditAction | null;
  redo: () => EditAction | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Utility actions
  reset: () => void;
}

// State creator for the edit mode store
const createEditModeSlice: StateCreator<
  EditModeState,
  [['zustand/devtools', never]],
  [],
  EditModeState
> = (set, get) => ({
  // Initial state
  enabled: false,
  selectedComponentId: null,
  draggedComponentId: null,
  editHistory: [],
  currentHistoryIndex: -1,
  isPreviewMode: false,

  // Edit mode actions
  enableEditMode: () => set({ enabled: true, isPreviewMode: false }, false, 'enableEditMode'),

  disableEditMode: () =>
    set(
      {
        enabled: false,
        selectedComponentId: null,
        draggedComponentId: null,
        isPreviewMode: false,
      },
      false,
      'disableEditMode'
    ),

  toggleEditMode: () => {
    const { enabled } = get();
    if (enabled) {
      get().disableEditMode();
    } else {
      get().enableEditMode();
    }
  },

  setSelectedComponent: componentId =>
    set({ selectedComponentId: componentId }, false, 'setSelectedComponent'),

  setDraggedComponent: componentId =>
    set({ draggedComponentId: componentId }, false, 'setDraggedComponent'),

  // Preview mode actions
  enterPreviewMode: () =>
    set({ isPreviewMode: true, selectedComponentId: null }, false, 'enterPreviewMode'),

  exitPreviewMode: () => set({ isPreviewMode: false }, false, 'exitPreviewMode'),

  togglePreviewMode: () => {
    const { isPreviewMode } = get();
    if (isPreviewMode) {
      get().exitPreviewMode();
    } else {
      get().enterPreviewMode();
    }
  },

  // History management
  addHistoryAction: actionData => {
    const newAction: EditAction = {
      ...actionData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    set(
      state => {
        // Remove any actions after current index (when adding new action after undo)
        const newHistory = state.editHistory.slice(0, state.currentHistoryIndex + 1);
        newHistory.push(newAction);

        // Limit history size (keep last 50 actions)
        const limitedHistory = newHistory.slice(-50);

        return {
          editHistory: limitedHistory,
          currentHistoryIndex: limitedHistory.length - 1,
        };
      },
      false,
      'addHistoryAction'
    );
  },

  undo: () => {
    const { editHistory, currentHistoryIndex } = get();

    if (currentHistoryIndex >= 0) {
      const actionToUndo = editHistory[currentHistoryIndex];
      set({ currentHistoryIndex: currentHistoryIndex - 1 }, false, 'undo');
      return actionToUndo;
    }

    return null;
  },

  redo: () => {
    const { editHistory, currentHistoryIndex } = get();

    if (currentHistoryIndex < editHistory.length - 1) {
      const actionToRedo = editHistory[currentHistoryIndex + 1];
      set({ currentHistoryIndex: currentHistoryIndex + 1 }, false, 'redo');
      return actionToRedo;
    }

    return null;
  },

  canUndo: () => {
    const { currentHistoryIndex } = get();
    return currentHistoryIndex >= 0;
  },

  canRedo: () => {
    const { editHistory, currentHistoryIndex } = get();
    return currentHistoryIndex < editHistory.length - 1;
  },

  clearHistory: () => set({ editHistory: [], currentHistoryIndex: -1 }, false, 'clearHistory'),

  // Utility actions
  reset: () =>
    set(
      {
        enabled: false,
        selectedComponentId: null,
        draggedComponentId: null,
        editHistory: [],
        currentHistoryIndex: -1,
        isPreviewMode: false,
      },
      false,
      'reset'
    ),
});

// Create the edit mode store
export const useEditModeStore = create<EditModeState>()(
  devtools(createEditModeSlice, {
    name: 'edit-mode-store',
  })
);

// Selector hooks for better performance
export const useEditModeEnabled = () => useEditModeStore(state => state.enabled);

export const useSelectedComponent = () => useEditModeStore(state => state.selectedComponentId);

export const useDraggedComponent = () => useEditModeStore(state => state.draggedComponentId);

export const usePreviewMode = () => useEditModeStore(state => state.isPreviewMode);

export const useEditHistory = () =>
  useEditModeStore(state => ({
    history: state.editHistory,
    currentIndex: state.currentHistoryIndex,
    canUndo: state.canUndo(),
    canRedo: state.canRedo(),
  }));

// Action hooks - using store directly to avoid infinite loops
export const useEditModeActions = () => {
  const enableEditMode = useEditModeStore(state => state.enableEditMode);
  const disableEditMode = useEditModeStore(state => state.disableEditMode);
  const toggleEditMode = useEditModeStore(state => state.toggleEditMode);
  const setSelectedComponent = useEditModeStore(state => state.setSelectedComponent);
  const setDraggedComponent = useEditModeStore(state => state.setDraggedComponent);
  const enterPreviewMode = useEditModeStore(state => state.enterPreviewMode);
  const exitPreviewMode = useEditModeStore(state => state.exitPreviewMode);
  const togglePreviewMode = useEditModeStore(state => state.togglePreviewMode);
  const addHistoryAction = useEditModeStore(state => state.addHistoryAction);
  const undo = useEditModeStore(state => state.undo);
  const redo = useEditModeStore(state => state.redo);
  const clearHistory = useEditModeStore(state => state.clearHistory);
  const reset = useEditModeStore(state => state.reset);

  return {
    enableEditMode,
    disableEditMode,
    toggleEditMode,
    setSelectedComponent,
    setDraggedComponent,
    enterPreviewMode,
    exitPreviewMode,
    togglePreviewMode,
    addHistoryAction,
    undo,
    redo,
    clearHistory,
    reset,
  };
};
