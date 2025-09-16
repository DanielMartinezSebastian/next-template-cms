/**
 * Individual Page API Route
 * Handles GET, PUT, DELETE operations for specific pages
 */

import { prisma } from '@/lib/db';
import { PageJsonConfig } from '@/types/pages';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const UpdatePageSchema = z.object({
  slug: z.string().min(1).optional(),
  parentId: z.string().nullable().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  template: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  content: z.record(z.unknown()).optional(),
});

// =============================================================================
// GET: FETCH SINGLE PAGE
// =============================================================================

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: { id, isActive: true },
      include: {
        contents: {
          include: {
            locale: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
        components: {
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
          orderBy: {
            order: 'asc',
          },
        },
        parent: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
            level: true,
          },
        },
        children: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
            level: true,
            order: true,
          },
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Transform to API format
    const formattedPage = transformPrismaPageToApi(page);

    return NextResponse.json({
      success: true,
      page: formattedPage,
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// =============================================================================
// PUT: UPDATE PAGE
// =============================================================================

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdatePageSchema.parse(body);

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        slug: true,
        fullPath: true,
        level: true,
        parentId: true,
        contents: {
          select: {
            id: true,
            localeId: true,
          },
        },
      },
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Handle hierarchy changes (slug or parent change)
      if (validatedData.slug || validatedData.parentId !== undefined) {
        const newSlug = validatedData.slug || existingPage.slug;
        const newParentId = validatedData.parentId;

        // Calculate new full path and level
        let newFullPath = `/${newSlug}`;
        let newLevel = 0;

        if (newParentId) {
          const parent = await tx.page.findUnique({
            where: { id: newParentId, isActive: true },
            select: { fullPath: true, level: true },
          });

          if (!parent) {
            throw new Error('Parent page not found or inactive');
          }

          newFullPath = `${parent.fullPath}/${newSlug}`;
          newLevel = (parent.level || 0) + 1;
        }

        // Check for path conflicts (excluding current page)
        if (newFullPath !== existingPage.fullPath) {
          const conflictingPage = await tx.page.findFirst({
            where: {
              fullPath: newFullPath,
              isActive: true,
              id: { not: id },
            },
          });

          if (conflictingPage) {
            throw new Error('A page with this path already exists');
          }
        }

        // Update page hierarchy
        await updatePageHierarchy(tx, id, newParentId, newFullPath, newLevel, newSlug);
      }

      // Update page fields
      const pageUpdateData: Prisma.PageUpdateInput = {};
      if (validatedData.template !== undefined) pageUpdateData.template = validatedData.template;
      if (validatedData.order !== undefined) pageUpdateData.order = validatedData.order;

      if (Object.keys(pageUpdateData).length > 0) {
        await tx.page.update({
          where: { id },
          data: pageUpdateData,
        });
      }

      // Update page content
      const contentUpdateData: Record<string, unknown> = {};
      if (validatedData.title) contentUpdateData.title = validatedData.title;
      if (validatedData.description !== undefined)
        contentUpdateData.description = validatedData.description;
      if (validatedData.metaTitle !== undefined)
        contentUpdateData.metaTitle = validatedData.metaTitle;
      if (validatedData.metaDescription !== undefined)
        contentUpdateData.metaDescription = validatedData.metaDescription;
      if (validatedData.keywords) contentUpdateData.keywords = validatedData.keywords;
      if (validatedData.isPublished !== undefined) {
        contentUpdateData.isPublished = validatedData.isPublished;
        contentUpdateData.publishedAt = validatedData.isPublished ? new Date() : null;
      }
      if (validatedData.content) contentUpdateData.content = validatedData.content;

      if (Object.keys(contentUpdateData).length > 0) {
        // Update content for the primary locale
        const primaryContent = existingPage.contents[0];
        if (primaryContent) {
          await tx.pageContent.update({
            where: { id: primaryContent.id },
            data: contentUpdateData,
          });
        }
      }

      // Return updated page with all relations
      return await tx.page.findUnique({
        where: { id },
        include: {
          contents: {
            include: {
              locale: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
          components: {
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
            orderBy: {
              order: 'asc',
            },
          },
          parent: {
            select: {
              id: true,
              slug: true,
              fullPath: true,
              level: true,
            },
          },
          children: {
            select: {
              id: true,
              slug: true,
              fullPath: true,
              level: true,
              order: true,
            },
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    if (!result) {
      throw new Error('Failed to update page');
    }

    const formattedPage = transformPrismaPageToApi(result);

    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      page: formattedPage,
    });
  } catch (error) {
    console.error('Error updating page:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// =============================================================================
// DELETE: SOFT DELETE PAGE
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Check if page exists and has children
    const page = await prisma.page.findUnique({
      where: { id, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (page.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete page with active children. Delete children first.' },
        { status: 400 }
      );
    }

    // Soft delete the page (set isActive to false)
    await prisma.page.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

async function updatePageHierarchy(
  tx: Prisma.TransactionClient,
  pageId: string,
  newParentId: string | null | undefined,
  newFullPath: string,
  newLevel: number,
  newSlug: string
) {
  // Update the page itself
  await tx.page.update({
    where: { id: pageId },
    data: {
      slug: newSlug,
      parentId: newParentId || null,
      fullPath: newFullPath,
      level: newLevel,
    },
  });

  // Get the old page data to update descendants
  const oldPage = await tx.page.findUnique({
    where: { id: pageId },
    select: { fullPath: true },
  });

  if (!oldPage) return;

  // Get all descendant pages
  const descendants = await tx.page.findMany({
    where: {
      fullPath: {
        startsWith: `${oldPage.fullPath}/`,
      },
      isActive: true,
    },
    orderBy: { level: 'asc' },
  });

  // Update each descendant's path and level
  for (const descendant of descendants) {
    const relativePath = descendant.fullPath.replace(`${oldPage.fullPath}/`, '');
    const newDescendantPath = `${newFullPath}/${relativePath}`;
    const newDescendantLevel = newLevel + newDescendantPath.split('/').length - 1;

    await tx.page.update({
      where: { id: descendant.id },
      data: {
        fullPath: newDescendantPath,
        level: newDescendantLevel,
      },
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPrismaPageToApi(page: any): PageJsonConfig {
  // Get the first content (primary locale content)
  const primaryContent = page.contents[0];

  return {
    id: page.id,
    slug: page.slug,
    locale: primaryContent?.locale.code || 'en',
    hierarchy: {
      id: page.id,
      slug: page.slug,
      fullPath: page.fullPath,
      level: page.level,
      order: page.order,
      parentId: page.parentId || undefined,
    },
    meta: {
      title: primaryContent?.title || page.slug,
      description: primaryContent?.description || undefined,
      metaTitle: primaryContent?.metaTitle || undefined,
      metaDescription: primaryContent?.metaDescription || undefined,
      keywords: primaryContent?.keywords || [],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: page.components.map((comp: any) => ({
      id: comp.id,
      type: comp.component.name,
      props: (comp.config as Record<string, unknown>) || {},
      order: comp.order,
      isVisible: comp.isVisible,
    })),
    template: page.template || undefined,
    isPublished: primaryContent?.isPublished || false,
    publishedAt: primaryContent?.publishedAt?.toISOString(),
    content: (primaryContent?.content as Record<string, unknown>) || null, // Include Lexical JSON content
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}
