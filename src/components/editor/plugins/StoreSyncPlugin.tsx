/**
 * Store Sync Plugin for Lexical Editor
 * Synchronizes editor state with edit mode store
 */
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useEffect } from 'react';
import { useEditModeActions, useEditModeEnabled } from '../../../stores';

export function StoreSyncPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const { addHistoryAction } = useEditModeActions();
  const isEditMode = useEditModeEnabled();

  useEffect(() => {
    if (!isEditMode) return;

    return mergeRegister(
      // Track selection changes for store integration
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // Track selection change in edit mode store
              addHistoryAction({
                type: 'update',
                componentId: 'editor-selection',
                newValue: {
                  anchor: selection.anchor.offset,
                  focus: selection.focus.offset,
                },
              });
            }
          });
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, addHistoryAction, isEditMode]);

  return null;
}

export default StoreSyncPlugin;
