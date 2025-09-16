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
  savePageToDatabase: (id: string, updates: Partial<PageConfig>) => Promise<void>;
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
            content?: Record<string, unknown>;
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
    console.warn(`🔄 loadPageById called for: ${pageId}`);

    // Always fetch from API to ensure fresh data and proper sync
    set({ isLoading: true, error: null }, false, 'loadPageById:fetch-start');

    try {
      const response = await fetch(`/api/pages/${pageId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.warn(`✅ API response for page ${pageId}:`, data);

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

        console.warn('📊 Converted page for store:', pageForStore);

        // Add to store cache and set as current
        set(
          state => {
            const newState = {
              pages: [...state.pages.filter(p => p.id !== pageId), pageForStore],
              currentPage: pageForStore,
              isLoading: false,
              error: null,
            };
            console.warn('🎯 Setting new store state:', newState);
            return newState;
          },
          false,
          'loadPageById:success'
        );

        // Double-check that currentPage was set
        const finalState = usePageStore.getState();
        console.warn('🔍 Final store state after setting:', {
          currentPage: finalState.currentPage?.title,
          pagesCount: finalState.pages.length,
          isLoading: finalState.isLoading,
        });

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

  savePageToDatabase: async (id, updates) => {
    set({ isLoading: true, error: null }, false, 'savePageToDatabase:start');

    try {
      console.warn('🔄 Saving page to database:', {
        pageId: id,
        updates,
        componentsCount: updates.components?.length || 0,
      });

      // Convert PageConfig updates to API format
      const apiData: Record<string, unknown> = {};

      if (updates.title) apiData.title = updates.title;
      if (updates.slug) apiData.slug = updates.slug;
      if (updates.metadata?.description !== undefined)
        apiData.description = updates.metadata.description;
      if (updates.metadata?.keywords) apiData.keywords = updates.metadata.keywords;
      if (updates.isPublished !== undefined) apiData.isPublished = updates.isPublished;

      // Convert components to content.root.children format for API
      if (updates.components) {
        apiData.content = {
          root: {
            children: updates.components.map(component => ({
              type: 'component',
              componentType: component.type,
              componentProps: component.props,
              order: component.order,
            })),
          },
        };
      }

      // Make PUT request to save page
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.warn('✅ Page saved to database:', result);

      if (result.success && result.page) {
        // Update local store with the response data from API
        const updatedPageData: PageConfig = {
          id: result.page.id,
          title: result.page.meta?.title || 'Untitled',
          slug: result.page.slug,
          locale: result.page.locale,
          components: result.page.components || [],
          metadata: {
            description: result.page.meta?.description,
            keywords: result.page.meta?.keywords || [],
            image: result.page.meta?.image,
          },
          isPublished: result.page.isPublished,
          createdAt: new Date(result.page.createdAt),
          updatedAt: new Date(result.page.updatedAt),
          routeType: 'dynamic' as const,
        };

        set(
          state => ({
            pages: state.pages.map(page => (page.id === id ? updatedPageData : page)),
            currentPage: state.currentPage?.id === id ? updatedPageData : state.currentPage,
            isLoading: false,
          }),
          false,
          'savePageToDatabase:success'
        );
      }
    } catch (error) {
      console.error('❌ Error saving page to database:', error);
      set(
        {
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to save page',
        },
        false,
        'savePageToDatabase:error'
      );
      throw error; // Re-throw to allow component to handle
    }
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
  const savePageToDatabase = usePageStore(state => state.savePageToDatabase);
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
    savePageToDatabase,
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
