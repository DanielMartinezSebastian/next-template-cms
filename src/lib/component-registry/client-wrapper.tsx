/**
 * Client Wrapper for Conditional Client-Side Rendering
 * Only activates 'use client' when editMode is true
 */

'use client';

import React, { ComponentType } from 'react';

// =============================================================================
// CLIENT WRAPPER COMPONENT
// =============================================================================

/**
 * Wrapper that runs in client context
 * Only used when editMode is enabled
 */
export function ClientWrapper<P extends Record<string, unknown>>({
  Component,
  props,
}: {
  Component: ComponentType<P>;
  props: P;
}) {
  return <Component {...props} />;
}

// =============================================================================
// CONDITIONAL CLIENT HOC
// =============================================================================

/**
 * Higher-order component that conditionally enables client-side rendering
 * Returns Client Component when editMode=true, Server Component otherwise
 */
export function withConditionalClient<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>
) {
  return function ConditionalComponent(props: P & { editMode?: boolean }) {
    const { editMode = false, ...componentProps } = props;
    
    // Only use Client Wrapper in edit mode
    if (editMode) {
      return (
        <ClientWrapper
          Component={WrappedComponent}
          props={componentProps as P}
        />
      );
    }
    
    // SSR by default in production
    return <WrappedComponent {...(componentProps as P)} />;
  };
}

// =============================================================================
// EDIT MODE DETECTION UTILITIES
// =============================================================================

/**
 * Detect if we're in edit mode based on various factors
 */
export function detectEditMode(): boolean {
  // Server-side: always false (SSR)
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Client-side: check pathname
  const pathname = window.location.pathname;
  
  // Edit mode if we're in admin/editor routes
  return (
    pathname.includes('/admin/editor') ||
    pathname.includes('/admin/components') ||
    pathname.includes('/editable-components-test')
  );
}

/**
 * Hook to get current edit mode status (client-side only)
 */
export function useEditMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return detectEditMode();
}
