/**
 * withEditableSSR HOC
 * Server-Side Rendering compatible version of withEditable
 * Renders as Server Component by default, Client Component only in edit mode
 */

// NO 'use client' directive - Server Component by default
import React, { ComponentType } from 'react';
import { z } from 'zod';
import { detectEditMode } from './client-wrapper';
import { componentRegistry, registerComponent } from './registry';
import type { ComponentMetadata, EditableComponent, EditableComponentOptions } from './types';

// =============================================================================
// HOC OPTIONS INTERFACE
// =============================================================================

/**
 * Options for withEditableSSR HOC
 */
export interface WithEditableSSROptions<T = any> {
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
// SSR COMPONENT WRAPPER
// =============================================================================

/**
 * Server-compatible component wrapper with conditional client rendering
 */
function createSSREditableComponent<P extends Record<string, any>>(
  WrappedComponent: ComponentType<P>,
  options: WithEditableSSROptions<P>
) {
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
  const componentName =
    providedName || WrappedComponent.displayName || WrappedComponent.name || 'UnnamedComponent';

  // Create SSR-compatible conditional component (no client wrapper needed on server)
  const ConditionalComponent = WrappedComponent;

  // Auto-register component immediately (happens during component creation)
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

  // Register component immediately when HOC is called
  if (!componentRegistry.has(componentName)) {
    registerComponent(componentName, WrappedComponent, registrationOptions);
  }

  // SSR-compatible editable component
  const EditableSSRComponent: React.FC<P & { editMode?: boolean }> = props => {
    const { editMode, ...componentProps } = props;

    // Determine edit mode
    const isEditMode = editMode ?? (typeof window !== 'undefined' ? detectEditMode() : false);

    // Validate props if enabled (only on client-side to avoid SSR issues)
    if (typeof window !== 'undefined') {
      const shouldValidate =
        (validateInDev && process.env.NODE_ENV === 'development') ||
        (validateInProd && process.env.NODE_ENV === 'production');

      if (shouldValidate) {
        try {
          schema.parse(componentProps);

          if (customValidation) {
            const validationError = customValidation(componentProps as P);
            if (validationError) {
              console.warn(`[${componentName}] Custom validation failed:`, validationError);
            }
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.warn(`[${componentName}] Props validation failed:`, {
              errors: error.errors,
              receivedProps: componentProps,
            });
          }
        }
      }
    }

    // Get merged props (defaults + custom + provided)
    const registeredComponent =
      typeof window !== 'undefined' ? componentRegistry.get<P>(componentName) : null;

    const mergedProps = registeredComponent
      ? {
          ...registeredComponent.defaultProps,
          ...registeredComponent.customProps,
          ...componentProps, // User-provided props take highest priority
        }
      : { ...defaultProps, ...componentProps };

    // Render with conditional client wrapper
    return <ConditionalComponent {...mergedProps} editMode={isEditMode} />;
  };

  return EditableSSRComponent;
}

// =============================================================================
// HOC IMPLEMENTATION
// =============================================================================

/**
 * Creates an SSR-compatible editable version of a component
 * Server Components by default, Client Components only in edit mode
 */
export function withEditableSSR<P extends Record<string, any>>(
  WrappedComponent: ComponentType<P>,
  options: WithEditableSSROptions<P>
): EditableComponent<P> {
  const { name: providedName, metadata, schema, defaultProps, editorConfig } = options;

  // Determine component name
  const componentName =
    providedName || WrappedComponent.displayName || WrappedComponent.name || 'UnnamedComponent';

  // Create the SSR editable component
  const EditableComponent = createSSREditableComponent(WrappedComponent, options);

  // Set display name for debugging
  EditableComponent.displayName = `withEditableSSR(${componentName})`;

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
 * Create a simple SSR editable component with minimal configuration
 */
export function createEditableSSRComponent<P extends Record<string, any>>(
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
  return withEditableSSR(component, {
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
 * Check if a component is SSR editable
 */
export function isEditableSSRComponent<P = any>(
  component: ComponentType<P>
): component is EditableComponent<P> {
  return '__editable' in component && component.__editable !== undefined;
}

/**
 * Get editable metadata from an SSR component
 */
export function getEditableSSRMetadata<P = any>(
  component: ComponentType<P>
): EditableComponent<P>['__editable'] | null {
  if (isEditableSSRComponent(component)) {
    return component.__editable;
  }
  return null;
}
