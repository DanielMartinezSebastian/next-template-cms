/**
 * Individual Component API Routes
 * Manage specific component operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { componentRegistry, initializeRegistry } from '@/lib/component-registry';
import { componentDatabaseSync } from '@/lib/component-registry/db-sync';

// Ensure registry is initialized
initializeRegistry();

// =============================================================================
// GET - Get specific component details
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const componentName = decodeURIComponent(params.name);

    const component = componentRegistry.get(componentName);
    
    if (!component) {
      return NextResponse.json(
        {
          success: false,
          error: `Component ${componentName} not found`,
        },
        { status: 404 }
      );
    }

    // Format detailed component data
    const componentData = {
      name: component.metadata.name,
      displayName: component.metadata.displayName,
      description: component.metadata.description,
      category: component.metadata.category,
      icon: component.metadata.icon,
      tags: component.metadata.tags,
      version: component.metadata.version,
      deprecated: component.metadata.deprecated,
      
      // Props and configuration
      defaultProps: component.defaultProps,
      customProps: component.customProps,
      mergedProps: componentRegistry.getMergedProps(componentName),
      
      // Editor configuration
      editorConfig: component.editorConfig,
      
      // Schema information (simplified for client)
      schema: {
        // Don't send the actual Zod schema, just field info
        fields: Object.keys(component.editorConfig.fields || {}),
        groups: component.editorConfig.groups?.map(g => ({
          name: g.name,
          label: g.label,
          fields: g.fields,
        })),
      },
      
      // Metadata
      registeredAt: component.registeredAt,
      updatedAt: component.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: componentData,
    });
  } catch (error) {
    console.error(`[API] Failed to get component ${params.name}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve component',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update component properties
// =============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const componentName = decodeURIComponent(params.name);
    const body = await request.json();
    const { customProps, description, version } = body;

    if (!componentRegistry.has(componentName)) {
      return NextResponse.json(
        {
          success: false,
          error: `Component ${componentName} not found`,
        },
        { status: 404 }
      );
    }

    // Validate props if provided
    if (customProps) {
      const component = componentRegistry.get(componentName);
      const mergedProps = {
        ...component?.defaultProps,
        ...customProps,
      };

      const validation = componentRegistry.validateProps(componentName, mergedProps);
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

      // Update props in registry
      componentRegistry.updateCustomProps(componentName, customProps);
    }

    // Sync with database
    try {
      await componentDatabaseSync.updateCustomProps(componentName, customProps);
    } catch (dbError) {
      console.warn(`[API] Database sync failed for ${componentName}:`, dbError);
      // Continue even if DB sync fails
    }

    // Return updated component
    const updatedComponent = componentRegistry.get(componentName);
    return NextResponse.json({
      success: true,
      message: `Component ${componentName} updated successfully`,
      data: updatedComponent ? {
        name: updatedComponent.metadata.name,
        defaultProps: updatedComponent.defaultProps,
        customProps: updatedComponent.customProps,
        mergedProps: componentRegistry.getMergedProps(componentName),
        updatedAt: updatedComponent.updatedAt,
      } : null,
    });
  } catch (error) {
    console.error(`[API] Failed to update component ${params.name}:`, error);
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

// =============================================================================
// DELETE - Reset component to defaults
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const componentName = decodeURIComponent(params.name);

    if (!componentRegistry.has(componentName)) {
      return NextResponse.json(
        {
          success: false,
          error: `Component ${componentName} not found`,
        },
        { status: 404 }
      );
    }

    // Reset in registry
    const result = componentRegistry.resetToDefaults(componentName);
    
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to reset component ${componentName}`,
        },
        { status: 500 }
      );
    }

    // Sync with database
    try {
      await componentDatabaseSync.resetToDefaults(componentName);
    } catch (dbError) {
      console.warn(`[API] Database sync failed for ${componentName}:`, dbError);
      // Continue even if DB sync fails
    }

    const component = componentRegistry.get(componentName);
    return NextResponse.json({
      success: true,
      message: `Component ${componentName} reset to defaults successfully`,
      data: component ? {
        name: component.metadata.name,
        defaultProps: component.defaultProps,
        customProps: component.customProps,
        updatedAt: component.updatedAt,
      } : null,
    });
  } catch (error) {
    console.error(`[API] Failed to reset component ${params.name}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset component',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}