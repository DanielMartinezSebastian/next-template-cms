/**
 * Feature Grid Component
 * Displays features in a grid layout
 */

import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  columns?: 1 | 2 | 3 | 4;
  showIcons?: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function FeatureGrid({
  title = 'Features',
  subtitle = '',
  features = [],
  columns = 3,
  showIcons = true,
  locale = 'en',
  editMode = false,
  componentId,
}: FeatureGridProps) {
  const columnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className="feature-grid py-12" data-component-id={componentId}>
      <div className="mx-auto max-w-6xl px-4">
        {title && <h2 className="text-foreground mb-4 text-center text-3xl font-bold">{title}</h2>}

        {subtitle && <p className="text-muted-foreground mb-12 text-center text-lg">{subtitle}</p>}

        {features.length > 0 ? (
          <div className={`grid gap-8 ${columnsClass}`}>
            {features.map((feature, index) => (
              <div key={index} className="feature-item text-center">
                {showIcons && feature.icon && (
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full text-2xl">
                      {feature.icon}
                    </div>
                  </div>
                )}

                <h3 className="text-foreground mb-3 text-xl font-semibold">{feature.title}</h3>

                <p className="text-muted-foreground">{feature.description}</p>

                {feature.link && (
                  <a href={feature.link} className="text-primary mt-4 inline-block hover:underline">
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : editMode ? (
          <div className="rounded border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            <div className="text-lg font-medium">Empty Feature Grid</div>
            <div className="text-sm">Add features to display in this grid</div>
          </div>
        ) : null}

        {editMode && (
          <div className="mt-4 rounded bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
            Feature Grid • {features.length} features • {columns} columns
          </div>
        )}
      </div>
    </div>
  );
}

export default FeatureGrid;
