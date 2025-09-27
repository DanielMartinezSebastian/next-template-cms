# 🐻 Zustand Stores - Guía Rápida

## 📦 Stores Disponibles

### ✅ Implementados y Funcionando

- **`page-store.ts`** - Gestión de páginas CMS con CRUD operations
- **`edit-mode-store.ts`** - Control del editor visual con historial y selección
- **`user-preferences-store.ts`** - Configuración de usuario (idioma, tema, editor)
- **`translation-cache-store.ts`** - Cache de traducciones con métricas en tiempo real

## 🚀 Uso Rápido

### Hook Pattern (Recomendado)

```typescript
// Usar hooks de acción para evitar re-renders innecesarios
import { usePageActions, usePageStore } from '@/stores';

function MiComponente() {
  // ✅ Solo datos que necesito
  const pages = usePageStore(state => state.pages);
  const currentPage = usePageStore(state => state.currentPage);
  
  // ✅ Acciones separadas
  const { createPage, updatePage } = usePageActions();
  
  return (
    <button onClick={() => createPage({ title: 'Nueva Página' })}>
      Crear Página
    </button>
  );
}
```

### Store Direct (Para casos específicos)

```typescript
import { useEditModeStore } from '@/stores';

function EditorToolbar() {
  const {
    isEditMode,
    selectedComponent,
    toggleEditMode,
    selectComponent
  } = useEditModeStore();
  
  return (
    <div>
      <button onClick={toggleEditMode}>
        {isEditMode ? 'Salir' : 'Editar'}
      </button>
    </div>
  );
}
```

## 🎯 Demo Interactiva

Visita [`/stores-demo`](http://localhost:3000/stores-demo) para:

- ✅ Probar todos los stores interactivamente
- ✅ Ver métricas en tiempo real
- ✅ Entender el patrón de action hooks

## 📖 Ver Documentación Completa

Para arquitectura detallada: [`/docs/architecture/system-architecture.md`](../docs/architecture/system-architecture.md)