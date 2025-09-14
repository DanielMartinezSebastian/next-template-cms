# Next.js Edit Mode Template

Una plantilla completa de Next.js 15 con capacidades de edición visual,
internacionalización, y sistema de gestión de contenido.

## 🎉 Estado del Proyecto: FASE 5 COMPLETADA

**✅ Database & Components Phase TERMINADA** - El proyecto cuenta con una
**arquitectura sólida y production-ready** que incluye:

- 🏗️ **Fundación técnica completa** (Next.js 15 + TypeScript + Tailwind CSS 4)
- 🌐 **Sistema de traducciones híbrido** funcionando (JSON + PostgreSQL)
- 🎨 **Biblioteca de componentes UI** con Base UI + CVA
- 🗄️ **Schema de base de datos completo** para CMS avanzado
- 🛠️ **Herramientas de desarrollo** profesionales (25+ tareas automatizadas)
- 🧪 **Testing verificado** con Playwright (español/inglés)

**🚀 LISTO PARA**: Desarrollo de Zustand stores, editor visual, y panel de
administración.

## 🚀 Características Principales

- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS 4** para estilos modernos
- **Internacionalización Híbrida** con next-intl (ES/EN) + PostgreSQL
- **Base de datos PostgreSQL** con Prisma ORM
- **Editor visual** con Lexical para edición de páginas
- **Panel de administración** para gestión de contenido
- **SEO optimizado** con metadatos dinámicos
- **Server-side rendering** por defecto
- **Sistema de componentes** con Base UI (LLM-optimized) y CVA
- **Sistema de traducciones escalable** -
  [Ver documentación](./README-TRANSLATIONS.md)

## 📋 Plan de Desarrollo Detallado

### Fase 1: Configuración Base ✅ COMPLETADO

- [x] Crear proyecto Next.js 15 con TypeScript
- [x] Configurar Tailwind CSS 4
- [x] Configurar ESLint y estructura inicial
- [x] Actualizar package.json con todas las dependencias

### Fase 2: Configuración de Herramientas ✅ COMPLETADO

- [x] Configurar Git con Husky para hooks de pre-commit
- [x] Configurar Prettier para formateo automático
- [x] Configurar eslint-config-next con reglas personalizadas
- [x] Inicializar base de datos PostgreSQL con Prisma
- [x] Configurar VS Code workspace con tareas automatizadas
- [x] Implementar 25+ tareas de desarrollo para workflow completo

### Fase 3: Internacionalización ✅ COMPLETADO

- [x] Configurar next-intl middleware
- [x] Crear estructura de routing con [locale]
- [x] Configurar archivos de traducción (es/en)
- [x] Implementar hook useTranslations
- [x] Configurar layout internacional
- [x] Verificar funcionamiento con Playwright
- [x] **Sistema Híbrido de Traducciones** implementado y funcionando
  - [x] Cache multi-nivel (Memory → Redis → JSON fallback)
  - [x] Migración gradual JSON → PostgreSQL
  - [x] API de métricas y monitoreo (/api/translations/metrics)
  - [x] Zero breaking changes con next-intl
  - [x] Documentación completa:
        [README-TRANSLATIONS.md](./README-TRANSLATIONS.md)

### Fase 4: Sistema de Componentes ✅ COMPLETADO

- [x] Configurar CVA para variants de componentes
- [x] **Migrar de Radix UI a Base UI** (LLM-optimized)
- [x] Crear componentes base con Base UI:
  - [x] Button con variantes (default, destructive, outline, secondary, ghost,
        link)
  - [x] Input con variantes y estados
  - [x] Select con componentes multi-parte
- [x] Implementar sistema de tokens de diseño con CVA
- [x] Actualizar LocaleSwitcher con nuevo sistema de componentes
- [x] Crear barrel exports en src/components/ui/index.ts
- [x] Configurar utilidades con tailwind-merge y clsx

### Fase 5: Base de Datos y Modelos ✅ COMPLETADO

- [x] **Crear esquema Prisma completo** para:
  - [x] **Translations** (integración con sistema híbrido existente)
  - [x] **Pages** (páginas dinámicas) y PageContent
  - [x] **Components** (configuraciones de componentes) y PageComponent
  - [x] **Locales** y **Namespaces** para i18n
  - [x] **SystemConfig** (configuraciones globales)
- [x] **Configurar conexión PostgreSQL** con cliente optimizado
- [x] **Sistema listo para activación automática** configurando DATABASE_URL
- [x] Crear estructura de base de datos escalable con indices optimizados
- [x] **DatabaseTranslationProvider** implementado y funcional

### Fase 6: Gestión de Estado 🔄 EN PROGRESO

- [x] Configurar Zustand como dependencia
- [ ] Crear stores para:
  - [ ] Page configuration
  - [ ] Edit mode state
  - [ ] User preferences
  - [ ] Translations cache
- [ ] Implementar persistencia local cuando sea necesario

### Fase 7: Páginas Dinámicas 📄

- [ ] Crear sistema de páginas basado en JSON
- [ ] Implementar tipos TypeScript para configuraciones
- [ ] Crear API routes para CRUD de páginas
- [ ] Implementar renderizado SSR de páginas dinámicas

### Fase 8: Editor Visual 🖊️

- [ ] Integrar Lexical editor
- [ ] Crear modo de edición de páginas
- [ ] Implementar drag & drop de componentes
- [ ] Crear toolbar de edición
- [ ] Implementar preview mode

### Fase 9: Panel de Administración 👨‍💼

- [ ] Crear rutas de admin protegidas
- [ ] Formularios de gestión con React Hook Form + Zod
- [ ] Interface para gestión de páginas
- [ ] Editor de traducciones
- [ ] Configuración de tema y colores

### Fase 10: SEO y Metadatos 🔍

- [ ] Implementar generación automática de metadatos
- [ ] Configurar robots.txt y sitemap dinámico
- [ ] Optimizar Core Web Vitals
- [ ] Implementar JSON-LD estructurado

### Fase 11: Componentes de Ejemplo 🎯

- [ ] Hero sections responsivos
- [ ] Cards de contenido
- [ ] Formularios de contacto
- [ ] Galerías de imágenes
- [ ] Testimonios y reviews

### Fase 12: Testing y Optimización ⚡

- [ ] Configurar testing básico
- [ ] Optimizar bundle size
- [ ] Implementar lazy loading
- [ ] Validar performance SSR
- [ ] Preparar para producción

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Layout internacional
│   │   ├── page.tsx            # Página principal
│   │   ├── admin/              # Panel de administración
│   │   └── [...slug]/          # Páginas dinámicas
│   ├── api/
│   │   └── translations/       # API sistema híbrido
│   │       └── metrics/        # Métricas y gestión
│   └── globals.css             # Estilos globales
├── components/
│   ├── ui/                     # Componentes base UI (Base UI + CVA)
│   │   ├── button.tsx          # ✅ Button component con variantes
│   │   ├── input.tsx           # ✅ Input component
│   │   ├── select.tsx          # ✅ Select component multi-parte
│   │   ├── LocaleSwitcher.tsx  # ✅ Selector de idioma (Base UI)
│   │   ├── Header.tsx          # ✅ Header component
│   │   └── index.ts            # ✅ Barrel exports
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
├── stores/                     # Zustand stores
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
    └── migrate-translations.ts # ✅ Migración automática JSON→DB
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

# Calidad de código
npm run lint                  # Ejecutar ESLint con correcciones
npm run lint:check           # Verificar reglas ESLint
npm run format               # Formatear código con Prettier
npm run format:check         # Verificar formato del código
npm run type-check           # Verificar tipos de TypeScript

# Testing
npm run test:e2e             # Pruebas E2E con Playwright
npm run test:e2e:ui          # Interfaz de Playwright para pruebas

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

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:

   ```bash
   # Copiar archivo de ejemplo con 150+ variables configuradas
   cp .env.example .env.local

   # Configurar base de datos (activa automáticamente sistema híbrido)
   DATABASE_URL="postgresql://usuario:password@localhost:5432/nexteditor"
   ```

3. **Configurar base de datos**:

   ```bash
   # Ejecutar migraciones (cuando Prisma esté configurado)
   npm run db:push
   ```

4. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

5. **Verificar sistema de traducciones**:

   ```bash
   # Verificar estado del sistema híbrido
   curl http://localhost:3000/api/translations/metrics

   # Probar traducciones en diferentes idiomas
   curl http://localhost:3000/es
   curl http://localhost:3000/en
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

Ver **[README-TRANSLATIONS.md](./README-TRANSLATIONS.md)** para:

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

### Sistema de Componentes UI

- **Base UI**: Componentes accesibles y sin estilos pre-definidos
- **Class Variance Authority (CVA)**: Gestión de variantes de componentes
- **Tailwind CSS 4**: Sistema de diseño moderno
- **tailwind-merge**: Optimización de clases CSS
- **Patrones LLM-friendly**: Documentación en https://base-ui.com/llms.txt

### Gestión de Estado

- **Zustand** para estado global
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

1. **Configurar PostgreSQL** (opcional - el sistema funciona sin base de datos):
   ```bash
   # En .env.local
   DATABASE_URL="postgresql://usuario:password@localhost:5432/db_name"
   ```
2. **Migrar esquema**: `npm run db:push`
3. **Explorar Prisma Studio**: `npm run db:studio`
4. **Migrar traducciones**: `node scripts/migrate-translations.ts --execute`

### Siguiente Fase de Desarrollo: Zustand Stores 🚀

El proyecto está listo para implementar:

- **Page configuration store** (gestión de páginas dinámicas)
- **Edit mode store** (estado de edición visual)
- **User preferences store** (configuraciones de usuario)
- **Theme store** (gestión de temas y colores)

### Características Listas para Usar

- ✅ **Sistema de traducciones híbrido** funcionando
- ✅ **Componentes UI base** (Button, Input, Select) con variantes
- ✅ **Base de datos schema** completo para CMS
- ✅ **Herramientas de desarrollo** (25+ tareas de VS Code)
- ✅ **Testing E2E** con Playwright configurado
- ✅ **Calidad de código** (ESLint + Prettier + TypeScript)

### Arquitectura Preparada Para

- 🎯 **Editor visual** con Lexical (infraestructura lista)
- 🎯 **Panel de administración** (schema y API routes preparados)
- 🎯 **Páginas dinámicas** (sistema de componentes listo)
- 🎯 **SEO avanzado** (metadatos dinámicos con Prisma)

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
