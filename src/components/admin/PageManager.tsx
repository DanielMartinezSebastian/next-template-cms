/**
 * Page Manager Component
 * Gestiona la lista de páginas del CMS con funcionalidades CRUD
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageStore } from '@/stores';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { CreatePageModal } from './CreatePageModal';

export function PageManager() {
  const t = useTranslations('Admin');
  const { pages, isLoading, error, deletePage, updatePage, setLoading, setError } = usePageStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter and search pages
  const filteredPages = useMemo(() => {
    let result = [...pages];

    // Filter by locale
    if (selectedLocale !== 'all') {
      result = result.filter(page => page.locale === selectedLocale);
    }

    // Search by title and slug
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        page =>
          page.title.toLowerCase().includes(term) ||
          page.slug.toLowerCase().includes(term) ||
          page.metadata?.description?.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [pages, selectedLocale, searchTerm]);

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
      {/* Controls */}
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
        </div>

        {/* Create Button */}
        <Button onClick={() => setIsCreateModalOpen(true)} className="shrink-0">
          {t('editor.createPage')}
        </Button>
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
      ) : (
        <div className="space-y-4">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-card rounded-lg border p-6">
              <div className="flex items-start justify-between">
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
                <div className="ml-4 flex items-center gap-2">
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
