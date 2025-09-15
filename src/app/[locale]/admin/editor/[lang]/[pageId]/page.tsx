/**
 * Admin Page Editor
 * Página completa del editor con panel izquierdo y vista previa en tiempo real
 */
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageEditorPanel } from '../../../../../../components/admin/PageEditorPanel';
import { PagePreview, TailwindBreakpoint } from '../../../../../../components/admin/PagePreview';
import { useEditModeActions, useEditModeStore, usePageStore } from '../../../../../../stores';

interface PageEditorParams {
  locale: string;
  pageId: string;
}

export default function AdminPageEditor() {
  const params = useParams() as unknown as PageEditorParams;
  const { locale, pageId } = params;

  // Store hooks
  const { currentPage, isLoading, error } = usePageStore();
  const { enabled: isEditMode, selectedComponentId } = useEditModeStore();
  const { enableEditMode } = useEditModeActions();

  // Local state - Start with small default that will be adjusted to respect new dvw values
  const [content, setContent] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [breakpoint, setBreakpoint] = useState<TailwindBreakpoint>('lg');
  const [sidebarWidth, setSidebarWidth] = useState(384); // Start with 20dvw equivalent (will be adjusted)
  const [isResizing, setIsResizing] = useState(false);
  const [maxSidebarWidth, setMaxSidebarWidth] = useState(1920); // Dynamic max width (100dvw)
  const [sizeState, setSizeState] = useState<'default' | 'half' | 'full'>('default'); // Size toggle state

  // Calculate different width sizes based on dvw values
  const getDefaultWidth = () => Math.floor(window.innerWidth * 0.2); // 20dvw as default
  const getHalfScreenWidth = () => Math.floor(window.innerWidth * 0.4); // 40dvw as half
  const getFullScreenWidth = () => window.innerWidth; // 100dvw as full

  // Update max width based on window size
  useEffect(() => {
    const updateMaxWidth = () => {
      // Full screen width = 100dvw (entire viewport width)
      const newMaxWidth = window.innerWidth;
      setMaxSidebarWidth(newMaxWidth);

      // Adjust current width if it exceeds new maximum
      setSidebarWidth(prevWidth => Math.min(prevWidth, newMaxWidth));
    };

    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      enableEditMode();
    }
  }, [isEditMode, enableEditMode]);

  useEffect(() => {
    const loadPageData = async () => {
      if (pageId === 'new') {
        // Create new page - In real implementation, call API or store method
        // For now, just set some mock data
        // Development: Creating new page
      } else {
        // Load existing page - In real implementation, call API
        // Development: Loading page
      }
    };

    loadPageData();
  }, [pageId, locale]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBreakpointChange = (newBreakpoint: TailwindBreakpoint) => {
    setBreakpoint(newBreakpoint);
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

      // Minimum 5dvw for usability, maximum 100dvw
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
    const tolerance = 100; // Increased tolerance for larger widths
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
  }, [sidebarWidth, maxSidebarWidth]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <span className="text-muted-foreground">Cargando página...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-destructive">
            <svg
              className="mx-auto mb-4 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Error al cargar la página</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative flex h-full overflow-hidden">
      {/* Sidebar Toggle Button - Always visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="bg-primary text-primary-foreground hover:bg-primary/90 fixed left-0 top-1/2 z-50 flex h-12 w-8 -translate-y-1/2 transform items-center justify-center rounded-r-lg shadow-lg transition-all duration-300"
          title="Abrir panel editor"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
          <h2 className="text-foreground text-lg font-semibold">Editor</h2>
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
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100%-4rem)] overflow-hidden">
          <PageEditorPanel
            locale={locale}
            pageId={pageId}
            onContentChange={handleContentChange}
            width={sidebarWidth}
          />
        </div>

        {/* Resizable Divider */}
        {isSidebarOpen && (
          <div
            className="bg-border hover:bg-primary/20 absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors"
            onMouseDown={startResize}
            title="Arrastra para redimensionar"
          >
            {/* Visual indicator for better UX */}
            <div className="bg-muted-foreground/30 absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Main Content - Preview Area */}
      <div className="flex-1">
        <PagePreview
          page={currentPage || {}}
          content={content}
          locale={locale}
          className=""
          breakpoint={breakpoint}
          onBreakpointChange={handleBreakpointChange}
        />
      </div>

      {/* Component Selection Indicator */}
      {selectedComponentId && (
        <div className="bg-primary text-primary-foreground fixed right-4 top-4 z-50 rounded-md px-3 py-1 text-sm">
          Componente seleccionado: {selectedComponentId}
        </div>
      )}
    </div>
  );
}
