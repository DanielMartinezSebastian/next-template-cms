'use client';

import { ComponentFactory } from '@/components/dynamic/ComponentFactory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

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
  const [modalMode, setModalMode] = useState<'schema' | 'preview' | 'edit' | null>(null);
  const [editedConfig, setEditedConfig] = useState<Record<string, unknown>>({});

  useEffect(() => {
    loadComponents();
  }, []);

  // Initialize edited config when component is selected for editing
  useEffect(() => {
    if (selectedComponent && modalMode === 'edit') {
      setEditedConfig({ ...selectedComponent.defaultConfig });
    }
  }, [selectedComponent, modalMode]);

  const loadComponents = async () => {
    try {
      setIsLoading(true);

      // Use API endpoint to load components
      const response = await fetch('/api/admin/components');
      const data = await response.json();

      if (data.success) {
        setComponents(data.components);
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

  // Handle prop value changes
  const handlePropChange = (propName: string, value: unknown) => {
    setEditedConfig(prev => ({
      ...prev,
      [propName]: value,
    }));
  };

  // Save component configuration to database
  const saveComponentConfig = async () => {
    if (!selectedComponent) return;

    try {
      // Update component in database via API
      const response = await fetch(`/api/admin/components/${selectedComponent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultConfig: editedConfig,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state with the saved configuration
        setComponents(prev =>
          prev.map(comp =>
            comp.id === selectedComponent.id
              ? { ...comp, defaultConfig: { ...editedConfig } }
              : comp
          )
        );

        // Close the edit modal
        setSelectedComponent(null);
        setModalMode(null);
        setEditedConfig({});
      } else {
        console.error('❌ Failed to save component:', result.error);
      }
    } catch (error) {
      console.error('❌ Error saving component configuration:', error);
    }
  };

  // Reset configuration to default
  const resetConfig = () => {
    if (selectedComponent) {
      setEditedConfig({ ...selectedComponent.defaultConfig });
    }
  };

  // Render component preview using the NEW SYSTEM
  const renderComponentPreview = (config: Record<string, unknown>) => {
    if (!selectedComponent) return null;

    try {
      // Create a real component using ComponentFactory
      const componentElement = ComponentFactory.createComponent(selectedComponent.type, {
        ...config,
        editMode: false,
      });

      if (componentElement) {
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-6">{componentElement}</div>
        );
      }

      // Fallback if component not found
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="py-8 text-center text-gray-500">
            <div className="mb-4 text-4xl">🧩</div>
            <h3 className="mb-2 font-semibold">Component: {selectedComponent.type}</h3>
            <p>Component not found in ComponentFactory</p>
            <p className="mt-2 text-xs">
              Available: {ComponentFactory.getAvailableTypes().join(', ')}
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering component preview:', error);
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="py-8 text-center text-red-600">
            <div className="mb-4 text-4xl">⚠️</div>
            <h3 className="mb-2 font-semibold">Error rendering {selectedComponent.type}</h3>
            <p className="text-sm">Check console for details</p>
            <pre className="mt-2 text-left text-xs">{String(error)}</pre>
          </div>
        </div>
      );
    }
  };

  const renderComponentCard = (component: ComponentInfo) => {
    const defaultProps = component.defaultConfig || {};
    const propsPreview = Object.entries(defaultProps)
      .slice(0, 3)
      .map(
        ([key, value]) =>
          `${key}: ${typeof value === 'string' ? value.slice(0, 20) : String(value)}`
      )
      .join(', ');

    return (
      <div
        key={component.id}
        className="bg-card border-border rounded-lg border p-4 transition-shadow hover:shadow-md"
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
          <div className="bg-muted text-muted-foreground rounded border p-2 font-mono text-xs">
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

        {/* Edit Props Button */}
        <div className="mt-2 flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => {
              setSelectedComponent(component);
              setModalMode('edit');
            }}
          >
            ✏️ Editar Props
          </Button>
        </div>

        {/* Schema indicator */}
        {component.configSchema && (
          <div className="mt-2 text-xs text-green-600">✓ Esquema de configuración disponible</div>
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
            <div className="text-muted-foreground mt-2 text-xs">
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
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSelectedComponent(component);
                setModalMode('edit');
              }}
            >
              ✏️ Editar
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
            <div
              key={i}
              className="bg-card border-border h-48 animate-pulse rounded-lg border"
            ></div>
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
          <div className="max-w-md flex-1">
            <Input
              type="text"
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
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
          {categories.map(category => {
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Actualizar
        </Button>
      </div>

      {filteredComponents.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4 text-4xl">🔍</div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            No se encontraron componentes
          </h3>
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
        <div className="space-y-3">{filteredComponents.map(renderComponentListItem)}</div>
      )}

      {/* Schema/Preview Modal */}
      {selectedComponent && modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card border-border max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg border">
            <div className="border-border bg-muted/50 flex items-center justify-between border-b p-4">
              <h3 className="text-foreground text-lg font-semibold">
                {modalMode === 'schema'
                  ? 'Esquema de Configuración'
                  : modalMode === 'preview'
                    ? 'Vista Previa'
                    : 'Editor de Propiedades'}{' '}
                - {selectedComponent.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedComponent(null);
                  setModalMode(null);
                  setEditedConfig({});
                }}
              >
                ✕ Cerrar
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {modalMode === 'schema' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">
                    Esquema JSON de Configuración
                  </h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.configSchema || {}, null, 2)}
                  </pre>
                  <h4 className="text-foreground mb-4 mt-6 font-semibold">
                    Configuración por Defecto
                  </h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.defaultConfig || {}, null, 2)}
                  </pre>
                </div>
              ) : modalMode === 'preview' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">
                    Vista Previa del Componente
                  </h4>
                  <div className="border-border rounded-lg border p-6">
                    {renderComponentPreview(selectedComponent.defaultConfig)}
                  </div>
                  <div className="bg-muted/50 mt-6 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      💡 Esta es una vista previa del componente real usando ComponentFactory.
                    </p>
                  </div>
                </div>
              ) : modalMode === 'edit' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">Editor de Propiedades</h4>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Props Editor */}
                    <div>
                      <h5 className="text-foreground mb-3 font-medium">Configurar Propiedades</h5>
                      <div className="space-y-4">
                        {Object.entries(selectedComponent.defaultConfig || {}).map(
                          ([key, value]) => (
                            <div key={key}>
                              <label className="text-foreground mb-2 block text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </label>
                              {typeof value === 'boolean' ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={(editedConfig[key] as boolean) ?? (value as boolean)}
                                    onChange={e => handlePropChange(key, e.target.checked)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-muted-foreground text-sm">
                                    {(editedConfig[key] ?? value) ? 'Habilitado' : 'Deshabilitado'}
                                  </span>
                                </div>
                              ) : typeof value === 'number' ? (
                                <Input
                                  type="number"
                                  value={(editedConfig[key] as number) ?? (value as number) ?? 0}
                                  onChange={e =>
                                    handlePropChange(key, parseInt(e.target.value) || 0)
                                  }
                                  className="w-full"
                                  min="0"
                                />
                              ) : key.toLowerCase().includes('color') ||
                                key === 'backgroundColor' ? (
                                <Input
                                  type="text"
                                  value={(editedConfig[key] as string) ?? (value as string) ?? ''}
                                  onChange={e => handlePropChange(key, e.target.value)}
                                  className="w-full"
                                  placeholder="CSS color (hex, rgb, etc.)"
                                />
                              ) : (
                                <Input
                                  type="text"
                                  value={(editedConfig[key] as string) ?? (value as string) ?? ''}
                                  onChange={e => handlePropChange(key, e.target.value)}
                                  className="w-full"
                                  placeholder={`Introduce ${key.toLowerCase()}`}
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-2">
                        <Button onClick={saveComponentConfig} className="flex-1">
                          💾 Guardar Cambios
                        </Button>
                        <Button variant="outline" onClick={resetConfig} className="flex-1">
                          🔄 Resetear
                        </Button>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                      <h5 className="text-foreground mb-3 font-medium">
                        Vista Previa en Tiempo Real
                      </h5>
                      <div className="border-border rounded-lg border bg-gray-50 p-6">
                        {renderComponentPreview(editedConfig)}
                      </div>
                      <div className="mt-4 rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-800">
                          🔥 Vista previa actualizada en tiempo real usando ComponentFactory.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
