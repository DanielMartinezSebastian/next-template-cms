/**
 * Hook para detectar si estamos en modo editor
 * Permite usar componentes de forma transparente en producción y editor
 */

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

// =============================================================================
// HOOK
// =============================================================================

export function useEditorMode(): boolean {
  const pathname = usePathname();

  const isEditorMode = useMemo(() => {
    // Detectar si estamos en rutas del editor
    return (
      pathname.includes('/admin/editor') ||
      pathname.includes('/visual-editor') ||
      // Agregar otras rutas de editor según sea necesario
      false
    );
  }, [pathname]);

  return isEditorMode;
}

export default useEditorMode;
