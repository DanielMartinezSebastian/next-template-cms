#!/usr/bin/env tsx
/**
 * Automatic Component Configuration System
 *
 * Este script automatiza completamente la configuración de componentes:
 * 1. Lee automáticamente exports del index.ts
 * 2. Genera schemas desde interfaces TypeScript
 * 3. Sincroniza componentes con la base de datos
 * 4. Actualiza archivos de configuración
 *
 * Uso: npm run configure
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly for scripts
config({ path: path.join(process.cwd(), '.env.local') });

import { PrismaClient, type Prisma } from '@prisma/client';
import * as fs from 'fs';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface ComponentConfig {
  componentIndex: string;
  componentDir: string;
  outputDir: string;
  database: {
    enabled: boolean;
    syncOnConfigure: boolean;
  };
  typeScript: {
    parseInterfaces: boolean;
    generateSchemas: boolean;
    strictMode: boolean;
  };
  componentDefaults: {
    category: string;
    icon: string;
  };
  categoryMapping: Record<string, string>;
  iconMapping: Record<string, string>;
  excludeComponents: string[];
  placeholders?: {
    arrays: Record<string, any[]>;
    objects: Record<string, Record<string, any>>;
    primitives: {
      string: string;
      number: number;
      boolean: boolean;
    };
    specialTypes: {
      color: string;
      url: string;
      email: string;
      className: string;
    };
  };
  componentSpecificDefaults?: Record<string, Record<string, any>>;
  debug: boolean;
}

interface ComponentInfo {
  name: string;
  exportName: string;
  type: string;
  category: string;
  icon: string;
  description: string;
  filePath?: string;
  interfaceName?: string;
  hasInterface?: boolean;
}

interface SchemaObject {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  properties: Record<string, any>;
  defaults: Record<string, any>;
}

// =============================================================================
// CONFIGURATION LOADER
// =============================================================================

function loadConfig(): ComponentConfig {
  const configPath = path.join(process.cwd(), 'component-config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at ${configPath}`);
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configContent) as ComponentConfig;
}

// =============================================================================
// INDEX.TS PARSER
// =============================================================================

function parseComponentIndex(indexPath: string, config: ComponentConfig): ComponentInfo[] {
  const fullPath = path.resolve(indexPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Component index not found at ${fullPath}`);
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const components: ComponentInfo[] = [];

  // Solo buscar exports específicos de componentes (no utilities)
  const componentExportRegex =
    /export\s+\{\s*default\s+as\s+(\w+(?:Component)?)\s*\}\s+from\s+['"]\.\/components\/([^'"]+)['"]/g;
  const namedComponentRegex =
    /export\s+\{\s*([A-Z]\w+(?:Component|Section|Grid|Form|Gallery|Block|Action)?)\s*\}\s+from\s+['"]\.\/components\/([^'"]+)['"]/g;

  let match;

  // Buscar default exports de componentes
  while ((match = componentExportRegex.exec(content)) !== null) {
    const componentName = match[1];
    const modulePath = match[2];

    if (!config.excludeComponents.includes(componentName)) {
      const componentInfo = createComponentInfo(
        componentName,
        `./components/${modulePath}`,
        config
      );
      if (componentInfo) {
        components.push(componentInfo);
      }
    }
  }

  // Buscar exports nombrados que parezcan componentes
  while ((match = namedComponentRegex.exec(content)) !== null) {
    const componentName = match[1];
    const modulePath = match[2];

    if (!config.excludeComponents.includes(componentName) && isValidComponentName(componentName)) {
      const componentInfo = createComponentInfo(
        componentName,
        `./components/${modulePath}`,
        config
      );
      if (componentInfo) {
        components.push(componentInfo);
      }
    }
  }

  if (config.debug) {
    console.log(`📋 Found ${components.length} components in index.ts:`);
    components.forEach(comp => {
      console.log(`  • ${comp.name} (${comp.category}) ${comp.icon}`);
    });
  }

  return components;
}

function isValidComponentName(name: string): boolean {
  // Solo incluir nombres que parezcan componentes React reales
  const componentPatterns = [
    /^[A-Z]\w+Component$/, // Termina en Component
    /^[A-Z]\w+Section$/, // Termina en Section
    /^[A-Z]\w+Grid$/, // Termina en Grid
    /^[A-Z]\w+Form$/, // Termina en Form
    /^[A-Z]\w+Gallery$/, // Termina en Gallery
    /^[A-Z]\w+Block$/, // Termina en Block
    /^[A-Z]\w+Action$/, // Termina en Action
    /^(Button|Card|Image|Section|Spacer|TextBlock|HeroSection|CallToAction|FeatureGrid|Testimonials|Testimonial|Pricing|Newsletter|ContactForm|ImageGallery)$/,
  ];

  return componentPatterns.some(pattern => pattern.test(name));
}

function createComponentInfo(
  exportName: string,
  modulePath: string,
  config: ComponentConfig
): ComponentInfo | null {
  // Extraer nombre del componente (remover sufijos como Component)
  const componentName = exportName.replace(/Component$/, '');
  const type = kebabCase(componentName);

  // Determinar categoría e icono
  const category = config.categoryMapping[componentName] || config.componentDefaults.category;
  const icon = config.iconMapping[componentName] || config.componentDefaults.icon;

  // Generar descripción básica
  const description = `${componentName} component for dynamic content rendering`;

  // Buscar archivo del componente
  const componentFilePath = findComponentFile(componentName, modulePath, config);

  // Detectar interfaz automáticamente
  const detectedInterface = componentFilePath
    ? findComponentInterface(componentFilePath, componentName)
    : null;

  return {
    name: componentName,
    exportName,
    type,
    category,
    icon,
    description,
    filePath: componentFilePath,
    interfaceName: detectedInterface || `${componentName}ComponentProps`,
    hasInterface: detectedInterface !== null,
  };
}

function findComponentFile(
  componentName: string,
  modulePath: string,
  config: ComponentConfig
): string | undefined {
  const basePath = path.dirname(path.resolve(config.componentIndex));
  const fullModulePath = path.join(basePath, modulePath);

  // Posibles extensiones de archivo
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  for (const ext of extensions) {
    const filePath = fullModulePath + ext;
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return undefined;
}

function checkForInterface(filePath: string, interfaceName: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const interfaceRegex = new RegExp(`interface\\s+${interfaceName}\\s*\\{`, 'g');
    return interfaceRegex.test(content);
  } catch {
    return false;
  }
}

function findComponentInterface(filePath: string, componentName: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Patrones de nombres de interfaces en orden de prioridad
    const interfacePatterns = [
      `${componentName}ComponentProps`, // ButtonComponentProps
      `${componentName}Props`, // HeroSectionProps, TextBlockProps
      `${componentName}Config`, // AlternativeConfig
      `I${componentName}Props`, // IHeroSectionProps
      `${componentName}Properties`, // Alternative pattern
    ];

    for (const pattern of interfacePatterns) {
      const interfaceRegex = new RegExp(`interface\\s+${pattern}\\s*\\{`, 'g');
      if (interfaceRegex.test(content)) {
        return pattern;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// =============================================================================
// PLACEHOLDER SYSTEM
// =============================================================================

/**
 * Get placeholder value for a prop based on its name and type
 */
function getPlaceholderValue(propName: string, propType: string, config: ComponentConfig): unknown {
  const placeholders = config.placeholders;

  // Si no hay configuración de placeholders, usar valores básicos
  if (!placeholders) {
    if (propType === 'boolean') return false;
    if (propType === 'number') return 0;
    return '';
  }

  // Check for array props that should have array defaults
  const arrayProps = ['features', 'images', 'testimonials', 'items', 'tags', 'options'];
  if (arrayProps.includes(propName) || propName.endsWith('s')) {
    if (placeholders.arrays[propName]) {
      return placeholders.arrays[propName];
    }
    return placeholders.arrays.items || [];
  }

  // Check for object props
  const objectProps = ['config', 'settings', 'metadata'];
  if (objectProps.includes(propName)) {
    return placeholders.objects[propName] || {};
  }

  // Check for special types based on prop name
  if (propName.includes('color') || propName.includes('Color')) {
    return placeholders.specialTypes.color;
  }
  if (propName.includes('url') || propName.includes('href') || propName.includes('link')) {
    return placeholders.specialTypes.url;
  }
  if (propName.includes('email') || propName.includes('Email')) {
    return placeholders.specialTypes.email;
  }
  if (propName.includes('class') || propName.includes('Class')) {
    return placeholders.specialTypes.className;
  }

  // Check for types
  if (propType === 'boolean') {
    return placeholders.primitives.boolean;
  }
  if (propType === 'number') {
    return placeholders.primitives.number;
  }

  // Default to string
  return placeholders.primitives.string;
}

/**
 * Apply intelligent placeholders to component defaults
 */
function applyPlaceholders(
  defaults: Record<string, unknown>,
  properties: Record<string, unknown>,
  config: ComponentConfig,
  componentName?: string
): Record<string, unknown> {
  const enhancedDefaults = { ...defaults };

  // 1. First, apply component-specific defaults if available
  if (componentName && config.componentSpecificDefaults?.[componentName]) {
    const specificDefaults = config.componentSpecificDefaults[componentName];
    Object.assign(enhancedDefaults, specificDefaults);

    if (config.debug) {
      console.log(`    🎯 Applied specific defaults for ${componentName}`);
    }
  }

  // 2. Then, apply intelligent placeholders for missing values
  for (const [propName, propSchema] of Object.entries(properties)) {
    // Solo aplicar placeholder si no hay valor por defecto o si es problemático
    const currentValue = enhancedDefaults[propName];

    if (
      currentValue === undefined ||
      currentValue === null ||
      currentValue === '' ||
      (typeof currentValue === 'string' && ['[]', '{}', '>', '<'].includes(currentValue))
    ) {
      const placeholder = getPlaceholderValue(propName, (propSchema as any).type, config);
      enhancedDefaults[propName] = placeholder;

      if (config.debug) {
        console.log(`    🔧 Applied placeholder for ${propName}: ${JSON.stringify(placeholder)}`);
      }
    }
  }

  return enhancedDefaults;
}

// =============================================================================
// SCHEMA GENERATION
// =============================================================================

function generateComponentSchemas(
  components: ComponentInfo[],
  config: ComponentConfig
): Record<string, SchemaObject> {
  const schemas: Record<string, SchemaObject> = {};

  console.log('\n🔧 Generating component schemas...');

  for (const component of components) {
    try {
      if (component.hasInterface && component.filePath) {
        // Generar schema desde interfaz TypeScript
        const schema = generateSchemaFromTypeScript(component, config);
        if (schema) {
          schemas[component.type] = schema;
          console.log(`  ✅ ${component.name}: Auto-generated from TypeScript interface`);
        }
      } else {
        // Generar schema básico
        const schema = generateBasicSchema(component, config);
        schemas[component.type] = schema;
        console.log(`  📄 ${component.name}: Basic schema (no interface found)`);
      }
    } catch (error) {
      console.warn(`  ⚠️  ${component.name}: Error generating schema -`, error);
      // Fallback a schema básico
      const schema = generateBasicSchema(component, config);
      schemas[component.type] = schema;
    }
  }

  return schemas;
}

function generateSchemaFromTypeScript(
  component: ComponentInfo,
  config: ComponentConfig
): SchemaObject {
  if (!component.filePath || !component.interfaceName) {
    return generateBasicSchema(component, config);
  }

  try {
    const content = fs.readFileSync(component.filePath, 'utf8');
    const interfaceProperties = parseInterfaceProperties(content, component.interfaceName);

    if (Object.keys(interfaceProperties).length === 0) {
      console.warn(`  ⚠️  No properties found in interface ${component.interfaceName}`);
      return generateBasicSchema(component, config);
    }

    return {
      type: component.type,
      name: component.name,
      description: `${component.description} (Auto-generated from ${component.interfaceName})`,
      category: component.category,
      icon: component.icon,
      properties: interfaceProperties,
      defaults: applyPlaceholders(
        generateDefaultsFromProperties(interfaceProperties, config),
        interfaceProperties,
        config,
        component.name
      ),
    };
  } catch (error) {
    console.warn(`  ⚠️  Error parsing interface for ${component.name}:`, error);
    return generateBasicSchema(component, config);
  }
}

function parseInterfaceProperties(content: string, interfaceName: string): Record<string, any> {
  const properties: Record<string, any> = {};

  try {
    // Buscar la interfaz
    const interfaceRegex = new RegExp(`interface\\s+${interfaceName}\\s*\\{([^}]*)\\}`, 'gs');

    const match = interfaceRegex.exec(content);
    if (!match || !match[1]) {
      return properties;
    }

    const interfaceBody = match[1];

    // Parse de propiedades usando regex
    const propertyRegex = /(\w+)\??:\s*([^;]+);?/g;
    let propertyMatch;

    while ((propertyMatch = propertyRegex.exec(interfaceBody)) !== null) {
      const [, propName, propType] = propertyMatch;

      // Limpiar el tipo
      const cleanType = propType.trim().replace(/\s*\|\s*undefined$/, '');
      const isOptional = propertyMatch[0].includes('?:');

      properties[propName] = parsePropertyType(propName, cleanType, isOptional);
    }

    return properties;
  } catch (error) {
    console.warn(`Error parsing interface ${interfaceName}:`, error);
    return properties;
  }
}

function parsePropertyType(propName: string, typeString: string, isOptional: boolean): any {
  const property: any = {
    required: !isOptional,
    description: `${propName} property`,
  };

  // Detectar valores por defecto en el tipo
  const defaultMatch = typeString.match(/=\s*['"`]?([^'"`\s]+)['"`]?/);
  if (defaultMatch) {
    property.default = defaultMatch[1];
  }

  // Parsear tipo principal
  const mainType = typeString.split('|')[0].trim();

  if (mainType === 'string' || typeString.includes("'") || typeString.includes('"')) {
    property.type = 'string';
    property.label = formatLabel(propName);

    // Detectar opciones de string union
    const unionMatch = typeString.match(/'([^']+)'|"([^"]+)"/g);
    if (unionMatch && unionMatch.length > 1) {
      property.options = unionMatch.map(opt => opt.replace(/['"]/g, ''));
      property.type = 'select';
    }
  } else if (mainType === 'number') {
    property.type = 'number';
    property.label = formatLabel(propName);
  } else if (mainType === 'boolean') {
    property.type = 'boolean';
    property.label = formatLabel(propName);
    property.default = property.default === 'true';
  } else if (typeString.includes('()')) {
    property.type = 'function';
    property.label = formatLabel(propName);
    property.description = `${propName} callback function`;
  } else {
    property.type = 'string';
    property.label = formatLabel(propName);
  }

  return property;
}

function formatLabel(propName: string): string {
  return propName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function generateDefaultsFromProperties(
  properties: Record<string, any>,
  config?: ComponentConfig
): Record<string, any> {
  const defaults: Record<string, any> = {};

  for (const [key, prop] of Object.entries(properties)) {
    if (prop.default !== undefined) {
      defaults[key] = prop.default;
    } else if (config) {
      // Usar placeholders inteligentes
      defaults[key] = getPlaceholderValue(key, prop.type, config);
    } else {
      // Fallback básico
      if (prop.type === 'boolean') {
        defaults[key] = false;
      } else if (prop.type === 'number') {
        defaults[key] = 0;
      } else if (prop.type === 'string') {
        defaults[key] = '';
      }
    }
  }

  return defaults;
}

function generateBasicSchema(component: ComponentInfo, config?: ComponentConfig): SchemaObject {
  const basicDefaults = {
    content: `${component.name} content`,
  };

  const properties = {
    content: {
      type: 'string',
      label: 'Content',
      description: 'Component content',
      required: false,
      default: `${component.name} content`,
    },
  };

  return {
    type: component.type,
    name: component.name,
    description: component.description,
    category: component.category,
    icon: component.icon,
    properties,
    defaults: config
      ? applyPlaceholders(basicDefaults, properties, config, component.name)
      : basicDefaults,
  };
}

// =============================================================================
// DATABASE SYNCHRONIZATION
// =============================================================================

/**
 * Validate and clean defaults to prevent problematic values in database
 */
function validateAndCleanDefaults(
  defaults: Record<string, unknown>,
  config: ComponentConfig,
  componentName?: string
): Record<string, unknown> {
  const cleaned = { ...defaults };

  // 1. Apply component-specific defaults first if available
  if (componentName && config.componentSpecificDefaults?.[componentName]) {
    const specificDefaults = config.componentSpecificDefaults[componentName];
    Object.assign(cleaned, specificDefaults);

    if (config.debug) {
      console.log(`    🎯 Applied specific defaults for ${componentName}`);
    }
  }

  // 2. Clean problematic values
  for (const [key, value] of Object.entries(cleaned)) {
    // Check for problematic string arrays
    if (
      typeof value === 'string' &&
      (key.endsWith('s') || ['features', 'images', 'testimonials'].includes(key))
    ) {
      if (value === '' || value === '[]' || value === '{}') {
        const placeholder = getPlaceholderValue(key, 'array', config);
        cleaned[key] = placeholder;
        console.log(
          `    🔧 Fixed problematic array ${key}: "${value}" → ${JSON.stringify(placeholder)}`
        );
      }
    }

    // Check for other problematic values
    if (typeof value === 'string' && ['>', '<', '{}'].includes(value)) {
      const placeholder = getPlaceholderValue(key, 'string', config);
      cleaned[key] = placeholder;
      console.log(`    🔧 Fixed problematic value ${key}: "${value}" → "${placeholder}"`);
    }
  }

  return cleaned;
}

async function syncWithDatabase(
  components: ComponentInfo[],
  schemas: Record<string, SchemaObject>,
  config: ComponentConfig
): Promise<void> {
  if (!config.database.enabled || !config.database.syncOnConfigure) {
    console.log('\n📊 Database sync disabled, skipping...');
    return;
  }

  console.log('\n📊 Synchronizing with database...');

  const prisma = new PrismaClient();

  try {
    // Obtener componentes existentes
    const existingComponents = await prisma.component.findMany();
    const existingNames = new Set(existingComponents.map(c => c.name));

    let createdCount = 0;
    let updatedCount = 0;

    for (const component of components) {
      const schema = schemas[component.type];

      // Validar y limpiar defaultConfig antes de guardar
      const cleanDefaultConfig = validateAndCleanDefaults(schema.defaults, config, component.name);

      if (existingNames.has(component.name)) {
        // Actualizar componente existente
        await prisma.component.update({
          where: { name: component.name },
          data: {
            type: component.type,
            description: component.description,
            category: component.category,
            defaultConfig: cleanDefaultConfig as Prisma.InputJsonValue,
            configSchema: {
              type: 'object',
              properties: schema.properties,
            },
          },
        });
        updatedCount++;
        console.log(`  🔄 Updated: ${component.name}`);
      } else {
        // Crear nuevo componente
        await prisma.component.create({
          data: {
            name: component.name,
            type: component.type,
            description: component.description,
            category: component.category,
            defaultConfig: cleanDefaultConfig as Prisma.InputJsonValue,
            configSchema: {
              type: 'object',
              properties: schema.properties,
            },
          },
        });
        createdCount++;
        console.log(`  ✨ Created: ${component.name}`);
      }
    }

    console.log(`\n📈 Database sync complete: ${createdCount} created, ${updatedCount} updated`);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// =============================================================================
// OUTPUT GENERATION
// =============================================================================

function generateConfigFiles(
  components: ComponentInfo[],
  schemas: Record<string, SchemaObject>,
  config: ComponentConfig
): void {
  console.log('\n📝 Generating configuration files...');

  // Crear directorio de salida
  const outputDir = path.resolve(config.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generar archivo de schemas
  const schemasContent = `/**
 * AUTO-GENERATED COMPONENT SCHEMAS
 * Generated on: ${new Date().toISOString()}
 * 
 * DO NOT EDIT MANUALLY - Run 'npm run configure' to regenerate
 */

export const AUTO_GENERATED_SCHEMAS = ${JSON.stringify(schemas, null, 2)};

export const COMPONENT_LIST = ${JSON.stringify(
    components.map(c => ({
      name: c.name,
      type: c.type,
      category: c.category,
      icon: c.icon,
      hasInterface: c.hasInterface,
    })),
    null,
    2
  )};
`;

  const schemasPath = path.join(outputDir, 'component-schemas.ts');
  fs.writeFileSync(schemasPath, schemasContent);
  console.log(`  ✅ Generated: ${schemasPath}`);

  // Generar resumen de configuración
  const summaryContent = `# Component Configuration Summary

Generated on: ${new Date().toISOString()}

## Components Found: ${components.length}

${components
  .map(
    c => `- **${c.name}** (\`${c.type}\`) ${c.icon}
  - Category: ${c.category}
  - Has Interface: ${c.hasInterface ? '✅' : '❌'}
  - File: ${c.filePath ? path.basename(c.filePath) : 'Not found'}`
  )
  .join('\n')}

## Configuration Used

- Component Index: \`${config.componentIndex}\`
- Component Directory: \`${config.componentDir}\`
- Database Sync: ${config.database.enabled ? '✅' : '❌'}
- TypeScript Parsing: ${config.typeScript.parseInterfaces ? '✅' : '❌'}

## Next Steps

1. Review generated schemas in \`${config.outputDir}/component-schemas.ts\`
2. Test components in the editor: \`/es/admin/editor\`
3. Check database synchronization: \`npm run db:studio\`
`;

  const summaryPath = path.join(outputDir, 'README.md');
  fs.writeFileSync(summaryPath, summaryContent);
  console.log(`  📋 Generated: ${summaryPath}`);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main(): Promise<void> {
  console.log('🚀 Starting automatic component configuration...\n');

  try {
    // 1. Cargar configuración
    const config = loadConfig();
    console.log('📖 Loaded configuration from component-config.json');

    // 2. Parsear index.ts
    const components = parseComponentIndex(config.componentIndex, config);

    // 3. Generar schemas
    const schemas = generateComponentSchemas(components, config);

    // 4. Sincronizar con base de datos
    await syncWithDatabase(components, schemas, config);

    // 5. Generar archivos de configuración
    generateConfigFiles(components, schemas, config);

    console.log('\n🎉 Component configuration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  • Components processed: ${components.length}`);
    console.log(`  • Schemas generated: ${Object.keys(schemas).length}`);
    console.log(`  • Database sync: ${config.database.enabled ? 'Enabled' : 'Disabled'}`);

    if (config.debug) {
      console.log('\n🔍 Component details:');
      components.forEach(comp => {
        console.log(`  ${comp.icon} ${comp.name} → ${comp.type} (${comp.category})`);
      });
    }
  } catch (error) {
    console.error('\n❌ Configuration failed:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

export { main as configureComponents };
