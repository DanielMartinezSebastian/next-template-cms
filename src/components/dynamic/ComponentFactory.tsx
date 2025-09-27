/**
 * Component Factory
 * Maps component types to React components for dynamic rendering
 */

import {
  getComponentDefaultsSync,
  getComponentSchema,
  validateComponentProps,
} from '@/lib/component-schemas';
import { ComponentFactoryMapping } from '@/types/pages';
import React from 'react';
import componentConfig from '../../../component-config.json';

// Import available editable components from new structure
import {
  ButtonMigrated,
  EditableButton,
  CardMigrated,
  CallToActionMigrated,
  HeroSectionMigrated,
  TextBlockMigrated,
} from '../editable-components';

// Legacy placeholder for unknown components
const UnknownComponent = ({ type, ...props }: any) => (
  <div className="p-4 border border-red-300 bg-red-50 rounded">
    <p className="text-red-800 font-medium">Unknown component: {type}</p>
    <p className="text-red-600 text-sm">This component may have been removed or renamed.</p>
  </div>
);

const PlaceholderComponent = ({ message = 'Placeholder component', ...props }: any) => (
  <div className="p-4 border border-gray-300 bg-gray-50 rounded">
    <p className="text-gray-600">{message}</p>
  </div>
);

/**
 * Component Factory Class
 * Manages the mapping between component types and React components
 */
export class ComponentFactory {
  private static componentMap: ComponentFactoryMapping = {
    // Layout Components
    hero: HeroSectionMigrated,
    'hero-section': HeroSectionMigrated,
    herosection: HeroSectionMigrated,
    section: PlaceholderComponent, // Legacy section component

    // Content Components
    text: TextBlockMigrated,
    'text-block': TextBlockMigrated,
    textblock: TextBlockMigrated,
    content: TextBlockMigrated,

    // UI Components  
    button: ButtonMigrated,
    'button-migrated': ButtonMigrated,
    'editable-button': EditableButton,
    card: CardMigrated,
    'card-migrated': CardMigrated,
    spacer: PlaceholderComponent, // Legacy spacer component

    // Interactive Components
    form: PlaceholderComponent, // Legacy form component
    'contact-form': PlaceholderComponent,
    contactform: PlaceholderComponent,
    contact: PlaceholderComponent,

    // Marketing Components
    features: PlaceholderComponent, // Legacy features component
    'feature-grid': PlaceholderComponent,
    featuregrid: PlaceholderComponent,
    'feature-list': PlaceholderComponent,

    cta: CallToActionMigrated,
    'call-to-action': CallToActionMigrated,
    calltoaction: CallToActionMigrated,

    // Legacy components - now placeholders
    testimonials: PlaceholderComponent,
    reviews: PlaceholderComponent,
    testimonial: PlaceholderComponent,
    'testimonial-single': PlaceholderComponent,
    pricing: PlaceholderComponent,
    'pricing-plan': PlaceholderComponent,
    plan: PlaceholderComponent,
    newsletter: PlaceholderComponent,
    'newsletter-signup': PlaceholderComponent,
    image: PlaceholderComponent,
    'image-gallery': PlaceholderComponent,
    imagegallery: PlaceholderComponent,
    gallery: PlaceholderComponent,

    // Fallback components
    placeholder: PlaceholderComponent,
    unknown: UnknownComponent,
  };

  /**
   * Get a component by type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getComponent(type: string): React.ComponentType<any> | null {
    const normalizedType = type.toLowerCase().trim();
    return this.componentMap[normalizedType] || null;
  }

  /**
   * Register a new component type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerComponent(type: string, component: React.ComponentType<any>): void {
    const normalizedType = type.toLowerCase().trim();
    this.componentMap[normalizedType] = component;
  }

  /**
   * Unregister a component type
   */
  static unregisterComponent(type: string): void {
    const normalizedType = type.toLowerCase().trim();
    delete this.componentMap[normalizedType];
  }

  /**
   * Get all available component types
   */
  static getAvailableTypes(): string[] {
    return Object.keys(this.componentMap);
  }

  /**
   * Check if a component type is registered
   */
  static hasComponent(type: string): boolean {
    const normalizedType = type.toLowerCase().trim();
    return normalizedType in this.componentMap;
  }

  /**
   * Get component mapping for admin/editor use
   */
  static getComponentMapping(): ComponentFactoryMapping {
    return { ...this.componentMap };
  }

  /**
   * Get component info for admin/editor interfaces
   */
  static getComponentInfo() {
    return {
      layout: [
        { type: 'hero', name: 'Hero Section', category: 'layout' },
        { type: 'hero-section', name: 'Hero Section', category: 'layout' },
        { type: 'section', name: 'Section', category: 'layout' },
      ],
      content: [
        { type: 'text', name: 'Text Block', category: 'content' },
        { type: 'text-block', name: 'Text Block', category: 'content' },
      ],
      media: [
        { type: 'image', name: 'Image', category: 'media' },
        { type: 'image-gallery', name: 'Image Gallery', category: 'media' },
      ],
      ui: [
        { type: 'button', name: 'Button', category: 'ui' },
        { type: 'card', name: 'Card', category: 'ui' },
        { type: 'spacer', name: 'Spacer', category: 'ui' },
      ],
      interactive: [
        { type: 'form', name: 'Contact Form', category: 'interactive' },
        { type: 'contact-form', name: 'Contact Form', category: 'interactive' },
      ],
      marketing: [
        { type: 'features', name: 'Feature Grid', category: 'marketing' },
        { type: 'cta', name: 'Call to Action', category: 'marketing' },
        { type: 'testimonials', name: 'Testimonials', category: 'marketing' },
        { type: 'newsletter', name: 'Newsletter Signup', category: 'marketing' },
      ],
    };
  }

  /**
   * Get placeholder value for a prop based on its name and current value
   */
  static getPlaceholderValue(propName: string, currentValue: unknown): unknown {
    // If value is already valid (not empty string, not null, not undefined), keep it
    if (currentValue !== '' && currentValue !== null && currentValue !== undefined) {
      return currentValue;
    }

    // Get placeholders from config
    const placeholders = componentConfig.placeholders;

    // Check for array props that should have array defaults
    const arrayProps = ['features', 'images', 'testimonials', 'items', 'tags', 'options'];
    if (arrayProps.includes(propName) || propName.endsWith('s')) {
      if (placeholders.arrays[propName as keyof typeof placeholders.arrays]) {
        return placeholders.arrays[propName as keyof typeof placeholders.arrays];
      }
      return placeholders.arrays.items; // Default empty array
    }

    // Check for object props
    const objectProps = ['config', 'settings', 'metadata'];
    if (objectProps.includes(propName)) {
      return placeholders.objects[propName as keyof typeof placeholders.objects] || {};
    }

    // Check for special types
    if (propName.includes('color') || propName.includes('Color')) {
      return placeholders.specialTypes.color;
    }
    if (propName.includes('url') || propName.includes('href') || propName.includes('link')) {
      return placeholders.specialTypes.url;
    }
    if (propName.includes('email') || propName.includes('Email')) {
      return placeholders.specialTypes.email;
    }
    if (propName.includes('class') || propName.includes('Class')) {
      return placeholders.specialTypes.className;
    }

    // Default to empty string for unknown props
    return '';
  }

  /**
   * Sanitize props by removing dangerous or invalid properties and adding placeholders
   */
  static sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...props };

    // Remove dangerous props that could cause runtime errors
    const dangerousProps = ['onClick', 'onSubmit', 'onChange', 'onFocus', 'onBlur'];

    dangerousProps.forEach(prop => {
      if (prop in sanitized && typeof sanitized[prop] === 'string') {
        // If it's a string, it's likely invalid - remove it
        delete sanitized[prop];
        console.warn(`Removed invalid ${prop} prop with string value: "${sanitized[prop]}"`);
      }
    });

    // Additional cleanup and placeholder assignment
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key];

      // Remove undefined and null values first
      if (value === undefined || value === null) {
        delete sanitized[key];
        return;
      }

      // Handle string props that should be empty or have placeholders
      if (typeof value === 'string') {
        // Remove placeholder-like values and replace with proper placeholders
        if (value === '>' || value === '<' || value === '[]' || value === '{}' || value === '') {
          sanitized[key] = this.getPlaceholderValue(key, '');
        }
      }

      // Handle arrays that might be strings or invalid
      if (key.endsWith('s') || ['features', 'images', 'testimonials'].includes(key)) {
        if (typeof value === 'string' && value !== '') {
          // Try to parse if it's a JSON string
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              sanitized[key] = parsed;
            } else {
              sanitized[key] = this.getPlaceholderValue(key, '');
            }
          } catch {
            // If it's not valid JSON, use placeholder
            sanitized[key] = this.getPlaceholderValue(key, '');
          }
        } else if (!Array.isArray(value)) {
          // If it's not an array, use placeholder
          sanitized[key] = this.getPlaceholderValue(key, '');
        }
      }
    });

    return sanitized;
  }

  /**
   * Validate component props against expected schema
   */
  static validateProps(
    type: string,
    props: Record<string, unknown>
  ): {
    isValid: boolean;
    errors: string[];
    sanitizedProps: Record<string, unknown>;
  } {
    // First sanitize dangerous props
    const cleanProps = this.sanitizeProps(props);

    // Then use schema-based validation
    return validateComponentProps(type, cleanProps);
  }

  /**
   * Get default props for a component using schemas
   */
  static getDefaults(type: string): Record<string, unknown> {
    return getComponentDefaultsSync(type); // Use sync version for immediate response
  }

  /**
   * Get component schema information
   */
  static getSchema(type: string) {
    return getComponentSchema(type);
  }

  /**
   * Create component with validated props
   */
  static createComponent(type: string, props: Record<string, unknown> = {}): React.ReactNode {
    const Component = this.getComponent(type);

    if (!Component) {
      console.warn(`Unknown component type: ${type}`);
      return React.createElement(UnknownComponent, { type, ...props });
    }

    // Validate and sanitize props
    const { sanitizedProps, errors } = this.validateProps(type, props);

    // Log validation errors in development
    if (errors.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn(`Component ${type} validation errors:`, errors);
    }

    return React.createElement(Component, sanitizedProps);
  }
}
