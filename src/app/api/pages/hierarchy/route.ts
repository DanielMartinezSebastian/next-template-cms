/**
 * Hierarchical pages API
 * Handles CRUD operations for pages with parent-child relationships
 */

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const locale = searchParams.get('locale');

    const whereClause: Record<string, unknown> = {
      isActive: true,
    };

    if (parentId === 'null' || parentId === '') {
      whereClause.parentId = null;
    } else if (parentId) {
      whereClause.parentId = parentId;
    }

    if (locale) {
      whereClause.contents = {
        some: {
          locale: {
            code: locale,
          },
        },
      };
    }

    const pages = await prisma.page.findMany({
      where: whereClause,
      include: {
        contents: {
          include: {
            locale: true,
          },
        },
        components: true,
        parent: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
          },
        },
        children: includeChildren
          ? {
              include: {
                contents: {
                  include: {
                    locale: true,
                  },
                },
              },
            }
          : false,
      },
      orderBy: [{ level: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      pages,
      count: pages.length,
    });
  } catch (error) {
    console.error('Error fetching hierarchical pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, parentId, locale, title, description, template, order = 0 } = body;

    if (!slug || !locale || !title) {
      return NextResponse.json({ error: 'slug, locale, and title are required' }, { status: 400 });
    }

    // Calculate full path and level
    let fullPath = `/${slug}`;
    let level = 0;

    if (parentId) {
      const parent = await prisma.page.findUnique({
        where: { id: parentId },
        select: { fullPath: true, level: true },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent page not found' }, { status: 404 });
      }

      fullPath = `${parent.fullPath}/${slug}`;
      level = (parent.level || 0) + 1;
    }

    // Check if full path already exists
    const existingPage = await prisma.page.findFirst({
      where: { fullPath },
    });

    if (existingPage) {
      return NextResponse.json({ error: 'A page with this path already exists' }, { status: 409 });
    }

    // Get or create locale
    const localeRecord = await prisma.locale.upsert({
      where: { code: locale },
      update: {},
      create: {
        code: locale,
        name: locale === 'en' ? 'English' : locale === 'es' ? 'Español' : locale,
        isActive: true,
      },
    });

    // Create page with content in transaction
    const result = await prisma.$transaction(async tx => {
      const page = await tx.page.create({
        data: {
          slug,
          parentId,
          fullPath,
          level,
          order,
          template: template || null,
          isActive: true,
        },
      });

      const content = await tx.pageContent.create({
        data: {
          pageId: page.id,
          localeId: localeRecord.id,
          title,
          description: description || null,
          content: {},
          isPublished: false,
        },
      });

      return { page, content };
    });

    return NextResponse.json({
      success: true,
      message: 'Page created successfully',
      page: result.page,
      content: result.content,
    });
  } catch (error) {
    console.error('Error creating hierarchical page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, updates } = body;

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Handle parent change (moving page in hierarchy)
    if ('parentId' in updates) {
      const newParentId = updates.parentId;
      let newFullPath = `/${page.slug}`;
      let newLevel = 0;

      if (newParentId) {
        const parent = await prisma.page.findUnique({
          where: { id: newParentId },
          select: { fullPath: true, level: true },
        });

        if (!parent) {
          return NextResponse.json({ error: 'Parent page not found' }, { status: 404 });
        }

        newFullPath = `${parent.fullPath}/${page.slug}`;
        newLevel = (parent.level || 0) + 1;
      }

      // Update page and all descendants
      await updatePageHierarchy(pageId, newParentId, newFullPath, newLevel);
    } else {
      // Simple update
      await prisma.page.update({
        where: { id: pageId },
        data: updates,
      });
    }

    // Get updated page
    const updatedPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        contents: {
          include: {
            locale: true,
          },
        },
        parent: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
          },
        },
        children: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      page: updatedPage,
    });
  } catch (error) {
    console.error('Error updating hierarchical page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

async function updatePageHierarchy(
  pageId: string,
  newParentId: string | null,
  newFullPath: string,
  newLevel: number
) {
  await prisma.$transaction(async tx => {
    // Update the page itself
    await tx.page.update({
      where: { id: pageId },
      data: {
        parentId: newParentId,
        fullPath: newFullPath,
        level: newLevel,
      },
    });

    // Get all descendant pages
    const descendants = await tx.page.findMany({
      where: {
        fullPath: {
          startsWith: `${newFullPath}/`,
        },
      },
      orderBy: { level: 'asc' },
    });

    // Update each descendant's level
    for (const descendant of descendants) {
      const descendantLevel = newLevel + (descendant.fullPath?.split('/').length || 1) - 1;

      await tx.page.update({
        where: { id: descendant.id },
        data: {
          level: descendantLevel,
        },
      });
    }
  });
}
