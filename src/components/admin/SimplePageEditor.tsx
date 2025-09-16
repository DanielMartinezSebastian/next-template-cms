/**
 * Simple Page Editor - Replacement for Lexical editor
 * Panel lateral simplificado para editar componentes usando React Hook Form + Zod
 */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Plus, Settings, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  onPageUpdate?: (page: Partial<PageConfig>) => void;
  width?: number;
  sidebarWidth?: number;
  onNewPage?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

// Definiciones de componentes disponibles
const availableComponents = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Banner principal con título y subtítulo',
    defaultProps: {
      title: 'Hero Title',
      subtitle: 'Hero subtitle',
      backgroundImage:
        'https://images.placeholders.dev/1200x600?text=Hero%20Background&bgColor=%234f46e5&textColor=%23ffffff',
    },
  },
  {
    type: 'section',
    name: 'Section',
    description: 'Sección con título y contenido',
    defaultProps: {
      title: 'Section Title',
      content: 'Section content goes here...',
    },
  },
  {
    type: 'card',
    name: 'Card',
    description: 'Tarjeta con título y contenido',
    defaultProps: {
      title: 'Card Title',
      content: 'Card content goes here...',
    },
  },
  {
    type: 'button',
    name: 'Button',
    description: 'Botón interactivo',
    defaultProps: {
      text: 'Click me',
      variant: 'default',
      href: '#',
    },
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Imagen con descripción',
    defaultProps: {
      src: 'https://images.placeholders.dev/800x600?text=Image&bgColor=%236b7280&textColor=%23ffffff',
      alt: 'Image description',
      width: 800,
      height: 600,
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    description: 'Espacio vertical',
    defaultProps: {
      height: '2rem',
    },
  },
];

interface ComponentEditorProps {
  component: PageComponent;
  onUpdate: (component: PageComponent) => void;
  onDelete: () => void;
}

function ComponentEditor({ component, onUpdate, onDelete }: ComponentEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(component.props);

  const handlePropChange = (key: string, value: unknown) => {
    const newProps = { ...formData, [key]: value };
    setFormData(newProps);
    onUpdate({ ...component, props: newProps });
  };

  const renderPropEditor = (key: string, value: unknown) => {
    if (typeof value === 'string') {
      if (key === 'content' || key === 'description') {
        return (
          <textarea
            value={value}
            onChange={e => handlePropChange(key, e.target.value)}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[80px] w-full min-w-0 resize-none rounded-md border px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-1"
            placeholder={`Enter ${key}...`}
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={e => handlePropChange(key, e.target.value)}
          placeholder={`Enter ${key}...`}
          className="w-full min-w-0"
        />
      );
    }

    if (typeof value === 'number') {
      return (
        <Input
          type="number"
          value={value}
          onChange={e => handlePropChange(key, Number(e.target.value))}
          placeholder={`Enter ${key}...`}
          className="w-full min-w-0"
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex min-w-0 items-center space-x-2">
          <input
            type="checkbox"
            checked={value}
            onChange={e => handlePropChange(key, e.target.checked)}
            className="text-primary bg-background border-border focus:ring-primary h-4 w-4 flex-shrink-0 rounded focus:ring-2"
          />
          <label className="text-card-foreground min-w-0 text-sm">{key}</label>
        </div>
      );
    }

    return (
      <Input
        value={String(value)}
        onChange={e => handlePropChange(key, e.target.value)}
        placeholder={`Enter ${key}...`}
        className="w-full min-w-0"
      />
    );
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
            <h4 className="text-card-foreground truncate text-sm font-medium">{component.type}</h4>
            <p className="text-muted-foreground truncate text-xs">ID: {component.id}</p>
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
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="min-w-0 space-y-2">
                <label className="text-card-foreground text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <div className="min-w-0">{renderPropEditor(key, value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SimplePageEditor({
  onPageUpdate,
  width,
  sidebarWidth = 400,
  onNewPage,
  onSave,
  isSaving: externalIsSaving,
}: SimplePageEditorProps) {
  const currentPage = useCurrentPage();
  const { updatePage, savePageToDatabase } = usePageActions();
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
    (componentType: string) => {
      const componentDef = availableComponents.find(c => c.type === componentType);
      if (!componentDef) return;

      const newComponent: PageComponent = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        props: { ...componentDef.defaultProps },
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
    [watchedComponents, setValue, currentPage, updatePage, onPageUpdate]
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addComponent('section')}
                className="flex-shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Component
              </Button>
            </div>

            {/* Available Components */}
            <div className="min-w-0 space-y-2">
              <h4 className="text-card-foreground text-sm font-medium">Available Components</h4>
              <div className="flex min-w-0 flex-wrap gap-2">
                {availableComponents.map(component => (
                  <Button
                    key={component.type}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addComponent(component.type)}
                    className="min-w-0 flex-shrink-0 text-xs"
                  >
                    {component.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Current Components */}
            <div className="min-w-0 space-y-3">
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
