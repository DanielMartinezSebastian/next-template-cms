/**
 * Components API Route
 * Manages component registry operations and database integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { componentRegistry, initializeRegistry } from '@/lib/component-registry';

// Ensure registry is initialized
initializeRegistry();

// =============================================================================
// GET - List all registered components (hybrid: registry + database)
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const source = searchParams.get('source') || 'hybrid'; // registry, database, hybrid

    let components: any[] = [];

    if (source === 'registry' || source === 'hybrid') {
      // Get from component registry
      let registryComponents = componentRegistry.getAll();

      // Filter by category if provided
      if (category) {
        registryComponents = registryComponents.filter(c => c.metadata.category === category);
      }

      // Filter by search query if provided
      if (search) {
        registryComponents = componentRegistry.search(search);
      }

      // Format registry components
      const formattedRegistryComponents = registryComponents.map(component => ({
        id: component.metadata.name,
        type: component.metadata.name.toLowerCase().replace(/\s+/g, '-'),
        name: component.metadata.name,
        displayName: component.metadata.displayName,
        description: component.metadata.description || '',
        category: component.metadata.category,
        icon: component.metadata.icon,
        tags: component.metadata.tags,
        version: component.metadata.version,
        defaultProps: component.defaultProps,
        customProps: component.customProps,
        editorConfig: component.editorConfig,
        registeredAt: component.registeredAt,
        updatedAt: component.updatedAt,
        source: 'registry',
      }));

      components = components.concat(formattedRegistryComponents);
    }

    if (source === 'database' || source === 'hybrid') {
      try {
        // Get database client (real or mock)
        const db = getDbClient();
        
        // Get components from database
        const dbComponents = await db.component.findMany({
          where: {
            isActive: true,
            ...(category && { category }),
          },
          select: {
            id: true,
            name: true,
            type: true,
            category: true,
            description: true,
            configSchema: true,
            defaultConfig: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });

        // Filter by search if provided
        const filteredDbComponents = search 
          ? dbComponents.filter(c => 
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.description?.toLowerCase().includes(search.toLowerCase())
            )
          : dbComponents;

        // Transform database components
        const transformedDbComponents = filteredDbComponents.map(component => ({
          id: component.id,
          type: component.name.toLowerCase().replace(/\s+/g, '-'),
          name: component.name,
          description: component.description || '',
          category: component.category || 'general',
          defaultProps: component.defaultConfig || {},
          configSchema: component.configSchema || {},
          createdAt: component.createdAt,
          updatedAt: component.updatedAt,
          source: 'database',
        }));

        // Merge with registry components (avoid duplicates)
        if (source === 'hybrid') {
          const registryNames = new Set(components.map(c => c.name));
          const uniqueDbComponents = transformedDbComponents.filter(
            c => !registryNames.has(c.name)
          );
          components = components.concat(uniqueDbComponents);
        } else {
          components = transformedDbComponents;
        }
      } catch (dbError) {
        console.warn('[API] Database unavailable, using registry only:', dbError);
        if (source === 'database') {
          return NextResponse.json(
            {
              success: false,
              error: 'Database unavailable',
              message: dbError instanceof Error ? dbError.message : 'Unknown database error',
            },
            { status: 503 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: components,
      total: components.length,
      stats: {
        registry: componentRegistry.getStats(),
        source,
        filters: { category, search },
      },
    });
  } catch (error) {
    console.error('[API] Failed to get components:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve components',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Update component custom properties
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { componentName, customProps, action } = body;

    if (!componentName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Component name is required',
        },
        { status: 400 }
      );
    }

    // Check if component exists in registry
    if (!componentRegistry.has(componentName)) {
      return NextResponse.json(
        {
          success: false,
          error: `Component ${componentName} not found in registry`,
        },
        { status: 404 }
      );
    }

    let result = false;

    switch (action) {
      case 'update':
        if (!customProps) {
          return NextResponse.json(
            {
              success: false,
              error: 'Custom props are required for update action',
            },
            { status: 400 }
          );
        }

        // Validate props before updating
        const validation = componentRegistry.validateProps(componentName, {
          ...componentRegistry.get(componentName)?.defaultProps,
          ...customProps,
        });

        if (!validation.valid) {
          return NextResponse.json(
            {
              success: false,
              error: 'Props validation failed',
              details: validation.errors,
            },
            { status: 400 }
          );
        }

        result = componentRegistry.updateCustomProps(componentName, customProps);
        break;

      case 'reset':
        result = componentRegistry.resetToDefaults(componentName);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
          },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to ${action} component ${componentName}`,
        },
        { status: 500 }
      );
    }

    // Return updated component data
    const updatedComponent = componentRegistry.get(componentName);
    return NextResponse.json({
      success: true,
      message: `Component ${componentName} ${action}d successfully`,
      data: updatedComponent ? {
        name: updatedComponent.metadata.name,
        defaultProps: updatedComponent.defaultProps,
        customProps: updatedComponent.customProps,
        updatedAt: updatedComponent.updatedAt,
      } : null,
    });
  } catch (error) {
    console.error('[API] Failed to update component:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update component',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
