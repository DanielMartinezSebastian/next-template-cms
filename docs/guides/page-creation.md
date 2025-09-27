# Sistema de Páginas y Routing - Next.js Template CMS

Este documento explica cómo funciona el sistema de páginas híbrido del template
y cómo crear nuevas páginas de diferentes tipos.

## 📋 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Tipos de Páginas](#tipos-de-páginas)
3. [Crear Páginas Estáticas](#crear-páginas-estáticas)
4. [Crear Páginas Dinámicas (CMS)](#crear-páginas-dinámicas-cms)
5. [Configuración de Rutas](#configuración-de-rutas)
6. [Solución de Problemas](#solución-de-problemas)

## 🏗️ Arquitectura del Sistema

El template utiliza un sistema híbrido que combina:

- **Páginas estáticas** de Next.js (rendimiento óptimo)
- **Páginas dinámicas** gestionadas por CMS (flexibilidad editorial)
- **Routing automático** con detección inteligente de rutas

### Estructura de Archivos

```
src/app/[locale]/
├── [[...slug]]/          # ✨ Catch-all global (páginas dinámicas + homepage)
│   └── page.tsx
├── admin/                # 📁 Páginas estáticas (panel admin)
│   ├── page.tsx
│   └── editor/
├── servicios/            # 🔀 Híbrido (estático + dinámicas)
│   └── [[...slug]]/
└── stores-demo/          # 📁 Página estática (demo)
    └── page.tsx
```

## 📄 Tipos de Páginas

### 1. **Homepage** (`/`, `/es`)

- **Ubicación**: Renderizada por `[[...slug]]/page.tsx` cuando `slug` está vacío
- **Componente**: `HomePage` en `/src/components/pages/HomePage.tsx`
- **Características**: Multiidioma, optimizada para SEO

### 2. **Páginas Estáticas** (`/admin`, `/stores-demo`)

- **Ubicación**: Directorios específicos con `page.tsx`
- **Características**: Rendimiento óptimo, rutas fijas
- **Uso**: Funcionalidades que no cambiarán (admin, demos, docs)

### 3. **Páginas Dinámicas CMS** (`/cualquier-ruta`)

- **Ubicación**: Gestionadas por el catch-all `[[...slug]]/page.tsx`
- **Características**: Contenido editable desde el CMS
- **Uso**: Contenido editorial que cambia frecuentemente

### 4. **Páginas Híbridas** (`/servicios`)

- **Ubicación**: Directorio específico + catch-all interno
- **Características**: Página principal estática + subpáginas dinámicas
- **Uso**: Secciones con página principal fija y contenido variable

## 🆕 Crear Páginas Estáticas

### Paso 1: Crear el Directorio y Archivo

```bash
mkdir src/app/[locale]/mi-nueva-seccion
touch src/app/[locale]/mi-nueva-seccion/page.tsx
```

### Paso 2: Implementar la Página

```tsx
// src/app/[locale]/mi-nueva-seccion/page.tsx
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function MiNuevaSeccionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('MiSeccion');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Paso 3: Añadir Traducciones

```json
// messages/en/mi-seccion.json
{
  "title": "My New Section",
  "description": "This is my new section"
}

// messages/es/mi-seccion.json
{
  "title": "Mi Nueva Sección",
  "description": "Esta es mi nueva sección"
}
```

### Paso 4: ⚠️ Actualizar Configuración (IMPORTANTE)

```tsx
// src/app/[locale]/[[...slug]]/page.tsx
const STATIC_ROUTES_FALLBACK = [
  '/admin',
  '/editor-demo',
  '/stores-demo',
  '/visual-editor-demo',
  '/servicios',
  '/scrollbar-demo',
  '/not-found-redirect',
  '/mi-nueva-seccion', // ✅ AÑADIR AQUÍ
];
```

## 🎛️ Crear Páginas Dinámicas (CMS)

### Paso 1: Usar el Panel de Administración

1. Ve a `/admin/editor`
2. Clic en "Nueva Página"
3. Configurar:
   - **Slug**: `mi-contenido-dinamico`
   - **Full Path**: `/mi-contenido-dinamico`
   - **Activa**: ✅
   - **Tipo de Ruta**: `dynamic`

### Paso 2: Crear Contenido Multiidioma

```tsx
// El sistema automáticamente creará contenido para cada locale
// Puedes editarlo desde el editor visual o mediante API
```

### Paso 3: Acceder a la Página

- **Inglés**: `http://localhost:3000/en/mi-contenido-dinamico`
- **Español**: `http://localhost:3000/es/mi-contenido-dinamico`

## 🔀 Crear Páginas Híbridas

### Ejemplo: Sección `/productos`

#### Paso 1: Crear Estructura

```bash
mkdir src/app/[locale]/productos
mkdir src/app/[locale]/productos/[[...slug]]
```

#### Paso 2: Página Principal Estática

```tsx
// src/app/[locale]/productos/[[...slug]]/page.tsx
export default async function ProductosPage({ params }: Props) {
  const { locale, slug = [] } = await params;

  // Si no hay slug, mostrar página principal
  if (slug.length === 0) {
    return (
      <div>
        <h1>Productos</h1>
        <p>Catálogo principal de productos</p>
      </div>
    );
  }

  // Si hay slug, buscar en CMS
  const path = `/productos/${slug.join('/')}`;
  const page = await prisma.page.findFirst({
    where: { fullPath: path, isActive: true },
  });

  if (!page) notFound();

  return <div>Producto dinámico: {page.slug}</div>;
}
```

#### Paso 3: Actualizar Configuración

```tsx
const STATIC_ROUTES_FALLBACK = [
  // ... otras rutas
  '/productos', // ✅ AÑADIR AQUÍ
];
```

## ⚙️ Configuración de Rutas

### Detección Automática vs Manual

#### 🤖 Modo Automático (Desarrollo)

```tsx
// El sistema escanea automáticamente src/app/[locale]/
// y detecta todas las carpetas que NO empiecen con [
function getStaticRoutes(): string[] {
  // Escanea filesystem automáticamente
}
```

#### 🔧 Modo Manual (Producción)

```tsx
// Si falla el escaneo automático, usa el fallback manual
const STATIC_ROUTES_FALLBACK = [
  '/admin', // Panel de administración
  '/editor-demo', // Demo del editor
  '/stores-demo', // Demo de stores
  '/visual-editor-demo', // Demo editor visual
  '/servicios', // Sección servicios (híbrida)
  '/scrollbar-demo', // Demo scrollbars
  '/not-found-redirect', // Redirección 404
  // ✅ AÑADIR NUEVAS RUTAS ESTÁTICAS AQUÍ
];
```

### Variables de Entorno

```bash
# .env.local
TRANSLATIONS_DATABASE_ENABLED=true
DATABASE_URL="postgresql://..."
```

## 🚨 Solución de Problemas

### Error: "Route conflict"

```bash
Error: You cannot define a route with the same specificity
```

**Solución**: Verificar que no hay conflictos entre:

- `/mi-seccion/page.tsx` (estática)
- `/mi-seccion/[[...slug]]/page.tsx` (catch-all)

### Error: Página no encuentra en CMS

```bash
GET /es/mi-pagina 404
```

**Verificar**:

1. La página existe en la base de datos (`/admin/editor`)
2. `isActive = true`
3. `fullPath` correcto
4. La ruta NO está en `STATIC_ROUTES_FALLBACK`

### Error: "generateStaticParams duplicated"

```bash
Module parse failed: Identifier 'generateStaticParams' has already been declared
```

**Solución**: Solo debe haber una función `generateStaticParams` por archivo.

## 📝 Checklist para Nuevas Páginas

### ✅ Páginas Estáticas

- [ ] Crear directorio `/src/app/[locale]/mi-seccion/`
- [ ] Crear `page.tsx` con componente
- [ ] Añadir traducciones en `/messages/`
- [ ] ⚠️ **Actualizar `STATIC_ROUTES_FALLBACK`**
- [ ] Probar en desarrollo
- [ ] Verificar en ambos idiomas

### ✅ Páginas Dinámicas

- [ ] Crear desde `/admin/editor`
- [ ] Configurar slug y fullPath
- [ ] Marcar como activa
- [ ] Añadir contenido en ambos idiomas
- [ ] Verificar que NO está en `STATIC_ROUTES_FALLBACK`

### ✅ Páginas Híbridas

- [ ] Crear directorio con catch-all interno
- [ ] Implementar lógica de routing condicional
- [ ] ⚠️ **Actualizar `STATIC_ROUTES_FALLBACK`**
- [ ] Crear páginas CMS para subpáginas
- [ ] Probar ambos niveles de routing

## 🔗 Enlaces Útiles

- **Panel Admin**: `/admin`
- **Editor de Páginas**: `/admin/editor`
- **Demo de Stores**: `/stores-demo`
- **Documentación Next.js**:
  [Routing](https://nextjs.org/docs/app/building-your-application/routing)
- **Documentación next-intl**:
  [Internationalization](https://next-intl-docs.vercel.app/)

---

> ⚠️ **IMPORTANTE**: Siempre actualizar `STATIC_ROUTES_FALLBACK` al crear nuevas
> páginas estáticas para garantizar que el sistema funcione correctamente en
> producción.
