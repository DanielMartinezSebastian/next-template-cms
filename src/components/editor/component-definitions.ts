/**
 * Component Field Definitions
 * Defines editable fields and their types for each component type
 * This enables dynamic form generation for component editing
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'url'
  | 'image';

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
        type: 'url',
        label: 'Button Link',
        description: 'URL for the call-to-action button',
        defaultValue: '#',
        placeholder: 'https://example.com',
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
        type: 'url',
        label: 'Image URL',
        description: 'URL of the image to display',
        required: true,
        defaultValue: '/placeholder.svg',
        placeholder: 'https://example.com/image.jpg',
      },
      {
        name: 'alt',
        type: 'text',
        label: 'Alt Text',
        description: 'Alternative text for accessibility',
        required: true,
        defaultValue: 'Placeholder image',
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
      src: '/placeholder.svg',
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

      case 'url':
        const urlValue = String(value);
        if (urlValue && !urlValue.match(/^(https?:\/\/|\/|#)/)) {
          errors.push(`${field.label} must be a valid URL`);
        }
        sanitizedProps[field.name] = urlValue;
        break;

      default:
        // text, textarea, color, image
        sanitizedProps[field.name] = String(value);
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
