/**
 * Schema Inference from TypeScript Interfaces
 * Automatically generates component schemas from TypeScript interfaces
 */

import type { ComponentSchema, PropertySchema } from './component-schemas';

// Type definitions for schema inference
type TSPropertyType = 'string' | 'number' | 'boolean' | 'function' | 'union' | 'object' | 'array';

interface TSProperty {
  name: string;
  type: TSPropertyType;
  optional: boolean;
  unionValues?: string[];
  description?: string;
  defaultValue?: unknown;
}

interface ComponentInterfaceInfo {
  interfaceName: string;
  componentName: string;
  description?: string;
  category?: ComponentSchema['category'];
  icon?: string;
  properties: TSProperty[];
}

/**
 * Infers PropertySchema from TypeScript property information
 */
function inferPropertySchema(property: TSProperty): PropertySchema | null {
  const { name, type, optional, unionValues, description, defaultValue } = property;

  // Base schema
  const schema: PropertySchema = {
    type: 'string', // Default fallback
    label: formatLabel(name),
    description: description || generateDescription(name, type),
    required: !optional,
    default: defaultValue,
  };

  // Infer schema type based on TypeScript type
  switch (type) {
    case 'string':
      schema.type = inferStringType(name, unionValues);
      if (unionValues && unionValues.length > 0) {
        schema.type = 'select';
        schema.options = unionValues.map(value => ({
          value,
          label: formatLabel(value),
        }));
      }
      break;

    case 'number':
      schema.type = 'number';
      schema.placeholder = `Enter ${schema.label.toLowerCase()}...`;
      break;

    case 'boolean':
      schema.type = 'boolean';
      schema.description = schema.description || `Enable ${schema.label.toLowerCase()}`;
      break;

    case 'union':
      if (unionValues) {
        schema.type = 'select';
        schema.options = unionValues.map(value => ({
          value,
          label: formatLabel(value),
        }));
      }
      break;

    case 'function':
      // Skip function properties as they're not editable in UI
      return null;

    case 'object':
    case 'array':
      // For now, treat complex types as string (JSON)
      schema.type = 'textarea';
      schema.description = `${schema.description} (JSON format)`;
      break;
  }

  // Add specific configurations based on property name patterns
  if (name.toLowerCase().includes('color')) {
    schema.type = 'color';
    schema.placeholder = '#000000';
  } else if (name.toLowerCase().includes('url') || name.toLowerCase().includes('href')) {
    schema.type = 'url';
    schema.placeholder = 'https://example.com';
  } else if (name.toLowerCase().includes('description') || name.toLowerCase().includes('content')) {
    schema.type = 'textarea';
    schema.placeholder = `Enter ${schema.label.toLowerCase()}...`;
  } else if (schema.type === 'string' && !schema.options) {
    schema.placeholder = `Enter ${schema.label.toLowerCase()}...`;
  }

  return schema;
}

/**
 * Infers string schema type based on property name and union values
 */
function inferStringType(name: string, unionValues?: string[]): PropertySchema['type'] {
  const lowerName = name.toLowerCase();

  if (unionValues && unionValues.length > 0) {
    return 'select';
  }

  if (lowerName.includes('color')) return 'color';
  if (lowerName.includes('url') || lowerName.includes('href')) return 'url';
  if (
    lowerName.includes('description') ||
    lowerName.includes('content') ||
    lowerName.includes('text')
  ) {
    return 'textarea';
  }

  return 'string';
}

/**
 * Generates a user-friendly label from property name
 */
function formatLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
}

/**
 * Generates description based on property name and type
 */
function generateDescription(name: string, type: TSPropertyType): string {
  const label = formatLabel(name).toLowerCase();

  switch (type) {
    case 'string':
      if (name.toLowerCase().includes('url') || name.toLowerCase().includes('href')) {
        return `URL or path for the ${label}`;
      }
      if (name.toLowerCase().includes('color')) {
        return `Color value for the ${label}`;
      }
      return `Text value for the ${label}`;

    case 'number':
      return `Numeric value for the ${label}`;

    case 'boolean':
      return `Enable or disable ${label}`;

    case 'union':
      return `Selection option for ${label}`;

    default:
      return `Configuration for ${label}`;
  }
}

/**
 * Main function to generate ComponentSchema from interface information
 */
export function generateSchemaFromInterface(info: ComponentInterfaceInfo): ComponentSchema {
  const properties: Record<string, PropertySchema> = {};
  const defaults: Record<string, unknown> = {};

  // Validate input
  if (!info || !info.properties || !Array.isArray(info.properties)) {
    console.error('Invalid ComponentInterfaceInfo:', info);
    throw new Error('ComponentInterfaceInfo must have a properties array');
  }

  // Process each property
  for (const property of info.properties) {
    const schema = inferPropertySchema(property);

    // Skip function properties or invalid schemas
    if (!schema) continue;

    properties[property.name] = schema;

    // Set default value
    if (property.defaultValue !== undefined) {
      defaults[property.name] = property.defaultValue;
    } else {
      // Infer sensible defaults
      switch (schema.type) {
        case 'string':
        case 'textarea':
        case 'url':
        case 'color':
          defaults[property.name] = '';
          break;
        case 'number':
          defaults[property.name] = 0;
          break;
        case 'boolean':
          defaults[property.name] = false;
          break;
        case 'select':
          defaults[property.name] = schema.options?.[0]?.value || '';
          break;
      }
    }
  }

  return {
    type: info.componentName.toLowerCase().replace(/component$/, ''), // Remove 'Component' suffix
    name: formatLabel(info.componentName.replace(/Component$/, '')),
    description: info.description || `${formatLabel(info.componentName)} component`,
    category: info.category || 'ui',
    icon: info.icon || '🧩',
    properties,
    defaults,
  };
}

/**
 * Helper function to create interface info for Button component
 * This serves as an example of how to define component interface info
 */
export function createButtonInterfaceInfo(): ComponentInterfaceInfo {
  return {
    interfaceName: 'ButtonComponentProps',
    componentName: 'Button',
    description: 'Interactive button component with customizable appearance and behavior',
    category: 'ui',
    icon: '🔘',
    properties: [
      {
        name: 'text',
        type: 'string',
        optional: true,
        description: 'Text displayed on the button',
        defaultValue: 'Button',
      },
      {
        name: 'href',
        type: 'string',
        optional: true,
        description: 'URL or path for navigation when button is clicked',
      },
      {
        name: 'variant',
        type: 'union',
        optional: true,
        unionValues: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        description: 'Visual style variant of the button',
        defaultValue: 'default',
      },
      {
        name: 'size',
        type: 'union',
        optional: true,
        unionValues: ['default', 'sm', 'lg', 'icon'],
        description: 'Size of the button',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        optional: true,
        description: 'Whether the button is disabled',
        defaultValue: false,
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        optional: true,
        description: 'Whether the button should take full width',
        defaultValue: false,
      },
      {
        name: 'centerAlign',
        type: 'boolean',
        optional: true,
        description: 'Whether to center the button horizontally',
        defaultValue: false,
      },
      {
        name: 'className',
        type: 'string',
        optional: true,
        description: 'Additional CSS classes to apply',
      },
      // Skip onClick as it's a function
    ],
  };
}

/**
 * Generate schema for Button component using the interface info
 */
export function generateButtonSchema(): ComponentSchema {
  const interfaceInfo = createButtonInterfaceInfo();
  return generateSchemaFromInterface(interfaceInfo);
}

// Export utility functions for other components
export { type ComponentInterfaceInfo, type TSProperty };
