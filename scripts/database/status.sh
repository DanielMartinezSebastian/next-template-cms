#!/bin/bash
# 📊 Script para verificar el estado de la base de datos de desarrollo
# Next.js Template - Database Status

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
echo "║                Database Status - Next.js Template             ║"
echo "║                         📊 Health Check                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar Docker
log "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado"
    exit 1
fi

success "Docker disponible"

# Verificar servicios
log "Verificando servicios Docker..."
services_status=$(docker-compose -f docker-compose.dev.yml ps --format table 2>/dev/null || echo "No services")

if [[ "$services_status" == "No services" ]]; then
    warning "No hay servicios ejecutándose"
    echo
    info "Para iniciar los servicios ejecuta: ./scripts/database/setup.sh"
    exit 0
fi

echo
echo -e "${CYAN}📊 Estado de servicios:${NC}"
echo "$services_status"
echo

# Verificar PostgreSQL
log "Verificando PostgreSQL..."
if docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
    success "PostgreSQL está disponible"
    
    # Obtener información de la base de datos
    log "Obteniendo información de la base de datos..."
    docker-compose -f docker-compose.dev.yml exec -T postgres-dev psql -U dev_user -d nextjs_template_dev <<-EOSQL
        \echo '🔍 Información de la base de datos:'
        SELECT version() as postgresql_version;
        
        \echo ''
        \echo '📊 Estadísticas de tablas:'
        SELECT 
            schemaname,
            tablename,
            n_tup_ins as inserts,
            n_tup_upd as updates,
            n_tup_del as deletes,
            n_live_tup as live_rows
        FROM pg_stat_user_tables 
        ORDER BY schemaname, tablename;
        
        \echo ''
        \echo '💾 Tamaño de base de datos:'
        SELECT 
            pg_database.datname as database_name,
            pg_size_pretty(pg_database_size(pg_database.datname)) as size
        FROM pg_database 
        WHERE datname = 'nextjs_template_dev';
        
        \echo ''
        \echo '📋 Resumen de datos:'
        SELECT 
            'Locales' as tabla,
            COUNT(*) as registros
        FROM locales
        UNION ALL
        SELECT 
            'Namespaces' as tabla,
            COUNT(*) as registros
        FROM namespaces
        UNION ALL
        SELECT 
            'Translations' as tabla,
            COUNT(*) as registros
        FROM translations
        UNION ALL
        SELECT 
            'Pages' as tabla,
            COUNT(*) as registros
        FROM pages
        UNION ALL
        SELECT 
            'Page Contents' as tabla,
            COUNT(*) as registros
        FROM page_contents
        UNION ALL
        SELECT 
            'Components' as tabla,
            COUNT(*) as registros
        FROM components
        UNION ALL
        SELECT 
            'System Config' as tabla,
            COUNT(*) as registros
        FROM system_config;
EOSQL
    
else
    error "PostgreSQL no está disponible"
fi

# Verificar Redis
log "Verificando Redis..."
if docker-compose -f docker-compose.dev.yml exec -T redis-dev redis-cli ping > /dev/null 2>&1; then
    success "Redis está disponible"
    
    # Obtener información de Redis
    redis_info=$(docker-compose -f docker-compose.dev.yml exec -T redis-dev redis-cli info memory | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
    redis_keys=$(docker-compose -f docker-compose.dev.yml exec -T redis-dev redis-cli dbsize | tr -d '\r')
    
    echo -e "  • Memoria utilizada: ${CYAN}$redis_info${NC}"
    echo -e "  • Claves almacenadas: ${CYAN}$redis_keys${NC}"
else
    warning "Redis no está disponible"
fi

# Verificar conectividad desde la aplicación
log "Verificando conectividad desde la aplicación..."
if [ -f ".env.local" ]; then
    source .env.local
    if [[ "$DATABASE_URL" == *"localhost:5432"* ]]; then
        success "DATABASE_URL configurado correctamente"
    else
        warning "DATABASE_URL podría no estar configurado para desarrollo local"
        echo -e "  • Actual: ${YELLOW}$DATABASE_URL${NC}"
        echo -e "  • Esperado: ${CYAN}postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev${NC}"
    fi
else
    warning "Archivo .env.local no encontrado"
fi

# Verificar cliente Prisma
log "Verificando cliente Prisma..."
if [ -d "node_modules/.prisma" ]; then
    success "Cliente Prisma generado"
else
    warning "Cliente Prisma no encontrado. Ejecuta: npm run db:generate"
fi

echo
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    📊 Status Check Completado                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo

info "🔧 Comandos útiles:"
echo -e "  • Logs PostgreSQL: ${CYAN}docker-compose -f docker-compose.dev.yml logs postgres-dev${NC}"
echo -e "  • Logs Redis:      ${CYAN}docker-compose -f docker-compose.dev.yml logs redis-dev${NC}"
echo -e "  • Prisma Studio:   ${CYAN}npm run db:studio${NC}"
echo -e "  • Reset DB:        ${CYAN}./scripts/database/reset.sh${NC}"
echo -e "  • Setup DB:        ${CYAN}./scripts/database/setup.sh${NC}"