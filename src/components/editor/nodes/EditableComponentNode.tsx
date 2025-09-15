/**
 * Editable Component Node for Lexical Editor
 * Allows inserting and editing custom components within the editor
 */
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  createCommand,
} from 'lexical';
import Image from 'next/image';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { ComponentEditModal } from '../ComponentEditModal';

export type ComponentType =
  | 'button'
  | 'image'
  | 'card'
  | 'hero'
  | 'section'
  | 'grid'
  | 'text-block'
  | 'spacer';

export interface ComponentConfig {
  type: ComponentType;
  props: Record<string, string | number | boolean>;
  children?: ComponentConfig[];
  className?: string;
  id?: string;
}

export type SerializedEditableComponentNode = Spread<
  {
    componentConfig: ComponentConfig;
    componentType: ComponentType;
  },
  SerializedLexicalNode
>;

export const INSERT_EDITABLE_COMPONENT_COMMAND: LexicalCommand<ComponentConfig> = createCommand(
  'INSERT_EDITABLE_COMPONENT_COMMAND'
);

export class EditableComponentNode extends DecoratorNode<ReactElement> {
  __componentConfig: ComponentConfig;

  static getType(): string {
    return 'editable-component';
  }

  static clone(node: EditableComponentNode): EditableComponentNode {
    return new EditableComponentNode(node.__componentConfig, node.__key);
  }

  constructor(componentConfig: ComponentConfig, key?: NodeKey) {
    super(key);
    this.__componentConfig = componentConfig;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editable-component-wrapper relative group';
    div.setAttribute('data-component-type', this.__componentConfig.type);
    return div;
  }

  updateDOM(): false {
    return false;
  }

  setComponentConfig(componentConfig: ComponentConfig): void {
    const writableNode = this.getWritable();
    writableNode.__componentConfig = componentConfig;
  }

  getComponentConfig(): ComponentConfig {
    return this.getLatest().__componentConfig;
  }

  getTextContent(): string {
    return `[${this.__componentConfig.type} Component]`;
  }

  static importJSON(serializedNode: SerializedEditableComponentNode): EditableComponentNode {
    const { componentConfig } = serializedNode;
    return $createEditableComponentNode(componentConfig);
  }

  exportJSON(): SerializedEditableComponentNode {
    return {
      componentConfig: this.__componentConfig,
      componentType: this.__componentConfig.type,
      type: 'editable-component',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        const element = node as HTMLElement;
        if (element.hasAttribute('data-component-type')) {
          return {
            conversion: convertEditableComponentElement,
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-component-type', this.__componentConfig.type);
    element.className = 'editable-component-wrapper';
    return { element };
  }

  decorate(): ReactElement {
    return <EditableComponentComponent config={this.__componentConfig} nodeKey={this.__key} />;
  }

  isInline(): boolean {
    const inlineTypes: ComponentType[] = ['button', 'image'];
    return inlineTypes.includes(this.__componentConfig.type);
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

function convertEditableComponentElement(): DOMConversionOutput {
  return { node: $createEditableComponentNode({ type: 'text-block', props: {} }) };
}

export function $createEditableComponentNode(
  componentConfig: ComponentConfig
): EditableComponentNode {
  return new EditableComponentNode(componentConfig);
}

export function $isEditableComponentNode(
  node: LexicalNode | null | undefined
): node is EditableComponentNode {
  return node instanceof EditableComponentNode;
}

// Component renderer
interface EditableComponentComponentProps {
  config: ComponentConfig;
  nodeKey?: NodeKey;
}

function EditableComponentComponent({ config, nodeKey }: EditableComponentComponentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const componentId = nodeKey || config.id || `component-${config.type}-${Date.now()}`;

  const handleComponentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Component click will be handled by parent editor
    const event = new CustomEvent('component-selected', {
      detail: { componentId, type: config.type },
    });
    window.dispatchEvent(event);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Emit delete event
    const event = new CustomEvent('component-delete', {
      detail: { componentId, nodeKey, type: config.type },
    });
    window.dispatchEvent(event);
  };

  const handleSaveProps = (newProps: Record<string, unknown>) => {
    // Update component configuration
    const updatedConfig: ComponentConfig = {
      ...config,
      props: newProps as Record<string, string | number | boolean>,
    };

    // Emit update event
    const event = new CustomEvent('component-update', {
      detail: {
        componentId,
        nodeKey,
        type: config.type,
        newConfig: updatedConfig,
      },
    });
    window.dispatchEvent(event);
  };

  const renderComponent = () => {
    switch (config.type) {
      case 'button':
        return (
          <button
            className={`bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 ${config.className || ''}`}
            {...config.props}
          >
            {config.props.text || 'Button'}
          </button>
        );

      case 'image':
        return (
          <Image
            className={`h-auto max-w-full rounded-lg ${config.className || ''}`}
            src={String(config.props.src) || '/placeholder.svg'}
            alt={String(config.props.alt) || 'Image'}
            width={Number(config.props.width) || 400}
            height={Number(config.props.height) || 300}
          />
        );

      case 'card':
        return (
          <div className={`bg-card border-border rounded-lg border p-6 ${config.className || ''}`}>
            <h3 className="text-card-foreground mb-2 text-lg font-semibold">
              {config.props.title || 'Card Title'}
            </h3>
            <p className="text-muted-foreground">
              {config.props.content || 'Card content goes here...'}
            </p>
          </div>
        );

      case 'hero':
        return (
          <div
            className={`from-primary to-secondary text-primary-foreground rounded-lg bg-gradient-to-r px-8 py-16 text-center ${config.className || ''}`}
          >
            <h1 className="mb-4 text-4xl font-bold">{config.props.title || 'Hero Title'}</h1>
            <p className="text-xl opacity-90">
              {config.props.subtitle || 'Hero subtitle goes here...'}
            </p>
          </div>
        );

      case 'section':
        return (
          <section className={`py-8 ${config.className || ''}`}>
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              {config.props.title || 'Section Title'}
            </h2>
            <div className="text-muted-foreground">
              {config.props.content || 'Section content...'}
            </div>
          </section>
        );

      case 'spacer':
        return (
          <div
            className={`bg-transparent ${config.className || ''}`}
            style={{ height: String(config.props.height) || '2rem' }}
          />
        );

      case 'text-block':
      default:
        return (
          <div className={`text-foreground ${config.className || ''}`}>
            {config.props.content || 'Text block content...'}
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="editable-component group relative cursor-pointer"
        onClick={handleComponentClick}
      >
        {/* Edit overlay */}
        <div className="bg-primary/10 border-primary pointer-events-none absolute inset-0 rounded border-2 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="bg-primary text-primary-foreground absolute -top-6 left-0 rounded px-2 py-1 text-xs">
            {config.type}
          </div>

          {/* Component controls */}
          <div className="absolute -top-6 right-0 flex gap-1">
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/80 pointer-events-auto rounded px-2 py-1 text-xs transition-colors"
              onClick={handleEdit}
              title={`Edit ${config.type} component`}
            >
              Edit
            </button>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 pointer-events-auto rounded px-2 py-1 text-xs transition-colors"
              onClick={handleDelete}
              title={`Delete ${config.type} component`}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Component content */}
        {renderComponent()}
      </div>

      {/* Generic Edit Modal */}
      <ComponentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        componentType={config.type}
        currentProps={config.props}
        onSave={handleSaveProps}
      />
    </>
  );
}
