/**
 * Editor Components Export
 * Central export file for all editor components and utilities
 */

export { getComponentDefinition, validateComponentProps } from './component-definitions';
export { ComponentEditModal } from './ComponentEditModal';
export { EditableComponentsPlugin } from './plugins/EditableComponentsPlugin';
export { ToolbarPlugin } from './plugins/ToolbarPlugin';
export { VisualEditor } from './VisualEditor';

export {
  $createEditableComponentNode,
  $isEditableComponentNode,
  EditableComponentNode,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from './nodes/EditableComponentNode';

export type {
  ComponentConfig,
  ComponentType,
  SerializedEditableComponentNode,
} from './nodes/EditableComponentNode';

export { default as editorTheme } from './themes/editor-theme';
