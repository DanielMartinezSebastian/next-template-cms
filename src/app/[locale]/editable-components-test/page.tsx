/**
 * Editable Components Test Page
 * This page tests the new withEditable component system
 * allowing adding components, editing props, and verifying the editor works
 */
'use client';

import { useEffect, useState } from 'react';
import { componentRegistry } from '@/lib/component-registry';
import type { ComponentInfo } from '@/lib/component-registry';

// Import all editable components to trigger registration
import {
  ButtonMigrated,
  EditableButton,
  CardMigrated,
  CallToActionMigrated,
  HeroSectionMigrated,
  TextBlockMigrated,
} from '@/components/editable-components';

interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
}

export default function EditableComponentsTestPage() {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [availableComponents, setAvailableComponents] = useState<ComponentInfo[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null);
  const [editingProps, setEditingProps] = useState<Record<string, any>>({});

  useEffect(() => {
    // Get available components from registry
    const registryComponents = componentRegistry.getComponents();
    setAvailableComponents(registryComponents);
  }, []);

  const addComponent = (componentType: string) => {
    const componentInfo = availableComponents.find(c => c.name === componentType);
    if (!componentInfo) return;

    const newComponent: ComponentInstance = {
      id: Date.now().toString(),
      type: componentType,
      props: componentInfo.defaultProps || {},
    };

    setComponents(prev => [...prev, newComponent]);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const editComponent = (component: ComponentInstance) => {
    setSelectedComponent(component);
    setEditingProps({ ...component.props });
  };

  const saveProps = () => {
    if (!selectedComponent) return;

    setComponents(prev =>
      prev.map(c =>
        c.id === selectedComponent.id
          ? { ...c, props: { ...editingProps } }
          : c
      )
    );
    setSelectedComponent(null);
    setEditingProps({});
  };

  const renderComponent = (instance: ComponentInstance) => {
    const { type, props } = instance;
    
    // Provide default props to avoid TypeScript errors
    const defaultButtonProps = {
      text: 'Button',
      variant: 'default' as const,
      size: 'default' as const,
      disabled: false,
      centerAlign: false,
      fullWidth: false
    };
    
    const defaultCardProps = {
      title: 'Card Title',
      description: 'Card description',
      variant: 'default' as const,
      image: 'https://images.placeholders.dev/400x250?text=Card%20Image',
      buttonText: 'Read More',
      imageAlt: 'Card image',
      buttonLink: '#',
      imagePosition: 'top' as const
    };
    
    const defaultCTAProps = {
      title: 'Call to Action',
      description: 'Description here',
      buttonText: 'Get Started',
      buttonLink: '#',
      buttonVariant: 'default' as const,
      backgroundColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      centerAlign: true
    };
    
    const defaultHeroProps = {
      title: 'Hero Title',
      subtitle: 'Hero subtitle',
      description: 'Hero description',
      buttonText: 'Get Started',
      ctaText: 'Get Started',
      ctaLink: '#',
      buttonLink: '#',
      backgroundImage: 'https://images.placeholders.dev/800x400?text=Hero%20Background',
      backgroundColor: 'transparent',
      overlayOpacity: 0.5,
      textAlign: 'center' as const,
      textAlignment: 'center' as const,
      height: 'medium' as const
    };
    
    const defaultTextProps = {
      title: 'Text Block Title',
      subtitle: 'Text Block Subtitle',
      content: 'Sample text content',
      fontSize: 'base' as const,
      fontWeight: 'normal' as const,
      textAlign: 'left' as const,
      color: 'default' as const,
      backgroundColor: 'transparent',
      maxWidth: 'none' as const,
      padding: 'medium' as const,
      margin: 'medium' as const
    };
    
    switch (type) {
      case 'EditableButtonComponent':
        return <EditableButton {...defaultButtonProps} {...props} />;
      case 'ButtonComponent':
        return <ButtonMigrated {...defaultButtonProps} {...props} />;
      case 'CardComponent':
        return <CardMigrated {...defaultCardProps} {...props} />;
      case 'CallToActionComponent':
        return <CallToActionMigrated {...defaultCTAProps} {...props} />;
      case 'HeroSectionComponent':
        return <HeroSectionMigrated {...defaultHeroProps} {...props} />;
      case 'TextBlockComponent':
        return <TextBlockMigrated {...defaultTextProps} {...props} />;
      default:
        return <div className="p-4 border border-red-300 bg-red-50">Unknown component: {type}</div>;
    }
  };

  const renderPropEditor = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={editingProps[key]}
            onChange={(e) => setEditingProps(prev => ({ ...prev, [key]: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm">{key}</span>
        </label>
      );
    }

    if (typeof value === 'string') {
      return (
        <div>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input
            type="text"
            value={editingProps[key] || ''}
            onChange={(e) => setEditingProps(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium mb-1">{key}</label>
        <input
          type="text"
          value={JSON.stringify(editingProps[key] || value)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setEditingProps(prev => ({ ...prev, [key]: parsed }));
            } catch {
              // Handle invalid JSON gracefully
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Editable Components Test Page
          </h1>
          <p className="text-gray-600">
            Test the new withEditable component system by adding components, editing their props,
            and verifying the auto-registration and validation works correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Library */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📦 Available Components</h2>
            <div className="space-y-2">
              {availableComponents.map((component) => (
                <button
                  key={component.name}
                  onClick={() => addComponent(component.name)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{component.metadata.icon}</span>
                    <div>
                      <div className="font-medium">{component.metadata.displayName || component.name}</div>
                      <div className="text-sm text-gray-500">{component.metadata.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Registry Stats</div>
              <div className="text-sm text-blue-600">
                Components registered: {availableComponents.length}
              </div>
            </div>
          </div>

          {/* Component Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎨 Component Preview</h2>
            <div className="space-y-4">
              {components.map((component) => (
                <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {component.type}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => editComponent(component)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded p-3">
                    {renderComponent(component)}
                  </div>
                </div>
              ))}
              {components.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No components added yet. Add some from the library!
                </div>
              )}
            </div>
          </div>

          {/* Props Editor */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ Props Editor</h2>
            {selectedComponent ? (
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-600 mb-3">
                  Editing: {selectedComponent.type}
                </div>
                {Object.entries(selectedComponent.props).map(([key, value]) => (
                  <div key={key}>
                    {renderPropEditor(key, value)}
                  </div>
                ))}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={saveProps}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setSelectedComponent(null);
                      setEditingProps({});
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a component to edit its properties
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📊 System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-800 font-medium">Registry</div>
              <div className="text-green-600">✓ {availableComponents.length} components loaded</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-800 font-medium">Components Added</div>
              <div className="text-blue-600">{components.length} instances</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-800 font-medium">Editor</div>
              <div className="text-purple-600">
                {selectedComponent ? 'Editing active' : 'Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
