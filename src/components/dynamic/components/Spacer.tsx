/**
 * Spacer Component
 * Adds vertical or horizontal spacing between components
 */

import { cn } from '@/lib/utils';
import React from 'react';

export interface SpacerProps {
  height?: number;
  width?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

const Spacer: React.FC<SpacerProps> = ({
  height = 40,
  width,
  direction = 'vertical',
  className,
}) => {
  const styles =
    direction === 'vertical' ? { height: `${height}px` } : { width: width ? `${width}px` : '100%' };

  return <div className={cn('spacer', className)} style={styles} aria-hidden="true" />;
};

export default Spacer;
