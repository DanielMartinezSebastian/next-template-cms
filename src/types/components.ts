/**
 * Types for dynamic component system
 * Defines component types and props interfaces for the visual editor
 */

// =============================================================================
// COMPONENT TYPES
// =============================================================================

/**
 * All available component types in the system
 * These map to ComponentFactory component keys
 */
export type ComponentType =
  // Layout Components
  | 'hero'
  | 'hero-section'

  // Content Components
  | 'text'
  | 'text-block'
  | 'content'

  // Media Components
  | 'image'
  | 'image-gallery'
  | 'gallery'

  // Interactive Components
  | 'form'
  | 'contact-form'
  | 'contact'

  // Marketing Components
  | 'features'
  | 'feature-grid'
  | 'feature-list'
  | 'cta'
  | 'call-to-action'
  | 'testimonials'
  | 'newsletter'

  // Utility Components
  | 'placeholder'
  | 'unknown'

  // Text Inline (for inline components)
  | 'text-inline';

/**
 * Generic component props interface
 * Extends Record to allow any props while maintaining type safety
 */
export interface ComponentProps extends Record<string, unknown> {
  // Common props that most components might have
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // Content props
  title?: string;
  content?: string;
  text?: string;
  description?: string;
  heading?: string;
  subtitle?: string;
  label?: string;

  // Array props for lists/grids
  items?: Array<Record<string, unknown>>;

  // Editor context props (only for backward compatibility during migration)
  nodeKey?: string;
  isInEditMode?: boolean;
}

// =============================================================================
// SPECIFIC COMPONENT PROP INTERFACES
// =============================================================================

/**
 * HeroSection specific props
 */
export interface HeroSectionProps extends ComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaType?: 'default' | 'primary' | 'secondary';
  alignment?: 'left' | 'center' | 'right';
}

/**
 * TextBlock specific props
 */
export interface TextBlockProps extends ComponentProps {
  content?: string;
  text?: string;
  variant?: 'paragraph' | 'heading' | 'subtitle';
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

/**
 * FeatureGrid specific props
 */
export interface FeatureGridProps extends ComponentProps {
  title?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }>;
  columns?: number;
  layout?: 'grid' | 'list';
}

/**
 * CallToAction specific props
 */
export interface CallToActionProps extends ComponentProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  backgroundColor?: string;
  textColor?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Union type of all specific component props
 */
export type SpecificComponentProps =
  | HeroSectionProps
  | TextBlockProps
  | FeatureGridProps
  | CallToActionProps;

/**
 * Component factory mapping type
 */
export interface ComponentFactoryMapping {
  [key: string]: React.ComponentType<ComponentProps>;
}

/**
 * Component configuration for the editor
 */
export interface ComponentConfiguration {
  type: ComponentType;
  props: ComponentProps;
  isEditable?: boolean;
  metadata?: {
    name: string;
    description: string;
    category: string;
    icon?: string;
  };
}
