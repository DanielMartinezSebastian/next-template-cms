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

  // Handle prop value changes
  const handlePropChange = (propName: string, value: unknown) => {
    setEditedConfig(prev => ({
      ...prev,
      [propName]: value
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
          defaultConfig: editedConfig
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state with the saved configuration
        setComponents(prev => prev.map(comp => 
          comp.id === selectedComponent.id 
            ? { ...comp, defaultConfig: { ...editedConfig } }
            : comp
        ));
        
        console.log(`✅ Successfully saved component ${selectedComponent.name} to ${result.source} database`);
        
        // Close the edit modal
        setSelectedComponent(null);
        setModalMode(null);
        setEditedConfig({});
      } else {
        console.error('❌ Failed to save component:', result.error);
        alert(`Error al guardar: ${  result.error}`);
      }
    } catch (error) {
      console.error('❌ Error saving component configuration:', error);
      alert('Error al guardar los cambios. Por favor intenta de nuevo.');
    }
  };

  // Reset configuration to default
  const resetConfig = () => {
    if (selectedComponent) {
      setEditedConfig({ ...selectedComponent.defaultConfig });
    }
  };

  // Render component preview with current config
  const renderComponentPreview = (config: Record<string, unknown>) => {
    if (!selectedComponent) return null;

    const componentType = selectedComponent.type.toLowerCase();

    switch (componentType) {
      case 'hero-section':
      case 'herosection':
        return (
          <div 
            className="rounded-lg p-8 text-white min-h-[300px] flex flex-col justify-center"
            style={{ 
              background: (config.backgroundColor as string) || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            <h1 className="text-3xl font-bold mb-4">
              {(config.title as string) || 'Welcome to Our Website'}
            </h1>
            {config.subtitle && (
              <p className="text-xl mb-4 opacity-90">
                {config.subtitle as string}
              </p>
            )}
            <p className="text-lg mb-6">
              {(config.description as string) || 'Discover amazing content and services'}
            </p>
            <div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {(config.ctaText as string) || 'Get Started'}
              </button>
            </div>
          </div>
        );
      
      case 'text-block':
      case 'textblock':
        const textAlign = (config.textAlign as string) || 'left';
        return (
          <div 
            className="prose max-w-none p-6 border rounded-lg"
            style={{
              backgroundColor: (config.backgroundColor as string) || '#ffffff',
              color: (config.textColor as string) || '#1f2937'
            }}
          >
            {config.title && (
              <h2 
                className={`text-xl font-semibold mb-4 ${config.fontSize || 'text-xl'} ${config.fontWeight || 'font-semibold'}`}
                style={{ 
                  textAlign: textAlign as any,
                  color: (config.textColor as string) || '#1f2937'
                }}
              >
                {config.title as string}
              </h2>
            )}
            <div 
              className={`leading-relaxed ${config.fontSize || 'text-base'} ${config.fontWeight || 'font-normal'}`}
              style={{ 
                textAlign: textAlign as any,
                color: (config.textColor as string) || '#1f2937'
              }}
            >
              {(config.content as string) || 'Enter your text content here. This is a sample text block that demonstrates how your content will appear with custom styling options.'}
            </div>
            {config.showDate && (
              <p 
                className="text-sm opacity-70 mt-4" 
                style={{ 
                  textAlign: textAlign as any,
                  color: (config.textColor as string) || '#1f2937'
                }}
              >
                {new Date().toLocaleDateString()}
              </p>
            )}
          </div>
        );
      
      case 'feature-grid':
      case 'featuregrid':
        const features = (config.features as any[]) || [];
        const columns = Math.min((config.columns as number) || 3, 4);
        const gridCols = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        };
        
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {(config.title as string) || 'Our Features'}
            </h2>
            <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
              {features.length > 0 ? features.map((feature, i) => (
                <div key={i} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-3">{feature.icon || '⚡'}</div>
                  <h3 className="font-semibold mb-2 text-lg">{feature.title || `Feature ${i + 1}`}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description || 'Feature description here. Add your feature details.'}
                  </p>
                </div>
              )) : Array.from({ length: columns }, (_, i) => (
                <div key={i} className="text-center p-4 border rounded-lg">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-semibold mb-2 text-lg">Feature {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">Feature description here</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'button':
        const variant = (config.variant as string) || 'default';
        const size = (config.size as string) || 'default';
        
        const variantClasses = {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
          ghost: 'text-primary hover:bg-primary/10',
          destructive: 'bg-red-600 text-white hover:bg-red-700'
        };
        
        const sizeClasses = {
          sm: 'px-4 py-1 text-sm',
          default: 'px-6 py-2',
          lg: 'px-8 py-3 text-lg'
        };
        
        return (
          <div className="flex justify-center p-8">
            <button 
              className={`rounded-md font-medium transition-colors ${
                variantClasses[variant as keyof typeof variantClasses] || variantClasses.default
              } ${
                sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default
              }`}
            >
              {(config.text as string) || 'Button'}
            </button>
          </div>
        );
      
      case 'image-gallery':
      case 'imagegallery':
        const images = (config.images as any[]) || [];
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              {(config.title as string) || 'Image Gallery'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.length > 0 ? images.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">🖼️ {img.alt || `Image ${i + 1}`}</span>
                </div>
              )) : Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">🖼️ Image {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'contact-form':
      case 'contactform':
        return (
          <div className="p-4 border rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">
              {(config.title as string) || 'Contact Us'}
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-2 border rounded"
                disabled
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-2 border rounded"
                disabled
              />
              <textarea 
                placeholder="Message" 
                className="w-full p-2 border rounded h-24"
                disabled
              />
              <button className="w-full bg-primary text-primary-foreground p-2 rounded">
                {(config.submitText as string) || 'Send Message'}
              </button>
            </div>
          </div>
        );

      case 'call-to-action':
      case 'calltoaction':
        return (
          <div 
            className="p-8 rounded-lg text-white"
            style={{
              background: (config.backgroundColor as string) || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className={config.centerAlign ? 'text-center' : ''}>
              <h2 className="text-3xl font-bold mb-4">
                {(config.title as string) || 'Ready to get started?'}
              </h2>
              <p className="text-lg mb-6 opacity-90">
                {(config.description as string) || 'Join thousands of satisfied customers today'}
              </p>
              <button className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                config.buttonVariant === 'outline' 
                  ? 'border-2 border-white text-white hover:bg-white hover:text-blue-600' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}>
                {(config.buttonText as string) || 'Get Started'}
              </button>
            </div>
          </div>
        );

      case 'pricing':
        const pricingFeatures = (config.features as any[]) || [
          { text: 'Unlimited projects', included: true },
          { text: 'Advanced analytics', included: true },
          { text: 'Priority support', included: true },
          { text: 'Custom integrations', included: false },
        ];
        
        return (
          <div 
            className={`relative p-6 rounded-lg border shadow-lg max-w-sm mx-auto ${
              config.highlighted ? 'ring-2 ring-blue-600 ring-offset-2' : ''
            }`}
            style={{
              backgroundColor: (config.backgroundColor as string) || '#ffffff'
            }}
          >
            {config.highlighted && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: (config.textColor as string) || '#1f2937' }}>
                {(config.planName as string) || 'Pro Plan'}
              </h3>
              <p className="text-gray-500 text-sm mt-2">{(config.description as string) || 'Perfect for growing businesses'}</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center">
                <span className="text-sm text-gray-500">{(config.currency as string) || '$'}</span>
                <span className="text-4xl font-bold" style={{ color: (config.textColor as string) || '#1f2937' }}>
                  {(config.price as string) || '29'}
                </span>
                <span className="text-sm text-gray-500">/{(config.period as string) || 'month'}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {pricingFeatures.map((feature: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {feature.included ? (
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
            
            <button 
              className="w-full px-4 py-3 rounded-md text-center text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{
                backgroundColor: (config.accentColor as string) || '#2563eb'
              }}
            >
              {(config.buttonText as string) || 'Get Started'}
            </button>
          </div>
        );

      case 'testimonial':
        return (
          <div 
            className="p-6 rounded-lg"
            style={{
              backgroundColor: (config.backgroundColor as string) || '#f9fafb'
            }}
          >
            <div className="flex mb-4">
              {[...Array(Number(config.rating) || 5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-lg mb-4" style={{ color: (config.textColor as string) || '#1f2937' }}>
              "{(config.quote as string) || 'This product has transformed our business. Highly recommended!'}"
            </blockquote>
            <div className="flex items-center">
              {config.avatar && (
                <img 
                  src={config.avatar as string} 
                  alt={config.author as string} 
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <div className="font-semibold" style={{ color: (config.textColor as string) || '#1f2937' }}>
                  {(config.author as string) || 'John Smith'}
                </div>
                <div className="text-gray-500 text-sm">{(config.position as string) || 'CEO, Tech Corp'}</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="font-semibold mb-2">Component: {selectedComponent.type}</h3>
            <p>Preview not fully implemented for this component type.</p>
            <p className="text-xs mt-2">Component ID: {selectedComponent.id}</p>
          </div>
        );
    }
  };

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
        
        {/* Edit Props Button */}
        <div className="flex gap-2 mt-2">
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
                {modalMode === 'schema' ? 'Esquema de Configuración' : 
                 modalMode === 'preview' ? 'Vista Previa' : 'Editor de Propiedades'} - {selectedComponent.name}
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
                  <h4 className="text-foreground mb-4 font-semibold">Esquema JSON de Configuración</h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.configSchema || {}, null, 2)}
                  </pre>
                  <h4 className="text-foreground mb-4 mt-6 font-semibold">Configuración por Defecto</h4>
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 text-sm">
                    {JSON.stringify(selectedComponent.defaultConfig || {}, null, 2)}
                  </pre>
                </div>
              ) : modalMode === 'preview' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">Vista Previa del Componente</h4>
                  <div className="border-border rounded-lg border p-6">
                    {renderComponentPreview(selectedComponent.defaultConfig)}
                  </div>
                  <div className="bg-muted/50 mt-6 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      💡 Esta es una vista previa simplificada del componente con su configuración por defecto.
                    </p>
                  </div>
                </div>
              ) : modalMode === 'edit' ? (
                <div>
                  <h4 className="text-foreground mb-4 font-semibold">Editor de Propiedades</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Props Editor */}
                    <div>
                      <h5 className="text-foreground mb-3 font-medium">Configurar Propiedades</h5>
                      <div className="space-y-4">
                        {Object.entries(selectedComponent.defaultConfig || {}).map(([key, value]) => (
                          <div key={key}>
                            <label className="text-foreground mb-2 block text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </label>
                            {typeof value === 'boolean' ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={editedConfig[key] as boolean ?? (value as boolean)}
                                  onChange={(e) => handlePropChange(key, e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {(editedConfig[key] ?? value) ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                              </div>
                            ) : typeof value === 'number' ? (
                              <Input
                                type="number"
                                value={editedConfig[key] as number ?? (value as number) ?? 0}
                                onChange={(e) => handlePropChange(key, parseInt(e.target.value) || 0)}
                                className="w-full"
                                min="0"
                                max={key === 'columns' ? '6' : undefined}
                              />
                            ) : key === 'textAlign' ? (
                              <select
                                value={editedConfig[key] as string ?? (value as string) ?? 'left'}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background"
                              >
                                <option value="left">Izquierda</option>
                                <option value="center">Centro</option>
                                <option value="right">Derecha</option>
                                <option value="justify">Justificado</option>
                              </select>
                            ) : key === 'variant' ? (
                              <select
                                value={editedConfig[key] as string ?? (value as string) ?? 'default'}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background"
                              >
                                <option value="default">Por defecto</option>
                                <option value="outline">Contorno</option>
                                <option value="ghost">Fantasma</option>
                                <option value="destructive">Destructivo</option>
                              </select>
                            ) : key === 'size' ? (
                              <select
                                value={editedConfig[key] as string ?? (value as string) ?? 'default'}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background"
                              >
                                <option value="sm">Pequeño</option>
                                <option value="default">Mediano</option>
                                <option value="lg">Grande</option>
                              </select>
                            ) : key.toLowerCase().includes('color') || key === 'backgroundColor' ? (
                              <div className="space-y-2">
                                <Input
                                  type="text"
                                  value={editedConfig[key] as string ?? (value as string) ?? ''}
                                  onChange={(e) => handlePropChange(key, e.target.value)}
                                  className="w-full"
                                  placeholder="CSS color or gradient"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePropChange(key, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
                                    className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded"
                                  >
                                    Azul-Morado
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePropChange(key, 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}
                                    className="px-3 py-1 text-xs bg-gradient-to-r from-pink-400 to-red-500 text-white rounded"
                                  >
                                    Rosa-Rojo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePropChange(key, 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')}
                                    className="px-3 py-1 text-xs bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded"
                                  >
                                    Azul-Cyan
                                  </button>
                                </div>
                              </div>
                            ) : Array.isArray(value) ? (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Array con {(value as any[]).length} elementos
                                </p>
                                <textarea
                                  value={JSON.stringify(editedConfig[key] ?? value, null, 2)}
                                  onChange={(e) => {
                                    try {
                                      const parsed = JSON.parse(e.target.value);
                                      handlePropChange(key, parsed);
                                    } catch {
                                      // Invalid JSON, don't update
                                    }
                                  }}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background font-mono text-sm"
                                  rows={4}
                                  placeholder="JSON array"
                                />
                              </div>
                            ) : key.toLowerCase().includes('link') || key.toLowerCase().includes('url') ? (
                              <Input
                                type="url"
                                value={editedConfig[key] as string ?? (value as string) ?? ''}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full"
                                placeholder="https://example.com"
                              />
                            ) : typeof value === 'string' && (value as string).length > 50 ? (
                              <textarea
                                value={editedConfig[key] as string ?? (value as string) ?? ''}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-background"
                                rows={3}
                                placeholder={`Introduce ${key.toLowerCase()}`}
                              />
                            ) : (
                              <Input
                                type="text"
                                value={editedConfig[key] as string ?? (value as string) ?? ''}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="w-full"
                                placeholder={`Introduce ${key.toLowerCase()}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-6">
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
                      <h5 className="text-foreground mb-3 font-medium">Vista Previa en Tiempo Real</h5>
                      <div className="border-border rounded-lg border p-6 bg-gray-50">
                        {renderComponentPreview(editedConfig)}
                      </div>
                      <div className="bg-blue-50 mt-4 rounded-lg p-3">
                        <p className="text-blue-800 text-sm">
                          🔥 Vista previa actualizada en tiempo real. Los cambios se reflejan inmediatamente.
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
