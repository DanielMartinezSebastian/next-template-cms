/**
 * Enhanced withEditableSSR HOC
 * Automatically wraps components with EditableWrapper for centralized edit mode handling
 */

import EditableWrapper from '@/components/dynamic/EditableWrapper';
import { withEditableSSR as originalWithEditableSSR } from '@/lib/component-registry';
import { useEditModeStore } from '@/stores';
import React from 'react';

interface ComponentOptions {
  metadata: {
    category: string;
    description: string;
    icon: string;
    tags: string[];
  };
  schema: any;
  defaultProps: Record<string, unknown>;
  validateInDev?: boolean;
}

/**
 * Enhanced HOC that automatically adds EditableWrapper for edit mode handling
 */
export function withEditableWrapper<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: ComponentOptions
) {
  // First, create the original editable component
  const EditableComponent = originalWithEditableSSR(Component, options);

  // Then, wrap it with our EditableWrapper
  const WrappedComponent = React.forwardRef<
    any,
    T & {
      editMode?: boolean;
      componentId?: string;
      componentType?: string;
    }
  >((props, ref) => {
    const { editMode, componentId, componentType, ...componentProps } = props;
    const selectedComponentId = useEditModeStore(state => state.selectedComponentId);

    // Extract component name from the Component.name or componentType
    const displayName = componentType || Component.displayName || Component.name || 'Component';

    // Clean component name for display (remove "Component" suffix if present)
    const cleanDisplayName = displayName.replace(/Component$/, '');

    return (
      <EditableWrapper
        componentId={componentId || 'unknown'}
        componentType={cleanDisplayName}
        editMode={editMode}
        isSelected={selectedComponentId === componentId}
      >
        <EditableComponent ref={ref} {...(componentProps as T)} />
      </EditableWrapper>
    );
  });

  // Preserve display name and metadata
  WrappedComponent.displayName = `withEditableWrapper(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
