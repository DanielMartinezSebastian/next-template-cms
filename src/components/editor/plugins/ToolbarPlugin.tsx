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
import { ContainerConfig, ContainerType, INSERT_CONTAINER_COMMAND } from '../nodes/ContainerNode';
import {
  ComponentConfig,
  ComponentType,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from '../nodes/EditableComponentNode';
import { HistoryControlsPlugin } from './HistoryControlsPlugin';

interface ToolbarPluginProps {
  className?: string;
  width?: number; // Width for responsive layout adjustments
}

export function ToolbarPlugin({ className = '', width }: ToolbarPluginProps) {
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

  const insertContainer = (type: ContainerType) => {
    const containerConfig: ContainerConfig = {
      type,
      props: getDefaultPropsForContainer(type),
      children: [],
    };

    editor.dispatchCommand(INSERT_CONTAINER_COMMAND, containerConfig);
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

  const getDefaultPropsForContainer = (
    type: ContainerType
  ): Record<string, string | number | boolean> => {
    switch (type) {
      case 'row':
        return { gap: '1rem', align: 'start' };
      case 'column':
        return { gap: '1rem', align: 'start' };
      case 'grid':
        return { columns: 2, gap: '1rem' };
      case 'section':
        return { title: 'New Section', padding: '2rem' };
      case 'card-container':
        return { padding: '1.5rem', shadow: true };
      default:
        return {};
    }
  };

  if (!isEditable) {
    return null;
  }

  return (
    <div
      className={`border-border bg-card flex flex-wrap gap-2 border-b p-4 ${className}`}
      style={{ width: width ? `${width - 32}px` : '100%' }} // Match parent width with padding
    >
      {/* History Controls */}
      <HistoryControlsPlugin className="border-border border-r pr-2" />

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
      <div className="border-border flex gap-1 border-r pr-2">
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

      {/* Containers */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertContainer('row')}
          title="Insert Row Container"
        >
          ↔️
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertContainer('column')}
          title="Insert Column Container"
        >
          ↕️
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertContainer('grid')}
          title="Insert Grid Container"
        >
          #️⃣
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertContainer('section')}
          title="Insert Section Container"
        >
          📦
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertContainer('card-container')}
          title="Insert Card Container"
        >
          🗃️
        </Button>
      </div>
    </div>
  );
}
