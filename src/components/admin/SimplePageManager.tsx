/**
 * Simple Page Manager - Replacement for Lexical-based PageManager
 * Gestiona páginas usando el nuevo sistema sin Lexical con diseño de pantalla completa
 */
'use client';

import { Edit, Plus, RotateCcw, Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PageConfig, useCurrentPage, usePageActions, usePages } from '../../stores';
import { Button } from '../ui/button';
import { CreatePageModal } from './CreatePageModal';
import { SimplePageEditor } from './SimplePageEditor';
import { SimplePagePreview, TailwindBreakpoint } from './SimplePagePreview';

interface SimplePageManagerProps {
  className?: string;
}

export function SimplePageManager({ className = '' }: SimplePageManagerProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  const { loadPages, setCurrentPage, updatePage, savePageToDatabase } = usePageActions();

  const pages = usePages();
  const currentPage = useCurrentPage();

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewBreakpoint, setPreviewBreakpoint] = useState<TailwindBreakpoint>('lg');
  const [isSaving, setIsSaving] = useState(false);

  // Layout state - siguiendo el patrón del editor original
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(400); // Default 400px
  const [isResizing, setIsResizing] = useState(false);
  const [maxSidebarWidth, setMaxSidebarWidth] = useState(1920);
  const [sizeState, setSizeState] = useState<'default' | 'half' | 'full'>('default');

  // Calculate different width sizes based on dvw values
  const getDefaultWidth = useCallback(() => Math.floor(window.innerWidth * 0.2), []); // 20dvw as default
  const getHalfScreenWidth = useCallback(() => Math.floor(window.innerWidth * 0.4), []); // 40dvw as half
  const getFullScreenWidth = useCallback(() => window.innerWidth, []); // 100dvw as full

  // Update max width based on window size
  useEffect(() => {
    const updateMaxWidth = () => {
      const newMaxWidth = window.innerWidth;
      setMaxSidebarWidth(newMaxWidth);
      setSidebarWidth(prevWidth => Math.min(prevWidth, newMaxWidth));
    };

    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Set current page when selectedPageId changes
  useEffect(() => {
    if (selectedPageId) {
      const page = pages.find((p: PageConfig) => p.id === selectedPageId);
      if (page) {
        setCurrentPage(page);
      }
    }
  }, [selectedPageId, pages, setCurrentPage]);

  const handlePageUpdate = useCallback(
    async (pageData: Partial<PageConfig>) => {
      if (!currentPage) return;

      // Update local state immediately
      updatePage(currentPage.id, pageData);
    },
    [currentPage, updatePage]
  );

  const handleSavePage = useCallback(async () => {
    if (!currentPage) return;

    setIsSaving(true);
    try {
      // Use PageConfig structure, store will handle API conversion
      await savePageToDatabase(currentPage.id, {
        title: currentPage.title,
        slug: currentPage.slug,
        metadata: {
          description: currentPage.metadata?.description || '',
        },
        isPublished: currentPage.isPublished,
        components: currentPage.components || [], // Pass components directly
      });
      console.warn('✅ Page saved successfully');
    } catch (error) {
      console.error('❌ Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentPage, savePageToDatabase]);

  const handleRefresh = useCallback(async () => {
    await loadPages();
    console.warn('✅ Pages refreshed');
  }, [loadPages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Resizing handlers
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Effect for handling mouse events during resize
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing) return;

      const dynamicMin = Math.floor(window.innerWidth * 0.05); // 5dvw as minimum
      const newWidth = Math.min(Math.max(e.clientX, dynamicMin), maxSidebarWidth);
      setSidebarWidth(newWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, maxSidebarWidth]);

  // Function to toggle between three size states
  const toggleEditorSize = () => {
    let newState: 'default' | 'half' | 'full';
    let newWidth: number;

    switch (sizeState) {
      case 'default':
        newState = 'half';
        newWidth = getHalfScreenWidth();
        break;
      case 'half':
        newState = 'full';
        newWidth = getFullScreenWidth();
        break;
      case 'full':
      default:
        newState = 'default';
        newWidth = getDefaultWidth();
        break;
    }

    setSizeState(newState);
    setSidebarWidth(newWidth);
  };

  // Effect to update size state when width changes manually (by dragging)
  useEffect(() => {
    const tolerance = 100;
    const defaultWidth = Math.floor(window.innerWidth * 0.2); // 20dvw
    const halfScreenWidth = Math.floor(window.innerWidth * 0.4); // 40dvw
    const fullScreenWidth = window.innerWidth; // 100dvw

    if (Math.abs(sidebarWidth - defaultWidth) <= tolerance) {
      setSizeState('default');
    } else if (Math.abs(sidebarWidth - halfScreenWidth) <= tolerance) {
      setSizeState('half');
    } else if (Math.abs(sidebarWidth - fullScreenWidth) <= tolerance) {
      setSizeState('full');
    }
  }, [sidebarWidth, maxSidebarWidth, getDefaultWidth, getHalfScreenWidth, getFullScreenWidth]);

  return (
    <div className={`bg-background ${className}`}>
      {/* Page Selection and Actions */}
      <div className="bg-card border-border mb-4 rounded-lg border p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-foreground text-lg font-semibold">Pages</h2>
            <select
              value={selectedPageId || ''}
              onChange={e => setSelectedPageId(e.target.value || null)}
              className="border-border bg-background text-foreground focus:ring-primary rounded-md border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-1"
            >
              <option value="">Select a page...</option>
              {pages.map((page: PageConfig) => (
                <option key={page.id} value={page.id}>
                  {page.title} ({page.locale})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>

            {currentPage && (
              <>
                <Button variant="outline" size="sm" onClick={handleSavePage} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>

                <Button variant="outline" size="sm" onClick={() => loadPages()}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Page Info */}
        {currentPage && (
          <div className="border-border mt-4 border-t pt-4">
            <div className="text-muted-foreground grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <span className="font-medium">ID:</span> {currentPage.id}
              </div>
              <div>
                <span className="font-medium">Slug:</span> /{currentPage.slug}
              </div>
              <div>
                <span className="font-medium">Components:</span>{' '}
                {currentPage.components?.length || 0}
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className={currentPage.isPublished ? 'text-green-600' : 'text-yellow-600'}>
                  {currentPage.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Layout */}
      {currentPage ? (
        <div className="flex h-full">
          {/* Left Panel - Editor */}
          <div className="flex-shrink-0">
            <SimplePageEditor onPageUpdate={handlePageUpdate} width={sidebarWidth} />
          </div>

          {/* Right Panel - Preview */}
          <div className="min-w-0 flex-1">
            <SimplePagePreview
              page={currentPage}
              locale={currentPage.locale}
              breakpoint={previewBreakpoint}
              onBreakpointChange={setPreviewBreakpoint}
            />
          </div>
        </div>
      ) : (
        <div className="bg-card border-border flex h-96 items-center justify-center rounded-lg border">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">
              <Edit className="mx-auto h-12 w-12 opacity-50" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">No page selected</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Select a page from the dropdown above or create a new one to start editing.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Page
            </Button>
          </div>
        </div>
      )}

      {/* Create Page Modal */}
      {isCreating && <CreatePageModal isOpen={isCreating} onClose={() => setIsCreating(false)} />}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-muted border-border mt-4 rounded-lg border p-4">
          <h4 className="text-muted-foreground mb-2 text-sm font-medium">
            Debug Info - Simple Page Manager
          </h4>
          <div className="text-muted-foreground space-y-1 text-xs">
            <div>Total Pages: {pages.length}</div>
            <div>Selected Page ID: {selectedPageId || 'None'}</div>
            <div>Current Page: {currentPage?.title || 'None'}</div>
            <div>Preview Breakpoint: {previewBreakpoint}</div>
            <div>Editor Width: {sidebarWidth}px</div>
            <div>System: No Lexical (Simple Editor)</div>
          </div>
        </div>
      )}
    </div>
  );
}
