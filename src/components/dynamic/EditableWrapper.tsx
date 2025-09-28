/**
 * EditableWrapper Component
 * Centralizes edit mode visual indicators and click handling
 * Automatically wraps components in edit mode with interactive labels
 */

import { cn } from '@/lib/utils';
import { useEditModeStore } from '@/stores';
import React, { useCallback } from 'react';

interface EditableWrapperProps {
  /**
   * Component ID for identifying which component to edit
   */
  componentId: string;

  /**
   * Component type/name for display in the label
   */
  componentType: string;

  /**
   * Whether edit mode is active
   */
  editMode?: boolean;

  /**
   * The wrapped component
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;

  /**
   * Whether the component is currently selected for editing
   */
  isSelected?: boolean;
}

const EditableWrapper: React.FC<EditableWrapperProps> = ({
  componentId,
  componentType,
  editMode = false,
  children,
  className,
  isSelected = false,
}) => {
  const { setSelectedComponent } = useEditModeStore();

  const handleLabelClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Navigate to component editing in the sidebar
      setSelectedComponent(componentId);

      // Scroll the component into view in the properties panel
      const propertiesElement = document.querySelector(
        `[data-properties-component-id="${componentId}"]`
      );
      if (propertiesElement) {
        propertiesElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    [componentId, setSelectedComponent]
  );

  // If not in edit mode, render children directly
  if (!editMode) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'group relative',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      data-component-id={componentId}
    >
      {children}

      {/* Edit Mode Label - Clickable */}
      <button
        onClick={handleLabelClick}
        className={cn(
          'absolute right-2 top-2 z-50 rounded px-2 py-1 text-xs font-medium shadow-sm transition-all duration-200',
          'hover:scale-105 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          isSelected
            ? 'bg-blue-600 text-white ring-2 ring-blue-300 focus:ring-blue-500'
            : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
        )}
        title={`Click to edit ${componentType} properties`}
        aria-label={`Edit ${componentType} component`}
      >
        {componentType}
      </button>

      {/* Hover Border for Better UX - No overlay to avoid hiding content */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded border-2 border-transparent transition-colors duration-200',
          'group-hover:border-orange-300 dark:group-hover:border-orange-500',
          isSelected && 'border-blue-400 dark:border-blue-500'
        )}
      />
    </div>
  );
};

export default EditableWrapper;
