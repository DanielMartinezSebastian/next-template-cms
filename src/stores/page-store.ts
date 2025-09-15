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

  // Hierarchical structure for nested routes
  parentId?: string;
  fullPath?: string;
  level?: number;
  order?: number;

  // Route type management for hybrid system
  routeType?: 'static' | 'dynamic' | 'hybrid';
  staticRoute?: string;
  isStaticPrefix?: boolean;
}

// Page store state interface
export interface PageStoreState {
  // State
  pages: PageConfig[];
  currentPage: PageConfig | null;
  isLoading: boolean;
  error: string | null;
  lastLoaded: Date | null; // Track when pages were last loaded

  // Actions
  loadPages: () => Promise<void>;
  loadPageById: (pageId: string) => Promise<PageConfig | null>;
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
  lastLoaded: null,

  // Actions
  loadPages: async () => {
    set({ isLoading: true, error: null }, false, 'loadPages:start');

    try {
      const response = await fetch('/api/pages');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.pages)) {
        // Convert API format to store format
        const pagesForStore: PageConfig[] = data.pages.map(
          (apiPage: {
            id: string;
            slug: string;
            locale: string;
            components?: PageComponent[];
            meta?: {
              title?: string;
              description?: string;
              keywords?: string[];
              image?: string;
            };
            isPublished: boolean;
            createdAt: string;
            updatedAt: string;
          }) => ({
            id: apiPage.id,
            title: apiPage.meta?.title || 'Untitled',
            slug: apiPage.slug,
            locale: apiPage.locale,
            components: apiPage.components || [],
            metadata: {
              description: apiPage.meta?.description,
              keywords: apiPage.meta?.keywords || [],
              image: apiPage.meta?.image,
            },
            isPublished: apiPage.isPublished,
            createdAt: new Date(apiPage.createdAt),
            updatedAt: new Date(apiPage.updatedAt),
            // Additional fields
            routeType: 'dynamic' as const,
          })
        );

        set(
          {
            pages: pagesForStore,
            isLoading: false,
            error: null,
            lastLoaded: new Date(),
          },
          false,
          'loadPages:success'
        );
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to load pages from API:', errorMessage);
      set({ isLoading: false, error: errorMessage }, false, 'loadPages:error');
    }
  },

  loadPageById: async (pageId: string) => {
    // First check if page is already in store cache
    const existingPage = usePageStore.getState().pages.find(p => p.id === pageId);
    if (existingPage) {
      // Page found in cache - set as current and return immediately
      set({ currentPage: existingPage }, false, 'loadPageById:cache-hit');
      return existingPage;
    }

    // Page not in cache - fetch from API
    set({ isLoading: true, error: null }, false, 'loadPageById:fetch-start');

    try {
      const response = await fetch(`/api/pages/${pageId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.page) {
        // Convert API format to store format
        const pageForStore: PageConfig = {
          id: data.page.id,
          title: data.page.meta?.title || 'Untitled',
          slug: data.page.slug,
          locale: data.page.locale,
          components: data.page.components || [],
          metadata: {
            description: data.page.meta?.description,
            keywords: data.page.meta?.keywords || [],
            image: data.page.meta?.image,
          },
          isPublished: data.page.isPublished,
          createdAt: new Date(data.page.createdAt),
          updatedAt: new Date(data.page.updatedAt),
          routeType: 'dynamic' as const,
        };

        // Add to store cache and set as current
        set(
          state => ({
            pages: [...state.pages.filter(p => p.id !== pageId), pageForStore],
            currentPage: pageForStore,
            isLoading: false,
            error: null,
          }),
          false,
          'loadPageById:success'
        );

        return pageForStore;
      } else {
        throw new Error('Page not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to load page ${pageId}:`, errorMessage);
      set(
        { isLoading: false, error: errorMessage, currentPage: null },
        false,
        'loadPageById:error'
      );
      return null;
    }
  },

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
export const usePageLastLoaded = () => usePageStore(state => state.lastLoaded);

// Action hooks - using store directly to avoid infinite loops
export const usePageActions = () => {
  const loadPages = usePageStore(state => state.loadPages);
  const loadPageById = usePageStore(state => state.loadPageById);
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
    loadPages,
    loadPageById,
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
