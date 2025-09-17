'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ComponentInfo {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  defaultConfig: Record<string, unknown>;
  configSchema?: Record<string, unknown>;
  isActive?: boolean;
}

export function ComponentsManager() {
  const t = useTranslations('Admin');
  const [components, setComponents] = useState<ComponentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [modalMode, setModalMode] = useState<'schema' | 'preview' | null>(null);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      setIsLoading(true);
      
      // Use API endpoint to load components
      const response = await fetch('/api/admin/components');
      const data = await response.json();
      
      if (data.success) {
        setComponents(data.components);
        console.log(`✅ Loaded ${data.count} components from ${data.source} database`);
      } else {
        console.error('❌ Failed to load components:', data.error);
        setComponents([]);
      }
    } catch (error) {
      console.error('❌ Error loading components:', error);
      setComponents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search components
  const filteredComponents = useMemo(() => {
    let result = [...components];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(component => component.category === selectedCategory);
    }

    // Search by name, type, and description
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        component =>
          component.name.toLowerCase().includes(term) ||
          component.type.toLowerCase().includes(term) ||
          component.description?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [components, selectedCategory, searchTerm]);

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(components.map(component => component.category));
    return Array.from(categorySet).sort();
  }, [components]);

  const renderComponentCard = (component: ComponentInfo) => {
    const defaultProps = component.defaultConfig || {};
    const propsPreview = Object.entries(defaultProps)
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${typeof value === 'string' ? value.slice(0, 20) : String(value)}`)
      .join(', ');

    return (
      <div
        key={component.id}
        className="bg-card border-border hover:shadow-md rounded-lg border p-4 transition-shadow"
      >
        {/* Component Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-foreground mb-1 font-semibold">{component.name}</h3>
            <p className="text-muted-foreground text-sm">
              <span className="font-mono text-xs">{component.type}</span>
            </p>
          </div>
          <div className="ml-2">
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
              {component.category}
            </span>
          </div>
        </div>

        {/* Component Description */}
        {component.description && (
          <p className="text-muted-foreground mb-3 text-sm">{component.description}</p>
        )}

        {/* Props Preview */}
        <div className="mb-3">
          <h4 className="text-foreground mb-1 text-xs font-medium">Props por defecto:</h4>
          <div className="bg-muted text-muted-foreground rounded border p-2 text-xs font-mono">
            {propsPreview || 'Sin props configuradas'}
          </div>
        </div>

        {/* Component Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              setSelectedComponent(component);
              setModalMode('schema');
            }}
          >
            Ver Esquema
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              setSelectedComponent(component);
              setModalMode('preview');
            }}
          >
            Previsualizar
          </Button>
        </div>

        {/* Schema indicator */}
        {component.configSchema && (
          <div className="mt-2 text-xs text-green-600">
            ✓ Esquema de configuración disponible
          </div>
        )}
      </div>
    );
  };

  const renderComponentListItem = (component: ComponentInfo) => {
    return (
      <div
        key={component.id}
        className="bg-card border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-foreground font-semibold">{component.name}</h3>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                {component.category}
              </span>
              <span className="text-muted-foreground font-mono text-xs">{component.type}</span>
            </div>
            {component.description && (
              <p className="text-muted-foreground mt-1 text-sm">{component.description}</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Props: {Object.keys(component.defaultConfig || {}).length} configuradas
              {component.configSchema && ' • Schema disponible'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedComponent(component);
                setModalMode('schema');
              }}
            >
              Ver Esquema
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedComponent(component);
                setModalMode('preview');
              }}
            >
              Previsualizar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-foreground mb-2 text-2xl font-bold">Gestión de Componentes</h1>
          <p className="text-muted-foreground">Cargando componentes disponibles...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border-border h-48 animate-pulse rounded-lg border"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-foreground mb-2 text-2xl font-bold">Gestión de Componentes</h1>
        <p className="text-muted-foreground">
          Explora y configura los {components.length} componentes disponibles en el sistema
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Todos ({components.length})
          </Button>
          {categories.map((category) => {
            const count = components.filter(c => c.category === category).length;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Components Display */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {filteredComponents.length} de {components.length} componentes
        </p>
        <Button variant="outline" size="sm" onClick={loadComponents}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </Button>
      </div>

      {filteredComponents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4 text-4xl">🔍</div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">No se encontraron componentes</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all'
              ? 'Prueba ajustando los filtros de búsqueda'
              : 'No hay componentes disponibles en el sistema'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map(renderComponentCard)}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComponents.map(renderComponentListItem)}
        </div>
      )}

      {/* Schema/Preview Modal */}
      {selectedComponent && modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card border-border max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg border">
            <div className="border-b border-border bg-muted/50 flex items-center justify-between p-4">
              <h3 className="text-foreground text-lg font-semibold">
                {modalMode === 'schema' ? 'Esquema de Configuración' : 'Vista Previa'} - {selectedComponent.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedComponent(null);
                  setModalMode(null);
                }}
              >
                ✕ Cerrar
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {modalMode === 'schema' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">Esquema JSON de Configuración</h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.configSchema || {}, null, 2)}
                  </pre>
                  <h4 className="text-foreground mb-4 mt-6 font-semibold">Configuración por Defecto</h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.defaultConfig || {}, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">Vista Previa del Componente</h4>
                  <div className="border-border rounded-lg border p-6">
                    {selectedComponent.type === 'hero-section' && (
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                        <h1 className="text-3xl font-bold mb-4">
                          {(selectedComponent.defaultConfig.title as string) || 'Welcome to Our Website'}
                        </h1>
                        <p className="text-lg mb-6">
                          {(selectedComponent.defaultConfig.description as string) || 'Discover amazing content and services'}
                        </p>
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
                          {(selectedComponent.defaultConfig.ctaText as string) || 'Get Started'}
                        </button>
                      </div>
                    )}
                    {selectedComponent.type === 'text-block' && (
                      <div className="prose">
                        <h2 className="text-xl font-semibold mb-4">
                          {(selectedComponent.defaultConfig.title as string) || 'Text Block Title'}
                        </h2>
                        <p>
                          {(selectedComponent.defaultConfig.content as string) || 'Enter your text here'}
                        </p>
                      </div>
                    )}
                    {selectedComponent.type === 'feature-grid' && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-center">
                          {(selectedComponent.defaultConfig.title as string) || 'Our Features'}
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="text-center p-4">
                              <div className="text-3xl mb-2">⚡</div>
                              <h3 className="font-semibold mb-2">Feature {i}</h3>
                              <p className="text-sm text-muted-foreground">Feature description here</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedComponent.type === 'button' && (
                      <div className="flex justify-center">
                        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium">
                          {(selectedComponent.defaultConfig.text as string) || 'Button'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="bg-muted/50 mt-6 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      💡 Esta es una vista previa simplificada del componente con su configuración por defecto.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}