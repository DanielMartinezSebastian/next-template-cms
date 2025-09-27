/**
 * Schema to Editor Configuration Generator
 * Automatically generates UI editor configuration from Zod schemas
 */

import { z } from 'zod';
import type { EditorFieldConfig, SchemaToEditorResult } from './types';

// =============================================================================
// SCHEMA ANALYSIS UTILITIES
// =============================================================================

/**
 * Analyzes a Zod schema and extracts field information
 */
function analyzeZodSchema(schema: z.ZodSchema): Record<string, EditorFieldConfig> {
  const fields: Record<string, EditorFieldConfig> = {};

  // Handle different Zod types
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    
    for (const [key, fieldSchema] of Object.entries(shape)) {
      const fieldConfig = analyzeZodField(key, fieldSchema as z.ZodSchema);
      if (fieldConfig) {
        fields[key] = fieldConfig;
      }
    }
  }

  return fields;
}

/**
 * Analyzes individual Zod field and returns editor configuration
 */
function analyzeZodField(fieldName: string, fieldSchema: z.ZodSchema): EditorFieldConfig | null {
  const baseConfig: EditorFieldConfig = {
    type: 'string',
    label: formatFieldLabel(fieldName),
    description: generateFieldDescription(fieldName),
    placeholder: generatePlaceholder(fieldName),
    required: true,
  };

  // Handle optional fields
  if (fieldSchema instanceof z.ZodOptional) {
    baseConfig.required = false;
    fieldSchema = fieldSchema._def.innerType;
  }

  // Handle different Zod types
  if (fieldSchema instanceof z.ZodString) {
    return handleStringField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodNumber) {
    return handleNumberField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodBoolean) {
    return handleBooleanField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodEnum) {
    return handleEnumField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodArray) {
    return handleArrayField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodObject) {
    return handleObjectField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodUnion) {
    return handleUnionField(fieldName, fieldSchema, baseConfig);
  } else if (fieldSchema instanceof z.ZodLiteral) {
    return handleLiteralField(fieldName, fieldSchema, baseConfig);
  }

  // Default fallback
  return baseConfig;
}

// =============================================================================
// FIELD TYPE HANDLERS
// =============================================================================

/**
 * Handle string fields with smart type detection
 */
function handleStringField(
  fieldName: string,
  schema: z.ZodString,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  const config = { ...baseConfig };

  // Detect special string types based on field name
  const lowerName = fieldName.toLowerCase();
  
  if (lowerName.includes('color')) {
    config.type = 'color' as const;
    config.placeholder = '#000000';
  } else if (lowerName.includes('url') || lowerName.includes('href') || lowerName.includes('link')) {
    config.type = 'url' as const;
    config.placeholder = 'https://example.com';
  } else if (lowerName.includes('email')) {
    config.type = 'string' as const;
    config.placeholder = 'user@example.com';
    config.pattern = '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$';
    config.validationMessage = 'Please enter a valid email address';
  } else if (lowerName.includes('description') || lowerName.includes('content') || lowerName.includes('text')) {
    config.type = 'textarea' as const;
  }

  // Apply Zod constraints
  const checks = (schema as any)._def.checks || [];
  for (const check of checks) {
    switch (check.kind) {
      case 'min':
        config.min = check.value;
        break;
      case 'max':
        config.max = check.value;
        break;
      case 'regex':
        config.pattern = check.regex.source;
        break;
    }
  }

  return config;
}

/**
 * Handle number fields
 */
function handleNumberField(
  fieldName: string,
  schema: z.ZodNumber,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  const config = { ...baseConfig, type: 'number' as const };

  // Apply Zod constraints
  const checks = (schema as any)._def.checks || [];
  for (const check of checks) {
    switch (check.kind) {
      case 'min':
        config.min = check.value;
        break;
      case 'max':
        config.max = check.value;
        break;
      case 'int':
        config.step = 1;
        break;
    }
  }

  // Smart defaults based on field name
  const lowerName = fieldName.toLowerCase();
  if (lowerName.includes('percent') || lowerName.includes('opacity')) {
    config.min = 0;
    config.max = 100;
    config.step = 1;
  } else if (lowerName.includes('width') || lowerName.includes('height')) {
    config.min = 0;
    config.step = 1;
  }

  return config;
}

/**
 * Handle boolean fields
 */
function handleBooleanField(
  fieldName: string,
  schema: z.ZodBoolean,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  return {
    ...baseConfig,
    type: 'boolean',
    description: baseConfig.description || `Enable ${formatFieldLabel(fieldName).toLowerCase()}`,
  };
}

/**
 * Handle enum fields
 */
function handleEnumField(
  fieldName: string,
  schema: z.ZodEnum<any>,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  const options = schema.options.map((value: string) => ({
    value,
    label: formatFieldLabel(value),
    description: generateOptionDescription(fieldName, value),
  }));

  return {
    ...baseConfig,
    type: 'select',
    options,
  };
}

/**
 * Handle array fields
 */
function handleArrayField(
  fieldName: string,
  schema: z.ZodArray<any>,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  return {
    ...baseConfig,
    type: 'array',
    description: `${baseConfig.description} (List of items)`,
  };
}

/**
 * Handle object fields
 */
function handleObjectField(
  fieldName: string,
  schema: z.ZodObject<any>,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  return {
    ...baseConfig,
    type: 'object',
    description: `${baseConfig.description} (JSON object)`,
  };
}

/**
 * Handle union fields (convert to select when possible)
 */
function handleUnionField(
  fieldName: string,
  schema: z.ZodUnion<any>,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  const options = schema.options;
  
  // If all union options are literals, create a select field
  const literalValues: string[] = [];
  let allLiterals = true;

  for (const option of options) {
    if (option instanceof z.ZodLiteral) {
      literalValues.push(String(option.value));
    } else {
      allLiterals = false;
      break;
    }
  }

  if (allLiterals && literalValues.length > 0) {
    return {
      ...baseConfig,
      type: 'select',
      options: literalValues.map(value => ({
        value,
        label: formatFieldLabel(value),
      })),
    };
  }

  // Fallback to string field
  return baseConfig;
}

/**
 * Handle literal fields
 */
function handleLiteralField(
  fieldName: string,
  schema: z.ZodLiteral<any>,
  baseConfig: EditorFieldConfig
): EditorFieldConfig {
  const value = schema.value;
  
  return {
    ...baseConfig,
    type: typeof value === 'boolean' ? 'boolean' : 'string',
    description: `${baseConfig.description} (Fixed value: ${value})`,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format field name into human-readable label
 */
function formatFieldLabel(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Generate field description based on name patterns
 */
function generateFieldDescription(fieldName: string): string {
  const lowerName = fieldName.toLowerCase();
  
  const descriptions: Record<string, string> = {
    title: 'The main heading or title text',
    subtitle: 'Secondary heading text below the main title',
    description: 'Descriptive text content',
    content: 'Main content body',
    text: 'Text content',
    url: 'Web address or link',
    href: 'Navigation link destination',
    link: 'URL or internal link',
    image: 'Image source URL',
    src: 'Source URL for media content',
    alt: 'Alternative text for accessibility',
    width: 'Width in pixels',
    height: 'Height in pixels',
    color: 'Color value (hex, rgb, or CSS color)',
    bgcolor: 'Background color',
    variant: 'Visual style variant',
    size: 'Size option',
    disabled: 'Whether the element is disabled',
    visible: 'Whether the element is visible',
    enabled: 'Whether the feature is enabled',
    className: 'Additional CSS classes',
    id: 'Unique identifier',
  };

  // Check for exact matches first
  if (descriptions[lowerName]) {
    return descriptions[lowerName];
  }

  // Check for partial matches
  for (const [key, desc] of Object.entries(descriptions)) {
    if (lowerName.includes(key)) {
      return desc;
    }
  }

  // Default description
  return `Configuration for ${formatFieldLabel(fieldName).toLowerCase()}`;
}

/**
 * Generate placeholder text for fields
 */
function generatePlaceholder(fieldName: string): string {
  const lowerName = fieldName.toLowerCase();
  
  const placeholders: Record<string, string> = {
    title: 'Enter title...',
    subtitle: 'Enter subtitle...',
    description: 'Enter description...',
    content: 'Enter content...',
    text: 'Enter text...',
    url: 'https://example.com',
    href: '/path/to/page',
    email: 'user@example.com',
    color: '#000000',
    className: 'css-class-name',
  };

  // Check for exact matches
  if (placeholders[lowerName]) {
    return placeholders[lowerName];
  }

  // Check for partial matches
  for (const [key, placeholder] of Object.entries(placeholders)) {
    if (lowerName.includes(key)) {
      return placeholder;
    }
  }

  // Default placeholder
  return `Enter ${formatFieldLabel(fieldName).toLowerCase()}...`;
}

/**
 * Generate description for select options
 */
function generateOptionDescription(fieldName: string, optionValue: string): string | undefined {
  const lowerField = fieldName.toLowerCase();
  const lowerValue = optionValue.toLowerCase();

  // Generate contextual descriptions for common field/option combinations
  if (lowerField.includes('variant')) {
    const variantDescriptions: Record<string, string> = {
      default: 'Standard appearance',
      primary: 'Primary brand styling',
      secondary: 'Secondary styling',
      destructive: 'Warning or danger styling',
      outline: 'Outline or border only',
      ghost: 'Minimal styling',
      link: 'Text link appearance',
    };
    return variantDescriptions[lowerValue];
  }

  if (lowerField.includes('size')) {
    const sizeDescriptions: Record<string, string> = {
      sm: 'Small size',
      md: 'Medium size',
      lg: 'Large size',
      xl: 'Extra large size',
      small: 'Small size',
      medium: 'Medium size',
      large: 'Large size',
    };
    return sizeDescriptions[lowerValue];
  }

  return undefined;
}

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

/**
 * Convert Zod schema to editor configuration
 */
export function schemaToEditor(schema: z.ZodSchema): SchemaToEditorResult {
  const fields = analyzeZodSchema(schema);

  // Create logical field groups
  const groups = createFieldGroups(fields);

  return {
    fields,
    groups: groups.length > 0 ? groups : undefined,
  };
}

/**
 * Create logical field groups based on field names and types
 */
function createFieldGroups(fields: Record<string, EditorFieldConfig>) {
  const groups: Array<{
    name: string;
    label: string;
    description?: string;
    collapsed?: boolean;
    fields: string[];
  }> = [];

  const fieldNames = Object.keys(fields);
  const groupedFields = new Set<string>();

  // Content group
  const contentFields = fieldNames.filter(name => {
    const lowerName = name.toLowerCase();
    return lowerName.includes('title') || 
           lowerName.includes('subtitle') || 
           lowerName.includes('description') || 
           lowerName.includes('content') || 
           lowerName.includes('text');
  });

  if (contentFields.length > 0) {
    groups.push({
      name: 'content',
      label: 'Content',
      description: 'Text content and messaging',
      fields: contentFields,
    });
    contentFields.forEach(field => groupedFields.add(field));
  }

  // Appearance group
  const appearanceFields = fieldNames.filter(name => {
    const lowerName = name.toLowerCase();
    return (lowerName.includes('color') || 
            lowerName.includes('variant') || 
            lowerName.includes('size') || 
            lowerName.includes('className') || 
            lowerName.includes('style')) &&
           !groupedFields.has(name);
  });

  if (appearanceFields.length > 0) {
    groups.push({
      name: 'appearance',
      label: 'Appearance',
      description: 'Visual styling and presentation',
      fields: appearanceFields,
    });
    appearanceFields.forEach(field => groupedFields.add(field));
  }

  // Behavior group
  const behaviorFields = fieldNames.filter(name => {
    const lowerName = name.toLowerCase();
    return (lowerName.includes('disabled') || 
            lowerName.includes('visible') || 
            lowerName.includes('enabled') || 
            lowerName.includes('onclick') || 
            lowerName.includes('href') || 
            lowerName.includes('link')) &&
           !groupedFields.has(name);
  });

  if (behaviorFields.length > 0) {
    groups.push({
      name: 'behavior',
      label: 'Behavior',
      description: 'Interactive behavior and actions',
      fields: behaviorFields,
    });
    behaviorFields.forEach(field => groupedFields.add(field));
  }

  // Advanced group (remaining fields)
  const advancedFields = fieldNames.filter(name => !groupedFields.has(name));
  
  if (advancedFields.length > 0) {
    groups.push({
      name: 'advanced',
      label: 'Advanced',
      description: 'Advanced configuration options',
      collapsed: true,
      fields: advancedFields,
    });
  }

  return groups;
}
