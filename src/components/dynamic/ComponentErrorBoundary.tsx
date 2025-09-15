/**
 * Component Error Boundary
 * Gracefully handles component rendering errors
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ComponentConfig } from '@/types/pages';

interface Props {
  children: ReactNode;
  componentConfig: ComponentConfig;
  editMode?: boolean;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to monitoring service
    // logErrorToService(error, errorInfo, this.props.componentConfig);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Edit mode: Show detailed error
      if (this.props.editMode) {
        return (
          <div className="component-error rounded border border-red-300 bg-red-50 p-4 dark:border-red-600 dark:bg-red-950">
            <div className="mb-2 font-semibold text-red-900 dark:text-red-100">
              Component Error: {this.props.componentConfig.type}
            </div>
            
            <div className="mb-3 text-sm text-red-700 dark:text-red-300">
              <div><strong>Component ID:</strong> {this.props.componentConfig.id}</div>
              <div><strong>Order:</strong> {this.props.componentConfig.order}</div>
            </div>

            {this.state.error && (
              <div className="mb-3">
                <div className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Message:
                </div>
                <div className="rounded bg-red-100 p-2 text-sm font-mono text-red-900 dark:bg-red-900 dark:text-red-100">
                  {this.state.error.message}
                </div>
              </div>
            )}

            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-red-800 hover:text-red-600 dark:text-red-200 dark:hover:text-red-300">
                Component Props
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900 dark:bg-red-900 dark:text-red-100">
                {JSON.stringify(this.props.componentConfig.props, null, 2)}
              </pre>
            </details>

            {this.state.errorInfo && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium text-red-800 hover:text-red-600 dark:text-red-200 dark:hover:text-red-300">
                  Stack Trace
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-900 dark:bg-red-900 dark:text-red-100">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            >
              Retry Component
            </button>
          </div>
        );
      }

      // Production mode: Show minimal error or hide component
      return (
        <div className="component-error-fallback rounded border border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Content temporarily unavailable
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC version for functional components
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentType: string
) {
  return function ComponentWithErrorBoundary(props: P) {
    const componentConfig: ComponentConfig = {
      id: `wrapped-${componentType}`,
      type: componentType,
      props: props as Record<string, unknown>,
      order: 0,
    };

    return (
      <ComponentErrorBoundary componentConfig={componentConfig}>
        <WrappedComponent {...props} />
      </ComponentErrorBoundary>
    );
  };
}

export default ComponentErrorBoundary;
