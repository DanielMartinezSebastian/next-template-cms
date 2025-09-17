/**
 * Simple Page Manager - Full Screen Layout
 * Gestiona páginas usando el nuevo sistema sin Lexical con diseño de pantalla completa
 */
'use client';

import { ArrowLeft, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useEditorParams, useFindPageFromParams } from '../../hooks/useEditorParams';
import { PageConfig, usePageActions, usePages } from '../../stores';
import { CreatePageModal } from './CreatePageModal';
import { SimplePageEditor } from './SimplePageEditor';
import { SimplePagePreview, TailwindBreakpoint } from './SimplePagePreview';

export function SimplePageManagerNew() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  // Use URL-based navigation instead of store state
  const { create, pageId, navigateToPage, openCreateModal, clearParams } = useEditorParams();
  const { loadPages, loadPageById, setCurrentPage, updatePage } = usePageActions();

  const pages = usePages();
  // Find current page based on URL parameters, not store state
  const currentPage = useFindPageFromParams(pages);

  const [previewBreakpoint, setPreviewBreakpoint] = useState<TailwindBreakpoint>('lg');

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

  // Auto-load page when pageId changes in URL
  useEffect(() => {
    if (pageId && pages.length > 0) {
      const targetPage = pages.find(p => p.id === pageId);
      if (targetPage && targetPage.id !== currentPage?.id) {
        setCurrentPage(targetPage);
      }
    }
  }, [pageId, pages, currentPage?.id, setCurrentPage]);

  // Handle create modal state based on URL parameter
  const isCreating = create === true;

  const handlePageUpdate = useCallback(
    async (pageData: Partial<PageConfig>) => {
      if (!currentPage) return;

      // Update local state immediately
      updatePage(currentPage.id, pageData);
    },
    [currentPage, updatePage]
  );

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
    <div className="bg-background relative flex h-full overflow-hidden">
      {/* Sidebar Toggle Button - Always visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="bg-primary text-primary-foreground hover:bg-primary/90 fixed left-0 top-1/2 z-50 flex h-12 w-8 -translate-y-1/2 transform items-center justify-center rounded-r-lg shadow-lg transition-all duration-300"
          title="Abrir panel editor"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Sidebar - Editor Panel */}
      <div
        className={`bg-card border-border relative transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0 border-r' : 'w-0 -translate-x-full'
        }`}
        style={{
          width: isSidebarOpen ? `${sidebarWidth}px` : '0px',
        }}
      >
        {/* Sidebar Header */}
        <div className="bg-card border-border flex items-center justify-between border-b p-4">
          <div className="flex flex-1 items-center space-x-3">
            <Link
              href={`/${locale}/admin/editor`}
              className="hover:bg-muted text-muted-foreground hover:text-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors"
              aria-label="Volver a la lista de páginas"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {/* Page Selector in Header */}
            <select
              value={currentPage?.id || ''}
              onChange={e => {
                const selectedId = e.target.value;
                if (selectedId) {
                  const selectedPage = pages.find((p: PageConfig) => p.id === selectedId);
                  if (selectedPage) {
                    setCurrentPage(selectedPage); // Set in store first
                    navigateToPage(selectedId, selectedPage.slug);
                  }
                } else {
                  setCurrentPage(null); // Clear current page
                  clearParams();
                }
              }}
              className="border-border bg-background text-foreground focus:ring-primary min-w-0 flex-1 rounded-md border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-1"
              style={{
                maxWidth: sidebarWidth < 300 ? `${sidebarWidth - 120}px` : 'none',
              }}
            >
              <option value="">{sidebarWidth < 320 ? 'Select...' : 'Select a page...'}</option>
              {pages.map((page: PageConfig) => (
                <option key={page.id} value={page.id}>
                  {sidebarWidth < 320
                    ? `${page.title.substring(0, 15)}${page.title.length > 15 ? '...' : ''}`
                    : `${page.title} (${page.locale})`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {/* Size Toggle Button */}
            <button
              onClick={toggleEditorSize}
              className="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors"
              title={`Cambiar a ${sizeState === 'default' ? '40dvw (media pantalla)' : sizeState === 'half' ? '100dvw (pantalla completa)' : '20dvw (tamaño compacto)'}`}
            >
              {sizeState === 'default' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
              {sizeState === 'half' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v18m6-18v18"
                  />
                </svg>
              )}
              {sizeState === 'full' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4h16v16H4z"
                  />
                </svg>
              )}
            </button>
            {/* Close Sidebar */}
            <button
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors"
              title="Cerrar panel"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Content - Page Selection and Editor */}
        {/* Sidebar Content - Page Editor */}
        <div className="h-[calc(100%-4rem)]">
          {/* Page Editor */}
          {currentPage && (
            <SimplePageEditor
              currentPage={currentPage}
              onPageUpdate={handlePageUpdate}
              width={sidebarWidth}
              sidebarWidth={sidebarWidth}
              onNewPage={() => openCreateModal()}
            />
          )}
        </div>

        {/* Resizable Divider */}
        {isSidebarOpen && (
          <div
            className="bg-border hover:bg-primary/20 absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
            onMouseDown={startResize}
            title="Arrastra para redimensionar"
          >
            <div className="bg-muted-foreground/30 absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Main Content - Preview Area */}
      <div className="flex-1">
        {currentPage ? (
          <SimplePagePreview
            page={currentPage}
            locale={currentPage.locale}
            breakpoint={previewBreakpoint}
            onBreakpointChange={setPreviewBreakpoint}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-6 text-center">
              <Edit className="text-muted-foreground mx-auto h-16 w-16" />
              <div className="space-y-2">
                <h3 className="text-foreground text-xl font-semibold">No Page Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a page from the dropdown menu in the sidebar to start editing, or create a
                  new page.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => openCreateModal()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors"
                >
                  Create New Page
                </button>
                {pages.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    Or select one of the {pages.length} existing page{pages.length !== 1 ? 's' : ''}{' '}
                    from the sidebar
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {isCreating && (
        <CreatePageModal
          isOpen={isCreating}
          onClose={() => {
            clearParams(); // Clear URL parameters when modal closes
            loadPages(); // Refresh the list when modal closes
          }}
        />
      )}
    </div>
  );
}
