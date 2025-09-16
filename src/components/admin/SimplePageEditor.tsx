/**
 * Simple Page Editor - Replacement for Lexical editor
 * Panel lateral simplificado para editar componentes usando React Hook Form + Zod
 */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useComponents } from '../../hooks/useComponents';
import { getComponentSchema, type PropertySchema } from '../../lib/component-schemas';
import { PageComponent, PageConfig, useCurrentPage, usePageActions } from '../../stores';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Schema para validación de componentes
const componentSchema = z.object({
  id: z.string().min(1, 'ID es requerido'),
  type: z.string().min(1, 'Tipo es requerido'),
  props: z.record(z.unknown()),
  order: z.number().min(0),
});

const pageSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  slug: z.string().min(1, 'Slug es requerido'),
  metadata: z.object({
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  isPublished: z.boolean(),
  components: z.array(componentSchema),
});

type PageFormData = z.infer<typeof pageSchema>;

interface SimplePageEditorProps {
  currentPage?: PageConfig | null; // Add currentPage as prop
  onPageUpdate?: (page: Partial<PageConfig>) => void;
  width?: number;
  sidebarWidth?: number;
  onNewPage?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

interface ComponentEditorProps {
  component: PageComponent;
  onUpdate: (component: PageComponent) => void;
  onDelete: () => void;
}

/**
 * Property field component with schema-based rendering
 */
function PropertyField({
  schema,
  value,
  onChange,
}: {
  name: string;
  schema: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  // Select field with predefined options
  if (schema.type === 'select' && schema.options) {
    return (
      <select
        value={String(value)}
        onChange={e => onChange(e.target.value)}
        className="border-border bg-background text-foreground focus:ring-primary w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-colors focus:border-transparent focus:outline-none focus:ring-1"
      >
        {schema.options.map(option => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  // Textarea for long text
  if (schema.type === 'textarea') {
    return (
      <textarea
        value={String(value)}
        onChange={e => onChange(e.target.value)}
        placeholder={schema.placeholder}
        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[80px] w-full min-w-0 resize-none rounded-md border px-3 py-2 text-sm transition-colors focus:border-transparent focus:outline-none focus:ring-1"
      />
    );
  }

  // Color input
  if (schema.type === 'color') {
    return (
      <div className="flex min-w-0 items-center space-x-2">
        <input
          type="color"
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          className="border-border h-8 w-16 flex-shrink-0 rounded border"
        />
        <Input
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          placeholder={schema.placeholder}
          className="min-w-0 flex-1 text-sm"
        />
      </div>
    );
  }

  // Boolean checkbox
  if (schema.type === 'boolean') {
    return (
      <div className="flex min-w-0 items-center space-x-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(e.target.checked)}
          className="text-primary bg-background border-border focus:ring-primary h-4 w-4 flex-shrink-0 rounded focus:ring-2"
        />
        <span className="text-muted-foreground min-w-0 text-sm">
          {schema.description || 'Enable'}
        </span>
      </div>
    );
  }

  // Number input
  if (schema.type === 'number') {
    return (
      <Input
        type="number"
        value={Number(value)}
        onChange={e => onChange(Number(e.target.value))}
        placeholder={schema.placeholder}
        min={schema.min}
        max={schema.max}
        step={schema.step}
        className="w-full min-w-0 text-sm"
      />
    );
  }

  // Default string input
  return (
    <Input
      value={String(value)}
      onChange={e => onChange(e.target.value)}
      placeholder={schema.placeholder}
      className="w-full min-w-0 text-sm"
    />
  );
}

function ComponentEditor({ component, onUpdate, onDelete }: ComponentEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(component.props);

  // Get component schema for structured editing
  const componentSchema = getComponentSchema(component.type);

  const handlePropChange = (key: string, value: unknown) => {
    const newProps = { ...formData, [key]: value };
    setFormData(newProps);
    onUpdate({ ...component, props: newProps });
  };

  return (
    <div className="bg-card border-border min-w-0 rounded-lg border">
      {/* Component Header */}
      <div
        className="flex min-w-0 cursor-pointer items-center justify-between p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex min-w-0 flex-1 items-center space-x-3">
          <GripVertical className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="text-card-foreground truncate text-sm font-medium">
              {componentSchema?.name || component.type}
            </h4>
            <p className="text-muted-foreground truncate text-xs">
              {componentSchema?.description || `ID: ${component.id}`}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Component Properties */}
      {isExpanded && (
        <div className="border-border min-w-0 border-t p-4">
          <div className="min-w-0 space-y-4">
            {componentSchema
              ? // Use schema-based rendering
                Object.entries(componentSchema.properties).map(([key, schema]) => {
                  const currentValue = formData[key] ?? schema.default;
                  return (
                    <div key={key} className="min-w-0 space-y-2">
                      <label className="text-card-foreground text-sm font-medium">
                        {schema.label}
                        {schema.required && <span className="ml-1 text-red-500">*</span>}
                      </label>
                      {schema.description && (
                        <p className="text-muted-foreground text-xs">{schema.description}</p>
                      )}
                      <PropertyField
                        name={key}
                        schema={schema}
                        value={currentValue}
                        onChange={value => handlePropChange(key, value)}
                      />
                    </div>
                  );
                })
              : // Fallback to generic rendering
                Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="min-w-0 space-y-2">
                    <label className="text-card-foreground text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <Input
                      value={String(value)}
                      onChange={e => handlePropChange(key, e.target.value)}
                      placeholder={`Enter ${key}...`}
                      className="w-full min-w-0 text-sm"
                    />
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SimplePageEditor({
  currentPage: propCurrentPage, // Rename to distinguish from hook
  onPageUpdate,
  width,
  sidebarWidth = 400,
  onNewPage,
  onSave,
  isSaving: externalIsSaving,
}: SimplePageEditorProps) {
  const storeCurrentPage = useCurrentPage();
  // Use prop currentPage if provided, otherwise fall back to store
  const currentPage = propCurrentPage ?? storeCurrentPage;
  const { updatePage, savePageToDatabase } = usePageActions();
  const { components: availableComponents } = useComponents();
  const [internalIsSaving, setInternalIsSaving] = useState(false);

  // Use external isSaving prop if provided, otherwise use internal state
  const isSaving = externalIsSaving !== undefined ? externalIsSaving : internalIsSaving;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: 'New Page',
      slug: 'new-page',
      metadata: {
        description: '',
        keywords: [],
      },
      isPublished: false,
      components: [],
    },
  });

  const watchedComponents = watch('components');

  // Sync with currentPage
  useEffect(() => {
    if (currentPage) {
      setValue('title', currentPage.title);
      setValue('slug', currentPage.slug);
      setValue('metadata.description', currentPage.metadata?.description || '');
      setValue('isPublished', currentPage.isPublished);
      setValue('components', currentPage.components || []);
    }
  }, [currentPage, setValue]);

  const addComponent = useCallback(
    (componentType: string, defaults?: Record<string, unknown>) => {
      // Try to get defaults from schema first, then from component def
      const schema = getComponentSchema(componentType);
      const componentDef = availableComponents.find(c => c.type === componentType);

      const defaultProps = defaults || schema?.defaults || componentDef?.defaultProps || {};

      const newComponent: PageComponent = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        props: { ...defaultProps },
        order: watchedComponents.length,
      };

      const updatedComponents = [...watchedComponents, newComponent];
      setValue('components', updatedComponents);

      // Update page store
      if (currentPage) {
        const updatedPage = { ...currentPage, components: updatedComponents };
        updatePage(currentPage.id, updatedPage);
        onPageUpdate?.(updatedPage);
      }
    },
    [watchedComponents, setValue, currentPage, updatePage, onPageUpdate, availableComponents]
  );

  const updateComponent = useCallback(
    (index: number, component: PageComponent) => {
      const updatedComponents = [...watchedComponents];
      updatedComponents[index] = component;
      setValue('components', updatedComponents);

      // Update page store
      if (currentPage) {
        const updatedPage = { ...currentPage, components: updatedComponents };
        updatePage(currentPage.id, updatedPage);
        onPageUpdate?.(updatedPage);
      }
    },
    [watchedComponents, setValue, currentPage, updatePage, onPageUpdate]
  );

  const deleteComponent = useCallback(
    (index: number) => {
      const updatedComponents = watchedComponents.filter((_, i) => i !== index);
      setValue('components', updatedComponents);

      // Update page store
      if (currentPage) {
        const updatedPage = { ...currentPage, components: updatedComponents };
        updatePage(currentPage.id, updatedPage);
        onPageUpdate?.(updatedPage);
      }
    },
    [watchedComponents, setValue, currentPage, updatePage, onPageUpdate]
  );

  const onSubmit = async (data: PageFormData) => {
    if (!currentPage) return;

    // Only use internal saving state if external isSaving is not provided
    if (externalIsSaving === undefined) {
      setInternalIsSaving(true);
    }

    try {
      // If onSave prop is provided, use it instead of internal save logic
      if (onSave) {
        onSave();
        return;
      }

      // Use PageConfig structure, store will handle API conversion
      await savePageToDatabase(currentPage.id, {
        title: data.title,
        slug: data.slug,
        metadata: {
          description: data.metadata.description || '',
        },
        isPublished: data.isPublished,
        components: data.components, // Pass components directly
      });
      console.warn('✅ Page saved successfully');
    } catch (error) {
      console.error('❌ Error saving page:', error);
    } finally {
      // Only use internal saving state if external isSaving is not provided
      if (externalIsSaving === undefined) {
        setInternalIsSaving(false);
      }
    }
  };

  const handleSlugChange = useCallback(
    (title: string) => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    },
    [setValue]
  );

  return (
    <div
      className="bg-card border-border flex flex-col"
      style={{
        height: 'calc(100dvh - 66px)',
        width: width ? `${width}px` : '384px',
        minWidth: 0, // Permite que el contenido se comprima
        maxWidth: '100%', // Evita overflow del contenedor padre
        overflow: 'hidden', // Control total de overflow
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-w-0 flex-col">
        {/* Scrollable Content */}
        <div
          className="scrollbar-admin-auto min-w-0 flex-1 space-y-6 p-4"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* Basic Info */}
          <div className="min-w-0 space-y-4">
            <h3 className="text-card-foreground text-lg font-medium">Basic Information</h3>

            <div className="min-w-0 space-y-2">
              <label className="text-card-foreground text-sm font-medium">Page Title</label>
              <Input
                {...register('title')}
                onChange={e => {
                  register('title').onChange(e);
                  handleSlugChange(e.target.value);
                }}
                placeholder="Enter page title..."
                className="w-full min-w-0"
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="min-w-0 space-y-2">
              <label className="text-card-foreground text-sm font-medium">URL Slug</label>
              <Input {...register('slug')} placeholder="page-url-slug" className="w-full min-w-0" />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="min-w-0 space-y-2">
              <label className="text-card-foreground text-sm font-medium">Meta Description</label>
              <textarea
                {...register('metadata.description')}
                placeholder="Brief description for search engines..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[80px] w-full min-w-0 resize-none rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-1"
                maxLength={160}
              />
            </div>

            <div className="flex min-w-0 items-center space-x-3">
              <input
                type="checkbox"
                {...register('isPublished')}
                className="text-primary bg-background border-border focus:ring-primary h-4 w-4 rounded focus:ring-2"
              />
              <label className="text-card-foreground text-sm font-medium">Published</label>
            </div>
          </div>

          {/* Components Section */}
          <div className="min-w-0 space-y-4">
            <div className="flex min-w-0 items-center justify-between">
              <h3 className="text-card-foreground text-lg font-medium">Page Components</h3>
            </div>

            {/* Available Components from Database */}
            <div className="min-w-0 space-y-2">
              <h4 className="text-card-foreground text-sm font-medium">Add Components</h4>
              <div className="min-w-0 space-y-2">
                {availableComponents.map(component => {
                  // Get schema info for enhanced display
                  const schema = getComponentSchema(component.type);
                  return (
                    <Button
                      key={component.type}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addComponent(component.type, schema?.defaults)}
                      className="w-full min-w-0 justify-start text-left"
                    >
                      <div className="flex min-w-0 items-center space-x-2">
                        <span className="flex-shrink-0">{schema?.icon || '📄'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {schema?.name || component.name}
                          </div>
                          <div className="text-muted-foreground truncate text-xs">
                            {schema?.description || `Component type: ${component.type}`}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}

                {availableComponents.length === 0 && (
                  <div className="text-muted-foreground p-2 text-center text-sm">
                    No components available
                  </div>
                )}
              </div>
            </div>

            {/* Current Components */}
            <div className="min-w-0 space-y-3">
              <h4 className="text-card-foreground text-sm font-medium">Current Components</h4>
              {watchedComponents.map((component, index) => (
                <ComponentEditor
                  key={component.id}
                  component={component}
                  onUpdate={updatedComponent => updateComponent(index, updatedComponent)}
                  onDelete={() => deleteComponent(index)}
                />
              ))}

              {watchedComponents.length === 0 && (
                <div className="border-border text-muted-foreground min-w-0 rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm">No components added yet</p>
                  <p className="text-xs">Use the buttons above to add components</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="border-border min-w-0 border-t p-4">
          {/* Show two buttons in row when width allows (>= 400px), one button when narrow */}
          {sidebarWidth >= 400 && onNewPage ? (
            <div className="flex min-w-0 space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onNewPage}
                className="min-w-0 flex-1"
                disabled={isSaving}
              >
                New
              </Button>
              <Button type="submit" disabled={isSaving} className="min-w-0 flex-1">
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          ) : (
            <Button type="submit" disabled={isSaving} className="w-full min-w-0">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
