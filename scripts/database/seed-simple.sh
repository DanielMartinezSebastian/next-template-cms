#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de logging
log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "✅ $1"; }
warning() { echo -e "⚠️  $1"; }
error() { echo -e "❌ $1"; }

# Header
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 Database Seeding - Development                ║"
echo "║                        🌱 Seed Data                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar que la base de datos esté disponible
log "Verificando conexión a la base de datos..."
if ! docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
    error "La base de datos no está disponible. Ejecuta primero: ./scripts/database/setup.sh"
    exit 1
fi

success "Base de datos disponible"

# Ejecutar seeds con SQL simplificado
log "Ejecutando seeds de datos..."

# Datos básicos con SQL - Solo campos obligatorios
docker-compose -f docker-compose.dev.yml exec -T postgres-dev psql -U dev_user -d nextjs_template_dev <<-EOSQL
-- Insertar locales por defecto
INSERT INTO locales (id, code, name, "isDefault", "isActive") VALUES 
('locale_en', 'en', 'English', true, true),
('locale_es', 'es', 'Español', false, true)
ON CONFLICT (code) DO NOTHING;

-- Insertar namespaces por defecto
INSERT INTO namespaces (id, name, description, "isActive") VALUES 
('ns_common', 'common', 'Common translations used across the application', true),
('ns_home', 'home', 'Homepage specific translations', true),
('ns_admin', 'admin', 'Admin panel translations', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar traducciones básicas para inglés
INSERT INTO translations (id, key, value, "localeId", "namespaceId", "isActive") VALUES 
-- Common translations
('trans_en_common_1', 'app.name', 'Next.js Template', 'locale_en', 'ns_common', true),
('trans_en_common_2', 'app.description', 'A modern Next.js template with CMS capabilities', 'locale_en', 'ns_common', true),
('trans_en_common_3', 'navigation.home', 'Home', 'locale_en', 'ns_common', true),
('trans_en_common_4', 'navigation.admin', 'Admin', 'locale_en', 'ns_common', true)
ON CONFLICT (key, "localeId", "namespaceId") DO NOTHING;

-- Insertar traducciones básicas para español
INSERT INTO translations (id, key, value, "localeId", "namespaceId", "isActive") VALUES 
-- Common translations
('trans_es_common_1', 'app.name', 'Plantilla Next.js', 'locale_es', 'ns_common', true),
('trans_es_common_2', 'app.description', 'Una plantilla moderna de Next.js con capacidades CMS', 'locale_es', 'ns_common', true),
('trans_es_common_3', 'navigation.home', 'Inicio', 'locale_es', 'ns_common', true),
('trans_es_common_4', 'navigation.admin', 'Administración', 'locale_es', 'ns_common', true)
ON CONFLICT (key, "localeId", "namespaceId") DO NOTHING;

-- Insertar página de ejemplo
INSERT INTO pages (id, slug, "isActive", template) VALUES 
('page_home', 'home', true, 'homepage')
ON CONFLICT (slug) DO NOTHING;

-- Insertar contenido de página para inglés
INSERT INTO page_contents (id, "pageId", "localeId", title, description, "metaTitle", "isPublished") VALUES 
('content_home_en', 'page_home', 'locale_en', 'Welcome to Next.js Template', 'A modern template for building web applications', 'Next.js Template - Modern Web Development', true)
ON CONFLICT ("pageId", "localeId") DO NOTHING;

-- Insertar contenido de página para español
INSERT INTO page_contents (id, "pageId", "localeId", title, description, "metaTitle", "isPublished") VALUES 
('content_home_es', 'page_home', 'locale_es', 'Bienvenido a la Plantilla Next.js', 'Una plantilla moderna para construir aplicaciones web', 'Plantilla Next.js - Desarrollo Web Moderno', true)
ON CONFLICT ("pageId", "localeId") DO NOTHING;

-- Insertar componente de ejemplo
INSERT INTO components (id, name, type, category, description, "isActive") VALUES 
('comp_hero', 'Hero', 'layout', 'marketing', 'Hero section with title, subtitle and CTA', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar configuración del sistema
INSERT INTO system_config (id, key, value, description, category) VALUES 
('config_site_name', 'site.name', '"Next.js Template"', 'Site name displayed in header and metadata', 'general')
ON CONFLICT (key) DO NOTHING;
EOSQL

if [ $? -eq 0 ]; then
    success "Seeds de datos ejecutados correctamente"
else
    error "Error al ejecutar seeds de datos"
    exit 1
fi

# Verificar datos insertados
log "Verificando datos insertados..."
docker-compose -f docker-compose.dev.yml exec -T postgres-dev psql -U dev_user -d nextjs_template_dev -c "
SELECT 
    (SELECT COUNT(*) FROM locales) as locales,
    (SELECT COUNT(*) FROM namespaces) as namespaces,
    (SELECT COUNT(*) FROM translations) as translations,
    (SELECT COUNT(*) FROM pages) as pages,
    (SELECT COUNT(*) FROM page_contents) as page_contents,
    (SELECT COUNT(*) FROM components) as components;
"

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   🌱 Seeding Completado!                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

success "Base de datos poblada con datos de desarrollo! 🎉"
echo -e "ℹ️  🔧 Comandos útiles:"
echo -e "  • Prisma Studio:  npm run db:studio"
echo -e "  • Ver datos:      docker-compose -f docker-compose.dev.yml exec postgres-dev psql -U dev_user -d nextjs_template_dev"
echo -e "  • Reset DB:       ./scripts/database/reset.sh"