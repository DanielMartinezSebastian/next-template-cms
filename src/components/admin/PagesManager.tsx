'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageStore, usePageActions } from '@/stores';
import { CreatePageModal } from './CreatePageModal';
import Link from 'next/link';

export function PagesManager() {
  const t = useTranslations('Admin');
  const { pages, isLoading, error } = usePageStore();
  const { loadPages, deletePage, updatePage } = usePageActions();

  // State for filtering and UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // Load pages on component mount
  useEffect(() => {
    if (pages.length === 0) {
      loadPages();
    }
  }, [loadPages, pages.length]);

  // Filter and search pages
  const filteredPages = useMemo(() => {
    let result = [...pages];

    // Filter by locale
    if (selectedLocale !== 'all') {
      result = result.filter(page => {
        // For the mock structure, get locale from contents
        const content = page.contents?.[0];
        return content?.locale?.code === selectedLocale;
      });
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'published') {
        result = result.filter(page => {
          const content = page.contents?.[0];
          return content?.isPublished;
        });
      } else if (selectedStatus === 'draft') {
        result = result.filter(page => {
          const content = page.contents?.[0];
          return !content?.isPublished;
        });
      }
    }

    // Search by title, slug, and description
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(page => {
        const content = page.contents?.[0];
        return (
          content?.title?.toLowerCase().includes(term) ||
          page.slug.toLowerCase().includes(term) ||
          content?.description?.toLowerCase().includes(term)
        );
      });
    }

    // Sort pages
    result.sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = a.contents?.[0]?.title || a.slug;
        const titleB = b.contents?.[0]?.title || b.slug;
        return titleA.localeCompare(titleB);
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  }, [pages, selectedLocale, selectedStatus, searchTerm, sortBy]);

  // Handle bulk actions
  const handleBulkPublish = async () => {
    setIsBulkActionLoading(true);
    try {
      const promises = Array.from(selectedPages).map(pageId => 
        updatePage(pageId, { isPublished: true })
      );
      await Promise.all(promises);
      setSelectedPages(new Set());
    } catch (error) {
      console.error('Error in bulk publish:', error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkUnpublish = async () => {
    setIsBulkActionLoading(true);
    try {
      const promises = Array.from(selectedPages).map(pageId => 
        updatePage(pageId, { isPublished: false })
      );
      await Promise.all(promises);
      setSelectedPages(new Set());
    } catch (error) {
      console.error('Error in bulk unpublish:', error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar las páginas seleccionadas?')) {
      return;
    }
    
    setIsBulkActionLoading(true);
    try {
      const promises = Array.from(selectedPages).map(pageId => deletePage(pageId));
      await Promise.all(promises);
      setSelectedPages(new Set());
    } catch (error) {
      console.error('Error in bulk delete:', error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleSelectPage = (pageId: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(filteredPages.map(page => page.id)));
    }
  };

  const handleTogglePublish = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const currentStatus = page.contents?.[0]?.isPublished || false;
    await updatePage(pageId, { isPublished: !currentStatus });
  };

  const handleDuplicatePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const content = page.contents?.[0];
    if (!content) return;

    try {
      setIsBulkActionLoading(true);
      
      // Create a new page with duplicated content using the page store
      // This would normally call the createPage action from the store
      const duplicateData = {
        slug: `${page.slug}-copy-${Date.now()}`,
        title: `${content.title} (Copia)`,
        description: content.description,
        locale: content.locale?.code || 'en',
        components: page.components || [],
        isPublished: false,
      };

      console.log('Duplicating page with data:', duplicateData);
      
      // Simulate the duplication by refreshing the pages
      // In a real implementation, this would call createPage action
      await loadPages();
      
    } catch (error) {
      console.error('Error duplicating page:', error);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const renderPageCard = (page: any) => {
    const content = page.contents?.[0];
    const isSelected = selectedPages.has(page.id);
    
    return (
      <div
        key={page.id}
        className={`bg-card border-border hover:shadow-md rounded-lg border p-4 transition-shadow ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectPage(page.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className="text-foreground mb-1 font-semibold">
                {content?.title || page.slug}
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">/{page.slug}</p>
              {content?.description && (
                <p className="text-muted-foreground mb-2 text-sm">
                  {content.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                content?.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {content?.isPublished ? 'Publicada' : 'Borrador'}
            </span>
            <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
              {content?.locale?.code || 'en'}
            </span>
          </div>
        </div>

        <div className="text-muted-foreground mb-3 flex items-center gap-4 text-xs">
          <span>
            {page.components?.length || 0} componentes
          </span>
          <span>
            Actualizada: {new Date(page.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleTogglePublish(page.id)}
          >
            {content?.isPublished ? 'Despublicar' : 'Publicar'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDuplicatePage(page.id)}
          >
            Duplicar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/editor?pageId=${page.id}`}>
              Editar
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => deletePage(page.id)}
            className="text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        </div>
      </div>
    );
  };

  const renderPageListItem = (page: any) => {
    const content = page.contents?.[0];
    const isSelected = selectedPages.has(page.id);
    
    return (
      <div
        key={page.id}
        className={`bg-card border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectPage(page.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-foreground font-semibold">
                  {content?.title || page.slug}
                </h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    content?.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {content?.isPublished ? 'Publicada' : 'Borrador'}
                </span>
                <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
                  {content?.locale?.code || 'en'}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">/{page.slug}</p>
              {content?.description && (
                <p className="text-muted-foreground mt-1 text-sm">{content.description}</p>
              )}
              <div className="text-muted-foreground mt-2 text-xs">
                {page.components?.length || 0} componentes • 
                Actualizada: {new Date(page.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTogglePublish(page.id)}
            >
              {content?.isPublished ? 'Despublicar' : 'Publicar'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDuplicatePage(page.id)}
            >
              Duplicar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/editor?pageId=${page.id}`}>
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-foreground mb-2 text-2xl font-bold">Gestión de Páginas</h1>
          <p className="text-muted-foreground">Cargando páginas...</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card border-border h-24 animate-pulse rounded-lg border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error al cargar páginas</h2>
          <p className="text-red-600 text-sm">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={loadPages}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">Gestión de Páginas</h1>
          <p className="text-muted-foreground">
            Administra las {pages.length} páginas de tu sitio web
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Página
        </Button>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar páginas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* View Mode and Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded border border-border bg-background px-3 py-1 text-sm"
            >
              <option value="updated">Más recientes</option>
              <option value="created">Más antiguas</option>
              <option value="title">Por título</option>
            </select>
            
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              Lista
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Tarjetas
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="rounded border border-border bg-background px-3 py-1 text-sm"
          >
            <option value="all">Todos los idiomas</option>
            <option value="en">Inglés</option>
            <option value="es">Español</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded border border-border bg-background px-3 py-1 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicadas</option>
            <option value="draft">Borradores</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPages.size > 0 && (
          <div className="border-border bg-primary/5 flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm">
              {selectedPages.size} página{selectedPages.size !== 1 ? 's' : ''} seleccionada{selectedPages.size !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkPublish}
                disabled={isBulkActionLoading}
              >
                Publicar todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkUnpublish}
                disabled={isBulkActionLoading}
              >
                Despublicar todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isBulkActionLoading}
                className="text-red-600 hover:text-red-700"
              >
                Eliminar todas
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pages List */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedPages.size === filteredPages.length && filteredPages.length > 0}
              onChange={handleSelectAll}
            />
            Seleccionar todo
          </label>
          <span className="text-muted-foreground text-sm">
            Mostrando {filteredPages.length} de {pages.length} páginas
          </span>
        </div>
        
        <Button variant="outline" size="sm" onClick={loadPages}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </Button>
      </div>

      {filteredPages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4 text-4xl">📄</div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">No se encontraron páginas</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedLocale !== 'all' || selectedStatus !== 'all'
              ? 'Prueba ajustando los filtros de búsqueda'
              : 'Aún no tienes páginas creadas'}
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Crear primera página
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPages.map(renderPageCard)}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map(renderPageListItem)}
        </div>
      )}

      {/* Create Page Modal */}
      <CreatePageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          loadPages();
        }}
      />
    </div>
  );
}