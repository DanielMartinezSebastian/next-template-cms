import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseAvailable, isPagesTableAvailable, getDbClient } from '@/lib/db';
import { shouldUseMock } from '@/lib/mock-db';

export interface DatabaseStatus {
  isConnected: boolean;
  type: 'mock' | 'postgresql';
  tablesAvailable: {
    pages: boolean;
    components: boolean;
    translations: boolean;
  };
  connectionDetails: {
    host?: string;
    database?: string;
    status: 'connected' | 'disconnected' | 'error';
  };
  lastChecked: string;
  metrics: {
    totalPages: number;
    totalComponents: number;
    activeTranslations: number;
  };
}

/**
 * GET /api/admin/database-status
 * 
 * Returns comprehensive database status information for the admin panel
 */
export async function GET(request: NextRequest) {
  try {
    const isMock = shouldUseMock();
    const isDbAvailable = await isDatabaseAvailable();
    const isPagesAvailable = await isPagesTableAvailable();
    
    // Get database client (mock or real)
    const dbClient = getDbClient();
    
    // Get metrics
    let totalPages = 0;
    let totalComponents = 0;
    let activeTranslations = 0;
    
    try {
      // Count pages
      totalPages = await dbClient.page.count();
      
      // Count components
      totalComponents = await dbClient.component.count();
      
      // For translations, we'll use a simple count since mock doesn't have translations table
      if (!isMock) {
        // Real database - count translations if available
        try {
          activeTranslations = await (dbClient as any).translation?.count() || 0;
        } catch {
          activeTranslations = 0;
        }
      } else {
        // Mock database - estimate based on configured translations
        activeTranslations = 16; // Based on seed data
      }
    } catch (error) {
      console.warn('Error getting database metrics:', error);
    }
    
    const status: DatabaseStatus = {
      isConnected: isDbAvailable,
      type: isMock ? 'mock' : 'postgresql',
      tablesAvailable: {
        pages: isPagesAvailable,
        components: isDbAvailable, // Assume components table exists if db is available
        translations: !isMock && isDbAvailable, // Only real DB has translations table
      },
      connectionDetails: {
        host: isMock ? 'localhost (mock)' : process.env.DATABASE_URL?.split('@')[1]?.split('/')[0],
        database: isMock ? 'mock-database' : process.env.DATABASE_URL?.split('/').pop(),
        status: isDbAvailable ? 'connected' : 'disconnected',
      },
      lastChecked: new Date().toISOString(),
      metrics: {
        totalPages,
        totalComponents,
        activeTranslations,
      },
    };
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking database status:', error);
    
    const errorStatus: DatabaseStatus = {
      isConnected: false,
      type: shouldUseMock() ? 'mock' : 'postgresql',
      tablesAvailable: {
        pages: false,
        components: false,
        translations: false,
      },
      connectionDetails: {
        status: 'error',
      },
      lastChecked: new Date().toISOString(),
      metrics: {
        totalPages: 0,
        totalComponents: 0,
        activeTranslations: 0,
      },
    };
    
    return NextResponse.json(errorStatus, { status: 500 });
  }
}