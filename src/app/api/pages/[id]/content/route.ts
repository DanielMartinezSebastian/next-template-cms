/**
 * Page Content Management API Route
 * Handles content operations for specific pages across locales
 */

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const UpdateContentSchema = z.object({
  locale: z.string().min(2, 'Locale must be at least 2 characters'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: z.record(z.any()).optional(),
  isPublished: z.boolean().optional(),
});

const CreateContentSchema = UpdateContentSchema;

// =============================================================================
// GET: FETCH PAGE CONTENT FOR ALL LOCALES
// =============================================================================

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

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

    // Build where clause for content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { pageId: id };
    if (locale) {
      whereClause.locale = { code: locale };
    }

    // Fetch page content for all or specific locale
    const contents = await prisma.pageContent.findMany({
      where: whereClause,
      include: {
        locale: {
          select: {
            code: true,
            name: true,
            isDefault: true,
          },
        },
      },
      orderBy: [{ locale: { isDefault: 'desc' } }, { locale: { code: 'asc' } }],
    });

    // Transform to API format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedContents = contents.map((content: any) => ({
      id: content.id,
      locale: content.locale.code,
      localeName: content.locale.name,
      isDefault: content.locale.isDefault,
      title: content.title,
      description: content.description,
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription,
      keywords: content.keywords,
      content: content.content,
      isPublished: content.isPublished,
      publishedAt: content.publishedAt?.toISOString(),
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        slug: page.slug,
        fullPath: page.fullPath,
      },
      contents: formattedContents,
      count: formattedContents.length,
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

// =============================================================================
// POST: CREATE CONTENT FOR NEW LOCALE
// =============================================================================

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = CreateContentSchema.parse(body);

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id, isActive: true },
      select: { id: true, slug: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get or create locale
    const locale = await prisma.locale.upsert({
      where: { code: validatedData.locale },
      update: {},
      create: {
        code: validatedData.locale,
        name: getLocaleName(validatedData.locale),
        isActive: true,
      },
    });

    // Check if content already exists for this locale
    const existingContent = await prisma.pageContent.findUnique({
      where: {
        pageId_localeId: {
          pageId: id,
          localeId: locale.id,
        },
      },
    });

    if (existingContent) {
      return NextResponse.json(
        { error: 'Content for this locale already exists' },
        { status: 409 }
      );
    }

    // Create new content
    const content = await prisma.pageContent.create({
      data: {
        pageId: id,
        localeId: locale.id,
        title: validatedData.title,
        description: validatedData.description || null,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        keywords: validatedData.keywords || [],
        content: validatedData.content ? JSON.parse(JSON.stringify(validatedData.content)) : {},
        isPublished: validatedData.isPublished || false,
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
      include: {
        locale: {
          select: {
            code: true,
            name: true,
            isDefault: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Content created successfully',
        content: {
          id: content.id,
          locale: content.locale.code,
          localeName: content.locale.name,
          isDefault: content.locale.isDefault,
          title: content.title,
          description: content.description,
          metaTitle: content.metaTitle,
          metaDescription: content.metaDescription,
          keywords: content.keywords,
          content: content.content,
          isPublished: content.isPublished,
          publishedAt: content.publishedAt?.toISOString(),
          createdAt: content.createdAt.toISOString(),
          updatedAt: content.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating page content:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create page content' }, { status: 500 });
  }
}

// =============================================================================
// PUT: UPDATE CONTENT FOR SPECIFIC LOCALE
// =============================================================================

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateContentSchema.parse(body);

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    // Get locale
    const locale = await prisma.locale.findUnique({
      where: { code: validatedData.locale },
    });

    if (!locale) {
      return NextResponse.json({ error: 'Locale not found' }, { status: 404 });
    }

    // Find existing content
    const existingContent = await prisma.pageContent.findUnique({
      where: {
        pageId_localeId: {
          pageId: id,
          localeId: locale.id,
        },
      },
    });

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found for this locale' }, { status: 404 });
    }

    // Update content
    const updatedContent = await prisma.pageContent.update({
      where: { id: existingContent.id },
      data: {
        title: validatedData.title,
        description: validatedData.description ?? existingContent.description,
        metaTitle: validatedData.metaTitle ?? existingContent.metaTitle,
        metaDescription: validatedData.metaDescription ?? existingContent.metaDescription,
        keywords: validatedData.keywords ?? existingContent.keywords,
        content: validatedData.content
          ? JSON.parse(JSON.stringify(validatedData.content))
          : existingContent.content,
        isPublished: validatedData.isPublished ?? existingContent.isPublished,
        publishedAt:
          validatedData.isPublished !== undefined
            ? validatedData.isPublished
              ? new Date()
              : null
            : existingContent.publishedAt,
      },
      include: {
        locale: {
          select: {
            code: true,
            name: true,
            isDefault: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content: {
        id: updatedContent.id,
        locale: updatedContent.locale.code,
        localeName: updatedContent.locale.name,
        isDefault: updatedContent.locale.isDefault,
        title: updatedContent.title,
        description: updatedContent.description,
        metaTitle: updatedContent.metaTitle,
        metaDescription: updatedContent.metaDescription,
        keywords: updatedContent.keywords,
        content: updatedContent.content,
        isPublished: updatedContent.isPublished,
        publishedAt: updatedContent.publishedAt?.toISOString(),
        createdAt: updatedContent.createdAt.toISOString(),
        updatedAt: updatedContent.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating page content:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
}

// =============================================================================
// DELETE: DELETE CONTENT FOR SPECIFIC LOCALE
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    if (!locale) {
      return NextResponse.json({ error: 'Locale parameter is required' }, { status: 400 });
    }

    // Get locale record
    const localeRecord = await prisma.locale.findUnique({
      where: { code: locale },
    });

    if (!localeRecord) {
      return NextResponse.json({ error: 'Locale not found' }, { status: 404 });
    }

    // Check if this is the only content for this page
    const contentCount = await prisma.pageContent.count({
      where: { pageId: id },
    });

    if (contentCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last content for a page' },
        { status: 400 }
      );
    }

    // Find and delete the content
    const deletedContent = await prisma.pageContent.deleteMany({
      where: {
        pageId: id,
        localeId: localeRecord.id,
      },
    });

    if (deletedContent.count === 0) {
      return NextResponse.json({ error: 'Content not found for this locale' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting page content:', error);
    return NextResponse.json({ error: 'Failed to delete page content' }, { status: 500 });
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
    pt: 'Português',
    ja: '日本語',
    ko: '한국어',
    zh: '中文',
    ru: 'Русский',
  };
  return localeNames[code] || code.toUpperCase();
}
