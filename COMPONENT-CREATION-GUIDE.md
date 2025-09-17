# Component Creation Guide

## Overview

This guide provides comprehensive instructions for creating new dynamic components in the Next.js Template CMS. The system automatically detects TypeScript interfaces and generates schemas, forms, and database configurations.

## Quick Start

### 1. Create Component Interface

Define your component's TypeScript interface in `/src/components/dynamic/components/`:

```typescript
// src/components/dynamic/components/MyComponent.tsx

export interface MyComponentProps {
  title: string;
  description?: string;
  backgroundColor?: string;
  isVisible?: boolean;
  items?: Array<{
    name: string;
    value: string;
  }>;
}

export function MyComponent({ 
  title, 
  description = "Default description",
  backgroundColor = "#ffffff",
  isVisible = true,
  items = []
}: MyComponentProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ backgroundColor }}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      
      {items.length > 0 && (
        <ul className="mt-4">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2. Export Component

Add your component to the main index file:

```typescript
// src/components/dynamic/index.ts

export { MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent';

// Add to components object
export const components = {
  // ... existing components
  MyComponent,
};
```

### 3. Configure Component

Update the component configuration:

```json
// component-config.json

{
  "categoryMapping": {
    "MyComponent": "custom"
  },
  "iconMapping": {
    "MyComponent": "🔧"
  },
  "componentSpecificDefaults": {
    "MyComponent": {
      "title": "My Awesome Component",
      "description": "This component does amazing things",
      "backgroundColor": "#f3f4f6",
      "isVisible": true,
      "items": [
        {
          "name": "Feature 1",
          "value": "Enabled"
        },
        {
          "name": "Feature 2", 
          "value": "Disabled"
        }
      ]
    }
  }
}
```

### 4. Generate Schemas

Run the automatic configuration:

```bash
npm run components:configure
```

This will:
- ✅ Detect your new component automatically
- ✅ Generate TypeScript schemas from your interface
- ✅ Create database entries for the component
- ✅ Generate form configurations for the editor

### 5. Use Component

Your component is now available in the visual editor with:
- ✅ Automatic form generation based on props
- ✅ Real-time preview updates
- ✅ Component ordering capabilities
- ✅ Database persistence

## Advanced Component Development

### Complex Property Types

#### Enums and Select Options
```typescript
export interface AdvancedComponentProps {
  size: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
  alignment: 'left' | 'center' | 'right';
}
```

The system automatically generates select dropdowns for union types.

#### Array Properties with Objects
```typescript
export interface ComponentWithArrayProps {
  features: Array<{
    title: string;
    description: string;
    icon: string;
    enabled: boolean;
  }>;
}
```

Arrays of objects get special handling in the configuration system.

#### Optional vs Required Properties
```typescript
export interface ComponentProps {
  title: string;              // Required field
  subtitle?: string;          // Optional field
  isVisible: boolean;         // Required boolean
  showBorder?: boolean;       // Optional boolean with default
}
```

Use TypeScript's optional (`?`) syntax to make fields optional in the editor.

### Property Validation

#### Built-in Validations
The system provides automatic validation for:

```typescript
export interface ValidatedComponentProps {
  // URL validation
  link?: string;              // Auto-detected as URL field
  imageUrl?: string;          // Auto-detected as URL field
  
  // Color validation  
  color?: string;             // Auto-detected as color picker
  backgroundColor?: string;   // Auto-detected as color picker
  
  // Number validation
  count: number;              // Number input with steppers
  rating: number;             // Number input
  
  // Text validation
  email?: string;             // Email input validation
  content?: string;           // Auto-detected as textarea
  description?: string;       // Auto-detected as textarea
}
```

#### Custom Validation with Zod

For advanced validation, add Zod schemas:

```typescript
import { z } from 'zod';

export const MyComponentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  email: z.string().email("Invalid email format").optional(),
  rating: z.number().min(1).max(5),
  tags: z.array(z.string()).max(10, "Too many tags")
});

export type MyComponentProps = z.infer<typeof MyComponentSchema>;
```

### Component Categories

Organize components into logical categories:

```json
{
  "categoryMapping": {
    "HeroSection": "marketing",
    "ContactForm": "forms", 
    "ImageGallery": "media",
    "TextBlock": "content",
    "Button": "ui",
    "Section": "layout",
    "MyComponent": "custom"
  }
}
```

Available categories:
- `marketing` - Marketing and promotional components
- `content` - Text and content components  
- `forms` - Interactive form components
- `media` - Image, video, and media components
- `ui` - Basic UI elements
- `layout` - Structure and layout components
- `custom` - Your custom components

### Icon Mapping

Assign emojis or icons to your components:

```json
{
  "iconMapping": {
    "MyComponent": "🔧",
    "CustomForm": "📝", 
    "SpecialCard": "⭐",
    "DataChart": "📊"
  }
}
```

### Default Values

Provide meaningful defaults for better user experience:

```json
{
  "componentSpecificDefaults": {
    "MyComponent": {
      "title": "Component Title",
      "subtitle": "Component subtitle",
      "backgroundColor": "#f8fafc",
      "textColor": "#1f2937",
      "padding": "medium",
      "showBorder": true,
      "items": [
        {
          "name": "Default Item",
          "value": "Default Value",
          "enabled": true
        }
      ]
    }
  }
}
```

## Best Practices

### TypeScript Interface Design

1. **Use descriptive property names**:
   ```typescript
   // ✅ Good
   backgroundColor: string;
   isVisible: boolean;
   ctaButtonText: string;
   
   // ❌ Avoid
   bg: string;
   show: boolean;
   btn: string;
   ```

2. **Provide sensible defaults**:
   ```typescript
   export function MyComponent({ 
     title,
     isVisible = true,        // Default to visible
     padding = "medium",      // Default padding
     backgroundColor = "#fff" // Default background
   }: MyComponentProps) {
     // Component implementation
   }
   ```

3. **Use consistent typing patterns**:
   ```typescript
   // ✅ Consistent size options across components
   type Size = 'small' | 'medium' | 'large';
   type Theme = 'light' | 'dark';
   type Alignment = 'left' | 'center' | 'right';
   ```

### Component Structure

1. **Handle loading and error states**:
   ```typescript
   export function MyComponent({ title, data }: MyComponentProps) {
     if (!title) {
       return <div>Loading...</div>;
     }
     
     if (error) {
       return <div>Error loading component</div>;
     }
     
     return (
       <div>{/* Normal render */}</div>
     );
   }
   ```

2. **Make components accessible**:
   ```typescript
   return (
     <div 
       role="article"
       aria-labelledby="component-title"
     >
       <h2 id="component-title">{title}</h2>
       <p aria-describedby="component-desc">{description}</p>
     </div>
   );
   ```

3. **Support responsive design**:
   ```typescript
   export interface ResponsiveComponentProps {
     columns?: 1 | 2 | 3 | 4;
     mobileColumns?: 1 | 2;
     spacing?: 'tight' | 'normal' | 'loose';
   }
   ```

### Performance Optimization

1. **Use React.memo for expensive components**:
   ```typescript
   import { memo } from 'react';
   
   export const MyComponent = memo(function MyComponent(props: MyComponentProps) {
     // Component implementation
   });
   ```

2. **Lazy load heavy dependencies**:
   ```typescript
   import { lazy, Suspense } from 'react';
   
   const HeavyChart = lazy(() => import('./HeavyChart'));
   
   export function ChartComponent(props: ChartProps) {
     return (
       <Suspense fallback={<div>Loading chart...</div>}>
         <HeavyChart {...props} />
       </Suspense>
     );
   }
   ```

## Testing Components

### Manual Testing Checklist

When creating new components, test:

1. **Editor Integration**:
   - ✅ Component appears in "Add Components" list
   - ✅ Component can be added to pages
   - ✅ Property editor opens correctly
   - ✅ All props have appropriate input fields

2. **Property Editing**:
   - ✅ Required fields show validation
   - ✅ Optional fields work correctly
   - ✅ Default values populate properly
   - ✅ Changes reflect in real-time preview

3. **Component Ordering**:
   - ✅ Move up/down buttons work
   - ✅ Component maintains props when moved
   - ✅ Preview updates correctly after reordering

4. **Database Persistence**:
   - ✅ Component saves to database
   - ✅ Component loads correctly on page refresh
   - ✅ Props persist accurately

### Automated Testing

Add unit tests for your components:

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders with required props', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('handles optional props correctly', () => {
    render(
      <MyComponent 
        title="Test" 
        description="Test description"
        isVisible={false}
      />
    );
    
    // Should not render when isVisible is false
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

**Component not appearing in editor:**
- Check if component is exported from `index.ts`
- Verify component name matches file export
- Run `npm run components:configure` to refresh

**Properties not generating correctly:**
- Ensure TypeScript interface is exported
- Check property types are supported
- Verify configuration in `component-config.json`

**Default values not working:**
- Add defaults to `componentSpecificDefaults` in config
- Ensure property names match exactly
- Use proper JSON syntax for complex objects

**Component rendering errors:**
- Check browser console for TypeScript errors
- Verify all required props are provided
- Test component independently outside editor

### Debug Mode

Enable debug mode for detailed logging:

```json
{
  "debug": true
}
```

This shows detailed output during `npm run components:configure`:

```bash
🔧 Processing MyComponent interface...
📋 Found properties: title, description, backgroundColor
⚙️ Generating schema for MyComponent...
✅ MyComponent: Auto-generated from TypeScript interface
```

## Related Documentation

- [Component Ordering Guide](./COMPONENT-ORDERING-GUIDE.md)
- [Dynamic Components Pattern](./DYNAMIC-COMPONENTS-PATTERN.md)
- [System Architecture](./SYSTEM-ARCHITECTURE.md)
- [Development Workflow](./README.md)