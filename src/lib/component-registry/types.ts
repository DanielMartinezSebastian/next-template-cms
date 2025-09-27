/**
 * Component Registry Types
 * Type definitions for the new automatic component registration system
 */

import { z } from 'zod';
import type { ComponentType } from 'react';

// =============================================================================
// CORE TYPES
// =============================================================================

/**
 * Component categories for organization and UI grouping
 */
export type ComponentCategory = 
  | 'layout'     // Layout and structural components
  | 'content'    // Text, headings, rich content
  | 'media'      // Images, videos, galleries
  | 'interactive' // Buttons, forms, interactive elements
  | 'marketing'  // CTAs, testimonials, pricing
  | 'ui';        // Basic UI components

/**
 * Component metadata for registration
 */
export interface ComponentMetadata {
  /** Unique component name */
  name: string;
  /** Display name for UI */
  displayName?: string;
  /** Component description */
  description?: string;
  /** Component category */
  category: ComponentCategory;
  /** Icon for UI display (emoji or icon name) */
  icon?: string;
  /** Tags for search and filtering */
  tags?: string[];
  /** Whether component is deprecated */
  deprecated?: boolean;
  /** Version for tracking changes */
  version?: string;
}

/**
 * Editable component registration options
 */
export interface EditableComponentOptions<T = any> {
  /** Component metadata */
  metadata: ComponentMetadata;
  /** Zod schema for props validation */
  schema: z.ZodSchema<T>;
  /** Default props values */
  defaultProps: T;
  /** Custom editor configuration (optional) */
  editorConfig?: ComponentEditorConfig;
  /** Custom validation function (optional) */
  customValidation?: (props: T) => string | null;
}

/**
 * Editor field configuration
 */
export interface EditorFieldConfig {
  /** Field type for rendering appropriate input */
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'url' | 'array' | 'object';
  /** Field label for UI */
  label: string;
  /** Field description/help text */
  description?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Options for select fields */
  options?: Array<{ value: any; label: string; description?: string }>;
  /** Min/max values for numbers */
  min?: number;
  max?: number;
  /** Step for number inputs */
  step?: number;
  /** Validation pattern for strings */
  pattern?: string;
  /** Custom validation message */
  validationMessage?: string;
  /** Field grouping */
  group?: string;
  /** Field display order */
  order?: number;
  /** Conditional display rules */
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  };
}

/**
 * Component editor configuration
 */
export interface ComponentEditorConfig {
  /** Field configurations */
  fields?: Record<string, EditorFieldConfig>;
  /** Field groups for organization */
  groups?: Array<{
    name: string;
    label: string;
    description?: string;
    collapsed?: boolean;
    fields: string[];
  }>;
  /** Preview configuration */
  preview?: {
    /** Whether to show live preview */
    enabled?: boolean;
    /** Preview container width */
    width?: number;
    /** Preview container height */
    height?: number;
    /** Preview background */
    background?: string;
  };
}

/**
 * Registered component entry
 */
export interface RegisteredComponent<T = any> {
  /** Component React element */
  component: ComponentType<T>;
  /** Component metadata */
  metadata: ComponentMetadata;
  /** Zod schema for validation */
  schema: z.ZodSchema<T>;
  /** Default props */
  defaultProps: T;
  /** Current custom props (from database) */
  customProps?: Partial<T>;
  /** Editor configuration */
  editorConfig: ComponentEditorConfig;
  /** Custom validation function */
  customValidation?: (props: T) => string | null;
  /** Registration timestamp */
  registeredAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Component registry interface
 */
export interface ComponentRegistry {
  /** Register a component */
  register<T>(
    name: string,
    component: ComponentType<T>,
    options: EditableComponentOptions<T>
  ): void;
  
  /** Unregister a component */
  unregister(name: string): void;
  
  /** Get a registered component */
  get<T = any>(name: string): RegisteredComponent<T> | undefined;
  
  /** Get all registered components */
  getAll(): RegisteredComponent[];
  
  /** Get components by category */
  getByCategory(category: ComponentCategory): RegisteredComponent[];
  
  /** Search components by name or tags */
  search(query: string): RegisteredComponent[];
  
  /** Check if component is registered */
  has(name: string): boolean;
  
  /** Get component names */
  getNames(): string[];
  
  /** Clear all registered components */
  clear(): void;
  
  /** Sync with database */
  syncWithDatabase(): Promise<void>;
}

/**
 * Extract props type from component
 */
export type ExtractProps<T> = T extends ComponentType<infer P> ? P : never;

/**
 * Component with editable metadata
 */
export type EditableComponent<P = any> = ComponentType<P> & {
  __editable?: {
    metadata: ComponentMetadata;
    schema: z.ZodSchema<P>;
    defaultProps: P;
    editorConfig?: ComponentEditorConfig;
  };
};

/**
 * Schema to editor config mapping result
 */
export interface SchemaToEditorResult {
  fields: Record<string, EditorFieldConfig>;
  groups?: ComponentEditorConfig['groups'];
}