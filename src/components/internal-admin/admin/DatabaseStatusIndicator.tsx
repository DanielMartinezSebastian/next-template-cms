'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatabaseStatus } from '@/app/api/admin/database-status/route';

export function DatabaseStatusIndicator() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/database-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error fetching database status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (isConnected: boolean) => {
    return isConnected ? 'Conectada' : 'Desconectada';
  };

  if (isLoading && !status) {
    return (
      <div className="bg-card border-border rounded-lg border p-6">
        <div className="mb-4 flex items-center space-x-3">
          <div className="rounded-md bg-gray-500 p-2">
            <svg
              className="h-5 w-5 animate-spin text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-foreground text-lg font-semibold">Estado del Sistema</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Verificando...</span>
            <span className="text-sm font-medium text-gray-500">...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-border rounded-lg border p-6">
      <div className="mb-4 flex items-center space-x-3">
        <div className={`rounded-md p-2 ${status?.isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {status?.isConnected ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            )}
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-foreground text-lg font-semibold">Estado del Sistema</h2>
          <div className="text-xs text-muted-foreground">
            Tipo: {status?.type === 'mock' ? 'Base de datos Mock' : 'PostgreSQL'} • 
            Última actualización: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStatus}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            'Actualizar'
          )}
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Base de datos</span>
          <span className={`text-sm font-medium ${getStatusColor(status?.isConnected || false)}`}>
            {getStatusText(status?.isConnected || false)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Páginas</span>
          <span className={`text-sm font-medium ${getStatusColor(status?.tablesAvailable.pages || false)}`}>
            {status?.tablesAvailable.pages ? `${status.metrics.totalPages} páginas` : 'No disponible'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Componentes</span>
          <span className={`text-sm font-medium ${getStatusColor(status?.tablesAvailable.components || false)}`}>
            {status?.tablesAvailable.components ? `${status.metrics.totalComponents} componentes` : 'No disponible'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Traducciones</span>
          <span className={`text-sm font-medium ${getStatusColor(status?.tablesAvailable.translations || false)}`}>
            {status?.tablesAvailable.translations ? `${status.metrics.activeTranslations} activas` : 
             status?.type === 'mock' ? `${status.metrics.activeTranslations} (mock)` : 'No disponible'}
          </span>
        </div>

        {status?.connectionDetails.host && (
          <div className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
            <div>Host: {status.connectionDetails.host}</div>
            {status.connectionDetails.database && (
              <div>BD: {status.connectionDetails.database}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
