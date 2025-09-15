/**
 * Editable Components Plugin for Lexical Editor
 * Handles insertion and management of custom components
 */
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, $insertNodes, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { useEffect } from 'react';
import {
  $createEditableComponentNode,
  ComponentConfig,
  EditableComponentNode,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from '../nodes/EditableComponentNode';

export function EditableComponentsPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EditableComponentNode])) {
      throw new Error('EditableComponentsPlugin: EditableComponentNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<ComponentConfig>(
        INSERT_EDITABLE_COMPONENT_COMMAND,
        payload => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const componentNode = $createEditableComponentNode(payload);
            $insertNodes([componentNode]);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
