import {
  $getNodeByKey,
  createCommand,
  DecoratorNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalCommand,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import React from 'react';

import { ComponentFactory } from '@/components/dynamic/ComponentFactory';
import { EditableComponent } from '@/components/editor/EditableComponent';
import type { ComponentProps, ComponentType } from '@/types/components';

export type SerializedDynamicComponentNode = Spread<
  {
    componentType: ComponentType;
    componentProps: ComponentProps;
    isEditable?: boolean;
  },
  SerializedLexicalNode
>;

// Command payload type for inserting dynamic components
export interface DynamicComponentPayload {
  componentType: ComponentType;
  componentProps?: ComponentProps;
  isEditable?: boolean;
}

// Command for inserting dynamic components
export const INSERT_DYNAMIC_COMPONENT_COMMAND: LexicalCommand<DynamicComponentPayload> =
  createCommand('INSERT_DYNAMIC_COMPONENT_COMMAND');

/**
 * DynamicComponentNode - Integra ComponentFactory con Lexical DecoratorNode
 *
 * Esta clase hace bridge entre:
 * - Sistema de componentes dinámicos (ComponentFactory)
 * - Editor visual de Lexical (DecoratorNode)
 *
 * Permite insertar cualquier componente del ComponentFactory en el editor
 * manteniendo todas sus props y funcionalidades completas.
 */
export class DynamicComponentNode extends DecoratorNode<React.JSX.Element> {
  __componentType: ComponentType;
  __componentProps: ComponentProps;
  __isEditable: boolean;

  static getType(): string {
    return 'dynamic-component';
  }

  static clone(node: DynamicComponentNode): DynamicComponentNode {
    return new DynamicComponentNode(
      node.__componentType,
      node.__componentProps,
      node.__isEditable,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedDynamicComponentNode): DynamicComponentNode {
    const { componentType, componentProps, isEditable = true } = serializedNode;

    return new DynamicComponentNode(componentType, componentProps, isEditable);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (domNode.hasAttribute('data-lexical-dynamic-component')) {
          const componentType = domNode.getAttribute('data-component-type') as ComponentType;
          const componentPropsStr = domNode.getAttribute('data-component-props');

          if (componentType && componentPropsStr) {
            try {
              const componentProps = JSON.parse(componentPropsStr);
              return {
                conversion: () => ({
                  node: $createDynamicComponentNode(componentType, componentProps),
                }),
                priority: 1,
              };
            } catch (error) {
              console.error('Error parsing component props during import:', error);
            }
          }
        }
        return null;
      },
    };
  }

  constructor(
    componentType: ComponentType,
    componentProps: ComponentProps = {},
    isEditable: boolean = true,
    key?: NodeKey
  ) {
    super(key);
    this.__componentType = componentType;
    this.__componentProps = componentProps;
    this.__isEditable = isEditable;
  }

  exportJSON(): SerializedDynamicComponentNode {
    return {
      ...super.exportJSON(),
      componentType: this.__componentType,
      componentProps: this.__componentProps,
      isEditable: this.__isEditable,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-dynamic-component', 'true');
    element.setAttribute('data-component-type', this.__componentType);
    element.setAttribute('data-component-props', JSON.stringify(this.__componentProps));

    return { element };
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'dynamic-component-wrapper';

    // Agregar atributos para debugging y selección
    div.setAttribute('data-lexical-dynamic-component', 'true');
    div.setAttribute('data-component-type', this.__componentType);

    return div;
  }

  updateDOM(): boolean {
    // Los DecoratorNodes no necesitan actualizaciones de DOM directas
    // El componente React se actualiza automáticamente vía React.createPortal
    return false;
  }

  getComponentType(): ComponentType {
    return this.getLatest().__componentType;
  }

  setComponentType(componentType: ComponentType): this {
    const writable = this.getWritable();
    writable.__componentType = componentType;
    return writable;
  }

  getComponentProps(): ComponentProps {
    return this.getLatest().__componentProps;
  }

  setComponentProps(componentProps: ComponentProps): this {
    const writable = this.getWritable();
    writable.__componentProps = componentProps;
    return writable;
  }

  updateComponentProps(partialProps: Partial<ComponentProps>): this {
    const writable = this.getWritable();
    writable.__componentProps = {
      ...writable.__componentProps,
      ...partialProps,
    };
    return writable;
  }

  getIsEditable(): boolean {
    return this.getLatest().__isEditable;
  }

  setIsEditable(isEditable: boolean): this {
    const writable = this.getWritable();
    writable.__isEditable = isEditable;
    return writable;
  }

  isInline(): boolean {
    // La mayoría de nuestros componentes son de bloque
    // Solo algunos como text-inline podrían ser inline
    return this.__componentType === 'text-inline';
  }

  /**
   * Método principal: renderiza el componente usando ComponentFactory + EditableComponent
   */
  decorate(editor: LexicalEditor, config: EditorConfig): React.JSX.Element {
    try {
      // Obtener el componente del factory
      const Component = ComponentFactory.getComponent(this.__componentType);

      if (!Component) {
        return (
          <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Componente no encontrado</p>
            <p className="text-sm">Tipo: {this.__componentType}</p>
          </div>
        );
      }

      // Función que actualiza las props del componente en el editor
      const handlePropsChange = (newProps: Record<string, unknown>) => {
        editor.update(() => {
          const nodeKey = this.getKey();
          const node = $getDynamicComponentNodeByKey(nodeKey);
          if (node) {
            node.setComponentProps(newProps as ComponentProps);
          }
        });
      };

      // Usar EditableComponent para manejar automáticamente el modo editor
      return (
        <EditableComponent
          componentType={this.__componentType}
          componentProps={this.__componentProps}
          onPropsChange={handlePropsChange}
          nodeKey={this.getKey()}
        >
          {props => <Component {...props} />}
        </EditableComponent>
      );
    } catch (error) {
      console.error(`Error rendering component ${this.__componentType}:`, error);

      return (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error renderizando componente</p>
          <p className="text-sm">Tipo: {this.__componentType}</p>
          <p className="mt-1 text-xs">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      );
    }
  }

  getTextContent(): string {
    // Para búsqueda y accesibilidad, extraer texto del componente
    try {
      const props = this.__componentProps;

      // Extraer texto común de diferentes tipos de componentes
      const textSources = [
        props.title,
        props.content,
        props.text,
        props.description,
        props.heading,
        props.subtitle,
        props.label,
        Array.isArray(props.items)
          ? props.items
              .map((item: Record<string, unknown>) =>
                typeof item === 'string' ? item : item?.title || item?.text || ''
              )
              .join(' ')
          : '',
      ].filter(Boolean);

      return textSources.join(' ').trim();
    } catch {
      return '';
    }
  }
}

/**
 * Función helper para crear DynamicComponentNode
 */
export function $createDynamicComponentNode(
  componentType: ComponentType,
  componentProps: ComponentProps = {},
  isEditable: boolean = true
): DynamicComponentNode {
  return new DynamicComponentNode(componentType, componentProps, isEditable);
}

/**
 * Función helper para verificar si un nodo es DynamicComponentNode
 */
export function $isDynamicComponentNode(
  node: LexicalNode | null | undefined
): node is DynamicComponentNode {
  return node instanceof DynamicComponentNode;
}

/**
 * Función helper para obtener DynamicComponentNode por key
 */
export function $getDynamicComponentNodeByKey(key: NodeKey): DynamicComponentNode | null {
  const node = $getNodeByKey(key);
  return $isDynamicComponentNode(node) ? node : null;
}

// Re-exportar desde el barrel
export { DynamicComponentNode as default };
