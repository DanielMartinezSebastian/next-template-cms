#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funciones de logging
log() { echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "✅ $1"; }
warning() { echo -e "⚠️  $1"; }
error() { echo -e "❌ $1"; }

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  Prisma Studio - Development                  ║"
echo "║                     🎨 Database Explorer                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar si estamos en desarrollo
if [ "$NODE_ENV" = "production" ]; then
    error "Prisma Studio no debe ejecutarse en producción"
    echo "  Use herramientas de administración de producción como:"
    echo "  • Supabase Dashboard"
    echo "  • Vercel Postgres Dashboard"
    echo "  • pgAdmin para PostgreSQL directo"
    exit 1
fi

# Establecer variables de entorno por defecto para desarrollo
export NODE_ENV=${NODE_ENV:-development}

# Detectar y cargar la URL de base de datos correcta
if [ -f ".env.local" ]; then
    log "Cargando configuración desde .env.local..."
    # Cargar .env.local
    source .env.local 2>/dev/null || true
    
    if [ -n "$DATABASE_URL" ]; then
        success "DATABASE_URL encontrada en .env.local"
    else
        warning "DATABASE_URL no encontrada en .env.local"
    fi
fi

# Fallback a configuración de desarrollo por defecto
if [ -z "$DATABASE_URL" ]; then
    warning "Usando configuración de base de datos por defecto para desarrollo"
    export DATABASE_URL="postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev"
fi

# Verificar que la base de datos esté disponible
log "Verificando conexión a la base de datos..."
if command -v docker-compose &> /dev/null; then
    if docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
        success "Base de datos PostgreSQL disponible"
    else
        warning "Base de datos no disponible. Intentando iniciar servicios..."
        ./scripts/database/setup.sh
        
        # Esperar a que la base de datos esté lista
        for i in {1..30}; do
            if docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_isready -U dev_user -d nextjs_template_dev > /dev/null 2>&1; then
                success "Base de datos iniciada correctamente"
                break
            fi
            echo -n "."
            sleep 1
        done
    fi
fi

# Verificar que el cliente Prisma esté generado
log "Verificando cliente Prisma..."
if [ ! -d "node_modules/@prisma/client" ]; then
    warning "Cliente Prisma no encontrado. Generando..."
    npx prisma generate
fi

# Mostrar información de conexión
echo -e "${GREEN}"
echo "🎯 Prisma Studio iniciándose en desarrollo:"
echo "  • URL: http://localhost:5555"
echo "  • Base de datos: $(echo $DATABASE_URL | sed 's/:[^@]*@/@***@/')"
echo "  • Entorno: $NODE_ENV"
echo -e "${NC}"

# Ejecutar Prisma Studio con dotenv-cli para cargar variables de entorno
log "Iniciando Prisma Studio..."
exec npx dotenv -e .env.local -- npx prisma studio