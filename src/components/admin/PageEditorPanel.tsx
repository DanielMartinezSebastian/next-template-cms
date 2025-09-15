/**
 * Page Editor Panel
 * Panel lateral izquierdo para editar propiedades de la página
 */
'use client';

import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { VisualEditor } from '../editor';
import { usePageActions, usePageStore, PageConfig } from '../../stores';

interface PageEditorPanelProps {
  pageId: string;
  locale: string;
  onContentChange?: (content: string) => void;
  onPageUpdate?: (page: Partial<PageConfig>) => void;
}

export function PageEditorPanel({
  pageId,
  locale,
  onContentChange,
  onPageUpdate,
}: PageEditorPanelProps) {
  const { pages } = usePageStore();
  const { updatePage } = usePageActions();

  // Find the current page
  const currentPage = pages.find(p => p.id === pageId);

  const [pageData, setPageData] = useState<Partial<PageConfig>>({
    title: currentPage?.title || 'New Page',
    slug: currentPage?.slug || 'new-page',
    metadata: {
      description: currentPage?.metadata?.description || '',
      keywords: currentPage?.metadata?.keywords || [],
      image: currentPage?.metadata?.image || '',
    },
    isPublished: currentPage?.isPublished || false,
    locale,
  });

  const [contentString, setContentString] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="bg-card border-border h-screen w-96 overflow-y-auto border-r">
      {/* Header */}
      <div className="border-border border-b p-6">
        <h2 className="text-card-foreground mb-2 text-xl font-semibold">Page Editor</h2>
        <p className="text-muted-foreground text-sm">
          Editing: {locale.toUpperCase()} / {pageData.slug}
        </p>
      </div>

      {/* Page Settings */}
      <div className="space-y-6 p-6">
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
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[80px] w-full resize-none rounded-md border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
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
        <div className="border-border border-t pt-4">
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
