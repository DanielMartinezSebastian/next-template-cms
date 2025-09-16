/**
 * Component Schema Definitions
 * Automatically generates editor options from TypeScript component interfaces
 */

import { createButtonInterfaceInfo, generateSchemaFromInterface } from './schema-inference';

// =============================================================================
// SCHEMA TYPES
// =============================================================================

export interface PropertySchema {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'select'
    | 'array'
    | 'object'
    | 'color'
    | 'url'
    | 'textarea';
  label: string;
  description?: string;
  default?: unknown;
  options?: Array<{ value: unknown; label: string }>;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface ComponentSchema {
  type: string;
  name: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'marketing' | 'ui';
  icon?: string;
  properties: Record<string, PropertySchema>;
  defaults: Record<string, unknown>;
}

// =============================================================================
// COMPONENT SCHEMAS
// =============================================================================

export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  'hero-section': {
    type: 'hero-section',
    name: 'Hero Section',
    description: 'Large banner section with title, description and call-to-action',
    category: 'layout',
    icon: '🎯',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Main heading text',
        default: 'Welcome to Our Website',
        required: true,
        placeholder: 'Enter main title...',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        description: 'Optional subtitle above the main title',
        default: '',
        placeholder: 'Enter subtitle...',
      },
      description: {
        type: 'textarea',
        label: 'Description',
        description: 'Supporting text below the title',
        default: 'Discover amazing content and services',
        placeholder: 'Enter description...',
      },
      backgroundImage: {
        type: 'url',
        label: 'Background Image',
        description: 'URL of background image',
        default: '',
        placeholder: 'https://example.com/image.jpg',
      },
      backgroundColor: {
        type: 'string',
        label: 'Background Color',
        description: 'Background color or CSS class when no image is used',
        default: 'bg-gradient-to-r from-blue-600 to-purple-600',
        placeholder: 'bg-blue-500 or #000000',
      },
      textAlign: {
        type: 'select',
        label: 'Text Alignment',
        description: 'Text alignment within the hero section',
        default: 'center',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      height: {
        type: 'select',
        label: 'Height',
        description: 'Height of the hero section',
        default: 'medium',
        options: [
          { value: 'small', label: 'Small (300px)' },
          { value: 'medium', label: 'Medium (500px)' },
          { value: 'large', label: 'Large (700px)' },
          { value: 'full', label: 'Full Screen' },
        ],
      },
      ctaText: {
        type: 'string',
        label: 'Button Text',
        description: 'Text for the call-to-action button',
        default: 'Get Started',
        placeholder: 'Button text...',
      },
      ctaLink: {
        type: 'url',
        label: 'Button Link',
        description: 'URL or path for the button link',
        default: '#',
        placeholder: '/contact or https://example.com',
      },
      ctaType: {
        type: 'select',
        label: 'Button Style',
        description: 'Visual style of the button',
        default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ],
      },
      overlay: {
        type: 'boolean',
        label: 'Show Overlay',
        description: 'Add dark overlay over background image',
        default: true,
      },
      overlayOpacity: {
        type: 'number',
        label: 'Overlay Opacity',
        description: 'Opacity of the dark overlay (0-1)',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
    defaults: {
      title: 'Welcome to Our Website',
      subtitle: '',
      description: 'Discover amazing content and services',
      backgroundImage: '',
      backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      textAlign: 'center',
      height: 'medium',
      ctaText: 'Get Started',
      ctaLink: '#',
      ctaType: 'default',
      overlay: true,
      overlayOpacity: 0.5,
    },
  },

  'image-gallery': {
    type: 'image-gallery',
    name: 'Image Gallery',
    description: 'Grid of images with optional lightbox functionality',
    category: 'media',
    icon: '🖼️',
    properties: {
      title: {
        type: 'string',
        label: 'Gallery Title',
        description: 'Optional title for the gallery',
        default: '',
        placeholder: 'Gallery title...',
      },
      columns: {
        type: 'select',
        label: 'Columns',
        description: 'Number of columns in the grid',
        default: 3,
        options: [
          { value: 1, label: '1 Column' },
          { value: 2, label: '2 Columns' },
          { value: 3, label: '3 Columns' },
          { value: 4, label: '4 Columns' },
        ],
      },
      spacing: {
        type: 'select',
        label: 'Spacing',
        description: 'Gap between images',
        default: 'medium',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      aspectRatio: {
        type: 'select',
        label: 'Aspect Ratio',
        description: 'Shape of the images',
        default: 'landscape',
        options: [
          { value: 'square', label: 'Square (1:1)' },
          { value: 'landscape', label: 'Landscape (16:9)' },
          { value: 'portrait', label: 'Portrait (3:4)' },
          { value: 'auto', label: 'Original' },
        ],
      },
      lightbox: {
        type: 'boolean',
        label: 'Enable Lightbox',
        description: 'Allow clicking images to view in full size',
        default: false,
      },
      showTitles: {
        type: 'boolean',
        label: 'Show Image Titles',
        description: 'Display title for each image',
        default: false,
      },
      showDescriptions: {
        type: 'boolean',
        label: 'Show Descriptions',
        description: 'Display description for each image',
        default: false,
      },
    },
    defaults: {
      title: '',
      columns: 3,
      spacing: 'medium',
      aspectRatio: 'landscape',
      lightbox: false,
      showTitles: false,
      showDescriptions: false,
      images: [],
    },
  },

  'text-block': {
    type: 'text-block',
    name: 'Text Block',
    description: 'Formatted text content with styling options',
    category: 'content',
    icon: '📝',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Optional title for the text block',
        default: '',
        placeholder: 'Section title...',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        description: 'Optional subtitle',
        default: '',
        placeholder: 'Section subtitle...',
      },
      content: {
        type: 'textarea',
        label: 'Content',
        description: 'Main text content',
        default: '',
        required: true,
        placeholder: 'Enter your content here...',
      },
      textAlign: {
        type: 'select',
        label: 'Text Alignment',
        description: 'Alignment of the text',
        default: 'left',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
          { value: 'justify', label: 'Justify' },
        ],
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        description: 'Size of the text',
        default: 'medium',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      fontWeight: {
        type: 'select',
        label: 'Font Weight',
        description: 'Weight of the text',
        default: 'normal',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'medium', label: 'Medium' },
          { value: 'bold', label: 'Bold' },
        ],
      },
      padding: {
        type: 'select',
        label: 'Padding',
        description: 'Internal spacing',
        default: 'medium',
        options: [
          { value: 'none', label: 'None' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      margin: {
        type: 'select',
        label: 'Margin',
        description: 'External spacing',
        default: 'medium',
        options: [
          { value: 'none', label: 'None' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      maxWidth: {
        type: 'select',
        label: 'Max Width',
        description: 'Maximum width constraint',
        default: 'prose',
        options: [
          { value: 'none', label: 'Full Width' },
          { value: 'prose', label: 'Reading Width' },
          { value: 'container', label: 'Container Width' },
        ],
      },
      color: {
        type: 'color',
        label: 'Text Color',
        description: 'Custom text color',
        default: '',
        placeholder: '#000000',
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        description: 'Background color for the text block',
        default: '',
        placeholder: '#ffffff',
      },
      allowHtml: {
        type: 'boolean',
        label: 'Allow HTML',
        description: 'Render HTML tags in content (use with caution)',
        default: false,
      },
    },
    defaults: {
      title: '',
      subtitle: '',
      content: '',
      textAlign: 'left',
      fontSize: 'medium',
      fontWeight: 'normal',
      padding: 'medium',
      margin: 'medium',
      maxWidth: 'prose',
      color: '',
      backgroundColor: '',
      allowHtml: false,
    },
  },

  testimonials: {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials and reviews',
    category: 'marketing',
    icon: '💬',
    properties: {
      title: {
        type: 'string',
        label: 'Section Title',
        description: 'Title for the testimonials section',
        default: 'What our customers say',
        placeholder: 'Testimonials title...',
      },
      layout: {
        type: 'select',
        label: 'Layout',
        description: 'How to display testimonials',
        default: 'grid',
        options: [
          { value: 'grid', label: 'Grid Layout' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'list', label: 'List' },
        ],
      },
    },
    defaults: {
      title: 'What our customers say',
      layout: 'grid',
      testimonials: [],
    },
  },

  // =============================================================================
  // AUTO-GENERATED SCHEMAS (from TypeScript interfaces)
  // =============================================================================

  // Button component schema generated automatically from ButtonComponentProps interface
  ...(() => {
    const buttonInterfaceInfo = createButtonInterfaceInfo();
    const buttonSchema = generateSchemaFromInterface(buttonInterfaceInfo);

    return { [buttonSchema.type]: buttonSchema };
  })(),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get schema for a specific component type
 */
export function getComponentSchema(type: string): ComponentSchema | null {
  return COMPONENT_SCHEMAS[type] || null;
}

/**
 * Get all available component schemas
 */
export function getAllComponentSchemas(): ComponentSchema[] {
  return Object.values(COMPONENT_SCHEMAS);
}

/**
 * Get schemas grouped by category
 */
export function getSchemasByCategory(): Record<string, ComponentSchema[]> {
  const grouped: Record<string, ComponentSchema[]> = {};

  Object.values(COMPONENT_SCHEMAS).forEach(schema => {
    if (!grouped[schema.category]) {
      grouped[schema.category] = [];
    }
    grouped[schema.category].push(schema);
  });

  return grouped;
}

/**
 * Get default props for a component type
 */
export function getComponentDefaults(type: string): Record<string, unknown> {
  const schema = getComponentSchema(type);
  return schema?.defaults || {};
}

/**
 * Validate component props against schema
 */
export function validateComponentProps(
  type: string,
  props: Record<string, unknown>
): {
  isValid: boolean;
  errors: string[];
  sanitizedProps: Record<string, unknown>;
} {
  const schema = getComponentSchema(type);

  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown component type: ${type}`],
      sanitizedProps: {},
    };
  }

  const errors: string[] = [];
  const sanitizedProps: Record<string, unknown> = { ...schema.defaults };

  // Validate each property
  Object.entries(schema.properties).forEach(([key, propertySchema]) => {
    const value = props[key];

    // Check required fields
    if (propertySchema.required && (value === undefined || value === null || value === '')) {
      errors.push(`${propertySchema.label} is required`);
      return;
    }

    // Skip validation if value is undefined/null and not required
    if (value === undefined || value === null) {
      return;
    }

    // Type validation
    switch (propertySchema.type) {
      case 'string':
      case 'textarea':
      case 'url':
      case 'color':
        if (typeof value !== 'string') {
          errors.push(`${propertySchema.label} must be a string`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`${propertySchema.label} must be a valid number`);
        } else {
          // Check min/max constraints
          if (propertySchema.min !== undefined && value < propertySchema.min) {
            errors.push(`${propertySchema.label} must be at least ${propertySchema.min}`);
          } else if (propertySchema.max !== undefined && value > propertySchema.max) {
            errors.push(`${propertySchema.label} must be at most ${propertySchema.max}`);
          } else {
            sanitizedProps[key] = value;
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${propertySchema.label} must be true or false`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'select':
        const validOptions = propertySchema.options?.map(opt => opt.value) || [];
        if (!validOptions.includes(value)) {
          errors.push(`${propertySchema.label} must be one of: ${validOptions.join(', ')}`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${propertySchema.label} must be an array`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`${propertySchema.label} must be an object`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      default:
        sanitizedProps[key] = value;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedProps,
  };
}

/**
 * Generate form fields for component editor
 */
export function generateFormFields(type: string): Array<{
  key: string;
  schema: PropertySchema;
  value: unknown;
}> {
  const schema = getComponentSchema(type);

  if (!schema) {
    return [];
  }

  return Object.entries(schema.properties).map(([key, propertySchema]) => ({
    key,
    schema: propertySchema,
    value: schema.defaults[key],
  }));
}
