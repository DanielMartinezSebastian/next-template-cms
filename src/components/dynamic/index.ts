/**
 * Dynamic Components Index
 * Barrel exports for all dynamic components
 */

export { DynamicPageRenderer, renderDynamicPageSSR } from './DynamicPageRenderer';
export { ComponentFactory } from './ComponentFactory';
export { ComponentErrorBoundary, withErrorBoundary } from './ComponentErrorBoundary';
export { LoadingComponent, getLoadingComponent } from './LoadingComponent';

// Individual Components
export { HeroSection } from './components/HeroSection';
export { TextBlock } from './components/TextBlock';
export { ImageGallery } from './components/ImageGallery';
export { ContactForm } from './components/ContactForm';
export { FeatureGrid } from './components/FeatureGrid';
export { CallToAction } from './components/CallToAction';
export { Testimonials, Newsletter } from './components/Testimonials';
export { PlaceholderComponent } from './components/PlaceholderComponent';
export { UnknownComponent } from './components/UnknownComponent';

// Re-export types
export type {
  ComponentConfig,
  PageJsonConfig,
  ComponentFactoryMapping,
  ComponentRenderProps,
} from '@/types/pages';
