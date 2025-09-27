/**
 * Component Registry Implementation
 * Central registry for managing editable components with automatic schema detection
 */

import { z } from 'zod';
import type { ComponentType } from 'react';
import type {
  ComponentRegistry,
  ComponentCategory,
  ComponentInfo,
  RegisteredComponent,
  EditableComponentOptions,
  ComponentEditorConfig,
} from './types';
import { schemaToEditor } from './schema-to-editor';

// =============================================================================
// COMPONENT REGISTRY IMPLEMENTATION
// =============================================================================

/**
 * Default implementation of the component registry
 */
class ComponentRegistryImpl implements ComponentRegistry {
  private components = new Map<string, RegisteredComponent>();
  private initialized = false;

  /**
   * Register a component with automatic editor configuration generation
   */
  register<T>(
    name: string,
    component: ComponentType<T>,
    options: EditableComponentOptions<T>
  ): void {
    const { metadata, schema, defaultProps, editorConfig, customValidation } = options;

    // Generate editor configuration from schema if not provided
    const finalEditorConfig: ComponentEditorConfig = editorConfig || 
      this.generateEditorConfigFromSchema(schema);

    // Validate default props against schema
    try {
      schema.parse(defaultProps);
    } catch (error) {
      console.warn(`[ComponentRegistry] Default props validation failed for ${name}:`, error);
    }

    const registeredComponent: RegisteredComponent<T> = {
      component,
      metadata: {
        ...metadata,
        name, // Ensure name matches registration key
        displayName: metadata.displayName || metadata.name,
        version: metadata.version || '1.0.0',
      },
      schema,
      defaultProps,
      customProps: {},
      editorConfig: finalEditorConfig,
      customValidation,
      registeredAt: new Date(),
      updatedAt: new Date(),
    };

    this.components.set(name, registeredComponent);

    console.log(`[ComponentRegistry] Registered component: ${name} (${metadata.category})`);
  }

  /**
   * Unregister a component
   */
  unregister(name: string): void {
    if (this.components.delete(name)) {
      console.log(`[ComponentRegistry] Unregistered component: ${name}`);
    }
  }

  /**
   * Get a registered component by name
   */
  get<T = any>(name: string): RegisteredComponent<T> | undefined {
    return this.components.get(name) as RegisteredComponent<T> | undefined;
  }

  /**
   * Get all registered components
   */
  getAll(): RegisteredComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by category
   */
  getByCategory(category: ComponentCategory): RegisteredComponent[] {
    return this.getAll().filter(component => component.metadata.category === category);
  }

  /**
   * Get components as ComponentInfo array for UI display
   */
  getComponents(): ComponentInfo[] {
    return this.getAll().map(registered => ({
      name: registered.metadata.name,
      metadata: registered.metadata,
      defaultProps: registered.defaultProps,
      schema: registered.schema,
      component: registered.component,
    }));
  }

  /**
   * Search components by name, description, or tags
   */
  search(query: string): RegisteredComponent[] {
    const searchTerm = query.toLowerCase();
    
    return this.getAll().filter(component => {
      const { name, displayName, description, tags } = component.metadata;
      
      return (
        name.toLowerCase().includes(searchTerm) ||
        displayName?.toLowerCase().includes(searchTerm) ||
        description?.toLowerCase().includes(searchTerm) ||
        tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Get all registered component names
   */
  getNames(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear();
    console.log('[ComponentRegistry] Cleared all components');
  }

  /**
   * Sync registry with database (to be implemented with database integration)
   */
  async syncWithDatabase(): Promise<void> {
    // This will be implemented in the database sync module
    console.log('[ComponentRegistry] Database sync not yet implemented');
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const components = this.getAll();
    const categories = new Map<ComponentCategory, number>();
    
    components.forEach(component => {
      const category = component.metadata.category;
      categories.set(category, (categories.get(category) || 0) + 1);
    });

    return {
      total: components.length,
      categories: Object.fromEntries(categories),
      lastUpdate: components.length > 0 
        ? new Date(Math.max(...components.map(c => c.updatedAt.getTime())))
        : null,
    };
  }

  /**
   * Validate component props using its schema
   */
  validateProps<T>(name: string, props: T): { valid: boolean; errors?: string[] } {
    const component = this.get<T>(name);
    
    if (!component) {
      return { valid: false, errors: [`Component ${name} not found`] };
    }

    try {
      // Run Zod validation
      component.schema.parse(props);
      
      // Run custom validation if provided
      if (component.customValidation) {
        const customError = component.customValidation(props);
        if (customError) {
          return { valid: false, errors: [customError] };
        }
      }

      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ),
        };
      }
      
      return { valid: false, errors: [String(error)] };
    }
  }

  /**
   * Get merged props (default + custom) for a component
   */
  getMergedProps<T>(name: string): T | null {
    const component = this.get<T>(name);
    
    if (!component) {
      return null;
    }

    return {
      ...component.defaultProps,
      ...component.customProps,
    } as T;
  }

  /**
   * Update custom props for a component
   */
  updateCustomProps<T>(name: string, customProps: Partial<T>): boolean {
    const component = this.get<T>(name);
    
    if (!component) {
      return false;
    }

    // Merge with existing custom props
    component.customProps = {
      ...component.customProps,
      ...customProps,
    };
    
    component.updatedAt = new Date();
    
    console.log(`[ComponentRegistry] Updated custom props for: ${name}`);
    return true;
  }

  /**
   * Reset component to default props
   */
  resetToDefaults(name: string): boolean {
    const component = this.get(name);
    
    if (!component) {
      return false;
    }

    component.customProps = {};
    component.updatedAt = new Date();
    
    console.log(`[ComponentRegistry] Reset to defaults: ${name}`);
    return true;
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /**
   * Generate editor configuration from Zod schema
   */
  private generateEditorConfigFromSchema(schema: z.ZodSchema): ComponentEditorConfig {
    try {
      const editorResult = schemaToEditor(schema);
      return {
        fields: editorResult.fields,
        groups: editorResult.groups,
        preview: {
          enabled: true,
          width: 400,
          height: 300,
        },
      };
    } catch (error) {
      console.warn('[ComponentRegistry] Failed to generate editor config from schema:', error);
      return {
        fields: {},
        preview: { enabled: false },
      };
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Global component registry instance
 */
export const componentRegistry = new ComponentRegistryImpl();

/**
 * Initialize the registry (can be called multiple times safely)
 */
export function initializeRegistry(): void {
  if (componentRegistry['initialized']) {
    return;
  }

  // Mark as initialized
  componentRegistry['initialized'] = true;
  
  console.log('[ComponentRegistry] Initialized');
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Register a component (convenience function)
 */
export function registerComponent<T>(
  name: string,
  component: ComponentType<T>,
  options: EditableComponentOptions<T>
): void {
  initializeRegistry();
  componentRegistry.register(name, component, options);
}

/**
 * Get a registered component (convenience function)
 */
export function getComponent<T = any>(name: string): RegisteredComponent<T> | undefined {
  return componentRegistry.get<T>(name);
}

/**
 * Get all components by category (convenience function)
 */
export function getComponentsByCategory(category: ComponentCategory): RegisteredComponent[] {
  return componentRegistry.getByCategory(category);
}

/**
 * Search for components (convenience function)
 */
export function searchComponents(query: string): RegisteredComponent[] {
  return componentRegistry.search(query);
}

/**
 * Validate component props (convenience function)
 */
export function validateComponentProps<T>(
  name: string, 
  props: T
): { valid: boolean; errors?: string[] } {
  return componentRegistry.validateProps(name, props);
}

/**
 * Get registry statistics (convenience function)
 */
export function getRegistryStats() {
  return componentRegistry.getStats();
}

// Export the registry instance as default
export default componentRegistry;
