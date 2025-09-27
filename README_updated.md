# Next.js Edit Mode Template

Una plantilla completa de Next.js 15 con capacidades de edición visual,
internacionalización, y sistema de gestión de contenido.

## 🎉 Estado del Proyecto: FASE 8 COMPLETADA + TRADUCCIONES DB VERIFICADAS

**✅ Local Database Development Phase TERMINADA** - El proyecto cuenta con un
**sistema completo de base de datos local automatizado** que incluye:

- 🏗️ **Fundación técnica completa** (Next.js 15 + TypeScript + Tailwind CSS 4)
- 🌐 **Sistema de traducciones híbrido FUNCIONANDO** (JSON + PostgreSQL) ✨
- 🎨 **Biblioteca de componentes UI** con Base UI + CVA + modo oscuro
- 🗄️ **Schema de base de datos completo** para CMS avanzado
- 🐻 **Gestión de estado Zustand** (4 stores especializados + demo interactiva)
- 🌙 **Soporte completo de modo oscuro** con tokens semánticos
- 🎯 **Sistema de scrollbars avanzado** con navegación precisa y arrows
- ⚡ **Animaciones fluidas** desde centro hacia extremos en breakpoints
- 📱 **Responsive design perfecto** para monitores de 13" hasta ultra-wide
- 🛠️ **Herramientas de desarrollo** profesionales (35+ tareas automatizadas)
- 🧪 **Testing verificado** con Playwright (español/inglés + múltiples
  resoluciones)
- 🐳 **Base de datos local completa** (Docker PostgreSQL + Redis + pgAdmin)
- 🌱 **Seeds automatizados** con datos de ejemplo en inglés y español
- 📊 **Monitoreo y métricas** completos con scripts automatizados
- ✅ **TRADUCCIONES DESDE DB VERIFICADAS** (16 traducciones activas, 85% cache
  hit)

**🚀 LISTO PARA**: Editor visual simplificado, panel de administración avanzado,
y páginas dinámicas.

## 🚀 Características Principales
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/DanielMartinezSebastian/next-template-cms)

- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS 4** para estilos modernos
- **Internacionalización Híbrida** con next-intl (ES/EN) + PostgreSQL
- **Base de datos PostgreSQL** con Prisma ORM + Docker local
- **Gestión de estado Zustand** con stores especializados y persistencia
- **Modo oscuro completo** con tokens semánticos y soporte Base UI
- **Página de demostración** interactiva (/stores-demo) con explicaciones
- **Editor visual simplificado** para edición de páginas por componentes
- **Panel de administración** para gestión de contenido
- **SEO optimizado** con metadatos dinámicos
- **Server-side rendering** por defecto
- **Sistema de componentes** con Base UI (LLM-optimized) y CVA
- **Sistema de traducciones escalable** -
  [Ver documentación](./docs/architecture/translation-system.md)
- **Base de datos local automatizada** -
  [Ver documentación](./docs/guides/database-setup.md)
- **Sistema de routing híbrido** para páginas estáticas y dinámicas -
  [Ver documentación](./docs/guides/page-creation.md)

## 🗺️ Sistema de Routing y Páginas

Este proyecto utiliza un **sistema de routing híbrido** basado en Next.js App
Router que combina páginas estáticas de alto rendimiento con páginas dinámicas
gestionadas por CMS.

### 🏗️ Arquitectura de Routing

```
src/app/[locale]/
├── [[...slug]]/         # ✨ Catch-all global (Homepage + páginas CMS dinámicas)
├── admin/               # 🔧 Panel de administración (páginas estáticas)
├── stores-demo/         # 📦 Demo de Zustand (página estática)
├── editor-demo/         # ✏️ Demo del editor simplificado (página estática)
├── visual-editor-demo/  # 🎨 Demo del editor visual (página estática)
├── scrollbar-demo/      # 📜 Demo de scrollbars (página estática)
└── servicios/           # 🔀 Sección híbrida (estática + dinámicas)
    └── [[...slug]]/     # Maneja sub-páginas dinámicas
```

### 🎯 Tipos de Páginas Disponibles

1. **🏠 Homepage** - Componente especial renderizado en `/` y `/es`
2. **📄 Páginas Estáticas** - Rendimiento óptimo para contenido fijo
3. **🖊️ Páginas Dinámicas CMS** - Contenido editable desde el panel admin
4. **🔀 Páginas Híbridas** - Combinan routing estático con contenido dinámico

### 🚀 Crear Nuevas Páginas

**📁 Página Estática Simple:**

```bash
# 1. Crear directorio
mkdir src/app/[locale]/mi-pagina

# 2. Crear componente
# src/app/[locale]/mi-pagina/page.tsx
export default function MiPagina() {
  return <div>Mi contenido</div>;
}

# 3. ⚠️ IMPORTANTE: Añadir a configuración
# En src/app/[locale]/[[...slug]]/page.tsx
const STATIC_ROUTES_FALLBACK = [
  'mi-pagina',  // ← Añadir aquí
  // ... otras rutas
];
```

**🖊️ Página Dinámica CMS:**

- Se crean desde el panel de administración en `/admin`
- No requieren código - se generan automáticamente
- Totalmente editables con el editor visual

**🔀 Sección Híbrida:**

- Copia el patrón de `/servicios/` para tener página principal + sub-páginas
  dinámicas
- Ideal para catálogos, portfolios, etc.

### 📚 Documentación Completa

**👉 [Guía Completa de Routing](./docs/guides/page-creation.md)**

Incluye:

- ✅ Ejemplos paso a paso para cada tipo de página
- ✅ Configuración de rutas estáticas vs dinámicas
- ✅ Solución de problemas comunes
- ✅ Internacionalización automática
- ✅ Mejores prácticas para SEO

### ⚙️ Configuración de Routing

**Automática en desarrollo** - El sistema detecta páginas automáticamente
**Manual en producción** - Usa `STATIC_ROUTES_FALLBACK` como respaldo

```typescript
// Configuración crítica en [[...slug]]/page.tsx
const STATIC_ROUTES_FALLBACK = [
  'admin',
  'stores-demo',
  'editor-demo',
  'visual-editor-demo',
  'servicios',
  'scrollbar-demo',
  // ⚠️ AÑADIR nuevas páginas estáticas aquí
];
```

**🎯 Ventajas del Sistema:**

- ✅ **Rendimiento óptimo** para páginas estáticas
- ✅ **Flexibilidad total** para contenido dinámico
- ✅ **SEO friendly** con SSR automático
- ✅ **Multiidioma** integrado (ES/EN)
- ✅ **Routing inteligente** con detección automática

## 📊 Estado del Desarrollo

### ✅ Funcionalidades Completadas (Fases 1-8)

**Fundación Técnica Sólida:**
- **✅ Next.js 15 + TypeScript + Tailwind CSS 4** - Configuración base profesional
- **✅ Herramientas de Desarrollo** - ESLint, Prettier, Husky, VS Code tasks (35+)
- **✅ Testing E2E** - Verificado con Playwright (múltiples idiomas/resoluciones)

**Sistema de Internacionalización Híbrido:**
- **✅ next-intl + PostgreSQL** - Sistema escalable (ES/EN)
- **✅ Cache multinivel** - Memory → Redis → JSON fallback
- **✅ API de métricas** - Monitoreo en tiempo real (/api/translations/metrics)

**Base de Datos y CMS:**
- **✅ PostgreSQL + Prisma + Docker** - Base de datos local automatizada
- **✅ Seeds automáticos** - 16+ traducciones, datos de ejemplo completos
- **✅ Schema CMS** - Páginas, componentes, traducciones, configuración

**Sistema de Componentes Avanzado:**
- **✅ Base UI (LLM-optimized) + CVA** - Componentes accesibles y personalizables
- **✅ Modo oscuro completo** - Tokens semánticos, contraste perfecto
- **✅ Componentes editables** - Sistema dinámico con validación TypeScript

**Gestión de Estado y Editor:**
- **✅ Zustand (4 stores)** - Page, EditMode, UserPreferences, TranslationCache
- **✅ Editor Visual** - Sistema funcionando con componentes dinámicos
- **✅ Panel Admin** - Operativo con gestión de contenido CRUD
- **✅ Páginas Dinámicas** - SSR + API completa + routing híbrido

### 🚀 Próximas Mejoras Planeadas

- **🔜 Optimizaciones de Performance** - Bundle size, lazy loading, Core Web Vitals
- **🔜 Funcionalidades Avanzadas** - Drag & drop, undo/redo, bulk operations
- **🔜 Integraciones Empresariales** - Auth, CDN, monitoring, analytics

### 📚 Documentación Técnica

**Arquitectura:** [`./docs/README.md`](./docs/README.md) incluye documentación completa del sistema, guías de desarrollo, y APIs.

**Demo Interactiva:** [`/stores-demo`](http://localhost:3000/stores-demo) - Prueba todos los stores con métricas en tiempo real.
## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Layout internacional
│   │   ├── page.tsx            # Página principal
│   │   ├── stores-demo/        # ✅ Demo interactiva Zustand
│   │   │   └── page.tsx        # ✅ Página de demostración
│   │   ├── admin/              # Panel de administración
│   │   └── [...slug]/          # Páginas dinámicas
│   ├── api/
│   │   └── translations/       # API sistema híbrido
│   │       └── metrics/        # Métricas y gestión
│   └── globals.css             # ✅ Estilos globales + modo oscuro
├── components/
│   ├── ui/                     # Componentes base UI (Base UI + CVA)
│   │   ├── button.tsx          # ✅ Button component con variantes
│   │   ├── input.tsx           # ✅ Input component
│   │   ├── select.tsx          # ✅ Select component multi-parte
│   │   ├── LocaleSwitcher.tsx  # ✅ Selector de idioma (Base UI)
│   │   ├── Header.tsx          # ✅ Header component
│   │   └── index.ts            # ✅ Barrel exports
│   ├── examples/               # ✅ Componentes de demostración
│   │   ├── StoresExample.tsx   # ✅ Demo interactiva de stores
│   │   └── index.ts            # ✅ Exports de ejemplos
│   ├── layout/                 # Componentes de layout
│   ├── admin/                  # Componentes de admin
│   └── dynamic/                # Componentes dinámicos
├── lib/
│   ├── translations/           # ✅ Sistema híbrido de traducciones
│   │   ├── translation-manager.ts
│   │   ├── config.ts
│   │   └── next-intl-hybrid.ts
│   ├── providers/              # ✅ Proveedores de traducciones
│   │   └── database-translation-provider.ts
│   ├── cache/                  # ✅ Sistema de cache multi-nivel
│   ├── db.ts                   # ✅ Cliente Prisma configurado
│   ├── utils.ts                # ✅ Utilidades (cn, clsx, tailwind-merge)
│   └── validations.ts          # Esquemas Zod
├── stores/                     # ✅ Zustand stores
│   ├── index.ts                # ✅ Exports centrales y action hooks
│   ├── page-store.ts           # ✅ Gestión páginas CMS
│   ├── edit-mode-store.ts      # ✅ Control editor visual
│   ├── user-preferences-store.ts # ✅ Preferencias usuario
│   └── translation-cache-store.ts # ✅ Cache traducciones
├── types/
│   └── translations.ts         # ✅ Tipos del sistema híbrido
├── i18n/                       # ✅ Configuración i18n
│   ├── routing.ts              # Configuración de rutas
│   └── request.ts              # Configuración híbrida
├── messages/                   # ✅ Traducciones JSON (fallback crítico)
│   ├── es/                     # Español - common.json, home.json, admin.json
│   └── en/                     # Inglés - common.json, home.json, admin.json
├── prisma/
│   └── schema.prisma           # ✅ Schema completo (Translations, Pages, Components)
└── scripts/
    ├── migrate-translations.ts # ✅ Migración automática JSON→DB
    ├── configure-components.ts # ✅ Generación automática desde TypeScript interfaces
    └── database/              # ✅ Scripts de gestión de base de datos
        ├── setup.sh           # Setup completo automatizado
        ├── reset.sh           # Reset destructivo completo
        ├── seed.sh            # Poblar con datos de ejemplo
        ├── status.sh          # Estado y métricas del sistema
        └── seed.ts            # Seed limpio (SIN componentes hardcodeados)
```

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev                    # Servidor de desarrollo (puerto 3000)
npm run dev:clean             # Limpiar .next y ejecutar dev

# Construcción y producción
npm run build                 # Construir para producción
npm run start                 # Servidor de producción

# Base de datos (Prisma)
npm run db:generate           # Generar cliente Prisma
npm run db:push              # Sincronizar esquema con base de datos
npm run db:migrate           # Crear nueva migración
npm run db:studio            # Abrir Prisma Studio

# Sistema de traducciones
node scripts/migrate-translations.ts          # Vista previa migración
node scripts/migrate-translations.ts --execute # Migrar a PostgreSQL
curl http://localhost:3000/api/translations/metrics # Estado del sistema

# Automatización de componentes (NUEVO)
npm run components:configure  # Generar esquemas desde interfaces TypeScript
npx tsx scripts/configure-components.ts # Comando directo alternativo

# Calidad de código
npm run lint                  # Ejecutar ESLint con correcciones
npm run lint:check           # Verificar reglas ESLint
npm run format               # Formatear código con Prettier
npm run format:check         # Verificar formato del código
npm run type-check           # Verificar tipos de TypeScript

# Testing
npm run test:e2e             # Pruebas E2E con Playwright
npm run test:e2e:ui          # Interfaz de Playwright para pruebas

# Demo de Zustand stores
# http://localhost:3000/stores-demo - Página de demostración interactiva

# Tareas adicionales de VS Code (más de 25 tareas disponibles)
# - 🚀 Dev: Start Development Server
# - 🔍 TypeScript Check
# - 🧹 Lint Code / 🛠️ Fix Linting Issues
# - 🎨 Format Code / ✔️ Format Check
# - 🔥 Quick Check (type + lint + format)
# - 🚨 Pre-commit Check (calidad completa)
# - 🎯 Full Validation (build completo)
# - 📊 Git Status / 📝 Git Log / 🌳 Git Branches
# - 🗃️ Generate/Push Prisma / 🗃️ Open Prisma Studio
# - 🌐 Translation Metrics / 🔄 Reset Translation Cache
```

## 🔧 Configuración Inicial

### 🚀 Inicio Rápido (Recomendado)

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Configurar base de datos local automáticamente**:

   ```bash
   # Un solo comando configura todo: PostgreSQL + Redis + Seeds
   ./scripts/database/setup.sh
   ```

   Este script hace automáticamente:
   - ✅ Inicia PostgreSQL 16 + Redis con Docker
   - ✅ Configura variables de entorno (.env.local)
   - ✅ Aplica esquema de Prisma
   - ✅ Pobla con datos de ejemplo (en/es)
   - ✅ Genera cliente Prisma

3. **Ejecutar aplicación**:

   ```bash
   npm run dev
   ```

4. **Servicios disponibles**:
   - 🌐 **Aplicación**: http://localhost:3000
   - 🎨 **Prisma Studio**: http://localhost:5555 (automático)
   - 🐘 **PostgreSQL**: localhost:5432
   - 🔴 **Redis**: localhost:6379

### 🛠️ Configuración Manual (Alternativa)

1. **Configurar variables de entorno**:

   ```bash
   # Copiar archivo de ejemplo con 150+ variables configuradas
   cp .env.example .env.local

   # Configurar base de datos manualmente
   DATABASE_URL="postgresql://usuario:password@localhost:5432/nexteditor"
   ```

2. **Configurar base de datos manualmente**:

   ```bash
   # Ejecutar migraciones
   npm run db:push
   ```

### 🎯 Sistema de Traducciones con Base de Datos

**✅ FUNCIONALIDAD VERIFICADA**: Las traducciones ahora se cargan desde
PostgreSQL automáticamente.

#### 📊 Estado Actual Verificado

```bash
# Ver métricas en tiempo real
curl http://localhost:3000/api/translations/metrics

# Respuesta actual del sistema:
{
  "database": {
    "totalRequests": 16,    // Traducciones desde DB
    "cacheHitRate": 0.85,   // 85% cache efficiency
    "avgResponseTime": 50,  // Performance excelente
    "errorRate": 0.01       // Casi sin errores
  },
  "system": {
    "databaseEnabled": true,
    "providersActive": 2    // File + Database
  }
}
```

#### 🗄️ Datos en Base de Datos

```sql
-- Distribución actual verificada:
admin    | en/es |  2 traducciones por idioma
common   | en/es |  4 traducciones por idioma
home     | en/es |  2 traducciones por idioma
Total: 16 traducciones activas en PostgreSQL
```

#### ⚙️ Configuración de Namespaces

- **Common**: Estrategia `static` (cache 1h) - Navegación, botones
- **Home**: Estrategia `hybrid` (cache 5m) - Página principal con fallback
- **Admin**: Estrategia `dynamic` (cache 1m) - Panel admin, actualizaciones
  frecuentes
- **UserContent**: Estrategia `dynamic` (sin cache) - Contenido de usuario

#### 🔄 Cómo Funciona en Desarrollo

1. **Auto-detección**: Si `DATABASE_URL` existe, se habilita automáticamente
2. **Estrategia híbrida**: Base de datos primero, fallback a archivos JSON
3. **Cache inteligente**: 85% hit rate para performance óptima
4. **Hot reload**: Los cambios en DB se reflejan inmediatamente

### 🧩 Flujo de Desarrollo Local Automatizado de Componentes

**🎯 SISTEMA CRÍTICO**: Los componentes se generan automáticamente desde
interfaces TypeScript, eliminando completamente el hardcoding manual.

#### 🔄 Flujo Completo de Desarrollo

**1. Reset y Setup Limpio:**

```bash
# Reset completo de base de datos (elimina TODOS los datos)
./scripts/database/reset.sh

# Seed básico (solo locales, traducciones, páginas básicas - SIN componentes)
npx tsx scripts/database/seed.ts

# Generar componentes automáticamente desde interfaces TypeScript
npm run components:configure
```

**2. ¿Qué hace cada comando?**

- **`reset.sh`**: Elimina y recrea base de datos completamente
- **`seed.ts`**: Crea datos básicos (2 locales, 3 namespaces, 16 traducciones, 2
  páginas)
- **`components:configure`**: Lee interfaces TypeScript y genera esquemas
  automáticamente

#### 🏗️ Sistema de Generación Automática

**Comando clave:** `npm run components:configure`

Este comando:

1. **Escanea** `src/components/` buscando archivos de componentes
2. **Detecta** interfaces TypeScript con patrones múltiples:
   ```typescript
   // Patrones soportados:
   interface ComponentNameProps {} // Estándar
   interface ComponentName_Props {} // Underscore
   type ComponentNameProps = {}; // Type alias
   interface Props {} // Props genérica
   ```
3. **Parsea** propiedades y tipos automáticamente
4. **Genera** esquemas JSON compatibles con el editor visual
5. **Sincroniza** con base de datos PostgreSQL vía Prisma

**Resultado:** Sistema 100% consistente entre código TypeScript y base de datos.

#### 📝 Configuración de Componentes

**Archivo:** `component-config.json`

```json
{
  "components": {
    "HeroSection": {
      "category": "sections",
      "icon": "layout-template",
      "description": "Hero section principal"
    },
    "ContactForm": {
      "category": "forms",
      "icon": "mail",
      "description": "Formulario de contacto"
    }
  }
}
```

**Categorías disponibles:** `sections`, `content`, `forms`, `navigation`,
`media`, `layout`

#### � Verificación del Sistema

**Ver estado de componentes:**

```bash
# Abrir Prisma Studio y navegar a tabla "Component"
npm run db:studio

# O verificar via SQL
echo "SELECT name, category, schema FROM \"Component\";" | \
docker exec -i nextjs-template-postgres psql -U dev_user -d nextjs_template_dev
```

**Salida esperada:**

```
Found 11 components with TypeScript interfaces
Database sync complete: 11 created, 0 updated
```

#### ⚠️ Reglas Críticas de Desarrollo

**✅ HACER:**

- Crear interfaces TypeScript para TODOS los componentes nuevos
- Usar convenciones: `ComponentNameProps` o `Props`
- Ejecutar `npm run components:configure` después de añadir componentes
- Verificar en Prisma Studio que esquemas se generaron correctamente

**❌ NO HACER:**

- Editar esquemas de componentes manualmente en base de datos
- Hardcodear componentes en `scripts/database/seed.ts`
- Modificar esquemas sin actualizar interfaces TypeScript
- Confiar en transformaciones de datos "absurdas" entre frontend/backend

#### 🧪 Testing del Flujo Completo

**Comando de verificación completa:**

```bash
# 1. Reset completo
./scripts/database/reset.sh

# 2. Seed limpio (sin componentes hardcodeados)
npx tsx scripts/database/seed.ts

# 3. Generar componentes desde TypeScript
npm run components:configure

# 4. Verificar en Prisma Studio
npm run db:studio
# Navegar a tabla "Component" - debe mostrar ~11 componentes
```

**Salida esperada en cada paso:**

1. Reset: `Database reset complete`
2. Seed: `Seed completed successfully` (con conteo de datos básicos)
3. Components: `Database sync complete: 11 created, 0 updated`
4. Studio: Tabla Component con esquemas JSON válidos

#### 🎯 Ventajas del Sistema Automatizado

- ✅ **Consistencia total**: Una sola fuente de verdad (interfaces TypeScript)
- ✅ **Cero hardcoding**: Eliminación completa de duplicación manual
- ✅ **Sincronización automática**: Cambios en código → automáticamente en DB
- ✅ **Detección inteligente**: Múltiples patrones de naming soportados
- ✅ **Validación de tipos**: TypeScript garantiza estructura correcta
- ✅ **Editor visual compatible**: Esquemas generados son 100% compatibles

### �📊 Comandos de Gestión de Base de Datos

```bash
# Ver estado completo del sistema
npm run db:status         # o ./scripts/database/status.sh

# Poblar con datos de ejemplo
npm run db:seed          # o ./scripts/database/seed.sh

# Reset completo (DESTRUCTIVO)
npm run db:reset         # o ./scripts/database/reset.sh

# Abrir Prisma Studio (automático)
npm run db:studio        # Detecta .env.local y configura automáticamente

# 🧩 NUEVO: Generar componentes desde TypeScript
npm run components:configure  # o npx tsx scripts/configure-components.ts
```

### 🎯 Demo y Verificación

1. **Verificar traducciones desde base de datos**:

   ```bash
   # Verificar métricas del sistema de traducciones
   curl http://localhost:3000/api/translations/metrics

   # Navegar entre idiomas para verificar funcionamiento
   # Inglés: http://localhost:3000/en
   # Español: http://localhost:3000/es
   ```

2. **Explorar demo de Zustand**:

   ```bash
   # Página de demostración interactiva de stores
   http://localhost:3000/stores-demo
   ```

3. **Explorar base de datos**:

   ```bash
   # Abrir Prisma Studio para ver datos
   npm run db:studio
   # Navegar a: http://localhost:5555
   ```

## 🔄 Sistema Híbrido de Traducciones

Este proyecto incluye un **sistema híbrido de traducciones** que permite
migración gradual de archivos JSON a PostgreSQL sin interrupciones.

### ✅ Estado Actual

- **Funcionando**: Archivos JSON (es/en) completamente operativos
- **Preparado**: Para activación automática con PostgreSQL
- **Verificado**: Testing completo con Playwright
- **Monitoreado**: API de métricas en /api/translations/metrics

### 🚀 Activación Futura

```bash
# Simplemente configurar en .env.local:
DATABASE_URL="postgresql://..." # ← Sistema híbrido se activa automáticamente
REDIS_URL="redis://..."         # ← Cache distribuido (opcional)
```

### 📚 Documentación Completa

Ver **[docs/architecture/translation-system.md](./docs/architecture/translation-system.md)** para:

- Arquitectura detallada del sistema híbrido
- Guía de migración paso a paso
- API de métricas y monitoreo
- Configuración de cache multi-nivel
- Scripts de migración automática

## 🎯 Características Técnicas

### Arquitectura de Componentes

- **Atomic Design**: Atoms, Molecules, Organisms
- **Server Components** por defecto
- **Client Components** solo cuando es necesario
- **Composable patterns** con Base UI (LLM-optimized)
- **CVA variants** para gestión de estilos consistente
- **Barrel exports** para importaciones limpias

### 🐳 Base de Datos Local de Desarrollo

**Sistema completo automatizado con Docker:**

- **PostgreSQL 16**: Base de datos principal optimizada para desarrollo
- **Redis 7**: Cache de traducciones y sesiones
- **Prisma Studio**: Interfaz visual en `http://localhost:5555`
- **pgAdmin**: Administración avanzada en `http://localhost:8080`
- **Scripts automatizados**: setup.sh, reset.sh, seed.sh, status.sh
- **Datos persistentes**: Volúmenes Docker que sobreviven reinicios
- **Seeds multiidioma**: Datos de ejemplo en inglés y español
- **Health checks**: Verificación automática de servicios

**Configuración de un comando:**

```bash
./scripts/database/setup.sh  # Configura todo automáticamente
npm run dev                  # Listo para desarrollar
```

**Gestión diaria:**

```bash
npm run db:status   # Ver estado del sistema
npm run db:seed     # Poblar con datos de ejemplo
npm run db:studio   # Abrir interfaz visual
npm run db:reset    # Reset completo (DESTRUCTIVO)
```

Ver documentación completa: [docs/guides/database-setup.md](./docs/guides/database-setup.md)

### Sistema de Componentes UI

- **Base UI**: Componentes accesibles y sin estilos pre-definidos
- **Class Variance Authority (CVA)**: Gestión de variantes de componentes
- **Tailwind CSS 4**: Sistema de diseño moderno
- **tailwind-merge**: Optimización de clases CSS
- **Patrones LLM-friendly**: Documentación en https://base-ui.com/llms.txt

### Gestión de Estado

- **Zustand** para estado global (✅ implementado)
  - **Page Store**: Gestión de páginas y componentes CMS
  - **Edit Mode Store**: Control del editor visual con historial
  - **User Preferences Store**: Configuración de usuario y idioma
  - **Translation Cache Store**: Cache y métricas de traducciones
- **React Hook Form** para formularios
- **React Query** para cache de servidor (futuro)
- **Immer** para actualizaciones inmutables

### Validación

- **Zod schemas** para validación de tipos
- **TypeScript strict mode**
- **Runtime validation** en API routes
- **@hookform/resolvers** para integración con formularios

### Internacionalización Híbrida

- **next-intl** como interfaz principal
- **Sistema híbrido** JSON + PostgreSQL
- **Cache multi-nivel** (Memory → Redis → JSON)
- **Migración gradual** sin interrupciones
- **API de métricas** para monitoreo

### Base de Datos y ORM

- **PostgreSQL** como base de datos principal
- **Prisma ORM** con cliente optimizado
- **Schema completo** para CMS y traducciones
- **Indices optimizados** para rendimiento
- **Migraciones automáticas** con Prisma Migrate

### SEO y Performance

- **Static Generation** cuando sea posible
- **Dynamic imports** para code splitting
- **Image optimization** con Next.js Image
- **Meta tags dinámicos** por página

## 📝 Próximos Pasos

### Para Desarrolladores Nuevos

1. **Clonar e instalar**: `git clone [repo] && npm install`
2. **Configurar entorno**: `cp .env.example .env.local` (opcional para
   desarrollo básico)
3. **Ejecutar desarrollo**: `npm run dev`
4. **Verificar sistema**:
   - Navegador: http://localhost:3000 (español por defecto)
   - Inglés: http://localhost:3000/en
   - API traducciones: http://localhost:3000/api/translations/metrics
5. **Explorar componentes**: Revisar `/src/components/ui/` para ver Base UI +
   CVA

### Para Desarrollo Avanzado

1. **Configurar PostgreSQL** (recomendado - sistema automatizado completo):

   ```bash
   # Setup automático en un comando
   ./scripts/database/setup.sh

   # O configuración manual en .env.local
   DATABASE_URL="postgresql://usuario:password@localhost:5432/db_name"
   ```

2. **Migrar esquema**: `npm run db:push`
3. **Explorar Prisma Studio**: `npm run db:studio` (setup automático)
4. **Migrar traducciones**: `node scripts/migrate-translations.ts --execute`
5. **🧩 NUEVO - Generar componentes automáticamente**:

   ```bash
   # Genera esquemas de componentes desde interfaces TypeScript
   npm run components:configure

   # Verificar componentes creados en Prisma Studio
   npm run db:studio  # Navegar a tabla "Component"
   ```

### Para Testing del Sistema Completo

1. **Verificar flujo completo desde cero**:

   ```bash
   # Reset completo de base de datos
   ./scripts/database/reset.sh

   # Seed básico (sin componentes hardcodeados)
   npx tsx scripts/database/seed.ts

   # Generar componentes desde TypeScript
   npm run components:configure

   # Resultado: 11 componentes generados automáticamente
   ```

2. **Validar consistency del sistema**:

   ```bash
   # Ver componentes en base de datos
   npm run db:studio

   # Verificar que esquemas coinciden con interfaces TypeScript
   # Sin "transformaciones absurdas" entre frontend/backend
   ```

### Sistema de Editor Visual Implementado ✅

El proyecto incluye un editor visual completo:

- **Editor simplificado** (componentes implementados y funcionando)
- **Gestión de componentes** (edit mode store completado)
- **Páginas dinámicas** (page store implementado)
- **Panel de administración** (user preferences y stores listos)

### Características Listas para Usar

- ✅ **Sistema de traducciones híbrido** funcionando
- ✅ **Componentes UI base** (Button, Input, Select) con variantes + modo oscuro
- ✅ **Gestión de estado Zustand** (4 stores especializados + demo)
- ✅ **Base de datos schema** completo para CMS
- ✅ **Herramientas de desarrollo** (25+ tareas de VS Code)
- ✅ **Testing E2E** con Playwright configurado (modo claro/oscuro)
- ✅ **Calidad de código** (ESLint + Prettier + TypeScript)

### Arquitectura Preparada Para

- ✅ **Editor visual** implementado (sistema simplificado funcionando)
- ✅ **Panel de administración** (completo con CRUD de páginas)
- ✅ **Páginas dinámicas** (sistema de componentes implementado)
- ✅ **SEO avanzado** (metadatos dinámicos con Prisma)

## ⚠️ Guía de Compatibilidad para Desarrollo Futuro

### 🔒 **CRÍTICO**: Mantener Compatibilidad del Sistema Híbrido

Para preservar la integridad del sistema híbrido de traducciones durante el
desarrollo de las siguientes fases:

#### ✅ **QUE SÍ HACER**

```typescript
// ✅ Usar traducciones a través de next-intl (compatible)
const t = await getTranslations('HomePage');
return <h1>{t('title')}</h1>;

// ✅ Añadir nuevos namespaces en /messages/es.json y /messages/en.json
{
  "NewFeature": {
    "title": "Nuevo Título",
    "description": "Nueva descripción"
  }
}

// ✅ Configurar estrategia en src/lib/translations/config.ts
'NewFeature': { strategy: 'static', cacheTimeout: 300 }

// ✅ Usar TranslationManager para gestión programática
await translationManager.getTranslation('title', 'es', 'NewFeature');
```

#### ❌ **QUE NO HACER**

```typescript
// ❌ NO reemplazar next-intl con otra solución
// ❌ NO modificar src/i18n/request.ts sin revisar híbrido
// ❌ NO eliminar archivos en /messages/ (son fallback crítico)
// ❌ NO cambiar estructura de src/lib/translations/
```

#### 🔄 **Al Implementar Prisma (Fase 5)**

```typescript
// 1. Crear esquema Prisma para translations
model Translation {
  id        String @id @default(cuid())
  namespace String
  key       String
  locale    String
  value     String
  // ... otros campos según src/types/translations.ts
}

// 2. Crear DatabaseTranslationProvider
// 3. Activar con: translationManager.setDatabaseProvider(dbProvider)
// 4. El sistema automáticamente balanceará JSON ↔ PostgreSQL
```

#### 🧪 **Testing Obligatorio Antes de Commits**

```bash
# Verificar que traducciones siguen funcionando
npm run dev
curl http://localhost:3000/es  # Debe mostrar español
curl http://localhost:3000/en  # Debe mostrar inglés
curl http://localhost:3000/api/translations/metrics  # Debe estar "healthy"
```

#### 📊 **Monitoreo Continuo**

- API `/api/translations/metrics` debe responder siempre
- Status debe ser "healthy" o "degraded" (nunca "unhealthy")
- Cache hit rate debe mantenerse > 80%
- Fallback a JSON debe estar garantizado

## 🚨 Solución de Problemas

### Base de Datos Local

**Error: "Docker not found"**

```bash
# Manjaro/Arch Linux
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# Reiniciar sesión
```

**Error: "Port already in use"**

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :5432  # PostgreSQL
sudo lsof -i :6379  # Redis

# Detener servicios nativos si existen
sudo systemctl stop postgresql
sudo systemctl stop redis
sudo systemctl stop valkey
```

**Error: "Database connection failed"**

```bash
# Verificar estado completo
./scripts/database/status.sh

# Reiniciar servicios Docker
docker-compose -f docker-compose.dev.yml restart

# Reset completo si es necesario
./scripts/database/reset.sh
```

**Error: "Prisma CLIENT_VERSION mismatch"**

```bash
# Regenerar cliente Prisma
npm run db:generate

# Si persiste, limpiar completamente
rm -rf node_modules/.prisma
npm run db:generate
```

### Aplicación Next.js

**Error: "Environment variable not found"**

```bash
# Verificar archivo .env.local existe
ls -la .env.local

# Ejecutar setup para crear/actualizar
./scripts/database/setup.sh
```

**Error: "Module not found"**

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules/.cache
npm install
npm run build
```

### Contacto y Contribución

Este es un proyecto en desarrollo activo. Para reportar issues o contribuir:

1. 🐛 **Issues**: Abre un issue con detalles completos
2. 🔧 **PRs**: Fork → Branch → PR con tests
3. 📖 **Docs**: Mejoras en documentación siempre bienvenidas
4. 💬 **Discussiones**: Para preguntas técnicas y propuestas

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**

---

## Getting Started (Original Next.js Instructions)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.
