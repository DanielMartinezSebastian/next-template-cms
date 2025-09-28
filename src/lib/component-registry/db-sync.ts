/**
 * Database Synchronization for Component Registry
 * Handles syncing component metadata and configurations with PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { componentRegistry } from './registry';
import type { RegisteredComponent } from './types';

// =============================================================================
// DATABASE TYPES
// =============================================================================

/**
 * Database component representation
 */
interface DatabaseComponent {
  id: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
  configSchema: any;
  defaultConfig: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enhanced database component with new fields
 */
interface EnhancedDatabaseComponent extends DatabaseComponent {
  propsSchema: any; // Serialized Zod schema
  defaultProps: any;
  customProps?: any;
  editorConfig: any;
  version: string;
}

// =============================================================================
// DATABASE SYNC CLASS
// =============================================================================

export class ComponentDatabaseSync {
  private prisma: PrismaClient | null;
  private initialized = false;

  constructor(prisma?: PrismaClient) {
    // Don't initialize PrismaClient in browser environment
    if (typeof window !== 'undefined') {
      this.prisma = null;
    } else {
      this.prisma = prisma || new PrismaClient();
    }
  }

  /**
   * Check if database is available
   */
  private isDatabaseAvailable(): boolean {
    return this.prisma !== null && typeof window === 'undefined';
  }

  /**
   * Initialize database sync
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Skip database initialization in browser environment or if prisma is null
    if (typeof window !== 'undefined' || !this.prisma) {
      console.warn(
        '[ComponentDatabaseSync] Skipping database initialization in browser environment'
      );
      this.initialized = true;
      return;
    }

    try {
      // Test database connection
      await this.prisma.$connect();
      this.initialized = true;
      console.warn('[ComponentDatabaseSync] Initialized successfully');
    } catch (error) {
      console.error('[ComponentDatabaseSync] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Sync all registered components to database
   */
  async syncToDatabase(): Promise<void> {
    // Skip database operations in browser environment
    if (typeof window !== 'undefined') {
      console.warn('[ComponentDatabaseSync] Skipping database sync in browser environment');
      return;
    }

    await this.initialize();

    const registeredComponents = componentRegistry.getAll();
    console.warn(
      `[ComponentDatabaseSync] Syncing ${registeredComponents.length} components to database`
    );

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const component of registeredComponents) {
      try {
        const exists = await this.componentExists(component.metadata.name);

        if (exists) {
          await this.updateComponent(component);
          updated++;
        } else {
          await this.createComponent(component);
          created++;
        }
      } catch (error) {
        console.error(
          `[ComponentDatabaseSync] Failed to sync component ${component.metadata.name}:`,
          error
        );
        errors++;
      }
    }

    console.log(
      `[ComponentDatabaseSync] Sync complete: ${created} created, ${updated} updated, ${errors} errors`
    );
  }

  /**
   * Load components from database and update registry
   */
  async syncFromDatabase(): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      console.warn('[ComponentDatabaseSync] Skipping sync from database - not available');
      return;
    }

    await this.initialize();

    try {
      const dbComponents = await this.prisma!.component.findMany({
        where: { isActive: true },
      });

      console.warn(
        `[ComponentDatabaseSync] Loading ${dbComponents.length} components from database`
      );

      for (const dbComponent of dbComponents) {
        this.updateRegistryFromDatabase(dbComponent);
      }
    } catch (error) {
      console.error('[ComponentDatabaseSync] Failed to sync from database:', error);
      throw error;
    }
  }

  /**
   * Get component custom props from database
   */
  async getCustomProps(componentName: string): Promise<any> {
    await this.initialize();

    try {
      const component = await this.prisma.component.findUnique({
        where: { name: componentName },
        select: { defaultConfig: true },
      });

      return component?.defaultConfig || {};
    } catch (error) {
      console.error(
        `[ComponentDatabaseSync] Failed to get custom props for ${componentName}:`,
        error
      );
      return {};
    }
  }

  /**
   * Update component custom props in database
   */
  async updateCustomProps(componentName: string, customProps: any): Promise<boolean> {
    await this.initialize();

    try {
      await this.prisma.component.update({
        where: { name: componentName },
        data: {
          defaultConfig: customProps,
          updatedAt: new Date(),
        },
      });

      // Update registry as well
      componentRegistry.updateCustomProps(componentName, customProps);

      console.log(`[ComponentDatabaseSync] Updated custom props for ${componentName}`);
      return true;
    } catch (error) {
      console.error(
        `[ComponentDatabaseSync] Failed to update custom props for ${componentName}:`,
        error
      );
      return false;
    }
  }

  /**
   * Reset component to defaults
   */
  async resetToDefaults(componentName: string): Promise<boolean> {
    await this.initialize();

    try {
      const registeredComponent = componentRegistry.get(componentName);
      if (!registeredComponent) {
        console.error(`[ComponentDatabaseSync] Component ${componentName} not found in registry`);
        return false;
      }

      await this.prisma.component.update({
        where: { name: componentName },
        data: {
          defaultConfig: registeredComponent.defaultProps,
          updatedAt: new Date(),
        },
      });

      // Update registry as well
      componentRegistry.resetToDefaults(componentName);

      console.log(`[ComponentDatabaseSync] Reset ${componentName} to defaults`);
      return true;
    } catch (error) {
      console.error(`[ComponentDatabaseSync] Failed to reset ${componentName} to defaults:`, error);
      return false;
    }
  }

  /**
   * Get component history/versions
   */
  async getComponentHistory(componentName: string): Promise<any[]> {
    await this.initialize();

    try {
      // This would require a ComponentHistory table (future enhancement)
      // For now, return empty array
      return [];
    } catch (error) {
      console.error(`[ComponentDatabaseSync] Failed to get history for ${componentName}:`, error);
      return [];
    }
  }

  /**
   * Cleanup unused components from database
   */
  async cleanup(): Promise<void> {
    await this.initialize();

    try {
      const registeredNames = new Set(componentRegistry.getNames());

      const result = await this.prisma.component.updateMany({
        where: {
          name: {
            notIn: Array.from(registeredNames),
          },
          isActive: true,
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      console.log(`[ComponentDatabaseSync] Deactivated ${result.count} unused components`);
    } catch (error) {
      console.error('[ComponentDatabaseSync] Failed to cleanup:', error);
    }
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.initialized = false;
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /**
   * Check if component exists in database
   */
  private async componentExists(name: string): Promise<boolean> {
    try {
      const count = await this.prisma.component.count({
        where: { name },
      });
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Create new component in database
   */
  private async createComponent(component: RegisteredComponent): Promise<void> {
    const data = this.serializeComponent(component);

    await this.prisma.component.create({
      data: {
        name: data.name,
        type: data.type,
        category: data.category,
        description: data.description,
        displayName: data.displayName,
        propsSchema: data.propsSchema,
        defaultConfig: data.defaultConfig,
        isActive: true,
      },
    });

    console.warn(`[ComponentDatabaseSync] Created component: ${component.metadata.name}`);
  }

  /**
   * Update existing component in database
   */
  private async updateComponent(component: RegisteredComponent): Promise<void> {
    const data = this.serializeComponent(component);

    await this.prisma!.component.update({
      where: { name: component.metadata.name },
      data: {
        type: data.type,
        category: data.category,
        description: data.description,
        displayName: data.displayName,
        propsSchema: data.propsSchema,
        defaultConfig: data.defaultConfig,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    console.warn(`[ComponentDatabaseSync] Updated component: ${component.metadata.name}`);
  }

  /**
   * Update registry from database component
   */
  private updateRegistryFromDatabase(dbComponent: any): void {
    const componentName = dbComponent.name;
    const registeredComponent = componentRegistry.get(componentName);

    if (registeredComponent) {
      // Update custom props from database
      const customProps = dbComponent.defaultConfig || {};
      componentRegistry.updateCustomProps(componentName, customProps);
    }
  }

  /**
   * Serialize component for database storage
   */
  private serializeComponent(component: RegisteredComponent): {
    name: string;
    type: string;
    category: string;
    description: string;
    displayName: string;
    propsSchema: any;
    defaultConfig: any;
  } {
    return {
      name: component.metadata.name, // "CallToActionComponent"
      type: component.metadata.name, // Same as name for consistency
      category: component.metadata.category, // "marketing"
      description: component.metadata.description || '',
      displayName: component.metadata.displayName || component.metadata.name,
      propsSchema: this.serializeSchema(component.schema),
      defaultConfig: component.defaultProps,
    };
  }

  /**
   * Serialize Zod schema for database storage
   */
  private serializeSchema(schema: z.ZodSchema): any {
    try {
      // Convert Zod schema to JSON Schema
      // This is a simplified version - in production, you might want to use
      // a library like zod-to-json-schema
      return {
        type: 'object',
        properties: this.extractSchemaProperties(schema),
      };
    } catch (error) {
      console.warn('[ComponentDatabaseSync] Failed to serialize schema:', error);
      return { type: 'object', properties: {} };
    }
  }

  /**
   * Extract properties from Zod schema
   */
  private extractSchemaProperties(schema: z.ZodSchema): any {
    if (schema instanceof z.ZodObject) {
      const properties: any = {};
      const shape = schema.shape;

      for (const [key, fieldSchema] of Object.entries(shape)) {
        properties[key] = this.getFieldType(fieldSchema as z.ZodSchema);
      }

      return properties;
    }

    return {};
  }

  /**
   * Get field type from Zod schema
   */
  private getFieldType(schema: z.ZodSchema): any {
    if (schema instanceof z.ZodString) {
      return { type: 'string' };
    } else if (schema instanceof z.ZodNumber) {
      return { type: 'number' };
    } else if (schema instanceof z.ZodBoolean) {
      return { type: 'boolean' };
    } else if (schema instanceof z.ZodEnum) {
      return { type: 'string', enum: schema.options };
    } else if (schema instanceof z.ZodArray) {
      return { type: 'array' };
    } else if (schema instanceof z.ZodObject) {
      return { type: 'object' };
    } else if (schema instanceof z.ZodOptional) {
      return this.getFieldType(schema._def.innerType);
    }

    return { type: 'string' };
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Global database sync instance
 */
export const componentDatabaseSync = new ComponentDatabaseSync();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Initialize database sync
 */
export async function initializeDatabaseSync(): Promise<void> {
  await componentDatabaseSync.initialize();
}

/**
 * Sync components to database
 */
export async function syncComponentsToDatabase(): Promise<void> {
  await componentDatabaseSync.syncToDatabase();
}

/**
 * Sync components from database
 */
export async function syncComponentsFromDatabase(): Promise<void> {
  await componentDatabaseSync.syncFromDatabase();
}

/**
 * Update component custom props
 */
export async function updateComponentCustomProps(
  componentName: string,
  customProps: any
): Promise<boolean> {
  return componentDatabaseSync.updateCustomProps(componentName, customProps);
}

/**
 * Reset component to defaults
 */
export async function resetComponentToDefaults(componentName: string): Promise<boolean> {
  return componentDatabaseSync.resetToDefaults(componentName);
}

/**
 * Cleanup unused components
 */
export async function cleanupUnusedComponents(): Promise<void> {
  await componentDatabaseSync.cleanup();
}

// Export the sync instance as default
export default componentDatabaseSync;
