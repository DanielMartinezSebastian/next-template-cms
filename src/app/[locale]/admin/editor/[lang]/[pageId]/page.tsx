/**
 * Admin Page Editor
 * Página completa del editor con panel izquierdo y vista previa en tiempo real
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePageStore, useEditModeStore, useEditModeActions } from '../../../../../../stores';
import { PageEditorPanel } from '../../../../../../components/admin/PageEditorPanel';
import { PagePreview } from '../../../../../../components/admin/PagePreview';

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

  // Local state
  const [content, setContent] = useState<string>('');
  const [isResizing, setIsResizing] = useState(false);
  const [panelWidth, setPanelWidth] = useState(50); // Percentage

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const container = document.getElementById('editor-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit panel width between 30% and 70%
      const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
      setPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <span className="text-muted-foreground">Cargando página...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
    <div
      id="editor-container"
      className="bg-background flex h-screen"
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      {/* Left Panel - Editor */}
      <div
        className="bg-card border-border overflow-hidden border-r"
        style={{ width: `${panelWidth}%` }}
      >
        <PageEditorPanel locale={locale} pageId={pageId} onContentChange={handleContentChange} />
      </div>

      {/* Resizer */}
      <div
        className={`bg-border hover:bg-primary w-1 cursor-col-resize transition-colors ${
          isResizing ? 'bg-primary' : ''
        }`}
        onMouseDown={handleMouseDown}
        title="Redimensionar paneles"
      />

      {/* Right Panel - Preview */}
      <div className="flex-1 overflow-hidden" style={{ width: `${100 - panelWidth}%` }}>
        <PagePreview
          page={currentPage || {}}
          content={content}
          locale={locale}
          className="h-full"
        />
      </div>

      {/* Component Selection Indicator */}
      {selectedComponentId && (
        <div className="bg-primary text-primary-foreground fixed right-4 top-4 z-50 rounded-md px-3 py-1 text-sm">
          Componente seleccionado: {selectedComponentId}
        </div>
      )}

      {/* Resize Indicator */}
      {isResizing && (
        <div className="bg-background border-border text-foreground fixed left-1/2 top-4 z-50 -translate-x-1/2 transform rounded-md border px-3 py-1 text-sm shadow-lg">
          {Math.round(panelWidth)}% / {Math.round(100 - panelWidth)}%
        </div>
      )}
    </div>
  );
}
