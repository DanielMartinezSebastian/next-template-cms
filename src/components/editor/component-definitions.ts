/**
 * Component Field Definitions
 * Defines editable fields and their types for each component type
 * This enables dynamic form generation for component editing
// TODO: Necesario automatizar la creacion o uso de COMPONENT_DEFINITIONS que infiera de las interfaces de los componentes que puede usar y que data rellenar. Plantear estrategia de que informacion debe vivir en el componente que vamos a usar
  */ //

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  description?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
  options?: Array<{ value: string; label: string }>; // For select fields
  min?: number; // For number fields
  max?: number; // For number fields
  step?: number; // For number fields
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface ComponentDefinition {
  type: string;
  name: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'marketing';
  fields: FieldDefinition[];
  previewProps?: Record<string, unknown>; // Props for preview/demo
}

// =============================================================================
// COMPONENT FIELD DEFINITIONS
// =============================================================================

export const COMPONENT_DEFINITIONS: Record<string, ComponentDefinition> = {
  // Hero Section
  hero: {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, description, and call-to-action',
    category: 'layout',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        description: 'Main headline text',
        required: true,
        defaultValue: 'Welcome to Our Website',
        placeholder: 'Enter hero title...',
      },
      {
        name: 'subtitle',
        type: 'text',
        label: 'Subtitle',
        description: 'Secondary text above the title',
        defaultValue: '',
        placeholder: 'Enter subtitle...',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        description: 'Supporting text below the title',
        defaultValue: 'Discover amazing content and services',
        placeholder: 'Enter description...',
      },
      {
        name: 'ctaText',
        type: 'text',
        label: 'Button Text',
        description: 'Call-to-action button text',
        defaultValue: 'Get Started',
        placeholder: 'Enter button text...',
      },
      {
        name: 'ctaLink',
        type: 'text',
        label: 'Button Link',
        description: 'URL for the call-to-action button',
        defaultValue: '#',
        placeholder: 'https://example.com',
        validation: {
          pattern: '^(https?:\\/\\/|mailto:|tel:|\\/|\\.\\/|\\.\\.\\/$|#|[a-zA-Z0-9])',
          message: 'Must be a valid URL, relative path, or anchor link',
        },
      },
      {
        name: 'ctaType',
        type: 'select',
        label: 'Button Style',
        description: 'Visual style of the button',
        defaultValue: 'default',
        options: [
          { value: 'default', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ],
      },
      {
        name: 'backgroundColor',
        type: 'select',
        label: 'Background',
        description: 'Background color or gradient',
        defaultValue: 'bg-gradient-to-r from-blue-600 to-purple-600',
        options: [
          { value: 'bg-gradient-to-r from-blue-600 to-purple-600', label: 'Blue to Purple' },
          { value: 'bg-gradient-to-r from-green-600 to-blue-600', label: 'Green to Blue' },
          { value: 'bg-gradient-to-r from-purple-600 to-pink-600', label: 'Purple to Pink' },
          { value: 'bg-gradient-to-r from-orange-600 to-red-600', label: 'Orange to Red' },
          { value: 'bg-gray-900', label: 'Dark Gray' },
          { value: 'bg-blue-900', label: 'Dark Blue' },
        ],
      },
      {
        name: 'textAlign',
        type: 'select',
        label: 'Text Alignment',
        description: 'Text alignment within the hero',
        defaultValue: 'center',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      {
        name: 'height',
        type: 'select',
        label: 'Height',
        description: 'Overall height of the hero section',
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small (300px)' },
          { value: 'medium', label: 'Medium (500px)' },
          { value: 'large', label: 'Large (700px)' },
          { value: 'full', label: 'Full Screen' },
        ],
      },
      {
        name: 'overlay',
        type: 'boolean',
        label: 'Dark Overlay',
        description: 'Add dark overlay for better text readability',
        defaultValue: true,
      },
      {
        name: 'overlayOpacity',
        type: 'number',
        label: 'Overlay Opacity',
        description: 'Darkness of the overlay (0-1)',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
      },
    ],
    previewProps: {
      title: 'Hero Section Preview',
      subtitle: 'This is how your hero will look',
      description: 'Preview of the hero section with your settings',
      ctaText: 'Preview Button',
      ctaLink: '#',
    },
  },

  // Card Component
  card: {
    type: 'card',
    name: 'Card',
    description: 'Content card with title and description',
    category: 'content',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        description: 'Card title text',
        required: true,
        defaultValue: 'Card Title',
        placeholder: 'Enter card title...',
      },
      {
        name: 'content',
        type: 'textarea',
        label: 'Content',
        description: 'Card description text',
        defaultValue: 'Card content goes here...',
        placeholder: 'Enter card content...',
      },
    ],
    previewProps: {
      title: 'Sample Card',
      content: 'This is a preview of your card content.',
    },
  },

  // Button Component
  button: {
    type: 'button',
    name: 'Button',
    description: 'Clickable button element',
    category: 'interactive',
    fields: [
      {
        name: 'text',
        type: 'text',
        label: 'Button Text',
        description: 'Text displayed on the button',
        required: true,
        defaultValue: 'Click me',
        placeholder: 'Enter button text...',
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Style',
        description: 'Button visual style',
        defaultValue: 'default',
        options: [
          { value: 'default', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' },
          { value: 'link', label: 'Link' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        description: 'Button size',
        defaultValue: 'default',
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'default', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    ],
    previewProps: {
      text: 'Preview Button',
      variant: 'default',
    },
  },

  // Image Component
  image: {
    type: 'image',
    name: 'Image',
    description: 'Image with alt text and dimensions',
    category: 'media',
    fields: [
      {
        name: 'src',
        type: 'text',
        label: 'Image URL',
        description: 'URL of the image to display',
        required: true,
        defaultValue: 'https://images.placeholders.dev/400x300',
        placeholder: 'https://example.com/image.jpg',
        validation: {
          pattern: '^(https?:\\/\\/|mailto:|tel:|\\/|\\.\\/|\\.\\.\\/$|#|[a-zA-Z0-9])',
          message: 'Must be a valid URL, relative path, or file path',
        },
      },
      {
        name: 'alt',
        type: 'text',
        label: 'Alt Text',
        description: 'Alternative text for accessibility',
        required: true,
        defaultValue: 'Image placeholder',
        placeholder: 'Describe the image...',
      },
      {
        name: 'width',
        type: 'number',
        label: 'Width',
        description: 'Image width in pixels',
        defaultValue: 400,
        min: 50,
        max: 2000,
        step: 10,
      },
      {
        name: 'height',
        type: 'number',
        label: 'Height',
        description: 'Image height in pixels',
        defaultValue: 300,
        min: 50,
        max: 2000,
        step: 10,
      },
    ],
    previewProps: {
      src: 'https://images.placeholders.dev/400x300',
      alt: 'Preview image',
      width: 400,
      height: 300,
    },
  },

  // Section Component
  section: {
    type: 'section',
    name: 'Section',
    description: 'Content section with title and body',
    category: 'content',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Section Title',
        description: 'Main heading for the section',
        required: true,
        defaultValue: 'Section Title',
        placeholder: 'Enter section title...',
      },
      {
        name: 'content',
        type: 'textarea',
        label: 'Content',
        description: 'Section content text',
        defaultValue: 'Section content...',
        placeholder: 'Enter section content...',
      },
    ],
    previewProps: {
      title: 'Sample Section',
      content: 'This is a preview of your section content.',
    },
  },

  // Spacer Component
  spacer: {
    type: 'spacer',
    name: 'Spacer',
    description: 'Empty space for layout spacing',
    category: 'layout',
    fields: [
      {
        name: 'height',
        type: 'select',
        label: 'Height',
        description: 'Amount of vertical space',
        defaultValue: '2rem',
        options: [
          { value: '0.5rem', label: 'Extra Small (8px)' },
          { value: '1rem', label: 'Small (16px)' },
          { value: '2rem', label: 'Medium (32px)' },
          { value: '3rem', label: 'Large (48px)' },
          { value: '4rem', label: 'Extra Large (64px)' },
          { value: '6rem', label: 'Huge (96px)' },
        ],
      },
    ],
    previewProps: {
      height: '2rem',
    },
  },

  // Text Block Component
  'text-block': {
    type: 'text-block',
    name: 'Text Block',
    description: 'Simple text content block',
    category: 'content',
    fields: [
      {
        name: 'content',
        type: 'textarea',
        label: 'Content',
        description: 'Text content to display',
        required: true,
        defaultValue: 'Text content...',
        placeholder: 'Enter your text content...',
      },
    ],
    previewProps: {
      content: 'This is a sample text block content.',
    },
  },

  // Container Components (Layout)
  'card-container': {
    type: 'card-container',
    name: 'Card Container',
    description: 'Container with card styling for grouping content',
    category: 'layout',
    fields: [
      {
        name: 'padding',
        type: 'select',
        label: 'Padding',
        description: 'Internal spacing of the container',
        defaultValue: '1.5rem',
        options: [
          { value: '0.5rem', label: 'Small (8px)' },
          { value: '1rem', label: 'Medium (16px)' },
          { value: '1.5rem', label: 'Large (24px)' },
          { value: '2rem', label: 'Extra Large (32px)' },
        ],
      },
      {
        name: 'shadow',
        type: 'boolean',
        label: 'Drop Shadow',
        description: 'Add shadow effect to the container',
        defaultValue: true,
      },
      {
        name: 'border',
        type: 'boolean',
        label: 'Border',
        description: 'Add border around the container',
        defaultValue: true,
      },
      {
        name: 'borderRadius',
        type: 'select',
        label: 'Border Radius',
        description: 'Corner rounding of the container',
        defaultValue: '0.5rem',
        options: [
          { value: '0', label: 'None' },
          { value: '0.25rem', label: 'Small (4px)' },
          { value: '0.5rem', label: 'Medium (8px)' },
          { value: '1rem', label: 'Large (16px)' },
          { value: '9999px', label: 'Full (pill)' },
        ],
      },
    ],
    previewProps: {
      padding: '1.5rem',
      shadow: true,
      border: true,
      borderRadius: '0.5rem',
    },
  },

  row: {
    type: 'row',
    name: 'Row Container',
    description: 'Horizontal layout container for arranging items in a row',
    category: 'layout',
    fields: [
      {
        name: 'gap',
        type: 'select',
        label: 'Gap',
        description: 'Space between items in the row',
        defaultValue: '1rem',
        options: [
          { value: '0', label: 'None' },
          { value: '0.5rem', label: 'Small (8px)' },
          { value: '1rem', label: 'Medium (16px)' },
          { value: '1.5rem', label: 'Large (24px)' },
          { value: '2rem', label: 'Extra Large (32px)' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Vertical Alignment',
        description: 'How items align vertically in the row',
        defaultValue: 'start',
        options: [
          { value: 'start', label: 'Top' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Bottom' },
          { value: 'stretch', label: 'Stretch' },
        ],
      },
      {
        name: 'justify',
        type: 'select',
        label: 'Horizontal Alignment',
        description: 'How items align horizontally in the row',
        defaultValue: 'start',
        options: [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
          { value: 'space-between', label: 'Space Between' },
          { value: 'space-around', label: 'Space Around' },
          { value: 'space-evenly', label: 'Space Evenly' },
        ],
      },
    ],
    previewProps: {
      gap: '1rem',
      align: 'start',
      justify: 'start',
    },
  },

  column: {
    type: 'column',
    name: 'Column Container',
    description: 'Vertical layout container for arranging items in a column',
    category: 'layout',
    fields: [
      {
        name: 'gap',
        type: 'select',
        label: 'Gap',
        description: 'Space between items in the column',
        defaultValue: '1rem',
        options: [
          { value: '0', label: 'None' },
          { value: '0.5rem', label: 'Small (8px)' },
          { value: '1rem', label: 'Medium (16px)' },
          { value: '1.5rem', label: 'Large (24px)' },
          { value: '2rem', label: 'Extra Large (32px)' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Horizontal Alignment',
        description: 'How items align horizontally in the column',
        defaultValue: 'start',
        options: [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
          { value: 'stretch', label: 'Stretch' },
        ],
      },
    ],
    previewProps: {
      gap: '1rem',
      align: 'start',
    },
  },

  grid: {
    type: 'grid',
    name: 'Grid Container',
    description: 'Grid layout container for arranging items in rows and columns',
    category: 'layout',
    fields: [
      {
        name: 'columns',
        type: 'number',
        label: 'Columns',
        description: 'Number of columns in the grid',
        defaultValue: 2,
        min: 1,
        max: 12,
      },
      {
        name: 'gap',
        type: 'select',
        label: 'Gap',
        description: 'Space between grid items',
        defaultValue: '1rem',
        options: [
          { value: '0', label: 'None' },
          { value: '0.5rem', label: 'Small (8px)' },
          { value: '1rem', label: 'Medium (16px)' },
          { value: '1.5rem', label: 'Large (24px)' },
          { value: '2rem', label: 'Extra Large (32px)' },
        ],
      },
      {
        name: 'autoFit',
        type: 'boolean',
        label: 'Auto Fit',
        description: 'Automatically fit columns to available space',
        defaultValue: false,
      },
      {
        name: 'minColumnWidth',
        type: 'select',
        label: 'Min Column Width',
        description: 'Minimum width for auto-fit columns',
        defaultValue: '200px',
        options: [
          { value: '150px', label: '150px' },
          { value: '200px', label: '200px' },
          { value: '250px', label: '250px' },
          { value: '300px', label: '300px' },
        ],
      },
    ],
    previewProps: {
      columns: 2,
      gap: '1rem',
      autoFit: false,
      minColumnWidth: '200px',
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get component definition by type
 */
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS[type];
}

/**
 * Get all available component types
 */
export function getAvailableComponentTypes(): string[] {
  return Object.keys(COMPONENT_DEFINITIONS);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: ComponentDefinition['category']
): ComponentDefinition[] {
  return Object.values(COMPONENT_DEFINITIONS).filter(def => def.category === category);
}

/**
 * Validate component props against field definitions
 */
export function validateComponentProps(
  type: string,
  props: Record<string, unknown>
): {
  isValid: boolean;
  errors: string[];
  sanitizedProps: Record<string, unknown>;
} {
  const definition = getComponentDefinition(type);

  if (!definition) {
    return {
      isValid: false,
      errors: [`Unknown component type: ${type}`],
      sanitizedProps: {},
    };
  }

  const errors: string[] = [];
  const sanitizedProps: Record<string, unknown> = {};

  // Validate each field
  definition.fields.forEach(field => {
    const value = props[field.name];

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label} is required`);
      return;
    }

    // Use default value if not provided
    if (value === undefined || value === null) {
      sanitizedProps[field.name] = field.defaultValue;
      return;
    }

    // Type validation
    switch (field.type) {
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`${field.label} must be a number`);
          sanitizedProps[field.name] = field.defaultValue;
        } else {
          // Check min/max
          if (field.min !== undefined && numValue < field.min) {
            errors.push(`${field.label} must be at least ${field.min}`);
          }
          if (field.max !== undefined && numValue > field.max) {
            errors.push(`${field.label} must be at most ${field.max}`);
          }
          sanitizedProps[field.name] = numValue;
        }
        break;

      case 'boolean':
        sanitizedProps[field.name] = Boolean(value);
        break;

      case 'select':
        const validOptions = field.options?.map(opt => opt.value) || [];
        if (validOptions.length > 0 && !validOptions.includes(String(value))) {
          errors.push(`${field.label} must be one of: ${validOptions.join(', ')}`);
          sanitizedProps[field.name] = field.defaultValue;
        } else {
          sanitizedProps[field.name] = String(value);
        }
        break;

      default:
        // text, textarea, color, image
        const strValue = String(value);

        // Check custom validation pattern if provided
        if (field.validation?.pattern && strValue) {
          const pattern = new RegExp(field.validation.pattern);
          if (!pattern.test(strValue)) {
            errors.push(field.validation.message || `${field.label} format is invalid`);
          }
        }

        sanitizedProps[field.name] = strValue;
        break;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedProps,
  };
}

/**
 * Get default props for a component type
 */
export function getDefaultComponentProps(type: string): Record<string, unknown> {
  const definition = getComponentDefinition(type);

  if (!definition) {
    return {};
  }

  const defaultProps: Record<string, unknown> = {};

  definition.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      defaultProps[field.name] = field.defaultValue;
    }
  });

  return defaultProps;
}
