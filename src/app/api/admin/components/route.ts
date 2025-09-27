import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Components API called - checking database type...');
    
    const dbClient = getDbClient();
    
    // Force database connection check
    const components = await dbClient.component.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    
    console.log(`✅ Found ${components.length} components from database`);
    
    return NextResponse.json({
      success: true,
      components,
      source: process.env.DATABASE_URL ? 'postgresql' : 'mock',
      count: components.length
    });
    
  } catch (error) {
    console.error('❌ Error loading components:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load components',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
