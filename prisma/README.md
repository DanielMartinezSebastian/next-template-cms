# 🗄️ Base de Datos - Guía Rápida

## 📊 Esquema Principal

### Modelos Implementados

- **`Locale`** - Idiomas soportados (es, en)
- **`Translation`** - Traducciones dinámicas con namespace
- **`Page`** - Páginas del CMS con metadata y jerarquía
- **`Component`** - Componentes de página con configuración JSON
- **`SystemConfig`** - Configuración global del sistema

## 🚀 Comandos Rápidos

### Desarrollo Local

```bash
# Iniciar base de datos (Docker)
./scripts/database/setup.sh

# Ver estado
./scripts/database/status.sh

# Poblar con datos de ejemplo
./scripts/database/seed.sh

# Limpiar y reiniciar
./scripts/database/reset.sh
```

### Prisma

```bash
# Generar cliente
npx prisma generate

# Aplicar cambios del schema
npx prisma db push

# Ver datos (GUI)
npx prisma studio
```

## 🎯 Datos de Ejemplo

El sistema incluye seeds automáticos:

- ✅ **16+ traducciones** activas (es/en)
- ✅ **3 namespaces** (admin, common, home)
- ✅ **Páginas de ejemplo** con componentes
- ✅ **Configuración del sistema** completa

## 📖 Ver Documentación Completa

Para setup detallado: [`/docs/guides/database-setup.md`](../docs/guides/database-setup.md)