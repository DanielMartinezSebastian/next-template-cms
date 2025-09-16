/**
 * Dynamic Components Index
 * Barrel exports for all dynamic components
 */

export { ComponentErrorBoundary, withErrorBoundary } from './ComponentErrorBoundary';
export { ComponentFactory } from './ComponentFactory';
export { DynamicPageRenderer, renderDynamicPageSSR } from './DynamicPageRenderer';
export { getLoadingComponent, LoadingComponent } from './LoadingComponent';

// Individual Components
export { default as ButtonComponent } from './components/Button';
export { CallToAction } from './components/CallToAction';
export { default as Card } from './components/Card';
export { ContactForm } from './components/ContactForm';
export { FeatureGrid } from './components/FeatureGrid';
export { HeroSection } from './components/HeroSection';
export { default as Image } from './components/Image';
export { ImageGallery } from './components/ImageGallery';
export { PlaceholderComponent } from './components/PlaceholderComponent';
export { default as Section } from './components/Section';
export { default as Spacer } from './components/Spacer';
export { Newsletter, Testimonials } from './components/Testimonials';
export { TextBlock } from './components/TextBlock';
export { UnknownComponent } from './components/UnknownComponent';

// Re-export types
export type {
  ComponentConfig,
  ComponentFactoryMapping,
  ComponentRenderProps,
  PageJsonConfig,
} from '@/types/pages';
