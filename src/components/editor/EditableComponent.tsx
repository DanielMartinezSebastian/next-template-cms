/**
 * EditableComponent
 * Componente helper que envuelve automáticamente componentes con funcionalidad de edición
 * Solo activa el modo editor cuando es necesario
 */

'use client';

import { useEditorMode } from '@/hooks/useEditorMode';
import { ReactElement } from 'react';
import { ComponentWrapper } from './ComponentWrapper';

// =============================================================================
// TYPES
// =============================================================================

interface EditableComponentProps {
  /**
   * Tipo de componente para la edición
   */
  componentType: string;
  /**
   * Props del componente
   */
  componentProps: Record<string, unknown>;
  /**
   * Callback cuando las props cambian (solo necesario en modo editor)
   */
  onPropsChange?: (newProps: Record<string, unknown>) => void;
  /**
   * ID único del nodo en el editor (solo necesario en modo editor)
   */
  nodeKey?: string;
  /**
   * Función que renderiza el componente
   */
  children: (props: Record<string, unknown>) => ReactElement;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditableComponent({
  componentType,
  componentProps,
  onPropsChange,
  nodeKey,
  children,
}: EditableComponentProps) {
  const isEditorMode = useEditorMode();

  // En modo producción, renderizar directamente
  if (!isEditorMode) {
    return children(componentProps);
  }

  // En modo editor, envolver con funcionalidad de edición
  if (!onPropsChange) {
    console.warn(
      `EditableComponent: onPropsChange callback required in editor mode for ${componentType}`
    );
    return children(componentProps);
  }

  return (
    <ComponentWrapper
      componentType={componentType}
      componentProps={componentProps}
      onPropsChange={onPropsChange}
      nodeKey={nodeKey}
      isEditorMode={isEditorMode}
    >
      {children(componentProps)}
    </ComponentWrapper>
  );
}

export default EditableComponent;
