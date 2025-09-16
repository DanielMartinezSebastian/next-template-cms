/**
 * Page Components Management API Route
 * Handles component operations for specific pages
 */

import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const CreateComponentSchema = z.object({
  componentId: z.string().min(1, 'Component ID is required'),
  order: z.number().int().min(0).optional().default(0),
  isVisible: z.boolean().optional().default(true),
  config: z.record(z.unknown()).optional().default({}),
});

const UpdateComponentSchema = z.object({
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  config: z.record(z.unknown()).optional(),
});

const ReorderComponentsSchema = z.object({
  componentIds: z.array(z.string()).min(1, 'At least one component ID is required'),
});

// =============================================================================
// GET: FETCH PAGE COMPONENTS
// =============================================================================

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id, isActive: true },
      select: { id: true, slug: true, fullPath: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Fetch page components
    const components = await prisma.pageComponent.findMany({
      where: { pageId: id },
      include: {
        component: {
          select: {
            id: true,
            name: true,
            type: true,
            category: true,
            description: true,
            configSchema: true,
            defaultConfig: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Transform to API format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedComponents = components.map((comp: any) => ({
      id: comp.id,
      componentId: comp.componentId,
      component: {
        id: comp.component.id,
        name: comp.component.name,
        type: comp.component.type,
        category: comp.component.category,
        description: comp.component.description,
        configSchema: comp.component.configSchema,
        defaultConfig: comp.component.defaultConfig,
      },
      order: comp.order,
      isVisible: comp.isVisible,
      config: comp.config,
      createdAt: comp.createdAt.toISOString(),
      updatedAt: comp.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug,
        fullPath: page.fullPath,
      },
      components: formattedComponents,
      count: formattedComponents.length,
    });
  } catch (error) {
    console.error('Error fetching page components:', error);
    return NextResponse.json({ error: 'Failed to fetch page components' }, { status: 500 });
  }
}

// =============================================================================
// POST: ADD COMPONENT TO PAGE
// =============================================================================

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = CreateComponentSchema.parse(body);

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id, isActive: true },
      select: { id: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if component exists
    const component = await prisma.component.findUnique({
      where: { id: validatedData.componentId, isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
        description: true,
        configSchema: true,
        defaultConfig: true,
      },
    });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    // If no order specified, add to the end
    let order = validatedData.order;
    if (order === 0) {
      const maxOrder = await prisma.pageComponent.aggregate({
        where: { pageId: id },
        _max: { order: true },
      });
      order = (maxOrder._max.order || -1) + 1;
    }

    // Create page component with transaction to handle order conflicts
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Shift existing components if necessary
      await tx.pageComponent.updateMany({
        where: {
          pageId: id,
          order: { gte: order },
        },
        data: {
          order: { increment: 1 },
        },
      });

      // Create the new page component
      const pageComponent = await tx.pageComponent.create({
        data: {
          pageId: id,
          componentId: validatedData.componentId,
          order,
          isVisible: validatedData.isVisible,
          config: JSON.parse(
            JSON.stringify({
              ...(component.defaultConfig && typeof component.defaultConfig === 'object'
                ? component.defaultConfig
                : {}),
              ...validatedData.config,
            })
          ),
        },
        include: {
          component: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              description: true,
              configSchema: true,
              defaultConfig: true,
            },
          },
        },
      });

      return pageComponent;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Component added to page successfully',
        component: {
          id: result.id,
          componentId: result.componentId,
          type: component.name, // Use component from earlier query
          order: result.order,
          isVisible: result.isVisible,
          config: result.config,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding component to page:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to add component to page' }, { status: 500 });
  }
}

// =============================================================================
// PUT: UPDATE COMPONENT OR REORDER COMPONENTS
// =============================================================================

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const componentId = searchParams.get('componentId');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Handle reorder action
    if (action === 'reorder') {
      const validatedData = ReorderComponentsSchema.parse(body);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update each component's order
        for (let i = 0; i < validatedData.componentIds.length; i++) {
          await tx.pageComponent.updateMany({
            where: {
              pageId: id,
              id: validatedData.componentIds[i],
            },
            data: { order: i },
          });
        }

        // Return updated components
        return await tx.pageComponent.findMany({
          where: { pageId: id },
          include: {
            component: {
              select: {
                id: true,
                name: true,
                type: true,
                category: true,
                description: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        });
      });

      return NextResponse.json({
        success: true,
        message: 'Components reordered successfully',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: result.map((comp: any) => ({
          id: comp.id,
          componentId: comp.componentId,
          component: comp.component,
          order: comp.order,
          isVisible: comp.isVisible,
          config: comp.config,
          createdAt: comp.createdAt.toISOString(),
          updatedAt: comp.updatedAt.toISOString(),
        })),
      });
    }

    // Handle single component update
    if (!componentId) {
      return NextResponse.json({ error: 'Component ID is required for update' }, { status: 400 });
    }

    const validatedData = UpdateComponentSchema.parse(body);

    // Find the page component
    const existingComponent = await prisma.pageComponent.findFirst({
      where: {
        pageId: id,
        id: componentId,
      },
      include: {
        component: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingComponent) {
      return NextResponse.json({ error: 'Component not found on this page' }, { status: 404 });
    }

    // Update the component
    const updatedComponent = await prisma.pageComponent.update({
      where: { id: existingComponent.id },
      data: {
        order: validatedData.order ?? existingComponent.order,
        isVisible: validatedData.isVisible ?? existingComponent.isVisible,
        config: validatedData.config
          ? JSON.parse(JSON.stringify(validatedData.config))
          : existingComponent.config,
      },
      include: {
        component: {
          select: {
            id: true,
            name: true,
            type: true,
            category: true,
            description: true,
            configSchema: true,
            defaultConfig: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Component updated successfully',
      component: {
        id: updatedComponent.id,
        componentId: updatedComponent.componentId,
        type: existingComponent.component.name,
        order: updatedComponent.order,
        isVisible: updatedComponent.isVisible,
        config: updatedComponent.config,
        createdAt: updatedComponent.createdAt.toISOString(),
        updatedAt: updatedComponent.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating component:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update component' }, { status: 500 });
  }
}

// =============================================================================
// DELETE: REMOVE COMPONENT FROM PAGE
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const componentId = searchParams.get('componentId');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    if (!componentId) {
      return NextResponse.json({ error: 'Component ID is required' }, { status: 400 });
    }

    // Find the page component
    const existingComponent = await prisma.pageComponent.findFirst({
      where: {
        pageId: id,
        id: componentId,
      },
      select: { id: true, order: true },
    });

    if (!existingComponent) {
      return NextResponse.json({ error: 'Component not found on this page' }, { status: 404 });
    }

    // Delete the component and adjust orders
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete the component
      await tx.pageComponent.delete({
        where: { id: existingComponent.id },
      });

      // Shift remaining components down
      await tx.pageComponent.updateMany({
        where: {
          pageId: id,
          order: { gt: existingComponent.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Component removed from page successfully',
    });
  } catch (error) {
    console.error('Error removing component from page:', error);
    return NextResponse.json({ error: 'Failed to remove component from page' }, { status: 500 });
  }
}
