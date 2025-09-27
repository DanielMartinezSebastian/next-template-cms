/**
 * Component Registry Sync API
 * Handles synchronization between component registry and database
 */

import { NextRequest, NextResponse } from 'next/server';
import { componentRegistry } from '@/lib/component-registry';

// =============================================================================
// POST - Sync components between registry and database
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { direction = 'to-database', force = false } = body;

    const results: any = {
      success: true,
      direction,
      timestamp: new Date().toISOString(),
      stats: {
        before: componentRegistry.getStats(),
      },
    };

    switch (direction) {
      case 'to-database':
        // Sync from registry to database
        console.log('[API] Syncing components from registry to database...');
        await componentDatabaseSync.syncToDatabase();
        results.message = 'Components synced from registry to database successfully';
        break;

      case 'from-database':
        // Sync from database to registry
        console.log('[API] Syncing components from database to registry...');
        await componentDatabaseSync.syncFromDatabase();
        results.message = 'Components synced from database to registry successfully';
        break;

      case 'bidirectional':
        // Sync both ways (merge)
        console.log('[API] Performing bidirectional sync...');
        await componentDatabaseSync.syncFromDatabase();
        await componentDatabaseSync.syncToDatabase();
        results.message = 'Bidirectional sync completed successfully';
        break;

      case 'cleanup':
        // Clean up unused components
        console.log('[API] Cleaning up unused components...');
        await componentDatabaseSync.cleanup();
        results.message = 'Cleanup completed successfully';
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown sync direction: ${direction}`,
            availableDirections: ['to-database', 'from-database', 'bidirectional', 'cleanup'],
          },
          { status: 400 }
        );
    }

    // Add final stats
    results.stats.after = componentRegistry.getStats();
    results.stats.changes = {
      componentCount: results.stats.after.total - results.stats.before.total,
      lastUpdate: results.stats.after.lastUpdate,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API] Component sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Component sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        direction: request.body ? (await request.json()).direction : 'unknown',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Get sync status and statistics
// =============================================================================

export async function GET() {
  try {
    const registryStats = componentRegistry.getStats();
    
    // Try to get database stats
    let databaseStats = null;
    try {
      await componentDatabaseSync.initialize();
      // Database stats would go here - for now, we'll use a placeholder
      databaseStats = {
        connected: true,
        lastSync: new Date(), // This would be tracked in a real implementation
      };
    } catch (error) {
      databaseStats = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    const syncStatus = {
      success: true,
      timestamp: new Date().toISOString(),
      registry: {
        initialized: true,
        stats: registryStats,
      },
      database: databaseStats,
      recommendations: [],
    };

    // Add recommendations based on status
    if (!databaseStats?.connected) {
      syncStatus.recommendations.push({
        type: 'warning',
        message: 'Database is not available. Components will only be stored in memory.',
        action: 'Check database connection',
      });
    }

    if (registryStats.total === 0) {
      syncStatus.recommendations.push({
        type: 'info',
        message: 'No components registered yet. Import components to get started.',
        action: 'Register components using withEditable HOC',
      });
    }

    return NextResponse.json(syncStatus);
  } catch (error) {
    console.error('[API] Failed to get sync status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get sync status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}