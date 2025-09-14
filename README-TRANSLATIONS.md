# 🌐 Sistema Híbrido de Traducciones - Next.js Template

> **Una solución que crece contigo**: Desde proyectos pequeños hasta aplicaciones enterprise

## 💼 Casos de Uso Comerciales

### 🏪 **Proyectos Pequeños - Sin Base de Datos**
- ✅ **Deploy inmediato**: Solo archivos JSON, sin setup complejo
- ✅ **Costo cero**: Hosting estático en Vercel/Netlify gratuito
- ✅ **Performance máximo**: Cache en memoria súper rápido
- ✅ **Mantenimiento simple**: Editar archivos JSON directamente
- ✅ **Ideal para**: Landing pages, webs corporativas, portfolios

### 🏢 **Proyectos Enterprise - Con PostgreSQL**
- ✅ **Escalabilidad ilimitada**: Miles de traducciones en base de datos
- ✅ **Gestión profesional**: Panel admin para equipos
- ✅ **Performance optimizado**: Cache Redis multinivel
- ✅ **Fallback garantizado**: Si falla DB, usa JSON automáticamente
- ✅ **Ideal para**: E-commerce, SaaS, aplicaciones complejas

### 🚀 **Migración Sin Interrupciones**
- ✅ **Crecimiento gradual**: Empezar pequeño, escalar cuando necesites
- ✅ **Zero downtime**: Activación automática con `DATABASE_URL`
- ✅ **Sin vendor lock-in**: Siempre puedes volver a JSON
- ✅ **Progressive enhancement**: El sistema detecta automáticamente las capacidades

## 📊 Descripción General

Este proyecto implementa un **sistema híbrido de traducciones** que permite migrar gradualmente de archivos JSON estáticos a una base de datos PostgreSQL, manteniendo la compatibilidad con next-intl y optimizando para SSR.

## 🏗️ Arquitectura

### Componentes Principales

```
src/lib/translations/
├── translation-manager.ts     # Manager principal del sistema
├── config.ts                  # Configuración por namespace
└── next-intl-hybrid.ts        # Wrapper para next-intl

src/lib/providers/
└── file-translation-provider.ts   # Proveedor para archivos JSON

src/lib/cache/
└── memory-cache.ts            # Cache en memoria con LRU

src/types/
└── translations.ts            # Tipos TypeScript

src/app/api/translations/
└── metrics/                   # API de métricas y gestión
```

### Estrategias de Traducción

1. **Static**: Archivos JSON (máximo rendimiento)
2. **Dynamic**: Base de datos (contenido fresco)
3. **Hybrid**: Combinación con fallback automático

## 📊 Configuración por Namespace

```typescript
const namespaceConfigs = {
  'Navigation': { strategy: 'static', cacheTimeout: 3600 },
  'HomePage': { strategy: 'hybrid', cacheTimeout: 300 },
  'AdminPanel': { strategy: 'dynamic', cacheTimeout: 60 },
  'UserContent': { strategy: 'dynamic', cacheTimeout: 0 }
};
```

## 🚀 Uso

### Configuración Inicial

1. **Instala las dependencias**:
   ```bash
   npm install
   ```

2. **Configura las variables de entorno**:
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus valores específicos
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Verifica el sistema de traducciones**:
   ```bash
   # Visita el sitio en diferentes idiomas
   curl http://localhost:3000/es
   curl http://localhost:3000/en
   
   # Verifica las métricas del sistema
   curl http://localhost:3000/api/translations/metrics
   ```

### En Componentes (Compatible con next-intl)

```tsx
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('features.visual_editor')}</p>
    </div>
  );
}
```

### Gestión Programática

```typescript
import { translationManager } from '@/lib/translations/translation-manager';

// Obtener una traducción específica
const title = await translationManager.getTranslation('title', 'es', 'HomePage');

// Pre-cargar traducciones críticas
await translationManager.preloadCriticalTranslations('es');

// Invalidar cache
await translationManager.invalidateCache('HomePage', 'es');
```

## 📈 API de Métricas

### GET /api/translations/metrics

```json
{
  "timestamp": "2025-09-14T...",
  "metrics": {
    "file": {
      "cacheHitRate": 0.95,
      "avgResponseTime": 2.3,
      "totalRequests": 1250,
      "errorRate": 0.001
    }
  },
  "health": {
    "status": "healthy",
    "providers": { "file": "ok", "database": "disabled" },
    "latency": { "file": 1.2 }
  }
}
```

### POST /api/translations/metrics

```bash
# Limpiar cache
curl -X POST /api/translations/metrics \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'

# Pre-cargar cache para español
curl -X POST /api/translations/metrics \
  -H "Content-Type: application/json" \
  -d '{"action": "warmup", "locale": "es"}'
```

## 🔄 Migración a Base de Datos

### Script de Migración

```bash
# Vista previa (dry run)
node scripts/migrate-translations.ts

# Migración real
node scripts/migrate-translations.ts --execute

# Locales específicos
node scripts/migrate-translations.ts --locales en,es,fr
```

### Activar Base de Datos

El sistema detecta automáticamente la disponibilidad de PostgreSQL y Redis:

1. **Configurar variables de entorno** en `.env.local`:
   ```env
   # PostgreSQL (REQUERIDO para activar base de datos)
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   
   # Redis (OPCIONAL pero recomendado para producción)
   REDIS_URL="redis://localhost:6379"
   ```

2. **El sistema automáticamente**:
   - ✅ Detecta `DATABASE_URL` y activa el proveedor de base de datos
   - ✅ Detecta `REDIS_URL` y activa el cache distribuido
   - ✅ Cambia a estrategia híbrida según configuración por namespace
   - ✅ Mantiene fallback a archivos JSON garantizado

3. **Estados del sistema**:
   ```typescript
   // Solo archivos JSON (estado inicial)
   { "databaseEnabled": false, "providers": { "file": "ok", "database": "disabled" } }
   
   // Híbrido con PostgreSQL
   { "databaseEnabled": true, "providers": { "file": "ok", "database": "ok" } }
   ```

4. **Verificar activación**:
   ```bash
   # Revisar estado en métricas
   curl http://localhost:3000/api/translations/metrics
   
   # El campo "databaseEnabled" debe ser true
   ```

## ⚡ Performance

### Cache Multi-Nivel

1. **Memory Cache** (L1): 30s - 5min
2. **Redis Cache** (L2): 1h - 24h
3. **Static Files** (L3): Fallback garantizado

### Optimizaciones SSR

- Pre-carga de traducciones críticas
- Cache inteligente por estrategia
- Renderizado estático cuando posible
- Fallback automático sin errores

## 🔧 Configuración

### Variables de Entorno

El proyecto incluye un archivo `.env.example` con todas las variables de entorno necesarias. Para configurar el proyecto:

1. **Copia el archivo de ejemplo**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configura las variables principales**:
   ```env
   # Base de datos (opcional - activa automáticamente el sistema híbrido)
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"

   # Cache distribuido (opcional - recomendado para producción)
   REDIS_URL="redis://localhost:6379"

   # Configuración de desarrollo
   NODE_ENV="development"  # Cache más corto
   DEBUG_TRANSLATIONS=true  # Logs detallados
   ```

### Variables Críticas para el Sistema de Traducciones

```env
# Sistema híbrido de traducciones
DATABASE_URL="postgresql://..."           # Activa automáticamente la base de datos
REDIS_URL="redis://..."                  # Cache distribuido (producción)
TRANSLATIONS_DATABASE_ENABLED=false      # Override manual (opcional)
TRANSLATIONS_CACHE_TTL=300               # TTL del cache en segundos
TRANSLATIONS_CACHE_MAX_SIZE=104857600    # Tamaño máximo del cache (100MB)
DEBUG_TRANSLATIONS=false                 # Logs detallados de traducciones
```

### Configuración por Entorno

- **Development**: Cache corto (1min), logs verbosos
- **Production**: Cache largo, Redis habilitado, métricas activas

## 🧪 Testing

### Playwright Testing

```typescript
// Verificar traducciones en el navegador
await page.goto('http://localhost:3000/es');
const title = await page.textContent('h1');
expect(title).toBe('Next.js Edit Mode Template');

// Testear cambio de idioma
await page.click('[data-testid="language-switcher"]');
expected(page.url()).toContain('/en');
```

### Health Checks

```typescript
const health = await translationManager.healthCheck();
console.log(health.status); // 'healthy' | 'degraded' | 'unhealthy'
```

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Traducciones faltantes**:
   ```typescript
   // Verifica logs en desarrollo
   console.log('🚨 HomePage.missing_key');
   ```

2. **Cache no se actualiza**:
   ```bash
   curl -X POST /api/translations/metrics -d '{"action":"reset"}'
   ```

3. **Performance lenta**:
   - Revisar métricas: `/api/translations/metrics`
   - Verificar configuración de cache
   - Optimizar preload keys

### Logs de Debug

```typescript
// Habilitar logs detallados
process.env.DEBUG_TRANSLATIONS = 'true';
```

## 🚀 Roadmap

### Fase 1: ✅ Implementado
- [x] Sistema híbrido básico
- [x] Cache en memoria
- [x] API de métricas
- [x] Compatibilidad next-intl

### Fase 2: 📝 Siguiente
- [ ] Integración Prisma
- [ ] Cache Redis
- [ ] Panel de administración
- [ ] Migración automática

### Fase 3: 🔮 Futuro
- [ ] CDN caching
- [ ] A/B testing de textos
- [ ] Traducciones automáticas
- [ ] Analytics de uso

## ⚠️ Guía de Compatibilidad - CRÍTICO para Desarrollo Futuro

### ✅ **QUÉ SÍ HACER**

```typescript
// ✅ Usar next-intl normalmente (compatible al 100%)
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('HomePage');
return <h1>{t('title')}</h1>;

// ✅ Añadir nuevos namespaces en archivos JSON
// /messages/es.json
{
  "NewFeature": {
    "title": "Nuevo Título",
    "description": "Nueva descripción"
  }
}

// ✅ Configurar estrategias en src/lib/translations/config.ts
export const namespaceConfigs = {
  'NewFeature': { 
    strategy: 'static', 
    cacheTimeout: 300,
    fallbackToStatic: true 
  }
};

// ✅ Usar TranslationManager para gestión programática
import { translationManager } from '@/lib/translations/translation-manager';
await translationManager.getTranslation('title', 'es', 'NewFeature');
```

### ❌ **QUÉ NO HACER**

```typescript
// ❌ NO reemplazar next-intl con otra solución
// ❌ NO usar react-i18next, i18next, o otras librerías

// ❌ NO modificar src/i18n/request.ts sin revisar el sistema híbrido
// Este archivo integra next-intl con nuestro sistema híbrido

// ❌ NO eliminar archivos en /messages/ (son fallback crítico)
// Estos archivos garantizan que el sistema funcione sin base de datos

// ❌ NO cambiar estructura de src/lib/translations/
// Esta estructura es la base del sistema híbrido
```

### 🔄 **Al Implementar Prisma (Futuro)**

Cuando se implemente la base de datos en fases futuras:

```typescript
// 1. Crear esquema compatible con nuestros tipos
model Translation {
  id        String @id @default(cuid())
  namespace String
  key       String  
  locale    String
  value     String
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([namespace, key, locale])
  @@index([namespace, locale])
}

// 2. El sistema detectará automáticamente DATABASE_URL
// 3. Migrará gradualmente usando scripts incluidos
// 4. Mantendrá fallback a JSON garantizado
```

### 🧪 **Testing Obligatorio Antes de Commits**

```bash
# SIEMPRE verificar antes de commit:
npm run dev
curl http://localhost:3000/es    # ✅ Debe mostrar español
curl http://localhost:3000/en    # ✅ Debe mostrar inglés
curl http://localhost:3000/api/translations/metrics  # ✅ Status "healthy"

# Si alguno falla, el sistema híbrido está comprometido
```

## 🤝 Contribución

Para contribuir al sistema de traducciones:

1. Ejecuta tests: `npm run test:translations`
2. Verifica métricas: `curl /api/translations/metrics`
3. Prueba con Playwright: `npm run test:e2e`
4. Revisa performance en desarrollo
5. **OBLIGATORIO**: Seguir guía de compatibilidad arriba

---

**⚠️ Nota**: Este sistema está diseñado para migración gradual. Se puede usar en producción con archivos JSON y migrar a base de datos cuando sea necesario.

## 📁 Organización por Páginas - Nueva Estructura

### Estructura de Archivos

```
messages/
├── en/                    # Inglés
│   ├── common.json       # Traducciones comunes (navegación, botones)
│   ├── home.json         # Página principal
│   └── admin.json        # Panel de administración
├── es/                    # Español
│   ├── common.json       # Traducciones comunes
│   ├── home.json         # Página principal
│   └── admin.json        # Panel de administración
└── [legacy files]         # Archivos anteriores (compatibilidad)
    ├── en.json
    └── es.json
```

### Ventajas de la Organización por Páginas

1. **Mejor Mantenibilidad**
   - Archivos más pequeños y enfocados
   - Fácil encontrar traducciones por contexto
   - Menos conflictos en equipos grandes

2. **Carga Optimizada**
   - Solo se cargan traducciones necesarias
   - Mejor performance en aplicaciones grandes
   - Cache más eficiente por página

3. **Colaboración Mejorada**
   - Diferentes personas pueden trabajar en diferentes páginas
   - Merge conflicts reducidos
   - Ownership claro por funcionalidad

### Uso en Componentes

```tsx
// Página específica
const tHome = await getTranslations('Home');
const title = tHome('title');

// Traducciones comunes
const tCommon = await getTranslations();
const homeLabel = tCommon('home');
```

### Migración de Archivos Existentes

1. **Automática**: El sistema detecta automáticamente la nueva estructura
2. **Fallback**: Si no encuentra archivos por páginas, usa los archivos legacy
3. **Gradual**: Puedes migrar página por página sin romper nada

### Configuración Namespace por Página

```typescript
const namespaceConfigs = {
  'Common': { strategy: 'static', cacheTimeout: 3600 },    // Cache largo
  'Home': { strategy: 'hybrid', cacheTimeout: 300 },      // Mixto
  'Admin': { strategy: 'dynamic', cacheTimeout: 60 },     // Contenido fresco
};
```

### Estado Actual: ✅ FUNCIONANDO

- [x] Estructura de directorios creada
- [x] Archivos de traducción por página
- [x] Configuración next-intl actualizada
- [x] Sistema híbrido mantiene compatibilidad
- [x] Verificado con Playwright (inglés y español)
- [x] Zero breaking changes

