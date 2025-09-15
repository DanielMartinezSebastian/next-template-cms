#!/bin/bash
# 🌱 Script para poblar la base de datos con datos de desarrollo
# Next.js Template - Database Seeding

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Banner
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

# Ejecutar seeds con TypeScript/Node.js
log "Ejecutando seeds de datos..."

# Verificar si existe el script de seeds
if [ ! -f "scripts/database/seed.ts" ]; then
    warning "Script de seeds TypeScript no encontrado. Creando datos básicos con SQL..."
    
    # Ejecutar seeds básicos con SQL
    docker-compose -f docker-compose.dev.yml exec -T postgres-dev psql -U dev_user -d nextjs_template_dev <<-EOSQL
        -- Insertar locales por defecto
        INSERT INTO locales (id, code, name, "isDefault", "isActive", "createdAt", "updatedAt") VALUES 
        ('locale_en', 'en', 'English', true, true, NOW(), NOW()),
        ('locale_es', 'es', 'Español', false, true, NOW(), NOW())
        ON CONFLICT (code) DO NOTHING;
        
        -- Insertar namespaces por defecto
        INSERT INTO namespaces (id, name, description, "isActive", "createdAt", "updatedAt") VALUES 
        ('ns_common', 'common', 'Common translations used across the application', true, NOW(), NOW()),
        ('ns_home', 'home', 'Homepage specific translations', true, NOW(), NOW()),
        ('ns_admin', 'admin', 'Admin panel translations', true, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING;
        
        -- Insertar traducciones básicas para inglés
        INSERT INTO translations (id, key, value, "localeId", "namespaceId", "isActive") VALUES 
        -- Common translations
        ('trans_en_common_1', 'app.name', 'Next.js Template', 'locale_en', 'ns_common', true),
        ('trans_en_common_2', 'app.description', 'A modern Next.js template with CMS capabilities', 'locale_en', 'ns_common', true),
        ('trans_en_common_3', 'navigation.home', 'Home', 'locale_en', 'ns_common', true),
        ('trans_en_common_4', 'navigation.admin', 'Admin', 'locale_en', 'ns_common', true),
        ('trans_en_common_5', 'actions.save', 'Save', 'locale_en', 'ns_common', true),
        ('trans_en_common_6', 'actions.cancel', 'Cancel', 'locale_en', 'ns_common', true),
        ('trans_en_common_7', 'actions.edit', 'Edit', 'locale_en', 'ns_common', true),
        ('trans_en_common_8', 'actions.delete', 'Delete', 'locale_en', 'ns_common', true),
        
        -- Home translations
        ('trans_en_home_1', 'title', 'Welcome to Next.js Template', 'locale_en', 'ns_home', true),
        ('trans_en_home_2', 'subtitle', 'Build amazing web applications with modern tools', 'locale_en', 'ns_home', true),
        ('trans_en_home_3', 'features.cms.title', 'Content Management', 'locale_en', 'ns_home', true),
        ('trans_en_home_4', 'features.cms.description', 'Manage your content with a powerful visual editor', 'locale_en', 'ns_home', true),
        ('trans_en_home_5', 'features.i18n.title', 'Internationalization', 'locale_en', 'ns_home', true),
        ('trans_en_home_6', 'features.i18n.description', 'Support for multiple languages out of the box', 'locale_en', 'ns_home', true),
        
        -- Admin translations
        ('trans_en_admin_1', 'title', 'Administration Panel', 'locale_en', 'ns_admin', true),
        ('trans_en_admin_2', 'pages.title', 'Pages Management', 'locale_en', 'ns_admin', true),
        ('trans_en_admin_3', 'pages.create', 'Create New Page', 'locale_en', 'ns_admin', true),
        ('trans_en_admin_4', 'translations.title', 'Translations Management', 'locale_en', 'ns_admin', true),
        ('trans_en_admin_5', 'dashboard.welcome', 'Welcome to the Admin Dashboard', 'locale_en', 'ns_admin', true)
        ON CONFLICT (key, "localeId", "namespaceId") DO NOTHING;
        
        -- Insertar traducciones básicas para español
        INSERT INTO translations (id, key, value, "localeId", "namespaceId", "isActive") VALUES 
        -- Common translations
        ('trans_es_common_1', 'app.name', 'Plantilla Next.js', 'locale_es', 'ns_common', true),
        ('trans_es_common_2', 'app.description', 'Una plantilla moderna de Next.js con capacidades CMS', 'locale_es', 'ns_common', true),
        ('trans_es_common_3', 'navigation.home', 'Inicio', 'locale_es', 'ns_common', true),
        ('trans_es_common_4', 'navigation.admin', 'Administración', 'locale_es', 'ns_common', true),
        ('trans_es_common_5', 'actions.save', 'Guardar', 'locale_es', 'ns_common', true),
        ('trans_es_common_6', 'actions.cancel', 'Cancelar', 'locale_es', 'ns_common', true),
        ('trans_es_common_7', 'actions.edit', 'Editar', 'locale_es', 'ns_common', true),
        ('trans_es_common_8', 'actions.delete', 'Eliminar', 'locale_es', 'ns_common', true),
        
        -- Home translations
        ('trans_es_home_1', 'title', 'Bienvenido a la Plantilla Next.js', 'locale_es', 'ns_home', true),
        ('trans_es_home_2', 'subtitle', 'Construye aplicaciones web increíbles con herramientas modernas', 'locale_es', 'ns_home', true),
        ('trans_es_home_3', 'features.cms.title', 'Gestión de Contenido', 'locale_es', 'ns_home', true),
        ('trans_es_home_4', 'features.cms.description', 'Gestiona tu contenido con un potente editor visual', 'locale_es', 'ns_home', true),
        ('trans_es_home_5', 'features.i18n.title', 'Internacionalización', 'locale_es', 'ns_home', true),
        ('trans_es_home_6', 'features.i18n.description', 'Soporte para múltiples idiomas desde el inicio', 'locale_es', 'ns_home', true),
        
        -- Admin translations
        ('trans_es_admin_1', 'title', 'Panel de Administración', 'locale_es', 'ns_admin', true),
        ('trans_es_admin_2', 'pages.title', 'Gestión de Páginas', 'locale_es', 'ns_admin', true),
        ('trans_es_admin_3', 'pages.create', 'Crear Nueva Página', 'locale_es', 'ns_admin', true),
        ('trans_es_admin_4', 'translations.title', 'Gestión de Traducciones', 'locale_es', 'ns_admin', true),
        ('trans_es_admin_5', 'dashboard.welcome', 'Bienvenido al Panel de Administración', 'locale_es', 'ns_admin', true)
        ON CONFLICT (key, "localeId", "namespaceId") DO NOTHING;
        
        -- Insertar páginas de ejemplo
        INSERT INTO pages (id, slug, "isActive", template) VALUES 
        ('page_home', 'home', true, 'homepage'),
        ('page_about', 'about', true, 'content'),
        ('page_contact', 'contact', true, 'contact')
        ON CONFLICT (slug) DO NOTHING;
        
        -- Insertar contenido de páginas para inglés
        INSERT INTO page_contents (id, "pageId", "localeId", title, description, "metaTitle", "metaDescription", keywords, content, "isPublished") VALUES 
        ('content_home_en', 'page_home', 'locale_en', 'Welcome to Next.js Template', 'A modern template for building web applications', 'Next.js Template - Modern Web Development', 'Build amazing web applications with Next.js, TypeScript, and Tailwind CSS', ARRAY['nextjs', 'typescript', 'tailwind', 'template'], '{"sections": [{"type": "hero", "title": "Welcome to Next.js Template", "subtitle": "Build amazing web applications with modern tools"}]}', true),
        ('content_about_en', 'page_about', 'locale_en', 'About Us', 'Learn more about our template and mission', 'About - Next.js Template', 'Learn about our modern Next.js template and development philosophy', ARRAY['about', 'template', 'development'], '{"sections": [{"type": "content", "title": "About Our Template", "description": "This template provides a solid foundation for modern web applications."}]}', true),
        ('content_contact_en', 'page_contact', 'locale_en', 'Contact Us', 'Get in touch with our team', 'Contact - Next.js Template', 'Contact our development team for support and questions', ARRAY['contact', 'support'], '{"sections": [{"type": "contact-form", "title": "Get in Touch", "fields": ["name", "email", "message"]}]}', true)
        ON CONFLICT ("pageId", "localeId") DO NOTHING;
        
        -- Insertar contenido de páginas para español
        INSERT INTO page_contents (id, "pageId", "localeId", title, description, "metaTitle", "metaDescription", keywords, content, "isPublished") VALUES 
        ('content_home_es', 'page_home', 'locale_es', 'Bienvenido a la Plantilla Next.js', 'Una plantilla moderna para construir aplicaciones web', 'Plantilla Next.js - Desarrollo Web Moderno', 'Construye aplicaciones web increíbles con Next.js, TypeScript y Tailwind CSS', ARRAY['nextjs', 'typescript', 'tailwind', 'plantilla'], '{"sections": [{"type": "hero", "title": "Bienvenido a la Plantilla Next.js", "subtitle": "Construye aplicaciones web increíbles con herramientas modernas"}]}', true),
        ('content_about_es', 'page_about', 'locale_es', 'Acerca de Nosotros', 'Conoce más sobre nuestra plantilla y misión', 'Acerca de - Plantilla Next.js', 'Conoce nuestra plantilla moderna de Next.js y filosofía de desarrollo', ARRAY['acerca', 'plantilla', 'desarrollo'], '{"sections": [{"type": "content", "title": "Acerca de Nuestra Plantilla", "description": "Esta plantilla proporciona una base sólida para aplicaciones web modernas."}]}', true),
        ('content_contact_es', 'page_contact', 'locale_es', 'Contacto', 'Ponte en contacto con nuestro equipo', 'Contacto - Plantilla Next.js', 'Contacta a nuestro equipo de desarrollo para soporte y consultas', ARRAY['contacto', 'soporte'], '{"sections": [{"type": "contact-form", "title": "Ponte en Contacto", "fields": ["nombre", "email", "mensaje"]}]}', true)
        ON CONFLICT ("pageId", "localeId") DO NOTHING;
        
        -- Insertar componentes de ejemplo
        INSERT INTO components (id, name, type, category, description, "configSchema", "defaultConfig", "isActive") VALUES 
        ('comp_hero', 'Hero', 'layout', 'marketing', 'Hero section with title, subtitle and CTA', '{"type": "object", "properties": {"title": {"type": "string"}, "subtitle": {"type": "string"}, "ctaText": {"type": "string"}, "ctaLink": {"type": "string"}}}', '{"title": "Hero Title", "subtitle": "Hero subtitle", "ctaText": "Get Started", "ctaLink": "/"}', true),
        ('comp_feature_grid', 'FeatureGrid', 'content', 'marketing', 'Grid of features with icons and descriptions', '{"type": "object", "properties": {"features": {"type": "array", "items": {"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}, "icon": {"type": "string"}}}}}}', '{"features": [{"title": "Feature 1", "description": "Feature description", "icon": "star"}]}', true),
        ('comp_contact_form', 'ContactForm', 'interactive', 'forms', 'Contact form with validation', '{"type": "object", "properties": {"fields": {"type": "array", "items": {"type": "string"}}, "submitText": {"type": "string"}}}', '{"fields": ["name", "email", "message"], "submitText": "Send Message"}', true)
        ON CONFLICT (name) DO NOTHING;
        
        -- Insertar configuración del sistema
        INSERT INTO system_config (id, key, value, description, category) VALUES 
        ('config_site_name', 'site.name', '"Next.js Template"', 'Site name displayed in header and metadata', 'general'),
        ('config_site_description', 'site.description', '"A modern Next.js template with CMS capabilities"', 'Site description for SEO', 'general'),
        ('config_default_locale', 'i18n.defaultLocale', '"en"', 'Default locale for the application', 'i18n'),
        ('config_available_locales', 'i18n.availableLocales', '["en", "es"]', 'Available locales for the application', 'i18n'),
        ('config_theme_mode', 'theme.defaultMode', '"light"', 'Default theme mode (light/dark)', 'theme'),
        ('config_admin_enabled', 'admin.enabled', 'true', 'Enable admin panel access', 'admin')
        ON CONFLICT (key) DO NOTHING;
        
        -- Mostrar estadísticas
        SELECT 'Locales insertados:' as info, COUNT(*) as count FROM locales;
        SELECT 'Namespaces insertados:' as info, COUNT(*) as count FROM namespaces;
        SELECT 'Traducciones insertadas:' as info, COUNT(*) as count FROM translations;
        SELECT 'Páginas insertadas:' as info, COUNT(*) as count FROM pages;
        SELECT 'Contenidos de página insertados:' as info, COUNT(*) as count FROM page_contents;
        SELECT 'Componentes insertados:' as info, COUNT(*) as count FROM components;
        SELECT 'Configuraciones del sistema insertadas:' as info, COUNT(*) as count FROM system_config;
EOSQL

else
    # Ejecutar seeds con TypeScript
    log "Ejecutando seeds TypeScript..."
    npx tsx scripts/database/seed.ts
fi

success "Seeds de datos ejecutados correctamente"

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

echo
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   🌱 Seeding Completado!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo

success "Base de datos poblada con datos de desarrollo! 🎉"

info "🔧 Comandos útiles:"
echo -e "  • Prisma Studio:  ${CYAN}npm run db:studio${NC}"
echo -e "  • Ver datos:      ${CYAN}docker-compose -f docker-compose.dev.yml exec postgres-dev psql -U dev_user -d nextjs_template_dev${NC}"
echo -e "  • Reset DB:       ${CYAN}./scripts/database/reset.sh${NC}"