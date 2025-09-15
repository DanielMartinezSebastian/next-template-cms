/**
 * Page Editor Panel
 * Panel lateral izquierdo para editar propiedades de la página
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageConfig, useCurrentPage, usePageActions } from '../../stores';
import { VisualEditor } from '../editor';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PageEditorPanelProps {
  pageId: string;
  locale: string;
  onContentChange?: (content: string) => void;
  onPageUpdate?: (page: Partial<PageConfig>) => void;
  width?: number; // Width of the editor panel for responsive adjustments
}

export function PageEditorPanel({
  pageId,
  locale,
  onContentChange,
  onPageUpdate,
  width,
}: PageEditorPanelProps) {
  const currentPage = useCurrentPage();
  const { updatePage } = usePageActions();

  const [pageData, setPageData] = useState<Partial<PageConfig>>({
    title: 'New Page',
    slug: 'new-page',
    metadata: {
      description: '',
      keywords: [],
      image: '',
    },
    isPublished: false,
    locale,
  });

  const [contentString, setContentString] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Debug effect on component mount
  useEffect(() => {
    console.warn('🚀 PageEditorPanel mounted for pageId:', pageId);
    console.warn('📊 Initial state:', {
      hasCurrentPage: !!currentPage,
      currentPageTitle: currentPage?.title,
      pageDataTitle: pageData.title,
    });
  }, [pageId, currentPage, pageData.title]);

  // Sync local state with store currentPage
  useEffect(() => {
    console.warn('🔄 PageEditorPanel useEffect triggered', {
      hasCurrentPage: !!currentPage,
      currentPageTitle: currentPage?.title,
      currentPageId: currentPage?.id,
    });

    if (currentPage) {
      console.warn('📋 Syncing currentPage to local state:', currentPage);

      const newPageData = {
        title: currentPage.title,
        slug: currentPage.slug,
        metadata: {
          description: currentPage.metadata?.description || '',
          keywords: currentPage.metadata?.keywords || [],
          image: currentPage.metadata?.image || '',
        },
        isPublished: currentPage.isPublished,
        locale: currentPage.locale,
        components: currentPage.components,
      };

      setPageData(newPageData);
      console.warn('✅ Local pageData updated:', newPageData);

      // Extract content from components if available
      const contentComponent = currentPage.components?.find(c => c.type === 'content');
      if (contentComponent?.props?.content) {
        setContentString(contentComponent.props.content as string);
        console.warn('📄 Content extracted from components:', contentComponent.props.content);
      } else {
        console.warn('ℹ️ No content component found in page');
      }
    } else {
      console.warn('⚠️ currentPage is null/undefined, keeping default values');
    }
  }, [currentPage]);

  const handleFieldChange = useCallback(
    (field: keyof PageConfig, value: string | boolean | object) => {
      const newData = { ...pageData, [field]: value };
      setPageData(newData);
      onPageUpdate?.(newData);

      // Auto-update page store
      if (currentPage) {
        updatePage(currentPage.id, newData);
      }
    },
    [pageData, onPageUpdate, currentPage, updatePage]
  );

  const handleMetadataChange = useCallback(
    (field: string, value: string) => {
      const newMetadata = { ...pageData.metadata, [field]: value };
      handleFieldChange('metadata', newMetadata);
    },
    [pageData.metadata, handleFieldChange]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setContentString(content);
      onContentChange?.(content);

      // TODO: Convert content string to components structure
      // For now, we'll store it as a simple text component
      const components = content
        ? [
            {
              id: 'content-root',
              type: 'content',
              props: { content },
              order: 0,
            },
          ]
        : [];

      handleFieldChange('components', components);
    },
    [onContentChange, handleFieldChange]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (currentPage) {
        // Here you would typically save to a database
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('Saving page:', pageData);
        }
        // For now, just update the store
        updatePage(currentPage.id, pageData);
      }
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentPage, pageData, updatePage]);

  const handleSlugChange = useCallback(
    (title: string) => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      handleFieldChange('slug', slug);
    },
    [handleFieldChange]
  );

  return (
    <div
      className="bg-card border-border flex flex-col border-r"
      style={{
        height: 'calc(100dvh - 66px)', // Restar altura del header admin + margen
        width: width ? `${width}px` : '384px', // Use dynamic width or default
      }}
    >
      {/* Page Settings - Scrollable with auto Y-axis (only when needed) */}
      <div
        className="scrollbar-admin-auto flex-1 space-y-6 px-6 pt-6"
        style={{ paddingBottom: '32px' }}
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-card-foreground text-lg font-medium">Basic Information</h3>

          <div className="space-y-2">
            <label className="text-card-foreground text-sm font-medium">Page Title</label>
            <Input
              type="text"
              value={pageData.title}
              onChange={e => {
                handleFieldChange('title', e.target.value);
                handleSlugChange(e.target.value);
              }}
              placeholder="Enter page title..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-card-foreground text-sm font-medium">URL Slug</label>
            <Input
              type="text"
              value={pageData.slug}
              onChange={e => handleFieldChange('slug', e.target.value)}
              placeholder="page-url-slug"
              className="w-full"
            />
            <p className="text-muted-foreground text-xs">
              URL: /{locale}/{pageData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-card-foreground text-sm font-medium">Meta Description</label>
            <textarea
              value={pageData.metadata?.description || ''}
              onChange={e => handleMetadataChange('description', e.target.value)}
              placeholder="Brief description for search engines..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[80px] w-full resize-none rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-1"
              maxLength={160}
            />
            <p className="text-muted-foreground text-xs">
              {pageData.metadata?.description?.length || 0}/160 characters
            </p>
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-4">
          <h3 className="text-card-foreground text-lg font-medium">Page Content</h3>

          <div className="border-border overflow-hidden rounded-lg border">
            <VisualEditor
              placeholder="Start creating your page content..."
              onChange={handleContentChange}
              className="min-h-[300px]"
              width={width}
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="space-y-4">
          <h3 className="text-card-foreground text-lg font-medium">Publishing</h3>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={pageData.isPublished}
              onChange={e => handleFieldChange('isPublished', e.target.checked)}
              className="text-primary bg-background border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
            />
            <label htmlFor="published" className="text-card-foreground text-sm font-medium">
              Published
            </label>
          </div>

          {pageData.isPublished && (
            <p className="text-xs text-green-600 dark:text-green-400">
              ✓ This page is live and accessible to visitors
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="border-border border-t pb-8 pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>

          <div className="bg-muted mt-4 rounded-lg p-3">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">Debug Info</h4>
            <div className="text-muted-foreground space-y-1 text-xs">
              <div>Page ID: {pageId}</div>
              <div>Content Length: {contentString.length} chars</div>
              <div>Components: {pageData.components?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
