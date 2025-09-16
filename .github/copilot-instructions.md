<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/customization#_use-a-githubcopilotinstructionsmd-file -->

# Next.js Edit Mode Template - Copilot Instructions

This project is a comprehensive Next.js 15 template with visual editing
capabilities, internationalization, and a content management system designed to
be a production-ready foundation for modern web applications.

## Project Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: PostgreSQL with Prisma ORM (Docker for local development)
- **Internationalization**: next-intl with middleware
- **State Management**: Zustand with TypeScript
- **UI Components**: Base UI with CVA variants system (LLM-optimized)
- **Editor**: Lexical for visual content editing
- **Forms**: React Hook Form with Zod validation
- **Testing**: Playwright for E2E testing and visual verification
- **Development Database**: Docker PostgreSQL with automated setup and seeding
- **Cache**: Redis for translations and application cache (optional)

## Key Features

- **Server-side rendering (SSR)** by default with selective client components
- **Dynamic page configuration** via JSON with TypeScript schemas
- **Visual page editor** with drag & drop capabilities using Lexical
- **Multi-language support** with next-intl and route-based localization
- **Content management** via protected admin panel
- **SEO optimization** with dynamic metadata generation
- **Component-based architecture** following atomic design principles
- **Real-time preview** with edit mode toggle functionality

## Development Guidelines

### Core Principles

- **Server Components First**: Prioritize server components, use client
  components only when necessary (interactivity, hooks, browser APIs)
- **TypeScript Strict**: Use strict mode with comprehensive type definitions
- **Atomic Design**: Organize components as Atoms → Molecules → Organisms →
  Templates → Pages
- **Progressive Enhancement**: Ensure functionality works without JavaScript,
  enhance with interactivity
- **Performance First**: Optimize for Core Web Vitals and SSR performance

### Code Quality Standards

- **Error Boundaries**: Implement at page and component levels
- **Validation**: Use Zod schemas for runtime validation
- **Accessibility**: Follow WCAG 2.1 AA standards
- **SEO**: Generate semantic HTML with proper metadata
- **Security**: Validate all inputs, sanitize outputs, protect API routes

### Testing and Verification Strategy

- **MCP Playwright Integration**: Use browser automation for visual and
  functional verification
- **Component Testing**: Test UI components in isolation
- **E2E Testing**: Test complete user workflows
- **Visual Regression**: Compare screenshots across changes
- **Performance Testing**: Validate Core Web Vitals thresholds

## MCP Playwright Integration

### When to Use Playwright

- **After each significant feature implementation**
- **Before committing major changes**
- **When testing responsive design**
- **Validating form submissions and interactions**
- **Checking internationalization display**
- **Verifying admin panel functionality**

### Playwright Testing Workflow

1. **Start development server** (`npm run dev`)
2. **Navigate to pages** using `mcp_playwright_browser_navigate`
3. **Take screenshots** for visual verification with
   `mcp_playwright_browser_take_screenshot`
4. **Test interactions** (clicks, form fills, navigation)
5. **Verify responsive behavior** at different viewport sizes
6. **Check accessibility** with snapshots and screen readers
7. **Document issues** and iterate on fixes

### Standard Playwright Checks

```typescript
// Navigation and basic rendering
- Navigate to http://localhost:3000
- Take screenshot of homepage
- Check for console errors
- Verify responsive design (mobile, tablet, desktop)

// Internationalization
- Test /es and /en routes
- Verify language switching
- Check translated content display

// Admin panel (when implemented)
- Navigate to /admin
- Test authentication flow
- Verify CRUD operations
- Test visual editor functionality

// Zustand stores demo
- Navigate to http://localhost:3000/stores-demo
- Test all interactive store controls
- Verify dark/light mode compatibility
- Check store state persistence
- Test translation cache metrics

// Performance
- Check page load times
- Verify image optimization
- Test Core Web Vitals
```

## Project Status: DATABASE TRANSLATIONS VERIFIED ✅

The foundational architecture with complete state management and verified
database translations is now ready for advanced development.

### Foundation Enhancement ✅ COMPLETED

- [x] Install Required Extensions - GitLens, Git Graph, Headwind, Tailwind CSS
      IntelliSense, Tailwind Docs verified
- [x] Configure Prettier and ESLint rules - Complete configuration with
      prettier-plugin-tailwindcss
- [x] Setup Git with Husky hooks - Pre-commit and pre-push hooks with
      comprehensive quality checks
- [x] Configure environment variables (.env.local) - Development environment
      configured
- [x] Create development task automation - 20+ VS Code tasks for complete
      workflow
- [x] Create VS Code workspace settings - Professional configuration with
      IntelliSense, formatting, and Tailwind support
- [x] Fix translation JSON issues - Spanish translations corrected and verified
- [x] Verify with Playwright - Both English and Spanish locales tested
      successfully

### Database and Components Phase ✅ COMPLETED

#### Database Setup and Configuration

- [x] 1. Configurar entorno de base de datos
  - [x] 1.1. Crear archivo .env.local con DATABASE_URL
  - [x] 1.2. Instalar y configurar Prisma CLI
  - [x] 1.3. Inicializar esquema de Prisma
- [x] 2. Diseñar esquema de base de datos
  - [x] 2.1. Crear modelos para traducciones (Translation, Locale, Namespace)
  - [x] 2.2. Crear modelos para páginas (Page, PageContent)
  - [x] 2.3. Crear modelos para componentes (Component, ComponentConfig)
- [x] 3. Configurar conexión de base de datos
  - [x] 3.1. Generar cliente Prisma
  - [x] 3.2. Crear utilidad de conexión de base de datos
  - [x] 3.3. Sistema preparado para conexión con PostgreSQL

#### Translation System Database Integration

- [x] 4. Implementar provider de base de datos para traducciones
  - [x] 4.1. Crear DatabaseTranslationProvider con CRUD completo
  - [x] 4.2. Integrar con TranslationManager existente
  - [x] 4.3. Sistema híbrido archivo/base de datos funcionando perfectamente

#### UI Components Library

- [x] 5. Crear biblioteca de componentes UI base
  - [x] 5.1. Configurar CVA para variantes de componentes
  - [x] 5.2. Cambiar a Base UI (LLM-optimized) en lugar de Radix UI
  - [x] 5.3. Preparar infraestructura con tailwind-merge
  - [x] 5.4. Fundación lista para componentes modernos

#### State Management

- [x] 6. Configurar Zustand para manejo de estado
  - [x] 6.1. Zustand instalado y listo para store de traducciones
  - [x] 6.2. Preparado para store de configuración de UI
  - [x] 6.3. Compatible con React Server Components

#### Testing and Verification

- [x] 7. Verificar integración con Playwright
  - [x] 7.1. Probado sistema de traducciones (inglés ↔ español)
  - [x] 7.2. Verificado componentes UI en ambos locales
  - [x] 7.3. Validado rendimiento y diseño responsivo

### Zustand State Management Phase ✅ COMPLETED

#### Complete Store Architecture

- [x] 8. Implementar arquitectura completa de Zustand stores
  - [x] 8.1. **Page Store**: Gestión completa de páginas CMS con CRUD operations
  - [x] 8.2. **Edit Mode Store**: Control del editor visual, selección de
        componentes, historial
  - [x] 8.3. **User Preferences Store**: Gestión de idioma, tema, configuración
        del editor
  - [x] 8.4. **Translation Cache Store**: Cache de traducciones con métricas de
        rendimiento
- [x] 9. Implementar patrón de action hooks para separación limpia
  - [x] 9.1. Separar selectores de acciones para mejor rendimiento
  - [x] 9.2. Evitar infinite loops con pattern correcto
  - [x] 9.3. TypeScript strict con tipado completo
- [x] 10. Configurar persistencia y DevTools
  - [x] 10.1. localStorage persistence donde es necesario
  - [x] 10.2. Integración con Redux DevTools
  - [x] 10.3. Middleware composition optimizado

#### Dark Mode and UI Enhancements

- [x] 11. Implementar soporte completo de modo oscuro
  - [x] 11.1. Variables CSS semánticas para temas (light/dark)
  - [x] 11.2. Clases Tailwind optimizadas para modo oscuro
  - [x] 11.3. Contraste perfecto y accesibilidad garantizada
- [x] 12. Mejorar componentes UI con Base UI
  - [x] 12.1. Refactorizar con clases semánticas (bg-card, text-foreground,
        etc.)
  - [x] 12.2. Responsive design con espaciado profesional
  - [x] 12.3. Estados visuales mejorados

#### Interactive Demo Page

- [x] 13. Crear página de demostración interactiva (/stores-demo)
  - [x] 13.1. Controles interactivos para cada store
  - [x] 13.2. Explicaciones técnicas en español
  - [x] 13.3. Tooltips informativos para cada funcionalidad
  - [x] 13.4. Iconos descriptivos y feedback visual
  - [x] 13.5. Diseño responsive y profesional
  - [x] 13.6. Verificación completa con Playwright

### UI/UX Polish and Admin Panel Enhancement ✅ COMPLETED

#### Advanced Scrollbar System and Layout Optimization

- [x] 14. Implementar sistema completo de scrollbars personalizados
  - [x] 14.1. **`.scrollbar-admin-vertical`**: Scrollbars con flechas para
        navegación precisa
  - [x] 14.2. **`.scrollbar-admin-always`**: Scrollbars siempre visibles para
        coherencia visual
  - [x] 14.3. **`.scrollbar-admin-auto`**: Comportamiento automático del eje Y
        optimizado
  - [x] 14.4. **Webkit styling**: Compatibilidad completa con navegadores
        basados en Chromium

#### Layout and Responsive Design Enhancement

- [x] 15. Optimizar layout para diferentes tamaños de monitor
  - [x] 15.1. **Monitor 13"**: Layout perfectamente optimizado sin problemas de
        espacio
  - [x] 15.2. **Monitores grandes**: Aprovechamiento completo del espacio
        disponible
  - [x] 15.3. **Cálculos responsive**: `calc(100dvh - 66px)` para altura
        perfecta
  - [x] 15.4. **Container spacing**: Optimización para scrollbar arrow
        visibility

#### Animation and Transition System

- [x] 16. Implementar sistema de animaciones fluidas
  - [x] 16.1. **PagePreview transitions**: Animación desde centro hacia extremos
  - [x] 16.2. **Transform origin**: Configuración `center` para expansión
        natural
  - [x] 16.3. **Duration optimization**: Transiciones de 500ms con `ease-out`
        curve
  - [x] 16.4. **Cross-breakpoint**: Animaciones suaves entre todos los
        breakpoints

#### Code Quality and Architecture Cleanup

- [x] 17. Eliminar funcionalidades problemáticas y optimizar código
  - [x] 17.1. **Overlay mode removal**: Eliminación completa de modo superpuesto
  - [x] 17.2. **TypeScript strict**: Sin errores de compilación
  - [x] 17.3. **Performance optimization**: Layout calculations optimizados
  - [x] 17.4. **Browser testing**: Verificación con Playwright en múltiples
        resoluciones

### Local Database Development Phase ✅ COMPLETED

#### Docker PostgreSQL Setup with Automation

- [x] 18. Configurar entorno completo de base de datos local
  - [x] 18.1. **Docker Compose**: PostgreSQL 16 + Redis + pgAdmin configurado
  - [x] 18.2. **Scripts automatizados**: setup.sh, reset.sh, seed.sh, status.sh
  - [x] 18.3. **Configuración optimizada**: PostgreSQL tuneado para desarrollo
  - [x] 18.4. **Persistencia de datos**: Volúmenes Docker para datos
        persistentes

#### Development Database Features

- [x] 19. Sistema completo de datos de desarrollo
  - [x] 19.1. **Seeds automáticos**: Datos de ejemplo en inglés y español
  - [x] 19.2. **Health checks**: Verificación automática de servicios
  - [x] 19.3. **pgAdmin integrado**: Interfaz web para administración de DB
  - [x] 19.4. **Redis cache**: Sistema de cache opcional para traducciones

#### Database Management Tools

- [x] 20. Herramientas de gestión de base de datos
  - [x] 20.1. **Setup script**: Configuración completa automatizada
  - [x] 20.2. **Reset script**: Limpieza y reinicio de datos
  - [x] 20.3. **Seed script**: Población con datos de ejemplo
  - [x] 20.4. **Status script**: Verificación de estado y métricas
  - [x] 20.5. **VS Code tasks**: Integración con tareas del editor

### Database Translation System Verification ✅ COMPLETED

#### Translation System Database Integration Verification

- [x] 21. Verificar sistema de traducciones con base de datos
  - [x] 21.1. **Verificación de datos**: 16 traducciones activas en PostgreSQL
  - [x] 21.2. **API de métricas**: Endpoint `/api/translations/metrics`
        funcionando
  - [x] 21.3. **Database Provider**: 100% de requests manejados por base de
        datos
  - [x] 21.4. **Cache hit rate**: 85% de efectividad en cache de traducciones
- [x] 22. Configurar sistema híbrido de traducciones
  - [x] 22.1. **Auto-detección**: Sistema detecta automáticamente si usar DB o
        archivos
  - [x] 22.2. **Fallback mechanism**: Respaldo a archivos JSON si DB no
        disponible
  - [x] 22.3. **Environment variables**: Control via
        TRANSLATIONS_DATABASE_ENABLED
  - [x] 22.4. **Performance optimization**: Namespace-based caching strategies
- [x] 23. Validación visual y funcional
  - [x] 23.1. **Pruebas de idioma**: Verificado cambio inglés ↔ español
  - [x] 23.2. **Rendimiento**: Sin degradación en tiempo de carga
  - [x] 23.3. **Consistencia**: Todas las traducciones funcionando correctamente
  - [x] 23.4. **Métricas en tiempo real**: Dashboard de performance disponible

### Next Phase: Visual Editor with Lexical 🚀 READY

El sistema está completamente funcional y pulido, listo para la siguiente fase
de desarrollo enfocada en:

- Editor visual de páginas con Lexical
- Drag & drop de componentes (edit mode store listo)
- Panel de administración avanzado (stores y UI implementados)
- Páginas dinámicas (page store completo)
- **Base de datos local completa** con Docker PostgreSQL
- **Sistema de traducciones verificado** con Database Provider funcionando al
  100%

## File Structure Standards

### Components Organization

```
src/components/
├── ui/                    # Atomic UI components (Button, Input, etc.)
│   ├── button.tsx        # Individual component files
│   ├── input.tsx
│   └── index.ts          # Barrel exports
├── examples/             # Demo components for stores and features
│   ├── StoresExample.tsx # Interactive Zustand demo component
│   └── index.ts          # Example exports
├── layout/               # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── features/             # Feature-specific components
│   ├── auth/
│   ├── pages/
│   └── editor/
└── providers/            # Context providers
    ├── theme-provider.tsx
    └── i18n-provider.tsx
```

### Zustand Stores Architecture

```
src/stores/
├── index.ts              # Central exports and action hooks
├── page-store.ts         # Page management and CMS operations
├── edit-mode-store.ts    # Visual editor control and history
├── user-preferences-store.ts # User settings and preferences
└── translation-cache-store.ts # Translation caching and metrics
```

### API Routes Structure

```
src/app/api/
├── pages/                # Page CRUD operations
│   ├── route.ts         # GET, POST
│   └── [id]/
│       └── route.ts     # GET, PUT, DELETE
├── translations/         # Translation management
│   └── metrics/         # Translation system metrics
├── components/          # Component configurations
└── auth/               # Authentication routes
```

### Demo Pages Structure

```
src/app/[locale]/
├── [[...slug]]/          # ✨ Catch-all global (páginas dinámicas + homepage)
│   └── page.tsx
├── admin/                # 📁 Páginas estáticas (panel admin)
│   ├── page.tsx
│   └── editor/
├── servicios/            # 🔀 Híbrido Catch-all propio (estático + dinámicas)
│   └── [[...slug]]/
└── stores-demo/          # 📁 Página estática (demo)
    └── page.tsx
```

**How to Create New Pages:**

1. **Simple Static Page**: `mkdir src/app/[locale]/my-page` → Add `'my-page'` to
   `STATIC_ROUTES_FALLBACK`
2. **Dynamic CMS Page**: Use admin panel (auto-generated, no code needed)
3. **Section with Sub-pages**: Copy `servicios/` pattern for hybrid routing

## Development Workflow

### Feature Development Process

1. **Plan**: Define feature requirements and acceptance criteria
2. **Design**: Create component interfaces and API contracts
3. **Implement**: Write code following project standards
4. **Test**: Use Playwright for functional and visual testing
5. **Review**: Check code quality and performance
6. **Document**: Update README and component documentation

### Quality Gates

- **TypeScript**: No compilation errors
- **ESLint**: No linting errors or warnings
- **Prettier**: Consistent code formatting
- **Playwright**: All E2E tests passing
- **Performance**: Core Web Vitals within thresholds
- **Accessibility**: WCAG 2.1 AA compliance

## Integration Guidelines

### Database Integration (Prisma)

- Use server actions for database operations
- Implement proper error handling and validation
- Use transactions for complex operations
- Cache frequently accessed data
- Follow Prisma best practices for performance

### Translation System Database Usage

- **Automatic Detection**: System automatically detects database availability
  via `DATABASE_URL`
- **Environment Configuration**: Enable with
  `TRANSLATIONS_DATABASE_ENABLED=true` in `.env.local`
- **Hybrid Strategy**: Falls back to JSON files if database unavailable
- **Performance Monitoring**: Use `/api/translations/metrics` for real-time
  stats
- **Database Provider**: Handles all translation requests when enabled
- **Cache Integration**: 85%+ hit rate with namespace-based caching
- **Development Workflow**:
  1. Ensure Docker PostgreSQL is running
  2. Verify environment variables in `.env.local`
  3. Check translation metrics endpoint for database status
  4. Use Prisma Studio for manual database inspection

### Local Database Development (Docker PostgreSQL)

- **Development Setup**: Use `./scripts/database/setup.sh` for initial
  configuration
- **Reset Database**: Use `./scripts/database/reset.sh` for clean slate
  development
- **Seed Data**: Use `./scripts/database/seed.sh` to populate with example data
- **Status Check**: Use `./scripts/database/status.sh` to monitor database
  health
- **Access Points**:
  - PostgreSQL: `localhost:5432` (dev_user/dev_password_2024)
  - pgAdmin: `http://localhost:8080` (admin@nextjs-template.local/admin_2024)
  - Redis: `localhost:6379` (optional caching)
  - Prisma Studio: `http://localhost:5555` (via `npx prisma studio`)
- **Data Persistence**: Docker volumes ensure data survives container restarts
- **Seeds Include**: Locales, translations, pages, components, and system config
- **Translation Data**: 16+ active translations across 3 namespaces (admin,
  common, home)
- **Performance Verification**: Real-time metrics via
  `/api/translations/metrics`

### State Management (Zustand)

- Keep stores minimal and focused
- Use TypeScript interfaces for store types
- Implement persistence only when necessary
- Separate client and server state clearly
- Use React Server Components for server state
- Follow action hooks pattern for clean component separation
- Integrate with Redux DevTools for development
- Use selective subscriptions for performance optimization

### Styling Guidelines (Tailwind CSS 4)

- Use design tokens for consistency
- Implement responsive design mobile-first
- Create reusable component variants with CVA
- Optimize for dark/light theme support
- Follow semantic class naming conventions
- Use https://base-ui.com/llms.txt library for class suggestions and utilities

### Placeholder Images with placeholders.dev

**ALWAYS use placeholders.dev for placeholder images** in component definitions,
examples, and development.

- **Service**: https://placeholders.dev/ - Super-fast placeholder images via
  Cloudflare Workers (309+ edge locations)
- **Basic URL Pattern**: `https://images.placeholders.dev/WIDTHxHEIGHT`
- **Query Parameter Pattern**:
  `https://images.placeholders.dev/?width=W&height=H&text=TEXT&bgColor=%23COLOR&textColor=%23COLOR`

**Common Placeholder Examples:**

- Hero banners:
  `https://images.placeholders.dev/1200x600?text=Hero%20Image&bgColor=%234f46e5&textColor=%23ffffff`
- Card images:
  `https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff`
- Gallery images:
  `https://images.placeholders.dev/800x600?text=Gallery&bgColor=%2310b981&textColor=%23ffffff`
- Avatars:
  `https://images.placeholders.dev/150x150?text=Avatar&bgColor=%23f59e0b&textColor=%23ffffff`
- Thumbnails:
  `https://images.placeholders.dev/200x150?text=Thumbnail&bgColor=%23ef4444&textColor=%23ffffff`

**Available API Options:**

- `width`: Image width (default: 300)
- `height`: Image height (default: 150)
- `text`: Display text (default: dimensions)
- `bgColor`: Background color (default: #ddd)
- `textColor`: Text color (default: rgba(0,0,0,0.5))
- `fontFamily`: Font family (default: sans-serif)
- `fontWeight`: Font weight (default: bold)
- `fontSize`: Font size (default: 20% of shortest dimension)

**Usage Guidelines:**

- Use descriptive text that indicates the image purpose
- Choose appropriate dimensions for the component context
- Use semantic colors that match the design system
- Always URL-encode text parameters (spaces = %20)

### Base UI Component Patterns

Base UI provides unstyled, accessible React components that can be styled with
any CSS solution. Our project uses Base UI with Class Variance Authority (CVA)
for consistent variant management.

#### Available Base UI Components

Currently implemented:

- **Select**: Used in LocaleSwitcher with full accessibility support
- **Input**: Basic form input with variant support
- **Button**: Standard button component (HTML native with CVA styling)

#### Base UI Integration Guidelines

1. **Import Pattern**:

```tsx
import { ComponentName } from '@base-ui-components/react/component-name';
```

2. **CVA Styling Pattern**:

```tsx
const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-styles',
      error: 'error-styles',
    },
    size: {
      sm: 'small-styles',
      lg: 'large-styles',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

3. **Component Structure**:

```tsx
const MyComponent = forwardRef<HTMLElement, Props>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <BaseUI.Root
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
```

4. **Multi-part Components** (like Select):

```tsx
<BaseSelect.Root>
  <BaseSelect.Trigger>
    <BaseSelect.Value />
    <BaseSelect.Icon />
  </BaseSelect.Trigger>
  <BaseSelect.Portal>
    <BaseSelect.Positioner>
      <BaseSelect.Popup>
        {items.map(item => (
          <BaseSelect.Item key={item.value} value={item.value}>
            <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
            <BaseSelect.ItemIndicator />
          </BaseSelect.Item>
        ))}
      </BaseSelect.Popup>
    </BaseSelect.Positioner>
  </BaseSelect.Portal>
</BaseSelect.Root>
```

#### Base UI Benefits for LLM Development

- **llms.txt Integration**: Base UI provides comprehensive documentation at
  https://base-ui.com/llms.txt
- **Predictable API**: Consistent naming patterns across all components
- **Accessibility First**: ARIA attributes and keyboard navigation built-in
- **Styling Agnostic**: Works perfectly with Tailwind CSS and CVA
- **Tree Shakeable**: Only bundle the components you use

### Internationalization (next-intl)

- Use translation keys that describe content purpose
- Implement ICU message format for complex translations
- Handle pluralization and date/time formatting
- Test all locales with Playwright
- Provide fallbacks for missing translations

### Page Routing and Creation Guidelines

This project uses **Next.js native App Router** with catch-all routing patterns.
The hybrid routing system has been eliminated in favor of simpler, more
maintainable patterns.

#### Core Routing Architecture

- **Global Catch-all**: `src/app/[locale]/[[...slug]]/page.tsx` handles all
  routes
- **Homepage Integration**: Empty slug array renders HomePage component
- **Static Route Detection**: Automatic filesystem scanning with manual fallback
- **CMS Integration**: Database-driven dynamic pages via Prisma

#### Creating New Pages - Three Methods

1. **Static Pages** (Recommended for most content):

```bash
# 1. Create directory structure
mkdir -p src/app/[locale]/your-page-name

# 2. Create page component
# src/app/[locale]/your-page-name/page.tsx
export default function YourPage({ params }: { params: { locale: string } }) {
  return <div>Your content</div>;
}

# 3. Add to STATIC_ROUTES_FALLBACK in [[...slug]]/page.tsx
const STATIC_ROUTES_FALLBACK = [
  'your-page-name',
  // ... existing routes
];
```

2. **Dynamic CMS Pages** (For content-managed pages):

- Use the admin panel (future implementation)
- Pages automatically available via database integration
- No code changes required

3. **Hybrid Static + Dynamic** (For special cases):

- Use catch-all pattern: `[locale]/section/[[...slug]]/page.tsx`
- Handle both static routes and dynamic content
- Example: servicios section

#### Critical Configuration: STATIC_ROUTES_FALLBACK

**ALWAYS update this array when adding static pages:**

```typescript
// In src/app/[locale]/[[...slug]]/page.tsx
const STATIC_ROUTES_FALLBACK = [
  'stores-demo',
  'admin',
  'editor-demo',
  'visual-editor-demo',
  'scrollbar-demo',
  'not-found-redirect',
  'servicios',
  // ADD YOUR NEW STATIC ROUTES HERE
];
```

#### Route Priority Order

1. **Static directories** (highest priority)
2. **Catch-all routes** with STATIC_ROUTES_FALLBACK
3. **Database CMS pages** (dynamic)
4. **404 localized pages** (lowest priority)

#### Development Workflow

1. **Check existing routes**: Review filesystem structure in `src/app/[locale]/`
2. **Choose creation method**: Static vs Dynamic vs Hybrid
3. **Update configuration**: Add to STATIC_ROUTES_FALLBACK if static
4. **Test both locales**: Verify /es and /en routes work
5. **Verify with Playwright**: Use browser automation for testing

#### Common Routing Errors

- **Missing STATIC_ROUTES_FALLBACK entry**: Static pages return 404
- **Route conflicts**: Multiple page.tsx files for same path
- **Locale handling**: Ensure params.locale is properly typed and used
- **generateStaticParams**: Include new routes in static generation

#### Reference Documentation

See `PAGES-ROUTING-GUIDE.md` for comprehensive examples and troubleshooting.

**CRITICAL**: Always update STATIC_ROUTES_FALLBACK when adding static pages to
ensure production builds work correctly.
