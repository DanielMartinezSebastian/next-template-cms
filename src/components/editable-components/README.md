# Editable Components

This folder contains components that are editable by content creators.
These components use the withEditable HOC and are registered in the component registry.
They can be added to pages through the visual editor interface.

## Component Pattern

All components in this folder should follow the withEditable pattern:

```typescript
import { withEditable } from '@/lib/component-registry';
import { z } from 'zod';

const ComponentSchema = z.object({
  // Define props with validation
});

function ComponentBase(props) {
  // Component implementation
}

export default withEditable(ComponentBase, {
  metadata: { category: 'content', icon: '🔧', description: '...' },
  schema: ComponentSchema,
  defaultProps: { ... },
  validateInDev: true
});
```

## Benefits

- ✅ Auto-registration in component registry
- ✅ Runtime Zod validation
- ✅ Auto-generated editor UI forms
- ✅ Database synchronization
- ✅ TypeScript type safety
- ✅ Custom props management