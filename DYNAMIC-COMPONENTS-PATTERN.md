# Patrón de Componentes Dinámicos

Este documento establece las mejores prácticas para crear componentes dinámicos
seguros y fáciles de desarrollar en nuestro sistema CMS.

## Principios Fundamentales

### 1. **Server Components First**

- Los componentes dinámicos son Server Components por defecto
- Usar `'use client'` solo cuando sea absolutamente necesario
- Mantener la lógica de estado en stores de Zustand cuando se necesite
  interactividad

### 2. **Sanitización Automática**

- Todas las props pasan por un proceso de sanitización automática
- Se eliminan props peligrosas como `onClick` con valores string
- Se validan tipos y valores permitidos contra esquemas TypeScript

### 3. **Validación por Esquemas**

- Cada componente tiene un esquema TypeScript que define sus props válidas
- La validación es automática y previene errores en tiempo de ejecución
- Los valores por defecto están definidos en el esquema

## Estructura de un Componente Dinámico

### 1. Definición de Props (TypeScript Interface)

```typescript
// src/components/dynamic/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  // ❌ NUNCA incluir event handlers como onClick: () => void
  // ❌ NUNCA incluir funciones o referencias de objetos complejos
}
```

### 2. Implementación del Componente

```typescript
import { cn } from '@/lib/utils';

export default function MyComponent({
  title,
  description = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}: MyComponentProps) {
  return (
    <div
      className={cn(
        'my-component',
        `variant-${variant}`,
        `size-${size}`,
        { 'disabled': disabled },
        className
      )}
    >
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### 3. Registro en ComponentFactory

```typescript
// src/components/dynamic/ComponentFactory.tsx
import MyComponent from './components/MyComponent';

export class ComponentFactory {
  private static componentMap: ComponentFactoryMapping = {
    // ... otros componentes
    'my-component': MyComponent,
    mycomponent: MyComponent, // Alias para compatibilidad
  };
}
```

### 4. Esquema de Validación (Automático)

El sistema genera automáticamente esquemas a partir de las interfaces TypeScript
usando `schema-inference.ts`.

## Reglas de Seguridad

### ❌ Props Prohibidas

Estas props son automáticamente filtradas por el sistema de sanitización:

```typescript
// Props peligrosas que se eliminan automáticamente
const dangerousProps = [
  'onClick',
  'onSubmit',
  'onChange',
  'onFocus',
  'onBlur',
  'onMouseOver',
  'dangerouslySetInnerHTML',
];
```

### ❌ Tipos No Permitidos

```typescript
interface BadComponentProps {
  // ❌ Funciones
  onClick: () => void;
  onSubmit: (data: FormData) => void;

  // ❌ Referencias de objetos complejos
  ref: React.RefObject<HTMLElement>;

  // ❌ Componentes React
  children: React.ReactNode;

  // ❌ Valores no serializables
  callback: Function;
}
```

### ✅ Props Permitidas

```typescript
interface GoodComponentProps {
  // ✅ Primitivos
  title: string;
  count: number;
  isVisible: boolean;

  // ✅ Uniones de strings
  variant: 'default' | 'primary' | 'secondary';

  // ✅ Arrays de primitivos
  tags: string[];

  // ✅ Objetos simples serializables
  config: {
    color: string;
    size: number;
  };

  // ✅ Strings especiales
  className: string;
  href: string;
  src: string;
}
```

## Interactividad Segura

### Para Componentes que Requieren Interactividad

```typescript
'use client';

import { useUserPreferences } from '@/stores';

interface InteractiveComponentProps {
  initialValue: string;
  variant: 'default' | 'primary';
}

export default function InteractiveComponent({
  initialValue,
  variant = 'default'
}: InteractiveComponentProps) {
  const { theme, setTheme } = useUserPreferences();

  const handleClick = () => {
    // Lógica de interactividad usando stores
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={handleClick} className={`variant-${variant}`}>
      {initialValue}
    </button>
  );
}
```

## Proceso de Desarrollo

### 1. Crear el Componente

```bash
# Crear archivo del componente
touch src/components/dynamic/components/MyComponent.tsx
```

### 2. Definir Interface y Componente

```typescript
// Seguir el patrón establecido arriba
interface MyComponentProps {
  /* ... */
}
export default function MyComponent(props: MyComponentProps) {
  /* ... */
}
```

### 3. Registrar en ComponentFactory

```typescript
// Añadir al componentMap
'my-component': MyComponent,
```

### 4. Probar con Datos

```typescript
// El sistema automáticamente:
// - Genera el esquema de validación
// - Sanitiza las props
// - Aplica valores por defecto
// - Valida tipos
```

## Validación Automática

El sistema incluye múltiples capas de protección:

### 1. Sanitización de Props con Placeholders

```typescript
// ComponentFactory.sanitizeProps()
static sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...props };

  // Eliminar props peligrosas
  const dangerousProps = ['onClick', 'onSubmit', /* ... */];
  dangerousProps.forEach(prop => {
    if (prop in sanitized && typeof sanitized[prop] === 'string') {
      delete sanitized[prop];
      console.warn(`Removed invalid ${prop} prop`);
    }
  });

  // Asignar placeholders automáticos para arrays y objetos
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];

    // Arrays que podrían ser strings vacíos
    if (key.endsWith('s') || ['features', 'images', 'testimonials'].includes(key)) {
      if (typeof value === 'string' || !Array.isArray(value)) {
        sanitized[key] = this.getPlaceholderValue(key, '');
      }
    }
  });

  return sanitized;
}
```

### 2. Sistema de Placeholders Centralizados

Configuración en `component-config.json`:

```json
{
  "placeholders": {
    "arrays": {
      "features": [{ "text": "Feature example", "included": true }],
      "images": [],
      "testimonials": [{ "name": "John Doe", "text": "Great!", "rating": 5 }],
      "items": [],
      "tags": []
    },
    "objects": {
      "config": {},
      "settings": {},
      "metadata": {}
    },
    "specialTypes": {
      "color": "#000000",
      "url": "",
      "email": "",
      "className": ""
    }
  }
}
```

### 3. Detección Automática de Tipos

````typescript
// getPlaceholderValue() - Detección inteligente
static getPlaceholderValue(propName: string, currentValue: unknown): unknown {
  // Arrays automáticos para props que terminan en 's'
  if (propName.endsWith('s') || ['features', 'images'].includes(propName)) {
    return placeholders.arrays[propName] || [];
  }

  // Colores para props que contienen 'color'
  if (propName.includes('color')) {
    return placeholders.specialTypes.color;
  }

  // URLs para props que contienen 'url', 'href', 'link'
  if (propName.includes('url') || propName.includes('href')) {
    return placeholders.specialTypes.url;
  }

  return '';
}
```### 2. Validación de Esquemas

```typescript
// Validación automática contra esquemas TypeScript
const { sanitizedProps, errors } = ComponentFactory.validateProps(type, props);
````

### 3. Logging de Desarrollo

```typescript
// Avisos automáticos en desarrollo
if (errors.length > 0 && process.env.NODE_ENV === 'development') {
  console.warn(`Component ${type} validation errors:`, errors);
}
```

## Ejemplos de Uso

### Componente Simple (Text Block)

```typescript
interface TextBlockProps {
  content: string;
  title?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'md' | 'lg';
}

export default function TextBlock({
  content,
  title = '',
  textAlign = 'left',
  fontSize = 'md'
}: TextBlockProps) {
  return (
    <div className={`text-${textAlign} text-${fontSize}`}>
      {title && <h3>{title}</h3>}
      <p>{content}</p>
    </div>
  );
}
```

### Componente con Configuración Compleja (Image Gallery)

```typescript
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  spacing?: 'sm' | 'md' | 'lg';
}

export default function ImageGallery({
  images = [],
  columns = 3,
  aspectRatio = 'landscape',
  spacing = 'md'
}: ImageGalleryProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-${spacing}`}>
      {images.map((image, index) => (
        <div key={index} className={`aspect-${aspectRatio}`}>
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          {image.title && <p className="mt-2">{image.title}</p>}
        </div>
      ))}
    </div>
  );
}
```

## Debugging y Troubleshooting

### Error Común: onClick con String

```javascript
// ❌ Problema
"onClick": "handleClick()"  // String invalid

// ✅ Solución automática
// El sistema elimina automáticamente onClick strings
// En su lugar, usar stores para interactividad
```

### Error Común: Props No Serializables

```typescript
// ❌ Problema
interface BadProps {
  callback: () => void; // No serializable
}

// ✅ Solución
interface GoodProps {
  actionType: 'submit' | 'reset'; // Serializable
}
```

### Logs de Desarrollo

```bash
# En desarrollo, el sistema muestra:
Component button validation errors: ["onClick must be a function"]
Removed invalid onClick prop with string value: ">"
```

## Migración de Componentes Existentes

### Paso 1: Revisar Props Interface

```typescript
// Antes
interface OldComponentProps {
  onClick?: () => void; // ❌ Remover
  onSubmit?: Function; // ❌ Remover
  text: string; // ✅ Mantener
}

// Después
interface NewComponentProps {
  text: string; // ✅ Solo props serializables
  actionType?: string; // ✅ Alternativa serializable
}
```

### Paso 2: Actualizar Implementación

```typescript
// Migrar lógica de eventos a stores o usar 'use client'
```

### Paso 3: Actualizar Base de Datos

```sql
-- Limpiar configuraciones problemáticas
UPDATE components
SET "defaultConfig" = jsonb_strip_nulls("defaultConfig" - 'onClick')
WHERE "defaultConfig" ? 'onClick';
```

## Best Practices Summary

1. **✅ DO**: Usar props primitivos y serializables
2. **✅ DO**: Definir tipos strict con TypeScript
3. **✅ DO**: Usar stores para interactividad
4. **✅ DO**: Aprovechar la sanitización automática
5. **❌ DON'T**: Incluir event handlers en props
6. **❌ DON'T**: Usar objetos no serializables
7. **❌ DON'T**: Confiar en props no validadas
8. **❌ DON'T**: Omitir valores por defecto

Este patrón garantiza componentes dinámicos seguros, mantenibles y fáciles de
desarrollar.
