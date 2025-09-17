/**
 * Schema Configuration Generator
 * Generates component schemas automatically from component-config.json and TypeScript interfaces
 * This eliminates hardcoding and makes the system truly configurable
 */

import { ComponentSchema, PropertySchema } from './component-schemas';
import { AUTO_GENERATED_SCHEMAS } from './generated/component-schemas';

// Import the configuration JSON
import componentConfig from '../../component-config.json';

/**
 * Get the component configuration from JSON
 */
function getComponentConfig() {
  return componentConfig;
}

// =============================================================================
// TYPES
// =============================================================================

interface ComponentConfigOption {
  value: unknown;
  label: string;
}

interface ComponentConfigProperty {
  type?: PropertySchema['type'];
  label?: string;
  description?: string;
  options?: ComponentConfigOption[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

interface ComponentConfigOverride {
  name?: string;
  description?: string;
  category?: ComponentSchema['category'];
  icon?: string;
  properties?: Record<string, ComponentConfigProperty>;
}

// =============================================================================
// CONFIGURATION-BASED SCHEMA GENERATION
// =============================================================================

/**
 * Enhanced field type mapping with better inference from TypeScript
 */
const ENHANCED_TYPE_MAPPING: Record<string, PropertySchema['type']> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  // Enhanced mappings based on property names and patterns
  color: 'color',
  url: 'url',
  email: 'string',
  text: 'string',
  textarea: 'textarea',
  select: 'select',
};

/**
 * Detects field type from property name patterns
 */
function inferTypeFromPropertyName(propertyName: string, baseType: string): PropertySchema['type'] {
  const name = propertyName.toLowerCase();

  // Color fields
  if (name.includes('color') || (name.includes('background') && name.includes('color'))) {
    return 'color';
  }

  // URL fields
  if (
    name.includes('url') ||
    name.includes('link') ||
    name.includes('href') ||
    name.includes('src') ||
    (name.includes('image') && baseType === 'string')
  ) {
    return 'url';
  }

  // Textarea fields
  if (
    name.includes('description') ||
    name.includes('content') ||
    name.includes('text') ||
    name.includes('message') ||
    name.includes('quote')
  ) {
    return 'textarea';
  }

  // Select fields with known patterns
  if (
    name.includes('align') ||
    name.includes('position') ||
    name.includes('variant') ||
    name.includes('size') ||
    name.includes('type') ||
    name.includes('spacing') ||
    name.includes('ratio') ||
    name.includes('columns')
  ) {
    return 'select';
  }

  return ENHANCED_TYPE_MAPPING[baseType] || 'string';
}

/**
 * Gets predefined options for common select fields
 */
function getPredefinedOptions(propertyName: string): ComponentConfigOption[] | undefined {
  const name = propertyName.toLowerCase();

  // Common option patterns
  const optionMappings: Record<string, ComponentConfigOption[]> = {
    // Layout options
    columns: [
      { value: 1, label: '1 Column' },
      { value: 2, label: '2 Columns' },
      { value: 3, label: '3 Columns' },
      { value: 4, label: '4 Columns' },
      { value: 6, label: '6 Columns' },
    ],

    // Spacing options
    spacing: [
      { value: 'none', label: 'None' },
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],

    // Size options
    size: [
      { value: 'sm', label: 'Small' },
      { value: 'default', label: 'Default' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],

    // Alignment options
    align: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
      { value: 'justify', label: 'Justify' },
    ],

    // Text alignment
    textalign: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
      { value: 'justify', label: 'Justify' },
    ],

    // Position options
    position: [
      { value: 'top', label: 'Top' },
      { value: 'bottom', label: 'Bottom' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],

    // Image position
    imageposition: [
      { value: 'top', label: 'Top' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
      { value: 'bottom', label: 'Bottom' },
    ],

    // Aspect ratio options
    aspectratio: [
      { value: 'square', label: 'Square (1:1)' },
      { value: 'landscape', label: 'Landscape (16:9)' },
      { value: 'portrait', label: 'Portrait (3:4)' },
      { value: 'auto', label: 'Auto (original)' },
    ],

    // Button variants
    variant: [
      { value: 'default', label: 'Default' },
      { value: 'secondary', label: 'Secondary' },
      { value: 'destructive', label: 'Destructive' },
      { value: 'outline', label: 'Outline' },
      { value: 'ghost', label: 'Ghost' },
      { value: 'link', label: 'Link' },
    ],

    // Font weight
    fontweight: [
      { value: 'normal', label: 'Normal' },
      { value: 'medium', label: 'Medium' },
      { value: 'semibold', label: 'Semibold' },
      { value: 'bold', label: 'Bold' },
    ],

    // Font size
    fontsize: [
      { value: 'xs', label: 'Extra Small' },
      { value: 'sm', label: 'Small' },
      { value: 'base', label: 'Base' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
      { value: '2xl', label: '2X Large' },
    ],
  };

  // Find matching pattern
  for (const [pattern, options] of Object.entries(optionMappings)) {
    if (name.includes(pattern)) {
      return options;
    }
  }

  return undefined;
}

/**
 * Generates enhanced property schema from auto-generated schema + config
 */
function generatePropertySchema(
  propertyName: string,
  autoGenProperty: Record<string, unknown>,
  configOverride?: ComponentConfigProperty
): PropertySchema {
  // Start with auto-generated base
  const baseType = (autoGenProperty.type as string) || 'string';

  // Apply config override first, then intelligent inference
  const inferredType = configOverride?.type || inferTypeFromPropertyName(propertyName, baseType);

  // Generate base schema
  const schema: PropertySchema = {
    type: inferredType,
    label:
      configOverride?.label ||
      (autoGenProperty.label as string) ||
      propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
    description:
      configOverride?.description ||
      (autoGenProperty.description as string) ||
      `${propertyName} property`,
    default: autoGenProperty.default,
    required: configOverride?.required || (autoGenProperty.required as boolean) || false,
    placeholder: configOverride?.placeholder || (autoGenProperty.placeholder as string),
  };

  // Add options for select types
  if (schema.type === 'select') {
    schema.options = configOverride?.options ||
      getPredefinedOptions(propertyName) || [
        { value: autoGenProperty.default || '', label: 'Default' },
      ];
  }

  // Add validation if provided
  if (configOverride?.validation) {
    schema.validation = configOverride.validation;
  }

  // Add numeric constraints
  if (schema.type === 'number') {
    if (configOverride?.min !== undefined) schema.min = configOverride.min;
    if (configOverride?.max !== undefined) schema.max = configOverride.max;
  }

  return schema;
}

/**
 * Gets component-specific defaults from configuration
 */
function getComponentDefaults(componentType: string): Record<string, unknown> {
  const config = getComponentConfig();
  const configDefaults = config.componentSpecificDefaults;
  const componentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);

  // Try different name variations
  const possibleNames = [
    componentName,
    componentType,
    componentType.toLowerCase(),
    componentType
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .slice(1), // camelCase to snake_case
  ];

  for (const name of possibleNames) {
    if (configDefaults[name as keyof typeof configDefaults]) {
      return configDefaults[name as keyof typeof configDefaults];
    }
  }

  return {};
}

/**
 * Main function: Generate component schema from config + auto-generated data
 */
export function generateComponentSchemaFromConfig(componentType: string): ComponentSchema | null {
  // Handle component type mapping for known mismatches
  let searchType = componentType;
  const typeMapping: Record<string, string> = {
    imagegallery: 'image-gallery',
    textblock: 'text-block',
    featuregrid: 'feature-grid',
    herosection: 'hero-section',
    calltoaction: 'call-to-action',
    contactform: 'contact-form',
  };

  // Convert camelCase to dash-case for schema lookup
  if (typeMapping[componentType]) {
    searchType = typeMapping[componentType];
  }

  // Get auto-generated schema
  const autoGenSchema = (AUTO_GENERATED_SCHEMAS as Record<string, Record<string, unknown>>)[
    searchType
  ];
  if (!autoGenSchema) {
    console.warn(
      `No auto-generated schema found for component: ${componentType} (searched as: ${searchType})`
    );
    return null;
  }

  // Get configuration overrides (if any)
  const configOverrides: ComponentConfigOverride = {}; // Could be extended to read from config file

  // Get category and icon from config mappings
  const config = getComponentConfig();
  // Use original componentType for config mapping, but handle variations
  let configComponentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);

  // Map dash-case to PascalCase for config lookups
  if (componentType === 'image-gallery') configComponentName = 'ImageGallery';
  if (componentType === 'text-block') configComponentName = 'TextBlock';
  if (componentType === 'feature-grid') configComponentName = 'FeatureGrid';
  if (componentType === 'hero-section') configComponentName = 'HeroSection';
  if (componentType === 'call-to-action') configComponentName = 'CallToAction';
  if (componentType === 'contact-form') configComponentName = 'ContactForm';

  const category =
    config.categoryMapping[configComponentName as keyof typeof config.categoryMapping] ||
    config.componentDefaults.category;
  const icon =
    config.iconMapping[configComponentName as keyof typeof config.iconMapping] ||
    config.componentDefaults.icon;

  // Generate enhanced properties
  const enhancedProperties: Record<string, PropertySchema> = {};

  if (autoGenSchema.properties) {
    const properties = autoGenSchema.properties as Record<string, Record<string, unknown>>;
    for (const [propName, propSchema] of Object.entries(properties)) {
      enhancedProperties[propName] = generatePropertySchema(
        propName,
        propSchema,
        configOverrides.properties?.[propName]
      );
    }
  }

  // Get component-specific defaults from config
  const configDefaults = getComponentDefaults(configComponentName);

  // Merge defaults: auto-generated + config-specific
  const mergedDefaults = {
    ...(autoGenSchema.defaults as Record<string, unknown>),
    ...configDefaults,
  };

  // Build final schema
  const schema: ComponentSchema = {
    type: componentType,
    name: configOverrides.name || (autoGenSchema.name as string) || configComponentName,
    description:
      configOverrides.description ||
      (autoGenSchema.description as string) ||
      `${configComponentName} component for dynamic content rendering`,
    category: configOverrides.category || (category as ComponentSchema['category']),
    icon: configOverrides.icon || icon,
    properties: enhancedProperties,
    defaults: mergedDefaults,
  };

  return schema;
}

/**
 * Generate all component schemas from configuration
 */
export function generateAllComponentSchemasFromConfig(): Record<string, ComponentSchema> {
  const schemas: Record<string, ComponentSchema> = {};

  // Get all available component types from auto-generated schemas
  const availableTypes = Object.keys(AUTO_GENERATED_SCHEMAS);

  for (const componentType of availableTypes) {
    const schema = generateComponentSchemaFromConfig(componentType);
    if (schema) {
      schemas[componentType] = schema;
    }
  }

  return schemas;
}

/**
 * Enhanced placeholder resolution using config
 */
export function getPlaceholderValue(type: string, propertyName: string): unknown {
  const config = getComponentConfig();
  const placeholders = config.placeholders;

  // Check for array placeholders
  if (placeholders.arrays[propertyName as keyof typeof placeholders.arrays]) {
    return placeholders.arrays[propertyName as keyof typeof placeholders.arrays];
  }

  // Check for object placeholders
  if (placeholders.objects[propertyName as keyof typeof placeholders.objects]) {
    return placeholders.objects[propertyName as keyof typeof placeholders.objects];
  }

  // Check for primitive type placeholders
  if (placeholders.primitives[type as keyof typeof placeholders.primitives] !== undefined) {
    return placeholders.primitives[type as keyof typeof placeholders.primitives];
  }

  // Check for special type placeholders
  if (placeholders.specialTypes[type as keyof typeof placeholders.specialTypes]) {
    return placeholders.specialTypes[type as keyof typeof placeholders.specialTypes];
  }

  return null;
}
