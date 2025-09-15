/**
 * Toolbar Plugin for Lexical Editor
 * Provides formatting controls and component insertion
 */
'use client';

import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import {
  ComponentConfig,
  ComponentType,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from '../nodes/EditableComponentNode';

interface ToolbarPluginProps {
  className?: string;
}

export function ToolbarPlugin({ className = '' }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isEditable, setIsEditable] = useState(true);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const formats = new Set<string>();

      if (selection.hasFormat('bold')) formats.add('bold');
      if (selection.hasFormat('italic')) formats.add('italic');
      if (selection.hasFormat('underline')) formats.add('underline');
      if (selection.hasFormat('strikethrough')) formats.add('strikethrough');
      if (selection.hasFormat('code')) formats.add('code');

      setActiveFormats(formats);
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerEditableListener(editable => {
        setIsEditable(editable);
      })
    );
  }, [editor, updateToolbar]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([$createHeadingNode(headingSize)]);
      }
    });
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([$createQuoteNode()]);
      }
    });
  };

  const insertList = (listType: 'ul' | 'ol') => {
    if (listType === 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertComponent = (type: ComponentType) => {
    const componentConfig: ComponentConfig = {
      type,
      props: getDefaultPropsForComponent(type),
    };

    editor.dispatchCommand(INSERT_EDITABLE_COMPONENT_COMMAND, componentConfig);
  };

  const getDefaultPropsForComponent = (
    type: ComponentType
  ): Record<string, string | number | boolean> => {
    switch (type) {
      case 'button':
        return { text: 'Click me', variant: 'default' };
      case 'image':
        return {
          src: '/placeholder.svg',
          alt: 'Placeholder image',
          width: 400,
          height: 300,
        };
      case 'card':
        return {
          title: 'Card Title',
          content: 'Card content goes here...',
        };
      case 'hero':
        return {
          title: 'Hero Section',
          subtitle: 'Amazing hero section',
        };
      case 'section':
        return {
          title: 'Section Title',
          content: 'Section content...',
        };
      case 'spacer':
        return { height: '2rem' };
      case 'text-block':
      default:
        return { content: 'Text content...' };
    }
  };

  if (!isEditable) {
    return null;
  }

  return (
    <div className={`border-border bg-card flex flex-wrap gap-2 border-b p-4 ${className}`}>
      {/* Text Formatting */}
      <div className="border-border flex gap-1 border-r pr-2">
        <Button
          variant={activeFormats.has('bold') ? 'default' : 'outline'}
          size="sm"
          onClick={() => formatText('bold')}
          className="px-2"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </Button>
        <Button
          variant={activeFormats.has('italic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => formatText('italic')}
          className="px-2"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </Button>
        <Button
          variant={activeFormats.has('underline') ? 'default' : 'outline'}
          size="sm"
          onClick={() => formatText('underline')}
          className="px-2"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </Button>
        <Button
          variant={activeFormats.has('strikethrough') ? 'default' : 'outline'}
          size="sm"
          onClick={() => formatText('strikethrough')}
          className="px-2"
          title="Strikethrough"
        >
          <s>S</s>
        </Button>
        <Button
          variant={activeFormats.has('code') ? 'default' : 'outline'}
          size="sm"
          onClick={() => formatText('code')}
          className="px-2"
          title="Inline Code"
        >
          &lt;/&gt;
        </Button>
      </div>

      {/* Headings */}
      <div className="border-border flex gap-1 border-r pr-2">
        <Button variant="outline" size="sm" onClick={() => insertHeading('h1')} title="Heading 1">
          H1
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertHeading('h2')} title="Heading 2">
          H2
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertHeading('h3')} title="Heading 3">
          H3
        </Button>
      </div>

      {/* Lists and Quote */}
      <div className="border-border flex gap-1 border-r pr-2">
        <Button variant="outline" size="sm" onClick={() => insertList('ul')} title="Bullet List">
          •••
        </Button>
        <Button variant="outline" size="sm" onClick={() => insertList('ol')} title="Numbered List">
          123
        </Button>
        <Button variant="outline" size="sm" onClick={insertQuote} title="Quote">
          &ldquo; &rdquo;
        </Button>
      </div>

      {/* Components */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('button')}
          title="Insert Button"
        >
          Button
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('image')}
          title="Insert Image"
        >
          🖼️
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('card')}
          title="Insert Card"
        >
          📄
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('hero')}
          title="Insert Hero"
        >
          🎯
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('section')}
          title="Insert Section"
        >
          📑
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertComponent('spacer')}
          title="Insert Spacer"
        >
          ⬜
        </Button>
      </div>
    </div>
  );
}
