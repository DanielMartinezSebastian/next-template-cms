# Next.js Edit Mode Template

Una plantilla completa de Next.js 15 con capacidades de edición visual,
internacionalización, y sistema de gestión de contenido.

## 🚀 Características Principales

- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS 4** para estilos modernos
- **Internacionalización Híbrida** con next-intl (ES/EN) + PostgreSQL
- **Base de datos PostgreSQL** con Prisma ORM
- **Editor visual** con Lexical para edición de páginas
- **Panel de administración** para gestión de contenido
- **SEO optimizado** con metadatos dinámicos
- **Server-side rendering** por defecto
- **Sistema de componentes** con Radix UI y CVA
- **Sistema de traducciones escalable** -
  [Ver documentación](./README-TRANSLATIONS.md)

## 📋 Plan de Desarrollo Detallado

### Fase 1: Configuración Base ✅

- [x] Crear proyecto Next.js 15 con TypeScript
- [x] Configurar Tailwind CSS 4
- [x] Configurar ESLint y estructura inicial
- [x] Actualizar package.json con todas las dependencias

### Fase 2: Configuración de Herramientas 🔄

- [ ] Configurar Git con Husky para hooks de pre-commit
- [ ] Configurar Prettier para formateo automático
- [ ] Configurar eslint-config-next con reglas personalizadas
- [ ] Inicializar base de datos PostgreSQL con Prisma

### Fase 3: Internacionalización ✅

- [x] Configurar next-intl middleware
- [x] Crear estructura de routing con [locale]
- [x] Configurar archivos de traducción (es/en)
- [x] Implementar hook useTranslations
- [x] Configurar layout internacional
- [x] Verificar funcionamiento con Playwright
- [x] **Sistema Híbrido de Traducciones** implementado
  - [x] Cache multi-nivel (Memory → Redis → JSON fallback)
  - [x] Migración gradual JSON → PostgreSQL
  - [x] API de métricas y monitoreo (/api/translations/metrics)
  - [x] Zero breaking changes con next-intl
  - [x] Documentación completa:
        [README-TRANSLATIONS.md](./README-TRANSLATIONS.md)

### Fase 4: Sistema de Componentes 🎨

- [ ] Configurar CVA para variants de componentes
- [ ] Crear componentes base con Radix UI:
  - Button, Input, Dialog, Switch, Toast, Tooltip
- [ ] Implementar sistema de tokens de diseño
- [ ] Crear layout components (Header, Footer, Sidebar)

### Fase 5: Base de Datos y Modelos 🗄️

- [ ] Crear esquema Prisma para:
  - Pages (páginas dinámicas)
  - Components (configuraciones de componentes)
  - **Translations (integración con sistema híbrido existente)**
  - Settings (configuraciones globales)
- [ ] Configurar conexión PostgreSQL
- [ ] **Activar automáticamente sistema híbrido** configurando DATABASE_URL
- [ ] Crear seeds iniciales para desarrollo
- [ ] **Migrar traducciones críticas** usando script automático
- [ ] Verificar métricas en /api/translations/metrics

### Fase 6: Gestión de Estado 🔄

- [ ] Configurar Zustand stores para:
  - Page configuration
  - Edit mode state
  - User preferences
  - Translations cache
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
│   ├── ui/                     # Componentes base UI
│   ├── layout/                 # Componentes de layout
│   ├── admin/                  # Componentes de admin
│   └── dynamic/                # Componentes dinámicos
├── lib/
│   ├── translations/           # Sistema híbrido de traducciones
│   │   ├── translation-manager.ts
│   │   ├── config.ts
│   │   └── next-intl-hybrid.ts
│   ├── providers/              # Proveedores de traducciones
│   ├── cache/                  # Sistema de cache multi-nivel
│   ├── prisma.ts              # Cliente Prisma
│   ├── utils.ts               # Utilidades
│   └── validations.ts         # Esquemas Zod
├── stores/                     # Zustand stores
├── types/
│   └── translations.ts         # Tipos del sistema híbrido
├── i18n/                      # Configuración i18n
│   ├── routing.ts             # Configuración de rutas
│   └── request.ts             # Configuración híbrida
├── messages/                   # Traducciones JSON (fallback crítico)
│   ├── es.json
│   └── en.json
└── scripts/
    └── migrate-translations.ts # Migración automática JSON→DB
```

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Construir
npm run build

# Base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:push       # Sincronizar esquema
npm run db:migrate    # Crear migración
npm run db:studio     # Abrir Prisma Studio

# Sistema de traducciones
node scripts/migrate-translations.ts          # Vista previa migración
node scripts/migrate-translations.ts --execute # Migrar a PostgreSQL
curl http://localhost:3000/api/translations/metrics # Estado del sistema

# Linting y testing
npm run lint
npm run test:e2e      # Playwright tests
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
- **Composable patterns** con Radix UI

### Gestión de Estado

- **Zustand** para estado global
- **React Hook Form** para formularios
- **React Query** para cache de servidor (futuro)

### Validación

- **Zod schemas** para validación de tipos
- **TypeScript strict mode**
- **Runtime validation** en API routes

### SEO y Performance

- **Static Generation** cuando sea posible
- **Dynamic imports** para code splitting
- **Image optimization** con Next.js Image
- **Meta tags dinámicos** por página

## 📝 Próximos Pasos

1. Ejecutar `npm install` para instalar dependencias
2. Configurar variables de entorno con `cp .env.example .env.local`
3. Ejecutar `npm run dev` para desarrollo
4. Verificar traducciones: `curl http://localhost:3000/api/translations/metrics`
5. Visitar `/admin` para panel de control (futuro)
6. Comenzar a crear componentes personalizados

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
