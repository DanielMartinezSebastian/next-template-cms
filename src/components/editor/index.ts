/**
 * Editor Components Export
 * Central export file for all editor components and utilities
 */

export { getComponentDefinition, validateComponentProps } from './component-definitions';
export { ComponentEditModal } from './ComponentEditModal';
export { ComponentWrapper } from './ComponentWrapper';
export { EditableComponent } from './EditableComponent';
export { EditableComponentsPlugin } from './plugins/EditableComponentsPlugin';
export { ToolbarPlugin } from './plugins/ToolbarPlugin';
export { VisualEditor } from './VisualEditor';

export {
  $createEditableComponentNode,
  $isEditableComponentNode,
  EditableComponentNode,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from './nodes/EditableComponentNode';

export {
  $createDynamicComponentNode,
  $getDynamicComponentNodeByKey,
  $isDynamicComponentNode,
  DynamicComponentNode,
  INSERT_DYNAMIC_COMPONENT_COMMAND,
} from './nodes/DynamicComponentNode';

export type {
  ComponentConfig,
  ComponentType,
  SerializedEditableComponentNode,
} from './nodes/EditableComponentNode';

export type {
  DynamicComponentPayload,
  SerializedDynamicComponentNode,
} from './nodes/DynamicComponentNode';

export { default as editorTheme } from './themes/editor-theme';
