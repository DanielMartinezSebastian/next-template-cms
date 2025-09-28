/**
 * Component Registry Initializer
 *
 * This module initializes all editable components by importing them,
 * which triggers their auto-registration via withEditableSSR.
 *
 * IMPORTANT: This must be imported early in the application lifecycle
 * to ensure components are available when needed.
 */

import { componentRegistry } from './registry';

// Import all editable components to trigger auto-registration
import '@/components/editable-components/ButtonMigrated';
import '@/components/editable-components/CallToActionMigrated';
import '@/components/editable-components/CardMigrated';
import '@/components/editable-components/EditableButton';
import '@/components/editable-components/HeroSectionMigrated';
import '@/components/editable-components/TextBlockMigrated';

/**
 * Initialize the component registry
 * This function should be called early in the application lifecycle
 */
export function initializeComponents(): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ComponentRegistry] Initializing components...');
  }

  // The imports above have already triggered registration
  // This function serves as an explicit initialization point

  const stats = componentRegistry.getStats();

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[ComponentRegistry] Initialization complete: ${stats.total} components registered`
    );
    console.warn('[ComponentRegistry] Available components:', componentRegistry.getNames());
  }
}

/**
 * Get initialization status
 */
export function getInitializationStats() {
  return componentRegistry.getStats();
}

/**
 * Auto-initialize on module load (for convenience)
 * This ensures components are available even if initializeComponents() isn't called
 */
initializeComponents();

export default initializeComponents;
