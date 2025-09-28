/**
 * Component Schemas - Integration Layer
 * Provides unified access to component schemas and form generation
 */

import { z } from 'zod';
import { componentRegistry } from './component-registry/registry';
import { schemaToEditor } from './component-registry/schema-to-editor';
import type { ComponentMetadata, EditorFieldConfig } from './component-registry/types';

// Initialize components registry on module load
import './component-registry/initialize';

// Re-export types for backward compatibility
export type { EditorFieldConfig as PropertySchema } from './component-registry/types';

/**
 * Get Zod schema for a component type
 */
export function getComponentSchema(componentType: string): z.ZodSchema | null {
  // Try exact match first (no normalization)
  let registeredComponent = componentRegistry.get(componentType.trim());

  // If not found, try normalized (lowercase) version for backward compatibility
  if (!registeredComponent) {
    registeredComponent = componentRegistry.get(componentType.toLowerCase().trim());
  }

  // If still not found, try type mapping for database-stored components
  if (!registeredComponent) {
    const typeMapping: Record<string, string> = {
      herosectioncomponent: 'HeroSectionComponent',
      'hero-section-component': 'HeroSectionComponent',
      'hero-section': 'HeroSectionComponent',
      textblockcomponent: 'TextBlockComponent',
      'text-block-component': 'TextBlockComponent',
      'text-block': 'TextBlockComponent',
      cardcomponent: 'CardComponent',
      buttoncomponent: 'ButtonComponent',
      editablebuttoncomponent: 'EditableButtonComponent',
      'editable-button-component': 'EditableButtonComponent',
      calltoactioncomponent: 'CallToActionComponent',
      'call-to-action-component': 'CallToActionComponent',
      'cta-component': 'CallToActionComponent',
    };

    const normalizedType = componentType.toLowerCase().trim();
    const mappedType = typeMapping[normalizedType];
    if (mappedType) {
      registeredComponent = componentRegistry.get(mappedType);
    }
  }

  if (registeredComponent?.schema) {
    return registeredComponent.schema;
  }

  // Fallback: create basic schema for unknown components
  console.warn(`[ComponentSchemas] No schema found for component type: ${componentType}`);
  return null;
}

/**
 * Generate form fields configuration from component schema
 */
export function generateFormFields(componentType: string): Record<string, EditorFieldConfig> {
  const schema = getComponentSchema(componentType);

  if (!schema) {
    // Return empty form fields for unknown components
    return {};
  }

  try {
    const editorConfig = schemaToEditor(schema);
    return editorConfig.fields;
  } catch (error) {
    console.error(`[ComponentSchemas] Error generating form fields for ${componentType}:`, error);
    return {};
  }
}

/**
 * Validate component props against schema
 */
export function validateComponentProps(
  componentType: string,
  props: Record<string, unknown>
): { isValid: boolean; errors: string[] } {
  const schema = getComponentSchema(componentType);

  if (!schema) {
    // Unknown components pass validation
    return { isValid: true, errors: [] };
  }

  try {
    schema.parse(props);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { isValid: false, errors };
    }

    return {
      isValid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Get all component schemas for administrative purposes
 */
export function getAllComponentSchemas(): Record<
  string,
  { schema: z.ZodSchema; metadata: ComponentMetadata }
> {
  const components = componentRegistry.getComponents();
  const schemas: Record<string, { schema: z.ZodSchema; metadata: ComponentMetadata }> = {};

  components.forEach(comp => {
    if (comp.schema) {
      schemas[comp.metadata.name] = {
        schema: comp.schema,
        metadata: comp.metadata,
      };
    }
  });

  return schemas;
}
