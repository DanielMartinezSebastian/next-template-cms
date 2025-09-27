# Sistema de Configuración Automática de Componentes

## 🚀 Resumen

Este sistema permite sincronizar automáticamente los componentes disponibles en
el proyecto con la base de datos y generar schemas de configuración
automáticamente desde las interfaces TypeScript.

## ⚡ Uso Rápido

```bash
# Configurar componentes para producción
npm run configure

# Vista previa (sin modificar base de datos)
npm run configure:dry-run
```

## 🎯 Características Principales

### 1. **Parser Automático del Index.ts**

- ✅ Lee automáticamente `src/components/dynamic/index.ts`
- ✅ Extrae solo componentes visuales reales (filtra utilities)
- ✅ Detecta automáticamente categorías e iconos
- ✅ Configurable via `component-config.json`

### 2. **Generación Automática de Schemas**

- ✅ Infiere schemas desde interfaces TypeScript como `ButtonComponentProps`
- ✅ Detecta tipos automáticamente (string, boolean, select, url, color)
- ✅ Genera opciones de select desde union types
- ✅ Fallback a schemas básicos si no hay interfaz

### 3. **Sincronización con Base de Datos**

- ✅ Actualiza componentes existentes automáticamente
- ✅ Crea nuevos componentes detectados
- ✅ Preserva datos existentes durante actualizaciones
- ✅ Transaccional y con manejo de errores

### 4. **Sistema de Configuración Flexible**

- ✅ Archivo `component-config.json` completamente personalizable
- ✅ Mapeo de categorías e iconos por componente
- ✅ Lista de exclusión configurable
- ✅ Rutas de archivos configurables

## 📁 Estructura de Archivos

```
project/
├── component-config.json              # 🔧 Configuración principal
├── scripts/
│   └── configure-components.ts        # 🚀 Script principal
├── src/
│   ├── components/dynamic/
│   │   ├── index.ts                   # 📋 Detectado automáticamente
│   │   └── components/                # 📦 Componentes escaneados
│   └── lib/
│       └── generated/                 # 📄 Archivos generados
│           ├── component-schemas.ts   # 🔧 Schemas generados
│           └── README.md              # 📖 Resumen de generación
└── package.json                       # ⚙️ Comandos npm configure
```

## ⚙️ Configuración

### `component-config.json`

```json
{
  "componentIndex": "src/components/dynamic/index.ts",
  "componentDir": "src/components/dynamic/components",
  "outputDir": "src/lib/generated",
  "database": {
    "enabled": true,
    "syncOnConfigure": true
  },
  "typeScript": {
    "parseInterfaces": true,
    "generateSchemas": true,
    "strictMode": true
  },
  "categoryMapping": {
    "Button": "ui",
    "Card": "general",
    "HeroSection": "marketing"
  },
  "iconMapping": {
    "Button": "🔘",
    "Card": "🃏",
    "HeroSection": "🎯"
  },
  "excludeComponents": ["PlaceholderComponent", "UnknownComponent"]
}
```

## 🔄 Flujo de Trabajo

### 1. **Desarrollo de Componente**

```typescript
// src/components/dynamic/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  variant: 'default' | 'primary' | 'secondary';
  isVisible?: boolean;
}

export default function MyComponent({ title, variant, isVisible }: MyComponentProps) {
  return <div className={`component-${variant}`}>{title}</div>;
}
```

### 2. **Registro en Index**

```typescript
// src/components/dynamic/index.ts
export { default as MyComponent } from './components/MyComponent';
```

### 3. **Configuración Automática**

```bash
npm run configure
```

### 4. **Resultado Automático**

- ✅ Schema generado automáticamente desde `MyComponentProps`
- ✅ Componente sincronizado en PostgreSQL
- ✅ Disponible inmediatamente en el editor visual
- ✅ Configuración UI generada automáticamente

## 📊 Ejemplo de Salida

```bash
🚀 Starting automatic component configuration...

📖 Loaded configuration from component-config.json
📋 Found 11 components in index.ts:
  • Button (ui) 🔘
  • Card (general) 🃏
  • HeroSection (marketing) 🎯

🔧 Generating component schemas...
  ✅ Button: Auto-generated from TypeScript interface
  📄 Card: Basic schema (no interface found)
  📄 HeroSection: Basic schema (no interface found)

📊 Synchronizing with database...
  🔄 Updated: Button
  🔄 Updated: Card
  ✨ Created: HeroSection

📈 Database sync complete: 1 created, 2 updated

🎉 Component configuration completed successfully!
```

## 🎨 Características Avanzadas

### **Schema Automático desde TypeScript**

El sistema detecta automáticamente:

- **Union Types → Select**: `'default' | 'primary'` → Dropdown con opciones
- **Boolean → Checkbox**: `isVisible?: boolean` → Checkbox toggle
- **String con patrones → Tipos especiales**:
  - `href, url, link` → URL input
  - `color, bg, text` → Color picker
  - `description, content` → Textarea

### **Mapeo Inteligente de Categorías**

```json
{
  "categoryMapping": {
    "Button": "ui",
    "Input": "ui",
    "Card": "general",
    "HeroSection": "marketing",
    "ContactForm": "forms"
  }
}
```

### **Iconos Contextuales**

```json
{
  "iconMapping": {
    "Button": "🔘",
    "Card": "🃏",
    "HeroSection": "🎯",
    "ContactForm": "📧"
  }
}
```

## 🚦 Estados del Sistema

### ✅ **Component with Interface** (Ideal)

- Interfaz TypeScript detectada
- Schema generado automáticamente
- Tipos inferidos correctamente
- UI de configuración completa

### 📄 **Component without Interface** (Básico)

- Sin interfaz TypeScript encontrada
- Schema básico generado
- Propiedades genéricas (content, className)
- Funcional pero limitado

### ⚠️ **Excluded Component**

- Listado en `excludeComponents`
- No procesado ni sincronizado
- Útil para utilities y helpers

## 🔧 Comandos de Mantenimiento

```bash
# Configuración completa
npm run configure

# Solo verificar sin cambios
npm run configure:dry-run

# Ver estado de la base de datos
npm run db:studio

# Resetear y reconfigurar
npm run db:reset && npm run db:seed && npm run configure
```

## 💡 Mejores Prácticas

### 1. **Interfaces TypeScript**

- Siempre define interfaces para tus componentes
- Usa union types para opciones limitadas
- Nomina propiedades semánticamente (`href` para URLs)

### 2. **Organización de Componentes**

- Mantén componentes en `src/components/dynamic/components/`
- Usa exports consistentes en `index.ts`
- Agrupa por funcionalidad similar

### 3. **Configuración**

- Revisa `component-config.json` regularmente
- Actualiza categorías e iconos según necesidad
- Excluye utilities y helpers

### 4. **Sincronización**

- Ejecuta `npm run configure` después de agregar componentes
- Verifica cambios en el editor visual
- Mantén la base de datos actualizada

## 📈 Beneficios

### **Para Desarrolladores**

- ⚡ Configuración automática → Sin trabajo manual
- 🔧 TypeScript → Schemas automáticos
- 📋 Un comando → Todo sincronizado

### **Para Editores de Contenido**

- 🎨 Componentes siempre actualizados
- 🔘 UI de configuración automática
- ✅ Sin necesidad de configuración técnica

### **Para el Proyecto**

- 🚀 Escalabilidad → Agregar componentes es trivial
- 🛡️ Consistencia → Todo sigue el mismo patrón
- 📊 Mantenibilidad → Un solo lugar de configuración

---

## 🎯 Resultado Final

Con este sistema, agregar un nuevo componente es tan simple como:

1. **Crear** el componente con su interfaz TypeScript
2. **Exportar** en `index.ts`
3. **Ejecutar** `npm run configure`
4. **¡Listo!** → Componente disponible en el editor visual

**¡Zero configuración manual! 🚀**
