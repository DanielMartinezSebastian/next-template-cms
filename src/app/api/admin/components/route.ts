import { componentDatabaseSync } from '@/lib/component-registry/db-sync';
import { componentRegistry } from '@/lib/component-registry/registry';
import { schemaToEditor } from '@/lib/component-registry/schema-to-editor';
import { getDbClient, isDatabaseAvailable } from '@/lib/db';
import { NextResponse } from 'next/server';

// Import initializer to ensure components are registered
import '@/lib/component-registry/initialize';

export async function GET() {
  try {
    console.warn('🔍 Components API called - getting from registry...');

    // Initialize database sync but only sync new components, not existing configurations
    try {
      await componentDatabaseSync.initialize();

      // Smart sync: only sync new components or schema updates, preserve manual changes
      // This prevents overwriting user-customized defaultConfig values
      console.warn('✅ Database sync initialized - preserving manual configurations');
    } catch (dbError) {
      console.warn('⚠️ Database sync failed, using registry only:', dbError);
    }

    // Get components from database with real IDs, fallback to registry
    let components = [];

    try {
      const db = getDbClient();
      const dbAvailable = await isDatabaseAvailable();

      if (dbAvailable && db.component) {
        // Get components from database with real IDs
        const dbComponents = await db.component.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        });

        // Get registry components for schema info
        const registeredComponents = componentRegistry.getComponents();
        const registryMap = new Map(registeredComponents.map(comp => [comp.metadata.name, comp]));

        components = dbComponents.map(dbComp => {
          const registryComp = registryMap.get(dbComp.name);

          // Generate editor configuration from Zod schema
          let configSchema = {};
          if (registryComp?.schema) {
            try {
              const editorConfig = schemaToEditor(registryComp.schema);
              configSchema = {
                type: 'object',
                properties: editorConfig.fields,
                groups: editorConfig.groups,
              };
            } catch (error) {
              console.warn(`⚠️ Failed to generate editor config for ${dbComp.name}:`, error);
              configSchema = { type: 'object', properties: {} };
            }
          }

          return {
            id: dbComp.id, // Use real database ID
            type: dbComp.type,
            name: dbComp.name,
            description: dbComp.description || '',
            category: dbComp.category,
            defaultConfig: dbComp.defaultConfig || registryComp?.defaultProps || {},
            configSchema,
          };
        });
      } else {
        throw new Error('Database not available');
      }
    } catch (dbError) {
      console.warn('⚠️ Database query failed, using registry fallback:', dbError);

      // Fallback to registry components
      const registeredComponents = componentRegistry.getComponents();
      components = registeredComponents.map(comp => {
        let configSchema = {};
        if (comp.schema) {
          try {
            const editorConfig = schemaToEditor(comp.schema);
            configSchema = {
              type: 'object',
              properties: editorConfig.fields,
              groups: editorConfig.groups,
            };
          } catch (error) {
            console.warn(`⚠️ Failed to generate editor config for ${comp.metadata.name}:`, error);
            configSchema = { type: 'object', properties: {} };
          }
        }

        return {
          id: comp.metadata.name, // Fallback to name as ID
          type: comp.metadata.name,
          name: comp.metadata.displayName || comp.metadata.name,
          description: comp.metadata.description || '',
          category: comp.metadata.category,
          defaultConfig: comp.defaultProps,
          configSchema,
        };
      });
    }

    console.warn(
      `✅ Found ${components.length} components from registry:`,
      components.map(c => `${c.name} (${c.category})`)
    );

    // Determine the actual source based on whether we used database or registry
    let actualSource = 'registry';
    try {
      const dbAvailable = await isDatabaseAvailable();
      if (dbAvailable && getDbClient().component) {
        // Check if we have any database components with real IDs
        const hasDbComponents = components.some(c => c.id !== c.name);
        actualSource = hasDbComponents ? 'postgresql' : 'registry';
      }
    } catch {
      actualSource = 'registry';
    }

    return NextResponse.json({
      success: true,
      components,
      source: actualSource,
      count: components.length,
    });
  } catch (error) {
    console.error('❌ Error loading components from registry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load components from registry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
