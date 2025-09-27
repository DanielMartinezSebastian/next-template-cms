/**
 * Page Manager Component
 * Gestiona la lista de páginas del CMS con funcionalidades CRUD
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageActions, usePageStore } from '@/stores';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { CreatePageModal } from './CreatePageModal';
import { PageTreeView } from './PageTreeView';

export function PageManager() {
  const t = useTranslations('Admin');
  const { pages, isLoading, error, deletePage, updatePage, setLoading, setError } = usePageStore();
  const { loadPages } = usePageActions();

  // Selection and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tree'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Bulk actions state
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // Load pages on component mount
  useEffect(() => {
    // Load pages if not already loaded or if store is empty
    if (pages.length === 0) {
      loadPages();
    }
  }, [loadPages, pages.length]);

  // Filter and search pages
  const filteredPages = useMemo(() => {
    let result = [...pages];

    // Filter by locale
    if (selectedLocale !== 'all') {
      result = result.filter(page => page.locale === selectedLocale);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'published') {
        result = result.filter(page => page.isPublished);
      } else if (selectedStatus === 'draft') {
        result = result.filter(page => !page.isPublished);
      }
    }

    // Search by title, slug, and metadata
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        page =>
          page.title.toLowerCase().includes(term) ||
          page.slug.toLowerCase().includes(term) ||
          page.metadata?.description?.toLowerCase().includes(term)
      );
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  }, [pages, selectedLocale, selectedStatus, searchTerm, sortBy]);

  const handleDeletePage = async (pageId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(t('editor.confirmDelete'))) {
      try {
        setLoading(true);
        deletePage(pageId);
        setError(null);
      } catch (error) {
        console.error('Error deleting page:', error);
        setError('Failed to delete page');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePublish = async (pageId: string) => {
    try {
      setLoading(true);
      const page = pages.find(p => p.id === pageId);
      if (page) {
        updatePage(pageId, { isPublished: !page.isPublished });
        setError(null);
      }
    } catch (error) {
      console.error('Error toggling page publish status:', error);
      setError('Failed to update page status');
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const handleSelectPage = (pageId: string, checked: boolean) => {
    const newSelection = new Set(selectedPages);
    if (checked) {
      newSelection.add(pageId);
    } else {
      newSelection.delete(pageId);
    }
    setSelectedPages(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(new Set(filteredPages.map(page => page.id)));
    } else {
      setSelectedPages(new Set());
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedPages.size === 0) return;

    // eslint-disable-next-line no-alert
    if (window.confirm(t('editor.confirmBulkDelete', { count: selectedPages.size }))) {
      try {
        setIsBulkActionLoading(true);
        for (const pageId of selectedPages) {
          deletePage(pageId);
        }
        setSelectedPages(new Set());
        setError(null);
      } catch (error) {
        console.error('Error bulk deleting pages:', error);
        setError('Failed to delete pages');
      } finally {
        setIsBulkActionLoading(false);
      }
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    if (selectedPages.size === 0) return;

    try {
      setIsBulkActionLoading(true);
      for (const pageId of selectedPages) {
        updatePage(pageId, { isPublished: publish });
      }
      setSelectedPages(new Set());
      setError(null);
    } catch (error) {
      console.error('Error bulk updating pages:', error);
      setError('Failed to update pages');
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">{t('editor.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
        <p className="text-destructive">
          {t('editor.error')}: {error}
        </p>
        <Button variant="outline" onClick={() => setError(null)} className="mt-2">
          {t('editor.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="space-y-4">
        {/* Top Row: Search, Filters and Create Button */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-1 gap-4 sm:w-auto">
            {/* Search */}
            <Input
              placeholder={t('editor.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="min-w-0 flex-1"
            />

            {/* Locale Filter */}
            <select
              value={selectedLocale}
              onChange={e => setSelectedLocale(e.target.value)}
              className="bg-background border-input focus:ring-ring text-foreground rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1"
            >
              <option value="all" className="bg-background text-foreground">
                {t('editor.allLocales')}
              </option>
              <option value="en" className="bg-background text-foreground">
                {t('editor.localeEn')}
              </option>
              <option value="es" className="bg-background text-foreground">
                {t('editor.localeEs')}
              </option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-background border-input focus:ring-ring text-foreground rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1"
            >
              <option value="all" className="bg-background text-foreground">
                {t('editor.allStatuses')}
              </option>
              <option value="published" className="bg-background text-foreground">
                {t('editor.published')}
              </option>
              <option value="draft" className="bg-background text-foreground">
                {t('editor.draft')}
              </option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-background border-input focus:ring-ring text-foreground rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1"
            >
              <option value="updated" className="bg-background text-foreground">
                {t('editor.sortByUpdated')}
              </option>
              <option value="created" className="bg-background text-foreground">
                {t('editor.sortByCreated')}
              </option>
              <option value="title" className="bg-background text-foreground">
                {t('editor.sortByTitle')}
              </option>
            </select>
          </div>

          {/* View Mode and Create Button */}
          <div className="flex shrink-0 items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex overflow-hidden rounded-md border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none border-0"
              >
                📋
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none border-0 border-l"
              >
                ⊞
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tree')}
                className="rounded-none border-0 border-l"
              >
                🌳
              </Button>
            </div>

            {/* Create Button */}
            <Button onClick={() => setIsCreateModalOpen(true)}>{t('editor.createPage')}</Button>
          </div>
        </div>

        {/* Bulk Actions Row */}
        {selectedPages.size > 0 && (
          <div className="bg-accent/50 border-accent rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {t('editor.selectedCount', { count: selectedPages.size })}
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedPages(new Set())}>
                  {t('editor.clearSelection')}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkPublish(true)}
                  disabled={isBulkActionLoading}
                >
                  {t('editor.bulkPublish')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkPublish(false)}
                  disabled={isBulkActionLoading}
                >
                  {t('editor.bulkUnpublish')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isBulkActionLoading}
                >
                  {t('editor.bulkDelete')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-muted-foreground text-sm font-medium">{t('editor.totalPages')}</h3>
          <p className="text-foreground text-2xl font-bold">{pages.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-muted-foreground text-sm font-medium">
            {t('editor.publishedPages')}
          </h3>
          <p className="text-foreground text-2xl font-bold">
            {pages.filter(p => p.isPublished).length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-muted-foreground text-sm font-medium">{t('editor.draftPages')}</h3>
          <p className="text-foreground text-2xl font-bold">
            {pages.filter(p => !p.isPublished).length}
          </p>
        </div>
      </div>

      {/* Pages List */}
      {filteredPages.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-foreground mb-2 text-lg font-medium">
            {searchTerm || selectedLocale !== 'all' ? t('editor.noResults') : t('editor.noPages')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedLocale !== 'all'
              ? t('editor.tryDifferentSearch')
              : t('editor.createFirstPage')}
          </p>
        </div>
      ) : viewMode === 'tree' ? (
        /* Tree View */
        <PageTreeView selectedPages={selectedPages} onSelectPage={handleSelectPage} />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-card rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedPages.has(page.id)}
                  onChange={e => handleSelectPage(page.id, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-foreground truncate text-sm font-semibold">{page.title}</h3>
                    <span className="bg-muted rounded px-1 py-0.5 text-xs">
                      {page.locale.toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`mb-2 inline-block rounded px-2 py-1 text-xs ${
                      page.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {page.isPublished ? t('editor.published') : t('editor.draft')}
                  </span>
                  <p className="text-muted-foreground mb-2 text-xs">/{page.slug}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(page.id)}
                    >
                      {page.isPublished ? '👁️' : '👀'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/editor/${page.locale}/${page.id}`}>✏️</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {/* Select All Header */}
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filteredPages.length > 0 && selectedPages.size === filteredPages.length}
                onChange={e => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">
                {selectedPages.size === filteredPages.length
                  ? t('editor.allPagesSelected')
                  : t('editor.selectAllPages')}
              </span>
              <span className="text-muted-foreground text-sm">
                ({filteredPages.length} {t('editor.pagesTotal')})
              </span>
            </div>
          </div>

          {/* Pages List */}
          {filteredPages.map(page => (
            <div key={page.id} className="bg-card rounded-lg border p-6">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedPages.has(page.id)}
                  onChange={e => handleSelectPage(page.id, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                {/* Page Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-foreground text-lg font-semibold">{page.title}</h3>
                    <span className="bg-muted rounded px-2 py-1 text-xs">
                      {page.locale.toUpperCase()}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        page.isPublished
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {page.isPublished ? t('editor.published') : t('editor.draft')}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2 text-sm">/{page.slug}</p>
                  {page.metadata?.description && (
                    <p className="text-muted-foreground mb-2 text-sm">
                      {page.metadata.description}
                    </p>
                  )}
                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <span>
                      {page.components.length} {t('editor.components')}
                    </span>
                    <span>
                      {t('editor.updated')}: {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleTogglePublish(page.id)}>
                    {page.isPublished ? t('editor.unpublish') : t('editor.publish')}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/editor/${page.locale}/${page.id}`}>{t('editor.edit')}</a>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePage(page.id)}>
                    {t('editor.delete')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Page Modal */}
      <CreatePageModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
