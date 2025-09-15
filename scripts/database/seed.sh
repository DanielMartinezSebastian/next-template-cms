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

# Ejecutar seeds con TypeScript/Node.js
log "Ejecutando seeds de datos..."

# Verificar si existe el script de seeds TypeScript
if [ -f "scripts/database/seed.ts" ]; then
    log "Compilando y ejecutando seeds con TypeScript..."
    
    # Establecer variables de entorno para Prisma
    export DATABASE_URL="postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev"
    
    # Compilar el script TypeScript
    npx tsc scripts/database/seed.ts --target es2020 --module commonjs --outDir scripts/database/compiled --skipLibCheck
    
    # Ejecutar el script compilado
    node scripts/database/compiled/seed.js
    
    if [ $? -eq 0 ]; then
        success "Seeds de datos ejecutados correctamente"
        # Limpiar archivos compilados
        rm -rf scripts/database/compiled
    else
        error "Error al ejecutar seeds de datos"
        exit 1
    fi
else
    warning "Script de seeds TypeScript no encontrado"
    exit 1
fi

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