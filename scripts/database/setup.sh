#!/bin/bash
# 🚀 Script de configuración completa de base de datos para desarrollo
# Next.js Template - Local Database Setup

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
echo "║                  Next.js Template Database Setup              ║"
echo "║                     🐳 Docker PostgreSQL                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar Docker
log "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Instálalo desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    error "Docker Compose no está disponible. Instálalo desde: https://docs.docker.com/compose/install/"
    exit 1
fi

success "Docker y Docker Compose están disponibles"

# Verificar si los servicios ya están ejecutándose
log "Verificando servicios existentes..."
if docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    warning "Algunos servicios ya están ejecutándose"
    read -p "¿Deseas reiniciarlos? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Deteniendo servicios existentes..."
        docker compose -f docker-compose.dev.yml down
    else
        info "Manteniendo servicios existentes"
        exit 0
    fi
fi

# Crear archivo .env.local si no existe
log "Configurando variables de entorno..."
if [ ! -f .env.local ]; then
    log "Creando .env.local desde .env.example..."
    cp .env.example .env.local
    
    # Actualizar DATABASE_URL en .env.local
    sed -i 's|DATABASE_URL=.*|DATABASE_URL="postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev"|g' .env.local
    
    # Actualizar configuración de Redis
    sed -i 's|REDIS_URL=.*|REDIS_URL="redis://localhost:6379"|g' .env.local
    sed -i 's|CACHE_REDIS_URL=.*|CACHE_REDIS_URL="redis://localhost:6379"|g' .env.local
    
    success "Archivo .env.local creado y configurado"
else
    warning "El archivo .env.local ya existe. Verificando configuración..."
    
    # Verificar si tiene la URL correcta
    if ! grep -q "postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev" .env.local; then
        warning "DATABASE_URL en .env.local no coincide con la configuración de Docker"
        read -p "¿Deseas actualizarlo automáticamente? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sed -i 's|DATABASE_URL=.*|DATABASE_URL="postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev"|g' .env.local
            success "DATABASE_URL actualizado en .env.local"
        fi
    fi
fi

# Hacer ejecutable el script de inicialización
log "Configurando permisos de scripts..."
chmod +x database/init/01-init.sh
success "Permisos configurados"

# Iniciar servicios
log "Iniciando servicios de desarrollo..."
docker compose -f docker-compose.dev.yml up -d

# Esperar a que PostgreSQL esté listo
log "Esperando a que PostgreSQL esté listo..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
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

# Verificar Prisma
log "Verificando configuración de Prisma..."
if [ ! -f "package.json" ]; then
    error "package.json no encontrado. ¿Estás en el directorio raíz del proyecto?"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    log "Instalando dependencias de Node.js..."
    npm install
    success "Dependencias instaladas"
fi

# Generar cliente Prisma
log "Generando cliente Prisma..."
npx prisma generate
success "Cliente Prisma generado"

# Aplicar migraciones o push del esquema
log "Aplicando esquema de base de datos..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    log "Aplicando migraciones existentes..."
    npx prisma migrate deploy
else
    log "No hay migraciones. Aplicando esquema directamente..."
    npx prisma db push
fi
success "Esquema de base de datos aplicado"

# Información final
echo
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    🎉 ¡Setup Completado!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo

info "📊 Servicios disponibles:"
echo -e "  • PostgreSQL:     ${CYAN}localhost:5432${NC}"
echo -e "  • pgAdmin:        ${CYAN}http://localhost:8080${NC}"
echo -e "  • Redis:          ${CYAN}localhost:6379${NC}"
echo

info "🔑 Credenciales de acceso:"
echo -e "  • DB Usuario:     ${CYAN}dev_user${NC}"
echo -e "  • DB Password:    ${CYAN}dev_password_2024${NC}"
echo -e "  • DB Nombre:      ${CYAN}nextjs_template_dev${NC}"
echo -e "  • pgAdmin Email:  ${CYAN}admin@nextjs-template.local${NC}"
echo -e "  • pgAdmin Pass:   ${CYAN}admin_2024${NC}"
echo

info "🛠️  Comandos útiles:"
echo -e "  • Ver logs:       ${CYAN}docker compose -f docker-compose.dev.yml logs -f${NC}"
echo -e "  • Detener:        ${CYAN}docker compose -f docker-compose.dev.yml down${NC}"
echo -e "  • Prisma Studio:  ${CYAN}npm run db:studio${NC}"
echo -e "  • Reset DB:       ${CYAN}./scripts/database/reset.sh${NC}"
echo

success "¡Base de datos lista para desarrollo! 🚀"