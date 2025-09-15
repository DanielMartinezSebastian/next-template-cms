/**
 * Bulk operations API for page management
 * Handles multiple page operations in a single request
 */

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, pageIds, data } = body;

    if (!action || !Array.isArray(pageIds) || pageIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: action and pageIds are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'bulk_delete':
        result = await handleBulkDelete(pageIds);
        break;
      case 'bulk_publish':
        result = await handleBulkPublish(pageIds, true);
        break;
      case 'bulk_unpublish':
        result = await handleBulkPublish(pageIds, false);
        break;
      case 'bulk_update':
        result = await handleBulkUpdate(pageIds, data);
        break;
      case 'bulk_move':
        result = await handleBulkMove(pageIds, data.parentId);
        break;
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleBulkDelete(pageIds: string[]) {
  const transaction = await prisma.$transaction(async tx => {
    // First, delete all page components
    await tx.pageComponent.deleteMany({
      where: { pageId: { in: pageIds } },
    });

    // Then, delete all page contents
    await tx.pageContent.deleteMany({
      where: { pageId: { in: pageIds } },
    });

    // Finally, delete the pages themselves
    const deletedPages = await tx.page.deleteMany({
      where: { id: { in: pageIds } },
    });

    return { deletedCount: deletedPages.count };
  });

  return {
    success: true,
    message: `${transaction.deletedCount} pages deleted successfully`,
    deletedCount: transaction.deletedCount,
  };
}

async function handleBulkPublish(pageIds: string[], isPublished: boolean) {
  const updatedContents = await prisma.pageContent.updateMany({
    where: { pageId: { in: pageIds } },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  return {
    success: true,
    message: `${updatedContents.count} pages ${isPublished ? 'published' : 'unpublished'} successfully`,
    updatedCount: updatedContents.count,
  };
}

async function handleBulkUpdate(pageIds: string[], updateData: Record<string, unknown>) {
  const validFields = ['template', 'isActive'];
  const filteredData = Object.keys(updateData)
    .filter(key => validFields.includes(key))
    .reduce(
      (obj, key) => {
        obj[key] = updateData[key];
        return obj;
      },
      {} as Record<string, unknown>
    );

  if (Object.keys(filteredData).length === 0) {
    return {
      success: false,
      message: 'No valid fields to update',
    };
  }

  const updatedPages = await prisma.page.updateMany({
    where: { id: { in: pageIds } },
    data: filteredData,
  });

  return {
    success: true,
    message: `${updatedPages.count} pages updated successfully`,
    updatedCount: updatedPages.count,
  };
}

async function handleBulkMove(pageIds: string[], newParentId: string | null) {
  const transaction = await prisma.$transaction(async tx => {
    const movedPages = [];

    for (const pageId of pageIds) {
      // Get the page to calculate new full path
      const page = await tx.page.findUnique({
        where: { id: pageId },
        select: { slug: true },
      });

      if (!page) continue;

      // Calculate new full path
      let newFullPath = `/${page.slug}`;
      let newLevel = 0;

      if (newParentId) {
        const parent = await tx.page.findUnique({
          where: { id: newParentId },
          select: { fullPath: true, level: true },
        });

        if (parent) {
          newFullPath = `${parent.fullPath}/${page.slug}`;
          newLevel = (parent.level || 0) + 1;
        }
      }

      // Update the page
      const updatedPage = await tx.page.update({
        where: { id: pageId },
        data: {
          parentId: newParentId,
          fullPath: newFullPath,
          level: newLevel,
        },
      });

      movedPages.push(updatedPage);
    }

    return movedPages;
  });

  return {
    success: true,
    message: `${transaction.length} pages moved successfully`,
    movedPages: transaction,
  };
}
