/**
 * useComponents Hook
 * Hook para cargar componentes disponibles desde la base de datos
 */
'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  defaultProps: Record<string, unknown>;
  configSchema: Record<string, unknown>;
}

interface UseComponentsResult {
  components: ComponentDefinition[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useComponents(): UseComponentsResult {
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/components');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch components');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch components');
      }

      setComponents(data.components || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching components:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchComponents();
  }, [fetchComponents]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return {
    components,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener un componente específico por tipo
 */
export function useComponentByType(type: string): ComponentDefinition | null {
  const { components } = useComponents();
  return components.find(component => component.type === type) || null;
}

/**
 * Hook para obtener componentes agrupados por categoría
 */
export function useComponentsByCategory(): Record<string, ComponentDefinition[]> {
  const { components } = useComponents();

  return components.reduce(
    (acc, component) => {
      const category = component.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(component);
      return acc;
    },
    {} as Record<string, ComponentDefinition[]>
  );
}
