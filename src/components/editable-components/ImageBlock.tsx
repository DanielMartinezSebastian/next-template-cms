/**
 * Image Block Component
 * Simple component to display images with optional caption
 */

import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import React from 'react';
import { z } from 'zod';

// Schema definition
const ImageBlockSchema = z.object({
  src: z.string().url('Debe ser una URL válida'),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().min(100).max(2000),
  height: z.number().min(100).max(2000),
  alignment: z.enum(['left', 'center', 'right']),
  variant: z.enum(['default', 'rounded', 'circle']),
  showCaption: z.boolean(),
});

interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  alignment: 'left' | 'center' | 'right';
  variant: 'default' | 'rounded' | 'circle';
  showCaption: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  src,
  alt,
  caption,
  width,
  height,
  alignment,
  variant,
  showCaption,
  componentId,
  editMode,
}) => {
  const alignmentClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  };

  const variantClasses = {
    default: '',
    rounded: 'rounded-lg overflow-hidden',
    circle: 'rounded-full overflow-hidden',
  };

  const aspectRatio = width / height;
  const maxWidth = Math.min(width, 800);
  const calculatedHeight = maxWidth / aspectRatio;

  return (
    <div
      className={cn(
        'image-block relative flex flex-col',
        alignmentClasses[alignment]
      )}
      data-component-id={componentId}
    >
      <div
        className={cn(
          'relative',
          variantClasses[variant]
        )}
        style={{
          width: maxWidth,
          height: calculatedHeight,
        }}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized={src.includes('placeholders.dev')}
        />
      </div>

      {showCaption && caption && (
        <div className="mt-3 text-sm text-gray-600 italic">
          {caption}
        </div>
      )}

      {editMode && (
        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
          Image Block
        </div>
      )}
    </div>
  );
};

// Export with withEditableSSR
export default withEditableSSR(ImageBlockComponent, {
  metadata: {
    category: 'content',
    description: 'Bloque de imagen con caption opcional y estilos personalizables',
    icon: '🖼️',
    tags: ['image', 'media', 'visual', 'content'],
  },
  schema: ImageBlockSchema,
  defaultProps: {
    src: 'https://images.placeholders.dev/600x400?text=Imagen%20de%20ejemplo&bgColor=%234f46e5&textColor=%23ffffff',
    alt: 'Imagen de ejemplo',
    caption: 'Esta es una imagen de ejemplo con su descripción correspondiente.',
    width: 600,
    height: 400,
    alignment: 'center',
    variant: 'rounded',
    showCaption: true,
  },
  validateInDev: true,
});

export { ImageBlockSchema };
export type { ImageBlockProps };