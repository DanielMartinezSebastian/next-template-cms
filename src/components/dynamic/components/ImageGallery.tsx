/**
 * Image Gallery Component
 * Dynamic image gallery component
 */

import React from 'react';

interface ImageItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images?: ImageItem[];
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  spacing?: 'small' | 'medium' | 'large';
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  showTitles?: boolean;
  showDescriptions?: boolean;
  lightbox?: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function ImageGallery({
  images = [],
  title = '',
  columns = 3,
  spacing = 'medium',
  aspectRatio = 'landscape',
  showTitles = false,
  showDescriptions = false,
  lightbox = false,
  locale = 'en',
  editMode = false,
  componentId,
}: ImageGalleryProps) {
  const columnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const spacingClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }[spacing];

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  }[aspectRatio];

  return (
    <div className="image-gallery py-6" data-component-id={componentId}>
      {title && <h2 className="text-foreground mb-6 text-center text-3xl font-bold">{title}</h2>}

      {images.length > 0 ? (
        <div className={`grid ${columnsClass} ${spacingClass}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="image-item group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <div className={`relative ${aspectRatio !== 'auto' ? aspectRatioClass : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    aspectRatio === 'auto' ? 'h-auto' : ''
                  }`}
                  loading="lazy"
                />

                {lightbox && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {(showTitles || showDescriptions) && (
                <div className="p-4">
                  {showTitles && image.title && (
                    <h3 className="text-foreground mb-2 font-semibold">{image.title}</h3>
                  )}
                  {showDescriptions && image.description && (
                    <p className="text-muted-foreground text-sm">{image.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : editMode ? (
        <div className="rounded border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
          <div className="text-lg font-medium">Empty Image Gallery</div>
          <div className="text-sm">Add images to display in this gallery</div>
        </div>
      ) : null}

      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Image Gallery ({images.length} images)
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
