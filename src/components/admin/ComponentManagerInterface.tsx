/**
 * Component Manager Interface
 * New interface for managing components with the withEditable system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// =============================================================================
// TYPES
// =============================================================================

interface ComponentData {
  name: string;
  displayName?: string;
  description?: string;
  category: string;
  icon?: string;
  tags?: string[];
  version?: string;
  defaultProps: any;
  customProps?: any;
  mergedProps?: any;
  editorConfig?: any;
  source: 'registry' | 'database' | 'hybrid';
  registeredAt?: string;
  updatedAt?: string;
}

interface ComponentStats {
  registry: {
    total: number;
    categories: Record<string, number>;
    lastUpdate: string | null;
  };
  source: string;
  filters: {
    category: string | null;
    search: string | null;
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ComponentManagerInterface() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [stats, setStats] = useState<ComponentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

  // =============================================================================
  // DATA FETCHING
  // =============================================================================

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        source: 'hybrid',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });

      const response = await fetch(`/api/components?${params}`);
      const data = await response.json();

      if (data.success) {
        setComponents(data.data || []);
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to load components');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const syncComponents = async (direction: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/components/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchComponents(); // Refresh data
        console.log('Sync completed:', data.message);
      } else {
        setError(data.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    fetchComponents();
  }, [searchQuery, selectedCategory]);

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const categories = stats?.registry.categories ? Object.keys(stats.registry.categories) : [];
  const filteredComponents = components.filter(component => {
    const matchesSearch = !searchQuery || 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getComponentIcon = (component: ComponentData) => {
    return component.icon || '📦';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  if (loading && components.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
        <h3 className="font-medium text-destructive">Error Loading Components</h3>
        <p className="mt-1 text-sm text-destructive/80">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={fetchComponents}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium text-card-foreground">Total Components</h3>
            <p className="text-2xl font-bold text-primary">{stats.registry.total}</p>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium text-card-foreground">Categories</h3>
            <p className="text-2xl font-bold text-primary">{categories.length}</p>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-medium text-card-foreground">Last Update</h3>
            <p className="text-sm font-medium text-card-foreground">
              {stats.registry.lastUpdate ? formatDate(stats.registry.lastUpdate) : 'Never'}
            </p>
            <p className="text-xs text-muted-foreground">Registry modified</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-64"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncComponents('to-database')}
            disabled={loading}
          >
            Sync to DB
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncComponents('from-database')}
            disabled={loading}
          >
            Sync from DB
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchComponents}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Components List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComponents.map((component) => (
          <div
            key={component.name}
            className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedComponent(component)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getComponentIcon(component)}</span>
                <div>
                  <h3 className="font-medium text-card-foreground">
                    {component.displayName || component.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{component.category}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                component.source === 'registry' 
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : component.source === 'database'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
              }`}>
                {component.source}
              </span>
            </div>

            {component.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {component.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mb-3">
              {component.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {component.tags && component.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{component.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>v{component.version || '1.0.0'}</span>
              <span>Updated {formatDate(component.updatedAt)}</span>
            </div>

            {component.customProps && Object.keys(component.customProps).length > 0 && (
              <div className="mt-2 pt-2 border-t border-border">
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  ⚙️ Has custom props
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredComponents.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No components found matching your criteria.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Component Details Modal (simplified for now) */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-card-foreground">
                    {selectedComponent.displayName || selectedComponent.name}
                  </h2>
                  <p className="text-muted-foreground">{selectedComponent.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedComponent(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Default Props</h3>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(selectedComponent.defaultProps, null, 2)}
                  </pre>
                </div>

                {selectedComponent.customProps && Object.keys(selectedComponent.customProps).length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Custom Props</h3>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                      {JSON.stringify(selectedComponent.customProps, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="outline">
                    Edit Props
                  </Button>
                  <Button size="sm" variant="outline">
                    Reset to Defaults
                  </Button>
                  <Button size="sm" variant="outline">
                    View Schema
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}