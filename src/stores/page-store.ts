/**
 * Page Store Types and Implementation
 * Manages page configurations, components, and metadata
 */

import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Page component types
export interface PageComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: PageComponent[];
  order: number;
}

// Page configuration types
export interface PageConfig {
  id: string;
  title: string;
  slug: string;
  locale: string;
  components: PageComponent[];
  metadata?: {
    description?: string;
    keywords?: string[];
    image?: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Page store state interface
export interface PageStoreState {
  // State
  pages: PageConfig[];
  currentPage: PageConfig | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentPage: (page: PageConfig | null) => void;
  addPage: (page: Omit<PageConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<PageConfig>) => void;
  deletePage: (id: string) => void;
  addComponent: (pageId: string, component: Omit<PageComponent, 'id'>) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<PageComponent>) => void;
  deleteComponent: (pageId: string, componentId: string) => void;
  reorderComponents: (pageId: string, fromIndex: number, toIndex: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// State creator for the page store
const createPageStoreSlice: StateCreator<
  PageStoreState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  PageStoreState
> = set => ({
  // Initial state
  pages: [],
  currentPage: null,
  isLoading: false,
  error: null,

  // Actions
  setCurrentPage: page => set({ currentPage: page }, false, 'setCurrentPage'),

  addPage: pageData => {
    const newPage: PageConfig = {
      ...pageData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({ pages: [...state.pages, newPage] }), false, 'addPage');
  },

  updatePage: (id, updates) => {
    set(
      state => ({
        pages: state.pages.map(page =>
          page.id === id ? { ...page, ...updates, updatedAt: new Date() } : page
        ),
        currentPage:
          state.currentPage?.id === id
            ? { ...state.currentPage, ...updates, updatedAt: new Date() }
            : state.currentPage,
      }),
      false,
      'updatePage'
    );
  },

  deletePage: id => {
    set(
      state => ({
        pages: state.pages.filter(page => page.id !== id),
        currentPage: state.currentPage?.id === id ? null : state.currentPage,
      }),
      false,
      'deletePage'
    );
  },

  addComponent: (pageId, componentData) => {
    const newComponent: PageComponent = {
      ...componentData,
      id: crypto.randomUUID(),
    };

    set(
      state => ({
        pages: state.pages.map(page =>
          page.id === pageId
            ? {
                ...page,
                components: [...page.components, newComponent],
                updatedAt: new Date(),
              }
            : page
        ),
        currentPage:
          state.currentPage?.id === pageId
            ? {
                ...state.currentPage,
                components: [...state.currentPage.components, newComponent],
                updatedAt: new Date(),
              }
            : state.currentPage,
      }),
      false,
      'addComponent'
    );
  },

  updateComponent: (pageId, componentId, updates) => {
    set(
      state => ({
        pages: state.pages.map(page =>
          page.id === pageId
            ? {
                ...page,
                components: page.components.map(component =>
                  component.id === componentId ? { ...component, ...updates } : component
                ),
                updatedAt: new Date(),
              }
            : page
        ),
        currentPage:
          state.currentPage?.id === pageId
            ? {
                ...state.currentPage,
                components: state.currentPage.components.map(component =>
                  component.id === componentId ? { ...component, ...updates } : component
                ),
                updatedAt: new Date(),
              }
            : state.currentPage,
      }),
      false,
      'updateComponent'
    );
  },

  deleteComponent: (pageId, componentId) => {
    set(
      state => ({
        pages: state.pages.map(page =>
          page.id === pageId
            ? {
                ...page,
                components: page.components.filter(component => component.id !== componentId),
                updatedAt: new Date(),
              }
            : page
        ),
        currentPage:
          state.currentPage?.id === pageId
            ? {
                ...state.currentPage,
                components: state.currentPage.components.filter(
                  component => component.id !== componentId
                ),
                updatedAt: new Date(),
              }
            : state.currentPage,
      }),
      false,
      'deleteComponent'
    );
  },

  reorderComponents: (pageId, fromIndex, toIndex) => {
    set(
      state => {
        const updateComponents = (components: PageComponent[]) => {
          const newComponents = [...components];
          const [removed] = newComponents.splice(fromIndex, 1);
          newComponents.splice(toIndex, 0, removed);

          // Update order values
          return newComponents.map((component, index) => ({
            ...component,
            order: index,
          }));
        };

        return {
          pages: state.pages.map(page =>
            page.id === pageId
              ? {
                  ...page,
                  components: updateComponents(page.components),
                  updatedAt: new Date(),
                }
              : page
          ),
          currentPage:
            state.currentPage?.id === pageId
              ? {
                  ...state.currentPage,
                  components: updateComponents(state.currentPage.components),
                  updatedAt: new Date(),
                }
              : state.currentPage,
        };
      },
      false,
      'reorderComponents'
    );
  },

  setLoading: loading => set({ isLoading: loading }, false, 'setLoading'),
  setError: error => set({ error }, false, 'setError'),
  clearError: () => set({ error: null }, false, 'clearError'),
});

// Create the page store
export const usePageStore = create<PageStoreState>()(
  devtools(
    persist(createPageStoreSlice, {
      name: 'page-store',
      partialize: state => ({
        pages: state.pages,
        currentPage: state.currentPage,
      }),
    }),
    {
      name: 'page-store',
    }
  )
);

// Selector hooks for better performance
export const useCurrentPage = () => usePageStore(state => state.currentPage);
export const usePages = () => usePageStore(state => state.pages);
export const usePageLoading = () => usePageStore(state => state.isLoading);
export const usePageError = () => usePageStore(state => state.error);

// Action hooks - using store directly to avoid infinite loops
export const usePageActions = () => {
  const setCurrentPage = usePageStore(state => state.setCurrentPage);
  const addPage = usePageStore(state => state.addPage);
  const updatePage = usePageStore(state => state.updatePage);
  const deletePage = usePageStore(state => state.deletePage);
  const addComponent = usePageStore(state => state.addComponent);
  const updateComponent = usePageStore(state => state.updateComponent);
  const deleteComponent = usePageStore(state => state.deleteComponent);
  const reorderComponents = usePageStore(state => state.reorderComponents);
  const setLoading = usePageStore(state => state.setLoading);
  const setError = usePageStore(state => state.setError);
  const clearError = usePageStore(state => state.clearError);

  return {
    setCurrentPage,
    addPage,
    updatePage,
    deletePage,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
    setLoading,
    setError,
    clearError,
  };
};
