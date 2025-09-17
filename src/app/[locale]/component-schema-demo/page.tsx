/**
 * Component Schema Demo Page
 * Demonstrates the automatic component property editor system
 */

'use client';

import { ComponentPropertyEditor, ComponentSelector } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { getAllComponentSchemas } from '@/lib/component-schemas';
import { useCallback, useState } from 'react';

interface ComponentExample {
  type: string;
  props: Record<string, unknown>;
}

export default function ComponentSchemaDemo() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const allSchemas = getAllComponentSchemas();

  const handleSelectComponent = (type: string, defaults: Record<string, unknown>) => {
    setSelectedComponent({ type, props: defaults });
    setShowSelector(false);
  };

  const handlePropsChange = useCallback(
    (props: Record<string, unknown>) => {
      if (selectedComponent) {
        setSelectedComponent({ ...selectedComponent, props });
      }
    },
    [selectedComponent]
  );

  const handleValidationChange = useCallback((valid: boolean, validationErrors: string[]) => {
    setIsValid(valid);
    setErrors(validationErrors);
  }, []);

  const examples: ComponentExample[] = [
    {
      type: 'hero-section',
      props: {
        title: 'Dynamic Hero Section',
        description: 'This hero was configured with the schema-based editor',
        height: 'medium',
        ctaText: 'Try It Now',
        ctaLink: '#demo',
        textAlign: 'center',
      },
    },
    {
      type: 'text-block',
      props: {
        title: 'Schema-Based Text Block',
        content:
          'This text block demonstrates automatic property configuration based on TypeScript interfaces.',
        fontSize: 'large',
        textAlign: 'center',
        padding: 'large',
      },
    },
    {
      type: 'image-gallery',
      props: {
        title: 'Configurable Gallery',
        columns: 3,
        spacing: 'medium',
        aspectRatio: 'landscape',
        lightbox: true,
      },
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">Component Schema Demo</h1>
              <p className="text-muted-foreground mt-2">
                Automatic property editors generated from TypeScript interfaces
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-muted-foreground text-sm">
                {allSchemas.length} components available
              </div>
              <Button
                onClick={() => setShowSelector(!showSelector)}
                variant={showSelector ? 'secondary' : 'default'}
              >
                {showSelector ? 'Hide' : 'Show'} Component Selector
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Component Selector */}
        {showSelector && (
          <div className="border-border bg-card mb-8 rounded-lg border p-6">
            <ComponentSelector onSelectComponent={handleSelectComponent} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Examples and Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-foreground mb-4 text-xl font-semibold">Quick Examples</h2>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant={selectedComponent?.type === example.type ? 'default' : 'outline'}
                    onClick={() => setSelectedComponent(example)}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">
                      {allSchemas.find(s => s.type === example.type)?.icon}
                    </span>
                    {allSchemas.find(s => s.type === example.type)?.name || example.type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Component Info */}
            {selectedComponent && (
              <div className="border-border bg-muted/50 rounded-lg border p-4">
                <h3 className="text-foreground mb-2 font-medium">Current Configuration</h3>
                <pre className="text-muted-foreground overflow-x-auto text-xs">
                  {JSON.stringify(selectedComponent, null, 2)}
                </pre>

                <div className="mt-4 flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className="text-muted-foreground text-sm">
                    {isValid ? 'Valid configuration' : `${errors.length} validation errors`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Property Editor */}
          <div className="space-y-6">
            {selectedComponent ? (
              <ComponentPropertyEditor
                componentType={selectedComponent.type}
                initialProps={selectedComponent.props}
                onChange={handlePropsChange}
                onValidationChange={handleValidationChange}
              />
            ) : (
              <div className="border-border bg-muted/20 rounded-lg border p-8 text-center">
                <div className="mb-4 text-4xl">🎨</div>
                <h3 className="text-foreground mb-2 text-lg font-medium">Select a Component</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a component from the examples or use the component selector to see the
                  automatic property editor in action.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Schema Overview */}
        <div className="border-border bg-card mt-12 rounded-lg border p-6">
          <h2 className="text-foreground mb-4 text-xl font-semibold">
            Available Component Schemas
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allSchemas.map(schema => (
              <div
                key={schema.type}
                className="border-border bg-background hover:bg-muted/50 cursor-pointer rounded-lg border p-4 transition-colors"
                onClick={() => handleSelectComponent(schema.type, schema.defaults)}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <span className="text-xl">{schema.icon}</span>
                  <h3 className="text-foreground font-medium">{schema.name}</h3>
                </div>

                <p className="text-muted-foreground mb-3 text-sm">{schema.description}</p>

                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span className="bg-muted rounded px-2 py-1">{schema.category}</span>
                  <span>{Object.keys(schema.properties).length} props</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="border-border mt-8 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-950/20 dark:to-purple-950/20">
          <h2 className="text-foreground mb-4 text-xl font-semibold">
            🚀 Benefits of Schema-Based Components
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-foreground mb-2 font-medium">For Developers</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• TypeScript interfaces automatically generate editor UI</li>
                <li>• No additional configuration needed for new components</li>
                <li>• Built-in validation and type safety</li>
                <li>• Consistent API between React and JSON/API usage</li>
              </ul>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-medium">For Content Creators</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Intuitive property editors with helpful descriptions</li>
                <li>• Dropdown menus for predefined options (small/medium/large)</li>
                <li>• Real-time validation feedback</li>
                <li>• Category-based component organization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
