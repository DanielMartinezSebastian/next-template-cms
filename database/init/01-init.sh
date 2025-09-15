#!/bin/bash
# Configuración inicial de PostgreSQL para desarrollo
# Este script se ejecuta automáticamente al crear el contenedor

set -e

echo "🚀 Iniciando configuración de PostgreSQL para desarrollo..."

# Crear extensiones útiles para desarrollo
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Extensiones para desarrollo y debugging
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Configurar timezone
    SET timezone = 'UTC';
    
    -- Configurar parámetros de desarrollo
    ALTER SYSTEM SET log_statement = 'all';
    ALTER SYSTEM SET log_duration = on;
    ALTER SYSTEM SET log_min_duration_statement = 1000;
    
    -- Recargar configuración
    SELECT pg_reload_conf();
    
    -- Información del sistema
    SELECT version() as postgresql_version;
    
    -- Usuario y base de datos creados exitosamente
    \l
    \du
EOSQL

echo "✅ PostgreSQL configurado exitosamente para desarrollo"
echo "📊 Base de datos: $POSTGRES_DB"
echo "👤 Usuario: $POSTGRES_USER"
echo "🌐 Host: localhost:5432"