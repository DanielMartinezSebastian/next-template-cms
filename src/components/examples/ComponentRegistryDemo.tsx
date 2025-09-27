/**
 * Component Registry Demo
 * Interactive demonstration of the withEditable system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Import our editable components
import EditableButton from '@/components/dynamic/components/EditableButton';
import ButtonMigrated from '@/components/dynamic/components/ButtonMigrated';

// =============================================================================
// DEMO COMPONENT
// =============================================================================

export default function ComponentRegistryDemo() {
  const [registryStats, setRegistryStats] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // =============================================================================
  // API CALLS
  // =============================================================================

  const fetchRegistryStats = async () => {
    try {
      const response = await fetch('/api/components?source=registry');
      const data = await response.json();
      setRegistryStats(data);
    } catch (error) {
      console.error('Failed to fetch registry stats:', error);
    }
  };

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/components/sync');
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  const performSync = async (direction: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/components/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchRegistryStats();
        await fetchSyncStatus();
        console.log('Sync completed:', data);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    // Fetch initial data
    fetchRegistryStats();
    fetchSyncStatus();
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="space-y-8">
      {/* Live Component Examples */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Live Component Examples
        </h2>
        <p className="text-muted-foreground mb-6">
          These components are automatically registered when they render for the first time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">EditableButton</h3>
            <p className="text-sm text-muted-foreground">
              New component built from scratch with the withEditable system.
            </p>
            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">
              <EditableButton />
            </div>
            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">
              <EditableButton 
                text="Custom Text" 
                variant="destructive" 
                fullWidth={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">ButtonMigrated</h3>
            <p className="text-sm text-muted-foreground">
              Existing component migrated to the new system.
            </p>
            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">
              <ButtonMigrated />
            </div>
            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">
              <ButtonMigrated 
                text="Migrated Button" 
                variant="outline" 
                centerAlign={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Registry Statistics */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Registry Statistics
        </h2>
        
        {registryStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {registryStats.total || 0}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Components Registered
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {registryStats.stats?.registry?.categories ? 
                  Object.keys(registryStats.stats.registry.categories).length : 0}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Categories
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {registryStats.data?.length || 0}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Available Components
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Loading registry statistics...
          </div>
        )}

        {registryStats?.data && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Registered Components:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {registryStats.data.map((component: any) => (
                <div key={component.name} className="flex items-center gap-3 p-3 bg-muted rounded">
                  <span className="text-lg">{component.icon || '📦'}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{component.displayName || component.name}</div>
                    <div className="text-xs text-muted-foreground">{component.category}</div>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    v{component.version || '1.0.0'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sync Controls */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Database Synchronization
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Sync Status</h3>
            {syncStatus ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Registry Status:</span>
                  <span className="text-green-600 dark:text-green-400">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Status:</span>
                  <span className={syncStatus.database?.connected 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"}>
                    {syncStatus.database?.connected ? '✓ Connected' : '✗ Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Components in Registry:</span>
                  <span>{syncStatus.registry?.stats?.total || 0}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Loading sync status...</div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Sync Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('to-database')}
                disabled={loading}
                className="w-full justify-start"
              >
                📤 Sync to Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('from-database')}
                disabled={loading}
                className="w-full justify-start"
              >
                📥 Sync from Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('bidirectional')}
                disabled={loading}
                className="w-full justify-start"
              >
                🔄 Bidirectional Sync
              </Button>
            </div>
          </div>
        </div>

        {syncStatus?.recommendations && syncStatus.recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              Recommendations
            </h4>
            <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
              {syncStatus.recommendations.map((rec: any, index: number) => (
                <li key={index}>• {rec.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* API Documentation */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          API Endpoints
        </h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">GET /api/components</code>
            <p className="text-muted-foreground ml-4 mt-1">
              List all registered components with filtering and search
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">GET /api/components/[name]</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Get detailed information about a specific component
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">POST /api/components/sync</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Synchronize components between registry and database
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">PUT /api/components/[name]</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Update component custom properties with validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}