/**
 * Text Block Component
 * Dynamic text content component
 */

import React from 'react';

interface TextBlockProps {
  content?: string;
  title?: string;
  subtitle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: 'small' | 'medium' | 'large';
  fontWeight?: 'normal' | 'medium' | 'bold';
  color?: string;
  backgroundColor?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: 'none' | 'prose' | 'container';
  allowHtml?: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function TextBlock({
  content = '',
  title = '',
  subtitle = '',
  textAlign = 'left',
  fontSize = 'medium',
  fontWeight = 'normal',
  color = '',
  backgroundColor = '',
  padding = 'medium',
  margin = 'medium',
  maxWidth = 'prose',
  allowHtml = false,
  locale = 'en',
  editMode = false,
  componentId,
}: TextBlockProps) {
  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[textAlign];

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  const fontWeightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  }[fontWeight];

  const paddingClass = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }[padding];

  const marginClass = {
    none: 'm-0',
    small: 'my-4',
    medium: 'my-6',
    large: 'my-8',
  }[margin];

  const maxWidthClass = {
    none: 'w-full',
    prose: 'max-w-prose mx-auto',
    container: 'max-w-6xl mx-auto',
  }[maxWidth];

  const customStyles: React.CSSProperties = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
  };

  return (
    <div
      className={`text-block ${paddingClass} ${marginClass}`}
      style={backgroundColor ? customStyles : undefined}
      data-component-id={componentId}
    >
      <div className={`${maxWidthClass} ${textAlignClass}`}>
        {title && (
          <h2 
            className={`mb-4 text-2xl font-bold ${color ? '' : 'text-foreground'}`}
            style={color ? { color } : undefined}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <h3 
            className={`mb-6 text-xl font-semibold ${color ? '' : 'text-muted-foreground'}`}
            style={color ? { color } : undefined}
          >
            {subtitle}
          </h3>
        )}

        {content && (
          <div
            className={`prose prose-gray dark:prose-invert ${fontSizeClass} ${fontWeightClass} ${textAlignClass} max-w-none`}
            style={color ? { color } : undefined}
          >
            {allowHtml ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="whitespace-pre-wrap">{content}</div>
            )}
          </div>
        )}

        {/* Empty state for edit mode */}
        {editMode && !content && !title && !subtitle && (
          <div className="rounded border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            <div className="text-lg font-medium">Empty Text Block</div>
            <div className="text-sm">Add title, subtitle, or content to this text block</div>
          </div>
        )}
      </div>

      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Text Block
        </div>
      )}
    </div>
  );
}

export default TextBlock;
