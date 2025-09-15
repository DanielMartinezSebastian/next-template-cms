/**
 * Unknown Component
 * Fallback for unregistered component types
 */

import React from 'react';

interface UnknownComponentProps {
  type?: string;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
  [key: string]: unknown;
}

export function UnknownComponent({
  type = 'unknown',
  locale = 'en',
  editMode = false,
  componentId,
  ...props
}: UnknownComponentProps) {
  if (!editMode) {
    // In production, don't render unknown components
    return null;
  }

  return (
    <div
      className="unknown-component rounded border border-orange-300 bg-orange-50 p-4 dark:border-orange-600 dark:bg-orange-950"
      data-component-id={componentId}
    >
      <div className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
        Unknown Component: {type}
      </div>
      
      <div className="mb-3 text-sm text-orange-700 dark:text-orange-300">
        This component type is not registered in the ComponentFactory. Available types can be viewed in the component library.
      </div>

      <div className="text-xs text-orange-600 dark:text-orange-400">
        <div>Component ID: {componentId || 'N/A'}</div>
        <div>Locale: {locale}</div>
      </div>

      {Object.keys(props).length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-medium text-orange-800 hover:text-orange-600 dark:text-orange-200 dark:hover:text-orange-300">
            Component Props
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-orange-100 p-2 text-xs text-orange-900 dark:bg-orange-900 dark:text-orange-100">
            {JSON.stringify(props, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default UnknownComponent;
