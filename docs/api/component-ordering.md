# Component Ordering System Guide

## Overview

The Next.js Template CMS includes a powerful component ordering system that allows users to rearrange components on their pages using simple up/down controls. This system ensures that the visual order in the editor matches exactly with the published page.

![Component Ordering Demo](https://github.com/user-attachments/assets/6dd677e4-dd03-46a1-a294-cdd05710921f)

## Features

### ✅ **Visual Component Ordering**
- **Move Up/Down buttons** for each component
- **Smart button states** - disabled when component can't move further
- **Real-time preview** updates showing new order immediately
- **Component counter** shows total number of components

### ✅ **User Experience**
- **Auto-expand** newly added components for immediate editing
- **Visual feedback** with helpful tips when multiple components exist
- **Persistent ordering** - changes saved to database automatically
- **Intuitive controls** with clear move up (↑) and move down (↓) icons

## How It Works

### Component Structure
Each component in the system has an `order` property that determines its position:

```typescript
interface PageComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  order: number;  // 👈 Controls display order
  isVisible: boolean;
}
```

### Move Functions
The system provides three main ordering functions:

```typescript
// Move a component up by one position
const moveComponentUp = (index: number) => {
  moveComponent(index, index - 1);
};

// Move a component down by one position  
const moveComponentDown = (index: number) => {
  moveComponent(index, index + 1);
};

// Core move function with automatic reordering
const moveComponent = (fromIndex: number, toIndex: number) => {
  // Validates bounds and reorders components
  // Updates order property for each component
  // Saves to database automatically
};
```

## User Interface

### Component Editor Layout
Each component in the editor displays:

1. **Header Section**:
   - Drag handle icon (for visual indication)
   - Component name and description
   - Control buttons row

2. **Control Buttons** (from left to right):
   - `↑` **Move Up** - Moves component towards beginning
   - `↓` **Move Down** - Moves component towards end  
   - `⚙️` **Settings** - Toggle property editor
   - `🗑️` **Delete** - Remove component

3. **Properties Section** (when expanded):
   - Auto-generated form fields based on component interface
   - Real-time editing with immediate preview updates

### Button States
The move buttons intelligently disable when movement isn't possible:

- **First component**: Move Up disabled, Move Down enabled
- **Middle components**: Both Move Up and Move Down enabled
- **Last component**: Move Up enabled, Move Down disabled
- **Single component**: Both buttons disabled

### Visual Feedback
When multiple components exist, a helpful tip appears:

> 💡 **Tip:** Use the ↑ ↓ buttons to reorder components. Components are displayed in the same order on your published page.

## Implementation Details

### Database Integration
Component ordering is persisted in PostgreSQL:

```sql
-- Components table includes order field
CREATE TABLE components (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  type TEXT NOT NULL,
  props JSONB NOT NULL,
  order_position INTEGER NOT NULL,  -- 👈 Order field
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Automatic Reordering
When components are moved, the system automatically updates order values:

```typescript
// Example: Moving component from position 1 to position 0
// Before: [A(0), B(1), C(2)]
// After:  [B(0), A(1), C(2)]

const reorderedComponents = updatedComponents.map((comp, index) => ({
  ...comp,
  order: index  // Ensures continuous numbering
}));
```

### Real-time Updates
Changes are immediately reflected in three places:

1. **Editor List** - Component order in sidebar
2. **Preview Panel** - Visual representation updates
3. **Database** - Persistent storage via API

## API Endpoints

The ordering system uses these API routes:

```bash
# Update component order
PUT /api/pages/[id]/components
Content-Type: application/json

{
  "components": [
    {
      "id": "comp-1",
      "type": "herosection", 
      "order": 0,
      "props": {...}
    },
    {
      "id": "comp-2", 
      "type": "textblock",
      "order": 1,
      "props": {...}
    }
  ]
}
```

## Best Practices

### For Developers

1. **Always use moveComponent functions** - Don't manually adjust order values
2. **Test button states** - Ensure proper enabling/disabling logic
3. **Validate order sequences** - Should be continuous (0, 1, 2, ...)
4. **Handle edge cases** - Empty arrays, single components, etc.

### For Content Editors

1. **Plan component structure** before adding many components
2. **Use logical ordering** - Header → Content → Footer flow
3. **Preview frequently** - Check how reordering affects page layout
4. **Save changes** - Use Save button to persist ordering

## Troubleshooting

### Common Issues

**Components not moving:**
- Check if move buttons are enabled
- Verify component is not at boundary position
- Ensure page is not in read-only mode

**Order numbers skipped:**
- System automatically renumbers components
- Use browser refresh if order appears inconsistent
- Check browser console for JavaScript errors

**Preview not updating:**
- Verify real-time preview is enabled
- Check network connection for API calls
- Clear browser cache if needed

### Debug Information

Enable debug mode in the editor to see:

```javascript
// Console output during moves
🔍 Moving component from index 1 to index 0
🔍 Reordered components: [B(0), A(1), C(2)]
🔍 Database update successful
```

## Future Enhancements

### Planned Features
- **Drag and drop ordering** - Visual dragging interface
- **Bulk reordering** - Move multiple components at once
- **Component groups** - Organize related components together
- **Undo/redo** - Reverse ordering changes
- **Copy order** - Duplicate ordering from other pages

### Extensibility
The system is designed to support:

- Custom component types with ordering
- Third-party component integrations  
- Advanced ordering rules and constraints
- Multi-level component hierarchies

## Related Documentation

- [Component Creation Guide](./COMPONENT-CREATION-GUIDE.md)
- [Dynamic Components Pattern](./DYNAMIC-COMPONENTS-PATTERN.md)
- [Page Management System](./PAGES-ROUTING-GUIDE.md)
- [System Architecture](./SYSTEM-ARCHITECTURE.md)