/**
 * Image Component
 * A simple image component with configurable properties for src, alt, dimensions, and fit
 */

import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import React from 'react';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  priority?: boolean;
}

const Image: React.FC<ImageProps> = ({
  src = 'https://images.placeholders.dev/800x600?text=Image&bgColor=%236b7280&textColor=%23ffffff',
  alt = 'Image description',
  width = 800,
  height = 600,
  fit = 'cover',
  className,
  priority = false,
}) => {
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full"
        style={{
          objectFit: fit,
        }}
        priority={priority}
        unoptimized={src.includes('placeholders.dev')} // Disable optimization for placeholder images
      />
    </div>
  );
};

export default Image;
