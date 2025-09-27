/**
 * Dynamic Components Index
 * Barrel exports for all dynamic components
 */

export { ComponentErrorBoundary, withErrorBoundary } from './ComponentErrorBoundary';
export { ComponentFactory } from './ComponentFactory';
export { DynamicPageRenderer, renderDynamicPageSSR } from './DynamicPageRenderer';
export { getLoadingComponent, LoadingComponent } from './LoadingComponent';

// Editable Components with withEditable HOC (New System)
export * from '../editable-components';

// Re-export types
export type {
  ComponentConfig,
  ComponentFactoryMapping,
  ComponentRenderProps,
  PageJsonConfig,
} from '@/types/pages';
