# Next.js Edit Mode Template

Una plantilla completa de Next.js 15 con capacidades de edición visual, internacionalización, y sistema de gestión de contenido.

## 🚀 Características Principales

- **Next.js 15** con App Router y TypeScript
- **Tailwind CSS 4** para estilos modernos
- **Internacionalización** con next-intl (ES/EN)
- **Base de datos PostgreSQL** con Prisma ORM
- **Editor visual** con Lexical para edición de páginas
- **Panel de administración** para gestión de contenido
- **SEO optimizado** con metadatos dinámicos
- **Server-side rendering** por defecto
- **Sistema de componentes** con Radix UI y CVA

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
  - Translations (traducciones)
  - Settings (configuraciones globales)
- [ ] Configurar conexión PostgreSQL
- [ ] Crear seeds iniciales para desarrollo

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
│   ├── api/                    # API Routes
│   └── globals.css             # Estilos globales
├── components/
│   ├── ui/                     # Componentes base UI
│   ├── layout/                 # Componentes de layout
│   ├── admin/                  # Componentes de admin
│   └── dynamic/                # Componentes dinámicos
├── lib/
│   ├── prisma.ts              # Cliente Prisma
│   ├── utils.ts               # Utilidades
│   └── validations.ts         # Esquemas Zod
├── stores/                     # Zustand stores
├── types/                      # Tipos TypeScript
└── i18n/                      # Configuración i18n
    ├── config.ts
    └── messages/
        ├── es.json
        └── en.json
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

# Linting
npm run lint
```

## 🔧 Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar base de datos**:
   ```bash
   # Crear archivo .env.local
   DATABASE_URL="postgresql://usuario:password@localhost:5432/nexteditor"
   
   # Ejecutar migraciones
   npm run db:push
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

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
2. Configurar base de datos PostgreSQL
3. Ejecutar `npm run dev` para desarrollo
4. Visitar `/admin` para panel de control
5. Comenzar a crear componentes personalizados

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
