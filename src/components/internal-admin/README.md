# Internal Admin Components

This folder contains components used internally by the admin system and editor.
These components are NOT editable by content creators and should not be registered
in the component registry.

## Purpose

- Admin panel interfaces
- Editor toolbars and panels
- Internal system components
- Developer-only components
- Database management interfaces

## Important

**DO NOT** use the `withEditable` HOC for components in this folder.
These components are for system functionality only and should not be
accessible to content creators through the visual editor.

## Categories

- `admin/` - Admin panel components
- `editor/` - Visual editor components  
- `system/` - Internal system components
- `database/` - Database management components