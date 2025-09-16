/**
 * useEditorParams Hook
 * Maneja los query parameters del editor de páginas para navegación y deep linking
 */
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { PageConfig } from '../stores';

export interface EditorParams {
  pageId?: string;
  slug?: string;
  locale?: string;
  create?: boolean;
}

export interface EditorParamsActions {
  navigateToPage: (pageId: string, slug?: string) => void;
  navigateToSlug: (slug: string, locale?: string) => void;
  navigateToPageView: (slug: string, locale?: string) => void;
  openCreateModal: () => void;
  clearParams: () => void;
  updatePageInUrl: (page: PageConfig) => void;
}

export function useEditorParams(): EditorParams & EditorParamsActions {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Get current locale from URL params
  const currentLocale = (params?.locale as string) || 'es';

  // Parse current query parameters
  const editorParams: EditorParams = useMemo(
    () => ({
      pageId: searchParams.get('pageId') || undefined,
      slug: searchParams.get('slug') || undefined,
      locale: searchParams.get('locale') || currentLocale,
      create: searchParams.get('create') === 'true',
    }),
    [searchParams, currentLocale]
  );

  // Helper to build URL with query parameters
  const buildEditorUrl = useCallback(
    (newParams: Partial<EditorParams> = {}) => {
      const url = new URLSearchParams();

      // Merge current params with new ones
      const finalParams = { ...editorParams, ...newParams };

      // Only add non-empty parameters
      if (finalParams.pageId) url.set('pageId', finalParams.pageId);
      if (finalParams.slug && !finalParams.pageId) url.set('slug', finalParams.slug);
      if (finalParams.locale && finalParams.locale !== currentLocale) {
        url.set('locale', finalParams.locale);
      }
      if (finalParams.create) url.set('create', 'true');

      const queryString = url.toString();
      return `/${currentLocale}/admin/editor${queryString ? `?${queryString}` : ''}`;
    },
    [editorParams, currentLocale]
  );

  // Action: Navigate to specific page by ID
  const navigateToPage = useCallback(
    (pageId: string, slug?: string) => {
      const url = buildEditorUrl({ pageId, slug, create: undefined });
      console.warn('🚀 navigateToPage: Built URL:', url);
      router.push(url);
      console.warn('🚀 navigateToPage: Router.push called');
    },
    [router, buildEditorUrl]
  );

  // Action: Navigate to page by slug (useful for user-friendly URLs)
  const navigateToSlug = useCallback(
    (slug: string, locale?: string) => {
      const url = buildEditorUrl({
        pageId: undefined,
        slug,
        locale: locale || currentLocale,
        create: undefined,
      });
      router.replace(url);
    },
    [router, buildEditorUrl, currentLocale]
  );

  // Action: Navigate directly to page view (not editor)
  const navigateToPageView = useCallback(
    (slug: string, locale?: string) => {
      const pageLocale = locale || currentLocale;
      const pageUrl = `/${pageLocale}/${slug}`;
      router.push(pageUrl);
    },
    [router, currentLocale]
  );

  // Action: Open create modal
  const openCreateModal = useCallback(() => {
    const url = buildEditorUrl({ create: true, pageId: undefined, slug: undefined });
    router.replace(url);
  }, [router, buildEditorUrl]);

  // Action: Clear all parameters (go to base editor)
  const clearParams = useCallback(() => {
    router.replace(`/${currentLocale}/admin/editor`);
  }, [router, currentLocale]);

  // Action: Update URL to reflect currently selected page
  const updatePageInUrl = useCallback(
    (page: PageConfig) => {
      // Use pageId as primary identifier, slug as secondary
      const url = buildEditorUrl({
        pageId: page.id,
        slug: page.slug,
        locale: page.locale,
        create: undefined,
      });
      console.warn('🚀 updatePageInUrl: Built URL:', url);
      console.warn('🚀 updatePageInUrl: Page data:', {
        id: page.id,
        slug: page.slug,
        locale: page.locale,
      });

      // Use push instead of replace to see if that works better
      router.push(url);
      console.warn('🚀 updatePageInUrl: Router.push called');
    },
    [router, buildEditorUrl]
  );

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔗 Editor Params:', editorParams);
    }
  }, [editorParams]);

  return {
    // Current state
    ...editorParams,

    // Actions
    navigateToPage,
    navigateToSlug,
    navigateToPageView,
    openCreateModal,
    clearParams,
    updatePageInUrl,
  };
}

/**
 * Helper hook to find page by current URL parameters
 * Returns the page that matches current URL params (pageId or slug+locale)
 */
export function useFindPageFromParams(pages: PageConfig[]): PageConfig | null {
  const { pageId, slug, locale } = useEditorParams();

  return useMemo(() => {
    if (!pages.length) return null;

    // First priority: exact pageId match
    if (pageId) {
      const pageById = pages.find(page => page.id === pageId);
      if (pageById) return pageById;
    }

    // Second priority: slug + locale match
    if (slug) {
      const pageBySlug = pages.find(page => page.slug === slug && page.locale === (locale || 'es'));
      if (pageBySlug) return pageBySlug;
    }

    return null;
  }, [pages, pageId, slug, locale]);
}
