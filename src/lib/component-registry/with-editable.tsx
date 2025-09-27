/**
 * withEditable HOC
 * Higher-Order Component for automatic component registration and props validation
 */

'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import type { ComponentType } from 'react';
import type { 
  ComponentMetadata, 
  EditableComponentOptions, 
  ExtractProps,
  EditableComponent,
} from './types';
import { registerComponent, componentRegistry } from './registry';

// =============================================================================
// HOC OPTIONS INTERFACE
// =============================================================================

/**
 * Options for withEditable HOC
 */
export interface WithEditableOptions<T = any> {
  /** Component name (defaults to component.name or displayName) */
  name?: string;
  /** Component metadata */
  metadata: Omit<ComponentMetadata, 'name'>;
  /** Zod schema for props validation */
  schema: z.ZodSchema<T>;
  /** Default props values */
  defaultProps: T;
  /** Custom editor configuration (optional) */
  editorConfig?: EditableComponentOptions<T>['editorConfig'];
  /** Custom validation function (optional) */
  customValidation?: EditableComponentOptions<T>['customValidation'];
  /** Whether to validate props in development */
  validateInDev?: boolean;
  /** Whether to validate props in production */
  validateInProd?: boolean;
}

// =============================================================================
// HOC IMPLEMENTATION
// =============================================================================

/**
 * Creates an editable version of a component with automatic registration
 */
export function withEditable<P extends Record<string, any>>(
  WrappedComponent: ComponentType<P>,
  options: WithEditableOptions<P>
): EditableComponent<P> {
  const {
    name: providedName,
    metadata,
    schema,
    defaultProps,
    editorConfig,
    customValidation,
    validateInDev = true,
    validateInProd = false,
  } = options;

  // Determine component name
  const componentName = providedName || 
                       WrappedComponent.displayName || 
                       WrappedComponent.name || 
                       'UnnamedComponent';

  // Create the enhanced component
  const EditableComponent: React.FC<P> = (props) => {
    // Auto-register component on first render
    useEffect(() => {
      if (!componentRegistry.has(componentName)) {
        const registrationOptions: EditableComponentOptions<P> = {
          metadata: {
            ...metadata,
            name: componentName,
          },
          schema,
          defaultProps,
          editorConfig,
          customValidation,
        };

        registerComponent(componentName, WrappedComponent, registrationOptions);
      }
    }, []);

    // Validate props if enabled
    const shouldValidate = (validateInDev && process.env.NODE_ENV === 'development') ||
                          (validateInProd && process.env.NODE_ENV === 'production');

    if (shouldValidate) {
      try {
        schema.parse(props);
        
        if (customValidation) {
          const validationError = customValidation(props);
          if (validationError) {
            console.warn(`[${componentName}] Custom validation failed:`, validationError);
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.warn(`[${componentName}] Props validation failed:`, {
            errors: error.errors,
            receivedProps: props,
          });
        }
      }
    }

    // Get merged props (defaults + custom + provided)
    const registeredComponent = componentRegistry.get<P>(componentName);
    const mergedProps = registeredComponent 
      ? {
          ...registeredComponent.defaultProps,
          ...registeredComponent.customProps,
          ...props, // User-provided props take highest priority
        }
      : props;

    return <WrappedComponent {...mergedProps} />;
  };

  // Set display name for debugging
  EditableComponent.displayName = `withEditable(${componentName})`;

  // Attach metadata to component for introspection
  const editableComponent = EditableComponent as unknown as EditableComponent<P>;
  editableComponent.__editable = {
    metadata: {
      ...metadata,
      name: componentName,
    },
    schema,
    defaultProps,
    editorConfig,
  };

  return editableComponent;
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a simple editable component with minimal configuration
 */
export function createEditableComponent<P extends Record<string, any>>(
  component: ComponentType<P>,
  config: {
    name?: string;
    category: ComponentMetadata['category'];
    schema: z.ZodSchema<P>;
    defaultProps: P;
    description?: string;
    icon?: string;
  }
): EditableComponent<P> {
  return withEditable(component, {
    name: config.name,
    metadata: {
      category: config.category,
      description: config.description || `${config.name || component.name} component`,
      icon: config.icon,
    },
    schema: config.schema,
    defaultProps: config.defaultProps,
  });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a component is editable
 */
export function isEditableComponent<P = any>(
  component: ComponentType<P>
): component is EditableComponent<P> {
  return '__editable' in component && component.__editable !== undefined;
}

/**
 * Get editable metadata from a component
 */
export function getEditableMetadata<P = any>(
  component: ComponentType<P>
): EditableComponent<P>['__editable'] | null {
  if (isEditableComponent(component)) {
    return component.__editable;
  }
  return null;
}

/**
 * Extract component name from editable component
 */
export function getComponentName(component: ComponentType<any>): string | null {
  const metadata = getEditableMetadata(component);
  return metadata?.metadata.name || component.displayName || component.name || null;
}

// =============================================================================
// COMMON SCHEMA PATTERNS
// =============================================================================

/**
 * Common Zod schemas for typical component props
 */
export const commonSchemas = {
  /**
   * Basic text props
   */
  text: z.object({
    text: z.string(),
  }),

  /**
   * Button-like component props
   */
  button: z.object({
    text: z.string(),
    variant: z.enum(['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost']).optional(),
    size: z.enum(['sm', 'md', 'lg']).optional(),
    disabled: z.boolean().optional(),
  }),

  /**
   * Link component props
   */
  link: z.object({
    href: z.string(),
    text: z.string(),
    target: z.enum(['_self', '_blank', '_parent', '_top']).optional(),
  }),

  /**
   * Image component props
   */
  image: z.object({
    src: z.string().url(),
    alt: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),

  /**
   * Section/container props
   */
  section: z.object({
    title: z.string().optional(),
    className: z.string().optional(),
    padding: z.enum(['none', 'small', 'medium', 'large']).optional(),
  }),

  /**
   * Card component props
   */
  card: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    href: z.string().optional(),
  }),
} as const;

/**
 * Infer props type from common schema
 */
export type InferSchemaProps<T extends keyof typeof commonSchemas> = z.infer<typeof commonSchemas[T]>;