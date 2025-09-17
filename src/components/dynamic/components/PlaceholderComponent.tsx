/**
 * Placeholder Component
 * Used for development and testing
 */

import React from 'react';

interface PlaceholderComponentProps {
  title?: string;
  type?: string;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  showProps?: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
  [key: string]: unknown;
}

export function PlaceholderComponent({
  title = 'Placeholder Component',
  type = 'placeholder',
  height = 200,
  backgroundColor = 'bg-gray-100 dark:bg-gray-800',
  textColor = 'text-gray-600 dark:text-gray-400',
  showProps = false,
  locale = 'en',
  editMode = false,
  componentId,
  ...props
}: PlaceholderComponentProps) {
  const style = {
    minHeight: `${height}px`,
  };

  return (
    <div
      className={`placeholder-component flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 ${backgroundColor} dark:border-gray-600`}
      style={style}
      data-component-id={componentId}
    >
      <div className={`text-center ${textColor}`}>
        <div className="mb-2 text-xl font-semibold">{title}</div>
        <div className="text-sm">Component Type: {type}</div>

        {editMode && (
          <div className="mt-4 text-xs">
            <div>ID: {componentId || 'N/A'}</div>
            <div>Locale: {locale}</div>
            <div>Edit Mode: Active</div>
          </div>
        )}

        {showProps && Object.keys(props).length > 0 && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">Component Props</summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-200 p-2 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {JSON.stringify(props, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default PlaceholderComponent;
