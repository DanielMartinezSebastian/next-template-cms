/**
 * Component Registry Initialization
 * Ensures the registry is properly initialized for the application
 */

import { initializeComponentSystem } from './index';

// Initialize the component registry system
let initialized = false;

export async function ensureRegistryInitialized() {
  if (initialized) return;
  
  try {
    await initializeComponentSystem();
    initialized = true;
    console.log('[ComponentRegistry] System initialized successfully');
  } catch (error) {
    console.error('[ComponentRegistry] Failed to initialize:', error);
    // Continue without database sync if needed
    initialized = true;
  }
}

// Auto-initialize in browser environments
if (typeof window !== 'undefined') {
  ensureRegistryInitialized();
}
