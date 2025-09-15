/**
 * Page Preview Component
 * Vista previa en tiempo real de la página siendo editada
 */
'use client';

import Image from 'next/image';
import { createElement, useEffect, useState } from 'react';
import { PageComponent, PageConfig } from '../../stores';
import { ThemeToggle } from '../ui/theme-toggle';

// Types for Lexical content
interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  tag?: string;
  listType?: string;
  componentConfig?: {
    type: string;
    props: Record<string, unknown>;
  };
}

interface LexicalData {
  root?: {
    children?: LexicalNode[];
  };
}

export type TailwindBreakpoint = 'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface PagePreviewProps {
  page: Partial<PageConfig>;
  content: string;
  locale: string;
  className?: string;
  breakpoint?: TailwindBreakpoint;
  onBreakpointChange?: (breakpoint: TailwindBreakpoint) => void;
}

interface PreviewComponentProps {
  component: PageComponent;
}

function PreviewComponent({ component }: PreviewComponentProps) {
  switch (component.type) {
    case 'content':
      // Parse JSON content from Lexical editor
      try {
        const lexicalData = JSON.parse(component.props.content as string);
        return <LexicalContentRenderer data={lexicalData} />;
      } catch {
        // Fallback to plain text
        return (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{component.props.content as string}</p>
          </div>
        );
      }

    case 'button':
      return (
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2">
          {(component.props.text as string) || 'Button'}
        </button>
      );

    case 'image':
      return (
        <Image
          src={(component.props.src as string) || '/placeholder.svg'}
          alt={(component.props.alt as string) || 'Image'}
          width={500}
          height={300}
          className="h-auto max-w-full rounded-lg"
        />
      );

    case 'card':
      return (
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-card-foreground mb-2 text-lg font-semibold">
            {(component.props.title as string) || 'Card Title'}
          </h3>
          <p className="text-muted-foreground">
            {(component.props.content as string) || 'Card content goes here...'}
          </p>
        </div>
      );

    case 'hero':
      return (
        <div className="from-primary to-secondary text-primary-foreground rounded-lg bg-gradient-to-r px-8 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            {(component.props.title as string) || 'Hero Title'}
          </h1>
          <p className="text-xl opacity-90">
            {(component.props.subtitle as string) || 'Hero subtitle goes here...'}
          </p>
        </div>
      );

    case 'section':
      return (
        <section className="py-8">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            {(component.props.title as string) || 'Section Title'}
          </h2>
          <div className="text-muted-foreground">
            {(component.props.content as string) || 'Section content...'}
          </div>
        </section>
      );

    case 'spacer':
      return (
        <div
          className="bg-transparent"
          style={{ height: (component.props.height as string) || '2rem' }}
        />
      );

    default:
      return (
        <div className="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-center">
          Unknown component: {component.type}
        </div>
      );
  }
}

function LexicalContentRenderer({ data }: { data: LexicalData }) {
  if (!data?.root?.children) {
    return <div className="text-muted-foreground">No content</div>;
  }

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-foreground mb-4 leading-relaxed">
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </p>
        );

      case 'text':
        const content = node.text || '';
        let className = '';

        if (node.format && node.format & 1) className += ' font-bold'; // Bold
        if (node.format && node.format & 2) className += ' italic'; // Italic
        if (node.format && node.format & 4) className += ' underline'; // Underline
        if (node.format && node.format & 8) className += ' line-through'; // Strikethrough

        return (
          <span key={index} className={className}>
            {content}
          </span>
        );

      case 'heading':
        const tag = node.tag || 'h1';
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6 text-foreground border-b border-border pb-2',
          h2: 'text-3xl font-semibold mb-5 text-foreground',
          h3: 'text-2xl font-semibold mb-4 text-foreground',
          h4: 'text-xl font-semibold mb-3 text-foreground',
          h5: 'text-lg font-semibold mb-2 text-foreground',
          h6: 'text-base font-semibold mb-2 text-foreground',
        };

        return createElement(
          tag,
          {
            key: index,
            className: headingClasses[tag as keyof typeof headingClasses] || '',
          },
          node.children?.map((child: LexicalNode, childIndex: number) =>
            renderNode(child, childIndex)
          )
        );

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        const listClass =
          node.listType === 'number'
            ? 'list-decimal list-inside mb-4 space-y-1 ml-4'
            : 'list-disc list-inside mb-4 space-y-1 ml-4';

        return (
          <ListTag key={index} className={listClass}>
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </ListTag>
        );

      case 'listitem':
        return (
          <li key={index} className="text-foreground">
            {node.children?.map((child: LexicalNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </li>
        );

      case 'editable-component':
        return (
          <div key={index} className="my-4">
            <PreviewComponent
              component={{
                id: `preview-${index}`,
                type: node.componentConfig?.type || 'unknown',
                props: node.componentConfig?.props || {},
                order: index,
              }}
            />
          </div>
        );

      default:
        if (node.children) {
          return (
            <div key={index}>
              {node.children.map((child: LexicalNode, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {data.root?.children?.map((node: LexicalNode, index: number) => renderNode(node, index))}
    </div>
  );
}

export function PagePreview({
  page,
  content,
  locale,
  className = '',
  breakpoint = 'lg',
  onBreakpointChange,
}: PagePreviewProps) {
  const [previewContent, setPreviewContent] = useState<string>('');

  useEffect(() => {
    setPreviewContent(content);
  }, [content]);

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
    <div className={`bg-background grid h-dvh grid-rows-[auto_1fr] ${className}`}>
      {/* Preview Header */}
      <div className="bg-background/95 border-border flex-shrink-0 border-b p-4 backdrop-blur">
        <div className="flex flex-col space-y-4">
          {/* Title and Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-foreground text-lg font-semibold">Live Preview</h2>
              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                <span>•</span>
                <span>{locale.toUpperCase()}</span>
                <span>•</span>
                <a
                  href={`/${locale}/${page.slug || 'new-page'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground text-primary underline-offset-4 transition-colors hover:underline"
                  title={`Abrir /${page.slug || 'new-page'} en nueva pestaña`}
                >
                  /{page.slug || 'new-page'}
                </a>
              </div>
            </div>

            {/* Live Indicator and Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle variant="outline" size="md" />

              {/* Live Indicator */}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground text-xs">Live</span>
              </div>
            </div>
          </div>

          {/* Breakpoint Controls */}
          <div className="flex flex-col space-y-3">
            {/* Current Breakpoint Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm font-medium">Breakpoint:</span>
                <div className="bg-muted text-muted-foreground flex items-center space-x-2 rounded-md px-3 py-2 text-sm">
                  <span>{currentBreakpointConfig.icon}</span>
                  <span className="font-medium">{currentBreakpointConfig.label}</span>
                  <span>({currentBreakpointConfig.width})</span>
                </div>
              </div>

              {/* Tailwind Breakpoint Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm font-medium">Selector:</span>
                <div className="bg-muted flex rounded-md p-1">
                  {tailwindBreakpoints.map(bp => (
                    <button
                      key={bp.name}
                      onClick={() => onBreakpointChange?.(bp.name)}
                      className={`flex items-center space-x-1 rounded px-2 py-1 text-xs transition-colors ${
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
              </div>
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
              <div className="space-y-6 p-8">
                {/* Page Title */}
                {page.title && (
                  <div className="mb-8">
                    <h1 className="text-foreground mb-2 text-4xl font-bold">{page.title}</h1>
                    {page.metadata?.description && (
                      <p className="text-muted-foreground text-xl">{page.metadata.description}</p>
                    )}
                  </div>
                )}

                {/* Page Content */}
                <div className="space-y-6">
                  {page.components && page.components.length > 0 ? (
                    page.components
                      .sort((a, b) => a.order - b.order)
                      .map(component => (
                        <div key={component.id} className="min-h-[2rem]">
                          <PreviewComponent component={component} />
                        </div>
                      ))
                  ) : previewContent ? (
                    <div className="border-border rounded-lg border border-dashed p-6">
                      <p className="text-muted-foreground text-center">
                        Content is being processed...
                        <br />
                        <span className="text-xs">({previewContent.length} characters)</span>
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
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
                  )}
                </div>

                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-muted border-border mt-12 rounded-lg border-t p-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Preview Debug Info
                    </h4>
                    <div className="text-muted-foreground space-y-1 text-xs">
                      <div>Components: {page.components?.length || 0}</div>
                      <div>Published: {page.isPublished ? 'Yes' : 'No'}</div>
                      <div>Content Length: {previewContent.length} chars</div>
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
    </div>
  );
}
