# 🖊️ Componentes Editables - Guía Rápida

## 📋 Componentes Disponibles

Los siguientes componentes están configurados para el editor visual:

### ✅ Implementados
- `ButtonMigrated` - Botón con variantes y estilos
- `CallToActionMigrated` - Sección de llamada a la acción
- `CardMigrated` - Card de contenido
- `HeroSectionMigrated` - Sección hero responsive
- `TextBlockMigrated` - Bloque de texto con formato

## 🚀 Crear Nuevo Componente Editable

### 1. Crear el Componente

```typescript
// src/components/editable-components/MiComponente.tsx
interface MiComponenteProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary';
}

export default function MiComponente({ title, description, variant = 'default' }: MiComponenteProps) {
  return (
    <div className={`p-4 ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-100'}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### 2. Registrar en el Editor

```typescript
// src/components/dynamic/index.ts
import MiComponente from '../editable-components/MiComponente';

export const componentMap = {
  // ... componentes existentes
  'mi-componente': MiComponente,
};
```

### 3. Configurar Base de Datos

```bash
# Ejecutar script de configuración automática
npm run configure
```

## 📖 Ver Documentación Completa

Para más detalles: [`/docs/guides/component-creation.md`](../../docs/guides/component-creation.md)