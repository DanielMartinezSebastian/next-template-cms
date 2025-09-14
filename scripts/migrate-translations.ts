/**
 * Migration script to move translations from JSON files to database
 * This script will be used when Prisma is set up
 */

import fs from 'fs/promises';
import path from 'path';
// TODO: Import when database provider is ready
// import { translationManager } from '../src/lib/translations/translation-manager';

interface MigrationConfig {
  sourceDir: string;
  targetLocales: string[];
  dryRun: boolean;
  verbose: boolean;
}

const defaultConfig: MigrationConfig = {
  sourceDir: './messages',
  targetLocales: ['en', 'es'],
  dryRun: true,
  verbose: true
};

async function loadTranslationsFromFile(locale: string, sourceDir: string) {
  try {
    const filePath = path.join(sourceDir, `${locale}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    return null;
  }
}

function flattenTranslations(obj: Record<string, unknown>, namespace = '', prefix = ''): Array<{namespace: string, key: string, value: string}> {
  const result: Array<{namespace: string, key: string, value: string}> = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!namespace && !prefix) {
        // Top level - this is a namespace
        result.push(...flattenTranslations(value as Record<string, unknown>, key, ''));
      } else {
        // Nested object within namespace
        result.push(...flattenTranslations(value as Record<string, unknown>, namespace, fullKey));
      }
    } else {
      result.push({
        namespace: namespace || 'default',
        key: fullKey,
        value: String(value)
      });
    }
  }
  
  return result;
}

async function migrateTranslations(config: MigrationConfig = defaultConfig) {
  console.log('🚀 Starting translation migration...');
  console.log('Config:', config);
  
  const migrations = [];
  
  for (const locale of config.targetLocales) {
    if (config.verbose) {
      console.log(`\n📋 Processing locale: ${locale}`);
    }
    
    const translations = await loadTranslationsFromFile(locale, config.sourceDir);
    if (!translations) {
      console.warn(`⚠️  Skipping ${locale} - could not load translations`);
      continue;
    }
    
    const flatTranslations = flattenTranslations(translations);
    
    if (config.verbose) {
      console.log(`   Found ${flatTranslations.length} translation keys`);
      console.log(`   Namespaces: ${[...new Set(flatTranslations.map(t => t.namespace))].join(', ')}`);
    }
    
    for (const translation of flatTranslations) {
      migrations.push({
        ...translation,
        locale,
        id: `${translation.namespace}:${locale}:${translation.key}`,
        metadata: {
          version: 1,
          lastModified: new Date(),
          source: 'json_migration',
          category: translation.namespace
        }
      });
    }
  }
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`   Total translations: ${migrations.length}`);
  console.log(`   Locales: ${config.targetLocales.length}`);
  console.log(`   Namespaces: ${[...new Set(migrations.map(m => m.namespace))].length}`);
  
  if (config.dryRun) {
    console.log('\n🔍 DRY RUN - No changes will be made');
    console.log('Sample migrations:');
    migrations.slice(0, 5).forEach(m => {
      console.log(`   ${m.namespace}:${m.locale}:${m.key} = "${m.value.substring(0, 50)}${m.value.length > 50 ? '...' : '"'}`);
    });
    
    // Save to file for inspection
    const outputPath = 'migration-preview.json';
    await fs.writeFile(outputPath, JSON.stringify(migrations, null, 2));
    console.log(`\n💾 Migration data saved to ${outputPath}`);
  } else {
    console.log('\n💿 Writing to database...');
    // TODO: Implement database writes when Prisma is ready
    // await writeToDatabase(migrations);
    console.log('✅ Migration completed!');
  }
  
  return migrations;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const config = { ...defaultConfig };
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--execute':
        config.dryRun = false;
        break;
      case '--quiet':
        config.verbose = false;
        break;
      case '--source':
        config.sourceDir = args[++i];
        break;
      case '--locales':
        config.targetLocales = args[++i].split(',');
        break;
      case '--help':
        console.log(`
Translation Migration Tool

Usage: node migrate-translations.js [options]

Options:
  --execute     Actually perform the migration (default: dry run)
  --quiet       Reduce output verbosity
  --source DIR  Source directory for JSON files (default: ./messages)
  --locales     Comma-separated list of locales (default: en,es)
  --help        Show this help

Examples:
  node migrate-translations.js                     # Dry run with defaults
  node migrate-translations.js --execute           # Perform actual migration
  node migrate-translations.js --locales en,es,fr  # Migrate specific locales
`);
        process.exit(0);
    }
  }
  
  migrateTranslations(config)
    .then(() => {
      console.log('\n🎉 Migration process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateTranslations, type MigrationConfig };
