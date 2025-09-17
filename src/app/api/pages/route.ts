/**
 * Main Pages API Route
 * Handles GET (list all pages) and POST (create new page) operations
 */

import { getDbClient } from '@/lib/db';
import { PageJsonConfig } from '@/types/pages';
import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const CreatePageSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  locale: z.string().min(2, 'Locale must be at least 2 characters'),
  parentId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  template: z.string().optional(),
  order: z.number().int().min(0).optional().default(0),
});

const ListPagesQuerySchema = z.object({
  locale: z.string().optional(),
  parentId: z.string().optional(),
  isPublished: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

// =============================================================================
// GET: LIST PAGES
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = ListPagesQuerySchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: Record<string, any> = {
      isActive: true,
    };

    // Filter by parent
    if (query.parentId === 'null' || query.parentId === '') {
      whereClause.parentId = null;
    } else if (query.parentId) {
      whereClause.parentId = query.parentId;
    }

    // Filter by published status
    if (query.isPublished) {
      whereClause.contents = {
        some: {
          isPublished: query.isPublished === 'true',
        },
      };
    }

    // Filter by locale
    if (query.locale) {
      whereClause.contents = {
        some: {
          ...whereClause.contents?.some,
          locale: {
            code: query.locale,
          },
        },
      };
    }

    // Search functionality
    if (query.search) {
      whereClause.contents = {
        some: {
          ...whereClause.contents?.some,
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      };
    }

    // Pagination
    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    const offset = query.offset ? parseInt(query.offset, 10) : 0;

    // Get database client (real or mock)
    const db = getDbClient();

    // Fetch pages with all relations
    const pages = await db.page.findMany({
      where: whereClause,
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
          },
        },
        children: {
          select: {
            id: true,
            slug: true,
            fullPath: true,
            level: true,
          },
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ level: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await db.page.count({ where: whereClause });

    // Transform to API format
    const formattedPages: PageJsonConfig[] = pages.map(transformPrismaPageToApi);

    return NextResponse.json({
      success: true,
      pages: formattedPages,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching pages:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// =============================================================================
// POST: CREATE PAGE
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreatePageSchema.parse(body);
    const prisma = getDbClient();

    // Calculate full path and level
    let fullPath = `/${validatedData.slug}`;
    let level = 0;

    if (validatedData.parentId) {
      const parent = await prisma.page.findUnique({
        where: { id: validatedData.parentId },
        select: { fullPath: true, level: true, isActive: true },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent page not found' }, { status: 404 });
      }

      if (!parent.isActive) {
        return NextResponse.json({ error: 'Parent page is not active' }, { status: 400 });
      }

      fullPath = `${parent.fullPath}/${validatedData.slug}`;
      level = (parent.level || 0) + 1;
    }

    // Check if full path already exists
    const existingPage = await prisma.page.findFirst({
      where: { fullPath, isActive: true },
    });

    if (existingPage) {
      return NextResponse.json({ error: 'A page with this path already exists' }, { status: 409 });
    }

    // Get or create locale
    const localeRecord = await prisma.locale.upsert({
      where: { code: validatedData.locale },
      update: {},
      create: {
        code: validatedData.locale,
        name: getLocaleName(validatedData.locale),
        isActive: true,
      },
    });

    // Create page with content in transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the page
      const page = await tx.page.create({
        data: {
          slug: validatedData.slug,
          parentId: validatedData.parentId || null,
          fullPath,
          level,
          order: validatedData.order,
          template: validatedData.template || null,
          routeType: 'dynamic',
          isActive: true,
        },
      });

      // Create the page content
      await tx.pageContent.create({
        data: {
          pageId: page.id,
          localeId: localeRecord.id,
          title: validatedData.title,
          description: validatedData.description || null,
          content: {},
          isPublished: false,
        },
      });

      // Return the complete page with relations
      return await tx.page.findUnique({
        where: { id: page.id },
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
            },
          },
          children: {
            select: {
              id: true,
              slug: true,
              fullPath: true,
              level: true,
            },
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    if (!result) {
      throw new Error('Failed to create page');
    }

    // Transform to API format
    const formattedPage = transformPrismaPageToApi(result);

    return NextResponse.json(
      {
        success: true,
        message: 'Page created successfully',
        page: formattedPage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating page:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getLocaleName(code: string): string {
  const localeNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
  };
  return localeNames[code] || code.toUpperCase();
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
      type: comp.component.name.toLowerCase().replace(/\s+/g, '-'), // Convert "Hero Section" -> "hero-section"
      props: (comp.config as Record<string, unknown>) || {},
      order: comp.order,
      isVisible: comp.isVisible,
    })),
    template: page.template || undefined,
    isPublished: primaryContent?.isPublished || false,
    publishedAt: primaryContent?.publishedAt?.toISOString(),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}
