/**
 * Container Node for Lexical Editor
 * Allows creating layout containers that can hold other components
 */
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  createCommand,
} from 'lexical';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { ComponentEditModal } from '../ComponentEditModal';

export type ContainerType = 'row' | 'column' | 'grid' | 'section' | 'card-container';

export interface ContainerConfig {
  type: ContainerType;
  className?: string;
  children: string[]; // Array of child component IDs
  props: Record<string, string | number | boolean>;
}

export type SerializedContainerNode = Spread<
  {
    containerConfig: ContainerConfig;
    containerType: ContainerType;
  },
  SerializedLexicalNode
>;

export const INSERT_CONTAINER_COMMAND: LexicalCommand<ContainerConfig> = createCommand(
  'INSERT_CONTAINER_COMMAND'
);

export class ContainerNode extends DecoratorNode<ReactElement> {
  __containerConfig: ContainerConfig;

  static getType(): string {
    return 'container';
  }

  static clone(node: ContainerNode): ContainerNode {
    return new ContainerNode(node.__containerConfig, node.__key);
  }

  constructor(containerConfig: ContainerConfig, key?: NodeKey) {
    super(key);
    this.__containerConfig = containerConfig;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'container-wrapper relative group';
    div.setAttribute('data-container-type', this.__containerConfig.type);
    return div;
  }

  updateDOM(): false {
    return false;
  }

  setContainerConfig(containerConfig: ContainerConfig): void {
    const writableNode = this.getWritable();
    writableNode.__containerConfig = containerConfig;
  }

  getContainerConfig(): ContainerConfig {
    return this.getLatest().__containerConfig;
  }

  getTextContent(): string {
    return `[${this.__containerConfig.type} Container]`;
  }

  static importJSON(serializedNode: SerializedContainerNode): ContainerNode {
    const { containerConfig } = serializedNode;
    return $createContainerNode(containerConfig);
  }

  exportJSON(): SerializedContainerNode {
    return {
      containerConfig: this.__containerConfig,
      containerType: this.__containerConfig.type,
      type: 'container',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => {
        const element = node as HTMLElement;
        if (element.hasAttribute('data-container-type')) {
          return {
            conversion: convertContainerElement,
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-container-type', this.__containerConfig.type);
    element.className = 'container-wrapper';
    return { element };
  }

  decorate(): ReactElement {
    return <ContainerComponent config={this.__containerConfig} nodeKey={this.__key} />;
  }

  isInline(): boolean {
    return false; // Containers are always block-level
  }

  isKeyboardSelectable(): boolean {
    return true;
  }
}

function convertContainerElement(): DOMConversionOutput {
  return { node: $createContainerNode({ type: 'section', props: {}, children: [] }) };
}

export function $createContainerNode(containerConfig: ContainerConfig): ContainerNode {
  return new ContainerNode(containerConfig);
}

export function $isContainerNode(node: LexicalNode | null | undefined): node is ContainerNode {
  return node instanceof ContainerNode;
}

// Container renderer component
interface ContainerComponentProps {
  config: ContainerConfig;
  nodeKey?: NodeKey;
}

function ContainerComponent({ config, nodeKey }: ContainerComponentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const containerId = nodeKey || `container-${config.type}-${Date.now()}`;

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('container-selected', {
      detail: { containerId, type: config.type },
    });
    window.dispatchEvent(event);
  };

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Emit delete event
    const event = new CustomEvent('container-delete', {
      detail: { containerId, nodeKey, type: config.type },
    });
    window.dispatchEvent(event);
  };

  const handleSaveProps = (newProps: Record<string, unknown>) => {
    // Update container configuration
    const event = new CustomEvent('container-update', {
      detail: {
        containerId,
        nodeKey,
        type: config.type,
        props: newProps,
      },
    });
    window.dispatchEvent(event);
    setIsEditModalOpen(false);
  };

  const renderContainer = () => {
    const baseClasses =
      'min-h-[100px] border-2 border-dashed border-muted-foreground/30 rounded-lg p-4';

    switch (config.type) {
      case 'row':
        return (
          <div className={`flex gap-4 ${baseClasses} ${config.className || ''}`}>
            <div className="text-muted-foreground flex flex-1 items-center justify-center">
              Drag components here (Row Layout)
            </div>
          </div>
        );

      case 'column':
        return (
          <div className={`flex flex-col gap-4 ${baseClasses} ${config.className || ''}`}>
            <div className="text-muted-foreground flex flex-1 items-center justify-center">
              Drag components here (Column Layout)
            </div>
          </div>
        );

      case 'grid':
        return (
          <div
            className={`grid gap-4 ${baseClasses} ${config.className || ''}`}
            style={{
              gridTemplateColumns: `repeat(${config.props.columns || 2}, 1fr)`,
            }}
          >
            <div className="text-muted-foreground col-span-full flex items-center justify-center">
              Drag components here (Grid Layout - {config.props.columns || 2} columns)
            </div>
          </div>
        );

      case 'section':
        return (
          <section className={`${baseClasses} ${config.className || ''}`}>
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              {config.props.title || 'Section Title'}
            </h3>
            <div className="text-muted-foreground flex min-h-[60px] items-center justify-center">
              Drag components here
            </div>
          </section>
        );

      case 'card-container':
        return (
          <div className={`bg-card border-border rounded-lg border p-6 ${config.className || ''}`}>
            <div className="text-muted-foreground flex min-h-[80px] items-center justify-center">
              Drag components here (Card Container)
            </div>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} ${config.className || ''}`}>
            <div className="text-muted-foreground flex items-center justify-center">
              Container ({config.type})
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="container-node group relative cursor-pointer" onClick={handleContainerClick}>
        {/* Edit overlay */}
        <div className="pointer-events-none absolute inset-0 rounded border-2 border-blue-500 bg-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute -top-6 left-0 rounded bg-blue-500 px-2 py-1 text-xs text-white">
            {config.type} container
          </div>

          {/* Container controls */}
          <div className="absolute -top-6 right-0 flex gap-1">
            <button
              className="pointer-events-auto rounded bg-blue-500 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-600"
              onClick={handleConfigure}
              title={`Configure ${config.type} container`}
            >
              Configure
            </button>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 pointer-events-auto rounded px-2 py-1 text-xs transition-colors"
              onClick={handleDelete}
              title={`Delete ${config.type} container`}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Container content */}
        {renderContainer()}
      </div>

      {/* Edit Modal */}
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

export default ContainerNode;
