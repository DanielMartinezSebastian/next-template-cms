/**
 * Dynamic Page Renderer
 * Renders pages based on JSON configuration with SSR support
 */

'use client';

import { ComponentConfig, PageJsonConfig } from '@/types/pages';
import { Suspense } from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import { ComponentFactory } from './ComponentFactory';
import { LoadingComponent } from './LoadingComponent';

interface DynamicPageRendererProps {
  pageConfig: PageJsonConfig;
  locale: string;
  editMode?: boolean;
  className?: string;
}

export function DynamicPageRenderer({
  pageConfig,
  locale,
  editMode = false,
  className = '',
}: DynamicPageRendererProps) {
  if (!pageConfig || !pageConfig.components) {
    return (
      <div className={`dynamic-page-renderer ${className}`}>
        <div className="text-muted-foreground flex min-h-64 items-center justify-center">
          No components configured for this page
        </div>
      </div>
    );
  }

  return (
    <div className={`dynamic-page-renderer ${className}`} data-edit-mode={editMode}>
      {/* Page Meta Information (for debugging in edit mode) */}
      {editMode && (
        <div className="mb-4 rounded border border-dashed border-blue-300 bg-blue-50 p-3 text-sm dark:border-blue-600 dark:bg-blue-950">
          <div className="font-semibold text-blue-900 dark:text-blue-100">
            Page: {pageConfig.hierarchy.fullPath}
          </div>
          <div className="text-blue-700 dark:text-blue-300">
            Components: {pageConfig.components.length} | Locale: {locale} | Published:{' '}
            {pageConfig.isPublished ? 'Yes' : 'No'}
          </div>
        </div>
      )}

      {/* Render Components */}
      <div className="components-container space-y-4">
        {pageConfig.components
          .filter(component => editMode || component.isVisible !== false)
          .sort((a, b) => a.order - b.order)
          .map((componentConfig, index) => (
            <ComponentErrorBoundary
              key={componentConfig.id || `component-${index}`}
              componentConfig={componentConfig}
              editMode={editMode}
            >
              <Suspense
                fallback={<LoadingComponent type={componentConfig.type} editMode={editMode} />}
              >
                <DynamicComponent
                  config={componentConfig}
                  locale={locale}
                  editMode={editMode}
                  index={index}
                />
              </Suspense>
            </ComponentErrorBoundary>
          ))}
      </div>

      {/* Empty State for Edit Mode */}
      {editMode && pageConfig.components.length === 0 && (
        <div className="text-muted-foreground flex min-h-64 items-center justify-center rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <div className="text-lg font-medium">No components added yet</div>
            <div className="text-sm">Start building your page by adding components</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Dynamic Component Renderer
interface DynamicComponentProps {
  config: ComponentConfig;
  locale: string;
  editMode?: boolean;
  index: number;
}

function DynamicComponent({ config, locale, editMode = false, index }: DynamicComponentProps) {
  console.warn(`🔍 DynamicComponent rendering: type="${config.type}", id="${config.id}"`);

  const Component = ComponentFactory.getComponent(config.type);
  console.warn('🔍 ComponentFactory.getComponent result:', Component ? Component.name : 'NULL');

  if (!Component) {
    if (editMode) {
      return (
        <div className="rounded border border-red-300 bg-red-50 p-4 dark:border-red-600 dark:bg-red-950">
          <div className="font-semibold text-red-900 dark:text-red-100">
            Unknown Component: {config.type}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">
            Component type &quot;{config.type}&quot; is not registered in the ComponentFactory
          </div>
        </div>
      );
    }
    return null; // Hide unknown components in production
  }

  const componentProps = {
    ...config.props,
    locale,
    editMode,
    componentId: config.id,
    componentOrder: config.order,
  };

  return (
    <div
      className={`dynamic-component ${editMode ? 'edit-mode' : ''} ${
        config.isVisible === false ? 'opacity-50' : ''
      }`}
      data-component-type={config.type}
      data-component-id={config.id}
      data-component-order={config.order}
      data-component-index={index}
    >
      {editMode && (
        <div className="component-meta mb-2 rounded bg-gray-100 p-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <span className="font-medium">{config.type}</span>
          {config.id && <span className="ml-2">ID: {config.id}</span>}
          <span className="ml-2">Order: {config.order}</span>
          {config.isVisible === false && (
            <span className="ml-2 text-orange-600 dark:text-orange-400">[Hidden]</span>
          )}
        </div>
      )}

      <Component {...componentProps} />

      {/* Render Children Components */}
      {config.children && config.children.length > 0 && (
        <div className="component-children ml-4 mt-4 space-y-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
          {config.children
            .filter(child => editMode || child.isVisible !== false)
            .sort((a, b) => a.order - b.order)
            .map((childConfig, childIndex) => (
              <ComponentErrorBoundary
                key={childConfig.id || `child-${childIndex}`}
                componentConfig={childConfig}
                editMode={editMode}
              >
                <Suspense
                  fallback={<LoadingComponent type={childConfig.type} editMode={editMode} />}
                >
                  <DynamicComponent
                    config={childConfig}
                    locale={locale}
                    editMode={editMode}
                    index={childIndex}
                  />
                </Suspense>
              </ComponentErrorBoundary>
            ))}
        </div>
      )}
    </div>
  );
}

// Server-side rendering helper
export async function renderDynamicPageSSR(pageConfig: PageJsonConfig, locale: string) {
  // This function can be used for server-side pre-processing
  // Currently returns the config as-is, but can be extended for:
  // - Data fetching for components
  // - SEO optimization
  // - Performance improvements

  return {
    pageConfig,
    locale,
    renderedAt: new Date().toISOString(),
  };
}

export default DynamicPageRenderer;
