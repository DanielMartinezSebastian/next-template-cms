/**/**

 * Component Registry Demo * Component Registry Demo

 * Interactive demonstration of the new editable components system * Interactive demonstration of the withEditable system

 */ */



'use client';'use client';



import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';import { Button as UIButton } from '@/components/ui/button';

import { componentRegistry } from '@/lib/component-registry';import { componentRegistry } from '@/lib/component-registry';



// Import our editable components// Import our editable components from new structure

import {import {

  Button as EditableButton,  Button as EditableButton,

  Card,  Card,

  CallToAction,  CallToAction,

  HeroSection,  HeroSection,

  ImageBlock,  ImageBlock,

  TextBlock,  TextBlock,

} from '@/components/editable-components';} from '@/components/editable-components';



interface RegistryStats {// =============================================================================

  total: number;// DEMO COMPONENT

  categories: string[];// =============================================================================

  lastUpdate: string;

  systemType: string;export default function ComponentRegistryDemo() {

}  const [registryStats, setRegistryStats] = useState<any>(null);

  const [syncStatus, setSyncStatus] = useState<any>(null);

interface SyncStatus {  const [loading, setLoading] = useState(false);

  success: boolean;

  message: string;  // =============================================================================

  componentsCount?: number;  // API CALLS

}  // =============================================================================



export default function ComponentRegistryDemo() {  const fetchRegistryStats = async () => {

  const [registryStats, setRegistryStats] = useState<RegistryStats | null>(null);    try {

  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);      const response = await fetch('/api/components?source=registry');

  const [loading, setLoading] = useState(false);      const data = await response.json();

      setRegistryStats(data);

  // Load registry stats on component mount    } catch (error) {

  useEffect(() => {      console.error('Failed to fetch registry stats:', error);

    loadRegistryStats();    }

  }, []);  };



  const loadRegistryStats = async () => {  const fetchSyncStatus = async () => {

    try {    try {

      const stats = {      const response = await fetch('/api/components/sync');

        total: componentRegistry.getComponents().length,      const data = await response.json();

        categories: Array.from(new Set(componentRegistry.getComponents().map(c => c.metadata.category))),      setSyncStatus(data);

        lastUpdate: new Date().toISOString(),    } catch (error) {

        systemType: 'NEW_SYSTEM_ONLY',      console.error('Failed to fetch sync status:', error);

      };    }

      setRegistryStats(stats);  };

    } catch (error) {

      console.error('Error loading registry stats:', error);  const performSync = async (direction: string) => {

    }    setLoading(true);

  };    try {

      const response = await fetch('/api/components/sync', {

  const syncToDatabase = async () => {        method: 'POST',

    setLoading(true);        headers: { 'Content-Type': 'application/json' },

    try {        body: JSON.stringify({ direction }),

      const response = await fetch('/api/components/sync', {      });

        method: 'POST',      const data = await response.json();

        headers: { 'Content-Type': 'application/json' },      

        body: JSON.stringify({ force: true }),      if (data.success) {

      });        await fetchRegistryStats();

        await fetchSyncStatus();

      const data = await response.json();        console.log('Sync completed:', data);

            }

      if (response.ok) {    } catch (error) {

        setSyncStatus({      console.error('Sync failed:', error);

          success: true,    } finally {

          message: 'Componentes sincronizados exitosamente',      setLoading(false);

          componentsCount: data.count || 0,    }

        });  };

        await loadRegistryStats();

      } else {  // =============================================================================

        setSyncStatus({  // EFFECTS

          success: false,  // =============================================================================

          message: data.error || 'Error al sincronizar componentes',

        });  useEffect(() => {

      }    // Fetch initial data

    } catch (error) {    fetchRegistryStats();

      setSyncStatus({    fetchSyncStatus();

        success: false,  }, []);

        message: 'Error de red al sincronizar',

      });  // =============================================================================

    } finally {  // RENDER

      setLoading(false);  // =============================================================================

    }

  };  return (

    <div className="space-y-8">

  return (      {/* Live Component Examples */}

    <div className="max-w-6xl mx-auto p-8 space-y-8">      <div className="rounded-lg border border-border bg-card p-6">

      <div className="text-center">        <h2 className="text-xl font-semibold text-card-foreground mb-4">

        <h1 className="text-4xl font-bold text-gray-900 mb-4">          Live Component Examples

          Demo de Componentes Editables        </h2>

        </h1>        <p className="text-muted-foreground mb-6">

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">          These components are automatically registered when they render for the first time.

          Demostración interactiva del nuevo sistema de componentes editables con withEditableSSR        </p>

        </p>

      </div>        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="space-y-4">

      {/* Registry Stats */}            <h3 className="font-medium text-card-foreground">Buttons</h3>

      <div className="bg-white p-6 rounded-lg shadow-lg border">            <p className="text-sm text-muted-foreground">

        <h2 className="text-2xl font-semibold mb-4">📊 Estadísticas del Registry</h2>              Button components with different variants and configurations.

        {registryStats ? (            </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">            <div className="space-y-2">

            <div className="text-center p-4 bg-blue-50 rounded-lg">              <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

              <div className="text-3xl font-bold text-blue-600">{registryStats.total}</div>                <EditableButton />

              <div className="text-sm text-blue-800">Componentes Totales</div>              </div>

            </div>              <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

            <div className="text-center p-4 bg-green-50 rounded-lg">                <ButtonMigrated text="Migrated Button" variant="outline" />

              <div className="text-3xl font-bold text-green-600">{registryStats.categories.length}</div>              </div>

              <div className="text-sm text-green-800">Categorías</div>            </div>

            </div>          </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">

              <div className="text-xl font-bold text-purple-600">{registryStats.systemType}</div>          <div className="space-y-4">

              <div className="text-sm text-purple-800">Sistema</div>            <h3 className="font-medium text-card-foreground">Content Cards</h3>

            </div>            <p className="text-sm text-muted-foreground">

            <div className="text-center p-4 bg-orange-50 rounded-lg">              Card components for displaying content with images and actions.

              <Button onClick={syncToDatabase} disabled={loading} variant="outline" size="sm">            </p>

                {loading ? 'Sincronizando...' : 'Sincronizar DB'}            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

              </Button>              <CardMigrated 

              <div className="text-xs text-orange-800 mt-1">Base de Datos</div>                title="Sample Card"

            </div>                description="This card was migrated to the new withEditable system"

          </div>                buttonText="Learn More"

        ) : (                variant="elevated"

          <div className="text-center py-8 text-gray-500">Cargando estadísticas...</div>              />

        )}            </div>

          </div>

        {syncStatus && (

          <div className={`mt-4 p-3 rounded ${          <div className="space-y-4">

            syncStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'            <h3 className="font-medium text-card-foreground">Text Content</h3>

          }`}>            <p className="text-sm text-muted-foreground">

            {syncStatus.message}              Text blocks for rich content display.

            {syncStatus.componentsCount && ` (${syncStatus.componentsCount} componentes)`}            </p>

          </div>            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

        )}              <TextBlockMigrated 

      </div>                title="Migrated Text Block"

                content="This text block component has been successfully migrated to use the withEditable HOC system with Zod validation."

      {/* Component Examples */}                textAlign="center"

      <div className="bg-white p-6 rounded-lg shadow-lg border">              />

        <h2 className="text-2xl font-semibold mb-6">🎨 Ejemplos de Componentes</h2>            </div>

                  </div>

        <div className="space-y-8">        </div>

          {/* Hero Section Example */}

          <div>        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>          <div className="space-y-4">

            <div className="border rounded-lg overflow-hidden">            <h3 className="font-medium text-card-foreground">Call to Actions</h3>

              <HeroSection            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

                title="¡Bienvenido a nuestro sitio web!"              <CallToActionMigrated 

                subtitle="La mejor experiencia digital"                title="Ready to get started?"

                description="Descubre contenido increíble y servicios únicos diseñados especialmente para ti."                description="Experience the new component system"

                ctaText="Comenzar ahora"                buttonText="Try Now"

                ctaLink="#"                backgroundColor="bg-blue-600"

                backgroundType="gradient"              />

                gradientFrom="#3b82f6"            </div>

                gradientTo="#8b5cf6"          </div>

                textColor="#ffffff"

                centered={true}          <div className="space-y-4">

                size="medium"            <h3 className="font-medium text-card-foreground">Hero Sections</h3>

              />            <div className="p-4 bg-muted rounded border-2 border-dashed border-border">

            </div>              <div className="scale-75 origin-top-left">

          </div>                <HeroSectionMigrated 

                  title="Migrated Hero"

          {/* Text Block Example */}                  description="This hero was migrated to withEditable"

          <div>                  height="small"

            <h3 className="text-lg font-semibold mb-4">Text Block</h3>                  ctaText="Get Started"

            <div className="border rounded-lg overflow-hidden">                />

              <TextBlock              </div>

                title="Sobre Nosotros"            </div>

                content="Somos una empresa comprometida con la innovación y la excelencia. Nuestro equipo trabaja día a día para ofrecerte las mejores soluciones digitales."          </div>

                textAlign="left"        </div>

                textSize="medium"      </div>

                titleSize="medium"

                color="#374151"      {/* Registry Statistics */}

                maxWidth="prose"      <div className="rounded-lg border border-border bg-card p-6">

                padding="large"        <h2 className="text-xl font-semibold text-card-foreground mb-4">

              />          Registry Statistics

            </div>        </h2>

          </div>        

        {registryStats ? (

          {/* Card Example */}          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">

            <h3 className="text-lg font-semibold mb-4">Card</h3>              <div className="text-2xl font-bold text-green-700 dark:text-green-300">

            <div className="border rounded-lg overflow-hidden">                {registryStats.total || 0}

              <Card              </div>

                title="Nuestros Servicios"              <div className="text-sm text-green-600 dark:text-green-400">

                description="Ofrecemos una amplia gama de servicios digitales para ayudarte a alcanzar tus objetivos."                Components Registered

                image="https://images.placeholders.dev/400x250?text=Servicios&bgColor=%234f46e5&textColor=%23ffffff"              </div>

                imageAlt="Nuestros servicios"            </div>

                buttonText="Ver más"            

                buttonLink="#"            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">

                layout="vertical"              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">

                variant="elevated"                {registryStats.stats?.registry?.categories ? 

                textAlign="left"                  Object.keys(registryStats.stats.registry.categories).length : 0}

              />              </div>

            </div>              <div className="text-sm text-blue-600 dark:text-blue-400">

          </div>                Categories

              </div>

          {/* Button Example */}            </div>

          <div>            

            <h3 className="text-lg font-semibold mb-4">Button</h3>            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">

            <div className="border rounded-lg p-6">              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">

              <EditableButton                {registryStats.data?.length || 0}

                text="Contáctanos"              </div>

                href="#"              <div className="text-sm text-purple-600 dark:text-purple-400">

                variant="default"                Available Components

                size="lg"              </div>

                disabled={false}            </div>

                fullWidth={false}          </div>

                alignment="center"        ) : (

              />          <div className="text-center text-muted-foreground">

            </div>            Loading registry statistics...

          </div>          </div>

        )}

          {/* Image Block Example */}

          <div>        {registryStats?.data && (

            <h3 className="text-lg font-semibold mb-4">Image Block</h3>          <div className="mt-6">

            <div className="border rounded-lg p-6">            <h3 className="font-medium mb-3">Registered Components:</h3>

              <ImageBlock            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                src="https://images.placeholders.dev/600x400?text=Imagen%20Demo&bgColor=%2310b981&textColor=%23ffffff"              {registryStats.data.map((component: any) => (

                alt="Imagen de demostración"                <div key={component.name} className="flex items-center gap-3 p-3 bg-muted rounded">

                caption="Esta es una imagen de ejemplo con su descripción correspondiente"                  <span className="text-lg">{component.icon || '📦'}</span>

                width={600}                  <div className="flex-1">

                height={400}                    <div className="font-medium text-sm">{component.displayName || component.name}</div>

                alignment="center"                    <div className="text-xs text-muted-foreground">{component.category}</div>

                variant="rounded"                  </div>

                showCaption={true}                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">

              />                    v{component.version || '1.0.0'}

            </div>                  </span>

          </div>                </div>

              ))}

          {/* Call To Action Example */}            </div>

          <div>          </div>

            <h3 className="text-lg font-semibold mb-4">Call To Action</h3>        )}

            <div className="border rounded-lg overflow-hidden">      </div>

              <CallToAction

                title="¿Listo para comenzar?"      {/* Sync Controls */}

                description="Únete a miles de clientes satisfechos y comienza tu viaje con nosotros hoy mismo."      <div className="rounded-lg border border-border bg-card p-6">

                buttonText="Empezar gratis"        <h2 className="text-xl font-semibold text-card-foreground mb-4">

                buttonLink="#"          Database Synchronization

                buttonVariant="default"        </h2>

                backgroundColor="#3b82f6"        

                textColor="#ffffff"        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                centered={true}          <div>

                size="medium"            <h3 className="font-medium mb-3">Sync Status</h3>

              />            {syncStatus ? (

            </div>              <div className="space-y-2 text-sm">

          </div>                <div className="flex justify-between">

        </div>                  <span>Registry Status:</span>

      </div>                  <span className="text-green-600 dark:text-green-400">✓ Connected</span>

                </div>

      {/* System Info */}                <div className="flex justify-between">

      <div className="bg-gray-50 p-6 rounded-lg">                  <span>Database Status:</span>

        <h2 className="text-xl font-semibold mb-4">ℹ️ Información del Sistema</h2>                  <span className={syncStatus.database?.connected 

        <div className="text-sm text-gray-600 space-y-2">                    ? 'text-green-600 dark:text-green-400' 

          <p><strong>Sistema:</strong> withEditableSSR con auto-registro</p>                    : 'text-red-600 dark:text-red-400'}>

          <p><strong>Validación:</strong> Zod schemas con TypeScript</p>                    {syncStatus.database?.connected ? '✓ Connected' : '✗ Disconnected'}

          <p><strong>Base de datos:</strong> Sincronización automática con PostgreSQL</p>                  </span>

          <p><strong>Editor:</strong> Generación automática de UI basada en schemas</p>                </div>

        </div>                <div className="flex justify-between">

      </div>                  <span>Components in Registry:</span>

    </div>                  <span>{syncStatus.registry?.stats?.total || 0}</span>

  );                </div>

}              </div>
            ) : (
              <div className="text-muted-foreground">Loading sync status...</div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Sync Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('to-database')}
                disabled={loading}
                className="w-full justify-start"
              >
                📤 Sync to Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('from-database')}
                disabled={loading}
                className="w-full justify-start"
              >
                📥 Sync from Database
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => performSync('bidirectional')}
                disabled={loading}
                className="w-full justify-start"
              >
                🔄 Bidirectional Sync
              </Button>
            </div>
          </div>
        </div>

        {syncStatus?.recommendations && syncStatus.recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              Recommendations
            </h4>
            <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
              {syncStatus.recommendations.map((rec: any, index: number) => (
                <li key={index}>• {rec.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* API Documentation */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          API Endpoints
        </h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">GET /api/components</code>
            <p className="text-muted-foreground ml-4 mt-1">
              List all registered components with filtering and search
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">GET /api/components/[name]</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Get detailed information about a specific component
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">POST /api/components/sync</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Synchronize components between registry and database
            </p>
          </div>
          
          <div>
            <code className="font-mono bg-muted px-2 py-1 rounded">PUT /api/components/[name]</code>
            <p className="text-muted-foreground ml-4 mt-1">
              Update component custom properties with validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
