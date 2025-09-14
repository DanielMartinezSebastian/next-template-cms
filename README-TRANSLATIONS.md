# 🌐 Sistema Híbrido de Traducciones - Next.js Template

## Descripción General

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

## 🤝 Contribución

Para contribuir al sistema de traducciones:

1. Ejecuta tests: `npm run test:translations`
2. Verifica métricas: `curl /api/translations/metrics`
3. Prueba con Playwright: `npm run test:e2e`
4. Revisa performance en desarrollo

---

**⚠️ Nota**: Este sistema está diseñado para migración gradual. Se puede usar en producción con archivos JSON y migrar a base de datos cuando sea necesario.
