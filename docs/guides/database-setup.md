# 🐳 Base de Datos Local - Next.js Template

Sistema completo de base de datos PostgreSQL para desarrollo local usando
Docker, con scripts automatizados y datos de ejemplo.

## 🚀 Inicio Rápido

### 1. Configuración Inicial (Una sola vez)

```bash
# Configurar todo automáticamente
./scripts/database/setup.sh
```

Este script hace todo el trabajo pesado:

- ✅ Verifica Docker y Docker Compose
- ✅ Crea archivo `.env.local` con configuración correcta
- ✅ Inicia PostgreSQL 16 + Redis + pgAdmin
- ✅ Genera cliente Prisma
- ✅ Aplica esquema de base de datos
- ✅ Ejecuta seeds con datos de ejemplo

### 2. Uso Diario

```bash
# Ver estado de la base de datos
./scripts/database/status.sh

# Poblar con datos de ejemplo
./scripts/database/seed.sh

# Resetear completamente (DESTRUCTIVO)
./scripts/database/reset.sh
```

## 🛠️ Servicios Disponibles

| Servicio       | URL                                            | Credenciales                                 |
| -------------- | ---------------------------------------------- | -------------------------------------------- |
| **PostgreSQL** | `localhost:5432`                               | `dev_user` / `dev_password_2024`             |
| **pgAdmin**    | [http://localhost:8080](http://localhost:8080) | `admin@nextjs-template.local` / `admin_2024` |
| **Redis**      | `localhost:6379`                               | Sin autenticación                            |

## 📊 Datos de Ejemplo Incluidos

El sistema incluye datos completos para desarrollo:

### 🌐 Traducciones

- **Locales**: Inglés (en) y Español (es)
- **Namespaces**: common, home, admin
- **Traducciones**: +20 claves en ambos idiomas

### 📄 Páginas

- **Home**: Página principal con hero y características
- **About**: Página informativa
- **Contact**: Página de contacto con formulario

### 🧩 Componentes

- **Hero**: Sección principal con título y CTA
- **FeatureGrid**: Grilla de características
- **ContactForm**: Formulario de contacto

### ⚙️ Configuración del Sistema

- Configuración de sitio (nombre, descripción)
- Configuración de i18n (locales, idioma por defecto)
- Configuración de tema y admin panel

## 🔧 Scripts de Gestión

### `setup.sh` - Configuración Inicial

```bash
./scripts/database/setup.sh
```

- Verifica dependencias (Docker, Docker Compose)
- Configura variables de entorno
- Inicia servicios Docker
- Configura Prisma
- Aplica esquema de base de datos

### `reset.sh` - Reset Completo

```bash
./scripts/database/reset.sh
```

⚠️ **DESTRUCTIVO** - Elimina todos los datos

- Confirma con el usuario antes de proceder
- Detiene servicios y elimina volúmenes
- Reinicia con base de datos limpia
- Ejecuta seeds automáticamente

### `seed.sh` - Datos de Ejemplo

```bash
./scripts/database/seed.sh
```

- Verifica conexión a base de datos
- Inserta datos de ejemplo completos
- Muestra estadísticas de datos insertados
- Compatible con ejecución repetida (upsert)

### `status.sh` - Estado del Sistema

```bash
./scripts/database/status.sh
```

- Verifica estado de servicios Docker
- Muestra información de PostgreSQL y Redis
- Analiza conectividad desde la aplicación
- Proporciona estadísticas de datos

## 🗃️ Estructura de Archivos

```
├── docker-compose.dev.yml          # Configuración Docker Compose
├── database/
│   ├── init/01-init.sh            # Script de inicialización PostgreSQL
│   ├── postgresql.conf            # Configuración optimizada para desarrollo
│   └── pgadmin-servers.json       # Configuración predefinida de pgAdmin
└── scripts/database/
    ├── setup.sh                   # Script de configuración inicial
    ├── reset.sh                   # Script de reset completo
    ├── seed.sh                    # Script de datos de ejemplo
    └── status.sh                  # Script de verificación de estado
```

## 🔄 Comandos Docker Manuales

Si necesitas control manual de los servicios:

```bash
# Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes (DESTRUCTIVO)
docker-compose -f docker-compose.dev.yml down -v

# Ver estado de servicios
docker-compose -f docker-compose.dev.yml ps
```

## 🏗️ Configuración de PostgreSQL

### Optimizaciones para Desarrollo

- **Memoria**: 256MB shared_buffers, 1GB effective_cache_size
- **Performance**: fsync deshabilitado para velocidad
- **Logging**: Consultas lentas (+1s) registradas
- **Extensiones**: uuid-ossp, pg_stat_statements, pg_trgm

### Volúmenes Persistentes

- `nextjs_template_postgres_dev_data`: Datos de PostgreSQL
- `nextjs_template_pgadmin_data`: Configuración de pgAdmin
- `nextjs_template_redis_dev_data`: Datos de Redis

## 🔐 Seguridad en Desarrollo

⚠️ **Esta configuración es SOLO para desarrollo**:

- Passwords hardcodeados en docker-compose
- SSL deshabilitado
- fsync deshabilitado para performance
- Acceso sin restricciones desde localhost

Para producción, usa variables de entorno seguras y SSL.

## 🚨 Solución de Problemas

### Error: "Docker not found"

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Error: "Database connection failed"

```bash
# Verificar servicios
./scripts/database/status.sh

# Reiniciar servicios
docker-compose -f docker-compose.dev.yml restart
```

### Error: "Port already in use"

```bash
# Ver qué proceso usa el puerto 5432
sudo lsof -i :5432

# Cambiar puerto en docker-compose.dev.yml si es necesario
```

### Datos corrompidos o inconsistentes

```bash
# Reset completo (DESTRUCTIVO)
./scripts/database/reset.sh
```

## 🔗 Integración con la Aplicación

### Variables de Entorno Requeridas

```env
# .env.local
DATABASE_URL="postgresql://dev_user:dev_password_2024@localhost:5432/nextjs_template_dev"
REDIS_URL="redis://localhost:6379"
CACHE_REDIS_URL="redis://localhost:6379"
```

### Comandos NPM Relacionados

```json
{
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio"
}
```

## 🎯 Próximos Pasos

Una vez configurada la base de datos:

1. **Ejecutar aplicación**: `npm run dev`
2. **Abrir Prisma Studio**: `npm run db:studio`
3. **Verificar datos**: Navegar a [http://localhost:3000](http://localhost:3000)
4. **Administrar DB**: Usar pgAdmin en
   [http://localhost:8080](http://localhost:8080)

¡Tu base de datos local está lista para desarrollo! 🚀
