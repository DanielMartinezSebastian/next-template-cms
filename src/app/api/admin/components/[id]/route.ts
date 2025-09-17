/**
 * API endpoint for updating component configurations
 * PUT /api/admin/components/[id] - Update component default configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDbClient, isDatabaseAvailable } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { defaultConfig } = body;
    const { id: componentId } = await params;

    if (!defaultConfig) {
      return NextResponse.json(
        { success: false, error: 'defaultConfig is required' },
        { status: 400 }
      );
    }

    const db = getDbClient();
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable && db.component && typeof db.component.update === 'function') {
      // Update in real database
      const updatedComponent = await db.component.update({
        where: { id: componentId },
        data: {
          defaultConfig: defaultConfig,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Updated component ${updatedComponent.name} in PostgreSQL database`);

      return NextResponse.json({
        success: true,
        component: updatedComponent,
        source: 'postgresql'
      });
    } else {
      // Mock database update (for development)
      console.log(`✅ Updated component ${componentId} in mock database`, defaultConfig);
      
      return NextResponse.json({
        success: true,
        component: {
          id: componentId,
          defaultConfig: defaultConfig,
          updatedAt: new Date().toISOString(),
        },
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('❌ Error updating component:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update component' },
      { status: 500 }
    );
  }
}