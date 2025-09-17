/**
 * Loading Component
 * Shows loading state for dynamic components
 */

import React from 'react';

interface LoadingComponentProps {
  type: string;
  editMode?: boolean;
  className?: string;
}

export function LoadingComponent({
  type,
  editMode = false,
  className = '',
}: LoadingComponentProps) {
  if (editMode) {
    return (
      <div
        className={`loading-component rounded border border-blue-300 bg-blue-50 p-4 dark:border-blue-600 dark:bg-blue-950 ${className}`}
      >
        <div className="animate-pulse">
          <div className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Loading {type} component...
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-blue-200 dark:bg-blue-800"></div>
            <div className="h-4 w-1/2 rounded bg-blue-200 dark:bg-blue-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-component animate-pulse ${className}`}>
      <div className="space-y-3">
        {/* Generic loading skeleton */}
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

// Specific loading states for different component types
export function HeroLoadingComponent({ className = '' }: { className?: string }) {
  return (
    <div className={`hero-loading animate-pulse ${className}`}>
      <div className="h-64 w-full rounded bg-gray-200 md:h-96 dark:bg-gray-700">
        <div className="flex h-full items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="h-8 w-64 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-48 rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImageGalleryLoadingComponent({ className = '' }: { className?: string }) {
  return (
    <div className={`gallery-loading animate-pulse ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 rounded bg-gray-200 dark:bg-gray-700"></div>
        ))}
      </div>
    </div>
  );
}

export function FormLoadingComponent({ className = '' }: { className?: string }) {
  return (
    <div className={`form-loading animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

// Factory function for component-specific loading states
export function getLoadingComponent(type: string, editMode: boolean = false) {
  const normalizedType = type.toLowerCase();

  switch (normalizedType) {
    case 'hero':
    case 'hero-section':
      return <HeroLoadingComponent />;

    case 'image':
    case 'image-gallery':
    case 'gallery':
      return <ImageGalleryLoadingComponent />;

    case 'form':
    case 'contact-form':
    case 'contact':
      return <FormLoadingComponent />;

    default:
      return <LoadingComponent type={type} editMode={editMode} />;
  }
}

export default LoadingComponent;
