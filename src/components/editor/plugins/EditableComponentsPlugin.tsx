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
  $createContainerNode,
  ContainerConfig,
  ContainerNode,
  INSERT_CONTAINER_COMMAND,
} from '../nodes/ContainerNode';
import {
  $createEditableComponentNode,
  ComponentConfig,
  EditableComponentNode,
  INSERT_EDITABLE_COMPONENT_COMMAND,
} from '../nodes/EditableComponentNode';

export function EditableComponentsPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EditableComponentNode, ContainerNode])) {
      throw new Error(
        'EditableComponentsPlugin: EditableComponentNode or ContainerNode not registered on editor'
      );
    }

    return mergeRegister(
      // Component insertion command
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
      ),

      // Container insertion command
      editor.registerCommand<ContainerConfig>(
        INSERT_CONTAINER_COMMAND,
        payload => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const containerNode = $createContainerNode(payload);
            $insertNodes([containerNode]);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
