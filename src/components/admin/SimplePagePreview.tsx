/**
 * Simple Page Preview - Replacement for Lexical-based preview
 * Vista previa en tiempo real usando DynamicPageRenderer (como en /about)
 */
'use client';

import { useEffect, useState } from 'react';
import { PageComponent, PageConfig, usePageActions } from '../../stores';
import { PageJsonConfig } from '../../types/pages';
import { DynamicPageRenderer } from '../dynamic/DynamicPageRenderer';
import { ThemeToggle } from '../ui/theme-toggle';

export type TailwindBreakpoint = 'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface SimplePagePreviewProps {
  page: PageConfig;
  locale: string;
  breakpoint: TailwindBreakpoint;
  onBreakpointChange: (breakpoint: TailwindBreakpoint) => void;
  // Removed onPageUpdate prop - using store directly
}

export function SimplePagePreview({
  page,
  locale,
  breakpoint,
  onBreakpointChange,
}: SimplePagePreviewProps) {
  // Import store methods directly
  const { updatePage, savePageToDatabase, loadPages } = usePageActions();

  const [pageConfig, setPageConfig] = useState<PageJsonConfig | null>(null);
  // Local state for publish status to enable immediate UI updates
  const [localIsPublished, setLocalIsPublished] = useState(page.isPublished || false);

  // Sync local state with page prop changes
  useEffect(() => {
    setLocalIsPublished(page.isPublished || false);
  }, [page.isPublished]);

  // Convert PageConfig to PageJsonConfig for DynamicPageRenderer
  useEffect(() => {
    if (page && page.title) {
      const config: PageJsonConfig = {
        id: page.id || 'preview-page',
        slug: page.slug || 'preview',
        locale,
        hierarchy: {
          id: page.id || 'preview-page',
          slug: page.slug || 'preview',
          fullPath: `/${page.slug || 'preview'}`,
          level: 0,
          order: 0,
        },
        meta: {
          title: page.title,
          description: page.metadata?.description,
          metaTitle: page.title,
          metaDescription: page.metadata?.description,
          keywords: page.metadata?.keywords || [],
        },
        components: (page.components || []).map((component: PageComponent) => ({
          id: component.id,
          type: component.type,
          props: component.props,
          order: component.order,
          isVisible: true,
        })),
        isPublished: page.isPublished || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // DEBUG: Log the page config to understand what's happening
      console.warn('🔍 SimplePagePreview: Converting page to pageConfig', {
        originalPage: {
          id: page.id,
          title: page.title,
          componentsCount: page.components?.length || 0,
          components: page.components?.map(c => ({
            id: c.id,
            type: c.type,
            props: c.props,
            order: c.order
          })) || [],
        },
        pageConfig: {
          id: config.id,
          componentsCount: config.components.length,
          components: config.components.map(c => ({
            id: c.id,
            type: c.type,
            props: c.props,
            order: c.order,
            isVisible: c.isVisible
          })),
        }
      });

      setPageConfig(config);
    } else {
      setPageConfig(null);
    }
  }, [page, locale]);

  // All Tailwind breakpoints with exact configurations
  const tailwindBreakpoints = [
    {
      name: 'default' as TailwindBreakpoint,
      width: '375px',
      label: 'Móvil',
      category: 'móvil',
      description: 'Mobile-first base styles (0px+)',
      icon: '📱',
    },
    {
      name: 'sm' as TailwindBreakpoint,
      width: '640px',
      label: 'Móvil XL',
      category: 'móvil',
      description: 'Small screens (640px+)',
      icon: '📱',
    },
    {
      name: 'md' as TailwindBreakpoint,
      width: '768px',
      label: 'Tablet',
      category: 'tablet',
      description: 'Medium screens (768px+)',
      icon: '📱',
    },
    {
      name: 'lg' as TailwindBreakpoint,
      width: '1024px',
      label: 'Desktop',
      category: 'desktop',
      description: 'Large screens (1024px+)',
      icon: '💻',
    },
    {
      name: 'xl' as TailwindBreakpoint,
      width: '1280px',
      label: 'Desktop XL',
      category: 'desktop',
      description: 'Extra large screens (1280px+)',
      icon: '💻',
    },
    {
      name: '2xl' as TailwindBreakpoint,
      width: '1536px',
      label: 'Desktop 2XL',
      category: 'desktop',
      description: 'Ultra wide screens (1536px+)',
      icon: '💻',
    },
  ];

  // Get current breakpoint configuration
  const currentBreakpointConfig =
    tailwindBreakpoints.find(bp => bp.name === breakpoint) || tailwindBreakpoints[3];

  // Get which breakpoints are active (all breakpoints from default to current)
  const getActiveBreakpoints = () => {
    const currentIndex = tailwindBreakpoints.findIndex(bp => bp.name === breakpoint);
    return tailwindBreakpoints.slice(0, currentIndex + 1);
  };

  return (
    <div className="bg-background grid h-dvh grid-rows-[auto_1fr]">
      {/* Preview Header */}
      <div className="bg-background/95 border-border flex-shrink-0 border-b p-4 backdrop-blur">
        <div className="flex items-center justify-between space-x-3">
          {/* Left side: Slug link (always visible) */}
          <div className="flex min-w-0 items-center space-x-2 overflow-hidden">
            <div className="text-muted-foreground flex items-center space-x-1 text-sm">
              {/* Language - hidden on small screens */}
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline">{locale.toUpperCase()}</span>
              <span className="hidden lg:inline">•</span>

              {/* Slug - always visible */}
              <a
                href={`/${locale}/${page.slug || 'new-page'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground text-primary truncate underline-offset-4 transition-colors hover:underline"
                title={`Abrir /${page.slug || 'new-page'} en nueva pestaña`}
              >
                /{page.slug || 'new-page'}
              </a>

              {/* Page ID - hidden on small screens */}
              {page.id && (
                <>
                  <span className="hidden xl:inline">•</span>
                  <span
                    className="bg-muted hidden whitespace-nowrap rounded-md px-2 py-1 font-mono text-xs xl:inline-block"
                    title="Page ID"
                  >
                    {page.id.slice(-8)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right side: Publish Button, Breakpoint Selector and Theme Toggle */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Publish/Draft Toggle Button */}
            <button
              onClick={async () => {
                const newStatus = !localIsPublished;
                console.warn('🔥 Publish button clicked', {
                  currentStatus: localIsPublished,
                  willToggleTo: newStatus,
                  pageId: page.id,
                });

                // Update local state immediately for responsive UI
                setLocalIsPublished(newStatus);

                try {
                  // Update store state immediately
                  updatePage(page.id, { isPublished: newStatus });

                  // Save to database
                  await savePageToDatabase(page.id, {
                    ...page,
                    isPublished: newStatus,
                    components: page.components || [],
                  });

                  // Reload pages to ensure full synchronization
                  await loadPages();

                  console.warn('✅ Store update successful');
                } catch (error) {
                  console.error('❌ Store update failed, reverting local state:', error);
                  // Revert local state on error
                  setLocalIsPublished(!newStatus);
                }
              }}
              className={`flex items-center space-x-1 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                localIsPublished
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30'
              }`}
              title={localIsPublished ? 'Cambiar a borrador' : 'Publicar página'}
            >
              <span className="mr-1">{localIsPublished ? '📝' : '🚀'}</span>
              <span>{localIsPublished ? 'Published' : 'Draft'}</span>
            </button>

            {/* Breakpoint Selector */}
            <div className="bg-muted flex rounded-md p-1">
              {tailwindBreakpoints.map(bp => (
                <button
                  key={bp.name}
                  onClick={() => onBreakpointChange?.(bp.name)}
                  className={`flex items-center space-x-1 rounded px-1.5 py-1 text-xs transition-colors ${
                    breakpoint === bp.name
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={`${bp.description} - ${bp.width}`}
                >
                  <span>{bp.name === 'default' ? 'base' : bp.name}</span>
                </button>
              ))}
            </div>

            {/* Theme Toggle - hidden on small screens */}
            <div className="hidden lg:block">
              <ThemeToggle variant="outline" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content Container with Horizontal Scroll */}
      <div className="grid min-h-0">
        <div className="scrollbar-admin-always ">
          <div
            className="flex justify-start p-4"
            style={{
              minWidth: `calc(${currentBreakpointConfig.width} + 4rem)`,
              width: `calc(${currentBreakpointConfig.width} + 4rem)`,
            }}
          >
            <div
              className="bg-background min-h-full shrink-0 transition-all duration-500 ease-out"
              style={{
                width: currentBreakpointConfig.width,
                minWidth: currentBreakpointConfig.width,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                border: '1px solid hsl(var(--border))',
                overflow: 'hidden',
                transformOrigin: 'center',
                transform: 'scale(1)',
              }}
            >
              {/* Page Content */}
              {pageConfig ? (
                <DynamicPageRenderer
                  pageConfig={pageConfig}
                  locale={locale}
                  editMode={false}
                  className="dynamic-page-content min-h-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-4">
                      <svg
                        className="mx-auto mb-4 h-12 w-12 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium">Start Creating</h3>
                      <p className="text-sm">
                        Add content using the editor panel to see your page come to life
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && pageConfig && (
                <div className="bg-muted border-border m-4 rounded-lg border p-4">
                  <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                    Preview Debug Info
                  </h4>
                  <div className="text-muted-foreground space-y-1 text-xs">
                    <div>Breakpoint: {breakpoint}</div>
                    <div>
                      Tailwind Active:{' '}
                      {getActiveBreakpoints()
                        .map(bp => bp.name)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
