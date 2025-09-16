/**
 * ComponentWrapper
 * Wrapper que maneja automáticamente la funcionalidad de edición en modo editor
 * Evita el acoplamiento del modal y lógica de edición dentro de los componentes
 */

'use client';

import { ReactElement, useState } from 'react';
import { ComponentEditModal } from './ComponentEditModal';

// =============================================================================
// TYPES
// =============================================================================

interface ComponentWrapperProps {
  /**
   * El componente a renderizar
   */
  children: ReactElement;
  /**
   * Tipo de componente para la edición
   */
  componentType: string;
  /**
   * Props actuales del componente
   */
  componentProps: Record<string, unknown>;
  /**
   * Callback cuando las props cambian
   */
  onPropsChange: (newProps: Record<string, unknown>) => void;
  /**
   * ID único del nodo en el editor
   */
  nodeKey?: string;
  /**
   * Si está en modo editor (por defecto detecta automáticamente)
   */
  isEditorMode?: boolean;
}

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

export function ComponentWrapper({
  children,
  componentType,
  componentProps,
  onPropsChange,
  nodeKey,
  isEditorMode = true, // Por defecto asumimos que si se usa el wrapper, es modo editor
}: ComponentWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Si no estamos en modo editor, renderizar directamente el componente
  if (!isEditorMode) {
    return children;
  }

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = (newProps: Record<string, unknown>) => {
    // Actualizar las props del componente
    onPropsChange(newProps);

    // Disparar evento global para que el editor se actualice
    if (nodeKey) {
      window.dispatchEvent(
        new CustomEvent('component-update', {
          detail: {
            nodeKey,
            newProps,
            componentType,
          },
        })
      );
    }

    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Wrapper con overlay para edición */}
      <div className="group relative">
        {/* Componente original */}
        {children}

        {/* Overlay de edición (solo visible en hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 bg-blue-500/10 ring-2 ring-blue-500 ring-offset-2" />
          <button
            onClick={handleEdit}
            className="relative z-10 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title={`Edit ${componentType}`}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      <ComponentEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        componentType={componentType}
        currentProps={componentProps}
        onSave={handleSave}
      />
    </>
  );
}

export default ComponentWrapper;
