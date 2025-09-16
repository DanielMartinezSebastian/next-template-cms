/**
 * API Route: Components
 * GET /api/components - Get all available components from database
 */

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get components from database
    const components = await prisma.component.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
        description: true,
        configSchema: true,
        defaultConfig: true,
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Transform to match the editor's expected format
    const transformedComponents = components.map(component => ({
      id: component.id,
      type: component.name.toLowerCase().replace(/\s+/g, '-'), // Convert "Hero Section" -> "hero-section"
      name: component.name,
      description: component.description || '',
      category: component.category || 'general',
      defaultProps: component.defaultConfig || {},
      configSchema: component.configSchema || {},
    }));

    return NextResponse.json({
      success: true,
      components: transformedComponents,
      total: components.length,
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch components',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
