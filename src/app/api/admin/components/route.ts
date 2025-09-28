import { componentDatabaseSync } from '@/lib/component-registry/db-sync';
import { componentRegistry } from '@/lib/component-registry/registry';
import { schemaToEditor } from '@/lib/component-registry/schema-to-editor';
import { NextResponse } from 'next/server';

// Import initializer to ensure components are registered
import '@/lib/component-registry/initialize';

export async function GET() {
  try {
    console.warn('🔍 Components API called - getting from registry...');

    // Initialize database sync and sync components to DB
    try {
      await componentDatabaseSync.initialize();
      await componentDatabaseSync.syncToDatabase();
      console.warn('✅ Components synced to database successfully');
    } catch (dbError) {
      console.warn('⚠️ Database sync failed, using registry only:', dbError);
    }

    // Get components from the in-memory registry
    const registeredComponents = componentRegistry.getComponents();

    // Transform to the format expected by the admin interface
    const components = registeredComponents.map(comp => {
      // Generate editor configuration from Zod schema
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
          configSchema = {
            type: 'object',
            properties: {},
          };
        }
      }

      return {
        id: comp.metadata.name,
        type: comp.metadata.name,
        name: comp.metadata.displayName || comp.metadata.name,
        description: comp.metadata.description || '',
        category: comp.metadata.category,
        defaultConfig: comp.defaultProps,
        configSchema,
      };
    });

    console.warn(
      `✅ Found ${components.length} components from registry:`,
      components.map(c => `${c.name} (${c.category})`)
    );

    return NextResponse.json({
      success: true,
      components,
      source: 'registry',
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
