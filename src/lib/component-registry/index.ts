/**
 * Component Registry - Main Export
 * Auto-registration system for editable components with Zod schema validation
 */

import type { ComponentCategory } from './types';

// =============================================================================
// CORE EXPORTS
// =============================================================================

// Types
export type {
  ComponentCategory,
  ComponentMetadata,
  EditableComponentOptions,
  EditorFieldConfig,
  ComponentEditorConfig,
  RegisteredComponent,
  ComponentRegistry,
  ExtractProps,
  EditableComponent,
  SchemaToEditorResult,
} from './types';

// Registry
export {
  componentRegistry,
  initializeRegistry,
  registerComponent,
  getComponent,
  getComponentsByCategory,
  searchComponents,
  validateComponentProps,
  getRegistryStats,
} from './registry';

// HOC and utilities
export {
  withEditable,
  createEditableComponent,
  isEditableComponent,
  getEditableMetadata,
  getComponentName,
  commonSchemas,
} from './with-editable';

export type {
  WithEditableOptions,
  InferSchemaProps,
} from './with-editable';

// Schema to editor
export {
  schemaToEditor,
} from './schema-to-editor';

// Database sync
export {
  componentDatabaseSync,
  initializeDatabaseSync,
  syncComponentsToDatabase,
  syncComponentsFromDatabase,
  updateComponentCustomProps,
  resetComponentToDefaults,
  cleanupUnusedComponents,
} from './db-sync';

// =============================================================================
// RE-EXPORTS FROM ZOD
// =============================================================================

// Re-export commonly used Zod utilities for convenience
export { z } from 'zod';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Available component categories
 */
export const COMPONENT_CATEGORIES = [
  'layout',
  'content', 
  'media',
  'interactive',
  'marketing',
  'ui',
] as const;

/**
 * Default component metadata
 */
export const DEFAULT_COMPONENT_METADATA = {
  category: 'content' as const,
  icon: '📄',
  version: '1.0.0',
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all available component categories
 */
export function getAllCategories(): readonly ComponentCategory[] {
  return COMPONENT_CATEGORIES;
}

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): category is ComponentCategory {
  return COMPONENT_CATEGORIES.includes(category as ComponentCategory);
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: ComponentCategory): string {
  const names: Record<ComponentCategory, string> = {
    layout: 'Layout',
    content: 'Content',
    media: 'Media',
    interactive: 'Interactive',
    marketing: 'Marketing',
    ui: 'UI Components',
  };
  
  return names[category] || category;
}

/**
 * Get category description
 */
export function getCategoryDescription(category: ComponentCategory): string {
  const descriptions: Record<ComponentCategory, string> = {
    layout: 'Structural components for page layout',
    content: 'Text and content display components',
    media: 'Image, video, and media components',
    interactive: 'Interactive elements like buttons and forms',
    marketing: 'Marketing-focused components like CTAs and testimonials',
    ui: 'Basic UI building blocks',
  };
  
  return descriptions[category] || 'Component category';
}

/**
 * Get suggested icon for category
 */
export function getCategoryIcon(category: ComponentCategory): string {
  const icons: Record<ComponentCategory, string> = {
    layout: '📐',
    content: '📝',
    media: '🖼️',
    interactive: '🎛️',
    marketing: '📢',
    ui: '🧩',
  };
  
  return icons[category] || '📄';
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the complete component registry system
 */
export async function initializeComponentSystem(): Promise<void> {
  try {
    // Initialize registry
    initializeRegistry();
    
    // Initialize database sync (if available)
    try {
      await initializeDatabaseSync();
      console.log('[ComponentSystem] Database sync initialized');
    } catch (error) {
      console.warn('[ComponentSystem] Database sync not available:', error);
    }
    
    console.log('[ComponentSystem] Component system initialized successfully');
  } catch (error) {
    console.error('[ComponentSystem] Failed to initialize:', error);
    throw error;
  }
}

/**
 * Get system status and statistics
 */
export function getSystemStatus() {
  const stats = getRegistryStats();
  
  return {
    registry: {
      initialized: true,
      components: stats.total,
      categories: stats.categories,
      lastUpdate: stats.lastUpdate,
    },
    database: {
      // This will be populated by database sync status
      connected: false,
      lastSync: null,
    },
  };
}

// =============================================================================
// MIGRATION HELPERS
// =============================================================================

/**
 * Helper to migrate existing components to the new system
 */
export function createMigrationHelper() {
  return {
    /**
     * Convert old component schema format to new system
     */
    convertLegacySchema(legacySchema: any): any {
      // Implementation for converting old schemas
      console.warn('[ComponentSystem] Legacy schema conversion not yet implemented');
      return legacySchema;
    },
    
    /**
     * Batch register components from old system
     */
    batchRegister(components: any[]): void {
      console.log(`[ComponentSystem] Batch registering ${components.length} components`);
      // Implementation for batch registration
    },
  };
}

// =============================================================================
// DEVELOPMENT HELPERS
// =============================================================================

/**
 * Development utilities (only available in development)
 */
export const devUtils = process.env.NODE_ENV === 'development' ? {
  /**
   * Log all registered components
   */
  logRegisteredComponents(): void {
    const components = componentRegistry.getAll();
    console.group('[ComponentRegistry] Registered Components');
    
    COMPONENT_CATEGORIES.forEach(category => {
      const categoryComponents = components.filter(c => c.metadata.category === category);
      if (categoryComponents.length > 0) {
        console.group(`${formatCategoryName(category)} (${categoryComponents.length})`);
        categoryComponents.forEach(component => {
          console.log(`• ${component.metadata.name}`, {
            description: component.metadata.description,
            version: component.metadata.version,
            registeredAt: component.registeredAt,
          });
        });
        console.groupEnd();
      }
    });
    
    console.groupEnd();
  },
  
  /**
   * Validate all registered components
   */
  validateAllComponents(): void {
    const components = componentRegistry.getAll();
    console.group('[ComponentRegistry] Component Validation');
    
    components.forEach(component => {
      try {
        component.schema.parse(component.defaultProps);
        console.log(`✅ ${component.metadata.name}: Valid`);
      } catch (error) {
        console.error(`❌ ${component.metadata.name}: Invalid`, error);
      }
    });
    
    console.groupEnd();
  },
  
  /**
   * Export registry state for debugging
   */
  exportRegistryState(): any {
    return {
      components: componentRegistry.getAll().map(c => ({
        name: c.metadata.name,
        category: c.metadata.category,
        defaultProps: c.defaultProps,
        customProps: c.customProps,
        registeredAt: c.registeredAt,
        updatedAt: c.updatedAt,
      })),
      stats: getRegistryStats(),
      systemStatus: getSystemStatus(),
    };
  },
} : {};