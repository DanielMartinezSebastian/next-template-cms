/**
 * Editable Components Plugin for Lexical Editor
 * Handles insertion, updating, and deletion of custom components
 */
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  NodeKey,
} from 'lexical';
import { useEffect } from 'react';
import {
  $createContainerNode,
  ContainerConfig,
  ContainerNode,
  INSERT_CONTAINER_COMMAND,
} from '../nodes/ContainerNode';
import {
  $createEditableComponentNode,
  $isEditableComponentNode,
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

    // Component event handlers
    const handleComponentUpdate = (event: CustomEvent) => {
      const { nodeKey, newConfig } = event.detail;

      editor.update(() => {
        const node = $getNodeByKey(nodeKey as NodeKey);
        if ($isEditableComponentNode(node)) {
          node.setComponentConfig(newConfig);
        }
      });
    };

    const handleComponentDelete = (event: CustomEvent) => {
      const { nodeKey } = event.detail;

      editor.update(() => {
        const node = $getNodeByKey(nodeKey as NodeKey);
        if (node) {
          node.remove();
        }
      });
    };

    // Register global event listeners
    window.addEventListener('component-update', handleComponentUpdate as EventListener);
    window.addEventListener('component-delete', handleComponentDelete as EventListener);

    const unregisterCommands = mergeRegister(
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

    // Cleanup function
    return () => {
      window.removeEventListener('component-update', handleComponentUpdate as EventListener);
      window.removeEventListener('component-delete', handleComponentDelete as EventListener);
      unregisterCommands();
    };
  }, [editor]);

  return null;
}
