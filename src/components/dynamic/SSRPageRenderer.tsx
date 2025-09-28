/**
 * SSR Page Renderer
 * Server-side rendering compatible version for public pages
 */

import { ComponentConfig, PageJsonConfig } from '@/types/pages';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import { ComponentFactory } from './ComponentFactory';

interface SSRPageRendererProps {
  pageConfig: PageJsonConfig;
  locale: string;
  className?: string;
}

export function SSRPageRenderer({ pageConfig, locale, className = '' }: SSRPageRendererProps) {
  if (!pageConfig || !pageConfig.components) {
    return (
      <div className={`ssr-page-renderer ${className}`}>
        <div className="text-muted-foreground flex min-h-64 items-center justify-center">
          No components configured for this page
        </div>
      </div>
    );
  }

  return (
    <div className={`ssr-page-renderer ${className}`}>
      {/* Render Components */}
      <div className="components-container space-y-4">
        {pageConfig.components
          .filter(component => component.isVisible !== false)
          .sort((a, b) => a.order - b.order)
          .map((componentConfig, index) => (
            <ComponentErrorBoundary
              key={`${componentConfig.id}-${componentConfig.type}-${index}`}
              componentConfig={componentConfig}
              editMode={false}
            >
              <SSRComponent config={componentConfig} locale={locale} index={index} />
            </ComponentErrorBoundary>
          ))}
      </div>

      {/* Empty State */}
      {pageConfig.components.length === 0 && (
        <div className="text-muted-foreground flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium">No content available</div>
            <div className="text-sm">This page has no published components</div>
          </div>
        </div>
      )}
    </div>
  );
}

// SSR Individual Dynamic Component Renderer
interface SSRComponentProps {
  config: ComponentConfig;
  locale: string;
  index: number;
}

function SSRComponent({ config, locale, index }: SSRComponentProps) {
  const Component = ComponentFactory.getComponent(config.type);

  if (!Component) {
    // Hide unknown components in production SSR
    return null;
  }

  const componentProps = {
    ...config.props,
    locale,
    editMode: false,
    componentId: config.id,
    componentOrder: config.order,
  };

  // Component props prepared for SSR rendering

  // Use ComponentFactory.createComponent for proper sanitization
  const componentElement = ComponentFactory.createComponent(config.type, componentProps);

  return (
    <div
      className="ssr-component"
      data-component-type={config.type}
      data-component-id={config.id}
      data-component-order={config.order}
      data-component-index={index}
    >
      {componentElement}

      {/* Render Children Components recursively */}
      {config.children && config.children.length > 0 && (
        <div className="component-children space-y-4">
          {config.children
            .filter(child => child.isVisible !== false)
            .sort((a, b) => a.order - b.order)
            .map((childConfig, childIndex) => (
              <ComponentErrorBoundary
                key={`${childConfig.id}-${childConfig.type}-child-${childIndex}`}
                componentConfig={childConfig}
                editMode={false}
              >
                <SSRComponent config={childConfig} locale={locale} index={childIndex} />
              </ComponentErrorBoundary>
            ))}
        </div>
      )}
    </div>
  );
}

export default SSRPageRenderer;
