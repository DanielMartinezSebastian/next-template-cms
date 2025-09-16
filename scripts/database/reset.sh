#!/bin/bash
# 🔄 Script para resetear la base de datos de desarrollo
# Next.js Template - Database Reset

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
echo "║                Database Reset - Next.js Template              ║"
echo "║                        ⚠️  DESTRUCTIVO                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

warning "Este script eliminará TODOS los datos de la base de datos de desarrollo"
warning "Esta acción NO se puede deshacer"
echo

read -p "¿Estás seguro de que deseas continuar? Escribe 'RESET' para confirmar: " -r
echo

if [ "$REPLY" != "RESET" ]; then
    info "Operación cancelada por el usuario"
    exit 0
fi

log "Iniciando reset de base de datos..."

# Detener servicios
log "Deteniendo servicios Docker..."
docker-compose -f docker-compose.dev.yml down -v
success "Servicios detenidos y volúmenes eliminados"

# Eliminar volúmenes explícitamente
log "Eliminando volúmenes de datos..."
docker volume rm nextjs_template_postgres_dev_data 2>/dev/null || true
docker volume rm nextjs_template_pgadmin_data 2>/dev/null || true
docker volume rm nextjs_template_redis_dev_data 2>/dev/null || true
success "Volúmenes eliminados"

# Limpiar imágenes no utilizadas (opcional)
log "Limpiando imágenes Docker no utilizadas..."
docker image prune -f > /dev/null 2>&1 || true
success "Imágenes limpiadas"

# Reiniciar servicios
log "Reiniciando servicios con datos limpios..."
docker-compose -f docker-compose.dev.yml up -d

# Esperar a que PostgreSQL esté listo
log "Esperando a que PostgreSQL esté listo..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
        success "PostgreSQL está listo!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        error "PostgreSQL no pudo iniciarse después de $max_attempts intentos"
        exit 1
    fi
    
    echo -ne "\r${YELLOW}⏳ Intento $attempt/$max_attempts - Esperando PostgreSQL...${NC}"
    sleep 2
    ((attempt++))
done

echo # Nueva línea después del progreso

# Regenerar cliente Prisma
log "Regenerando cliente Prisma..."
npx dotenv -e .env.local -- npx prisma generate
success "Cliente Prisma regenerado"

# Aplicar esquema
log "Aplicando esquema de base de datos..."
npx dotenv -e .env.local -- npx prisma db push --force-reset
success "Esquema aplicado con datos limpios"

# Ejecutar seeds si existen
if [ -f "scripts/database/seed.sh" ]; then
    log "Ejecutando seeds de desarrollo..."
    ./scripts/database/seed.sh
    success "Seeds ejecutados"
else
    warning "No se encontraron scripts de seeds"
fi

echo
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   🎉 Reset Completado!                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo

success "Base de datos reseteada y lista para desarrollo! 🚀"

info "📊 Servicios disponibles:"
echo -e "  • PostgreSQL:     ${CYAN}localhost:5432${NC}"
echo -e "  • pgAdmin:        ${CYAN}http://localhost:8080${NC}"
echo -e "  • Redis:          ${CYAN}localhost:6379${NC}"