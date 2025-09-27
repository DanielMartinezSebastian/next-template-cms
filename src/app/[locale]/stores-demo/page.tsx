/**
 * Stores Demo Page
 * Página de demostración para probar los stores de Zustand implementados
 */

'use client';

import { StoresExample } from '@/components/internal-admin/examples';

export default function StoresDemoPage() {
  return (
    <>
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">Zustand Stores Demo</h1>
              <p className="text-muted-foreground mt-2">
                Demonstración interactiva de los stores de gestión de estado
              </p>
            </div>
            <div className="text-muted-foreground text-sm">🐻 Powered by Zustand</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-8">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
            <h2 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
              🧪 Interactive Store Testing
            </h2>
            <div className="space-y-2 text-blue-800 dark:text-blue-200">
              <p>
                Esta página demuestra el funcionamiento de los 4 stores principales implementados
                con Zustand:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-1">
                <li>
                  <strong>Page Store:</strong> Gestión de páginas y componentes
                </li>
                <li>
                  <strong>Edit Mode Store:</strong> Control del editor visual
                </li>
                <li>
                  <strong>User Preferences Store:</strong> Configuración y preferencias
                </li>
                <li>
                  <strong>Translation Cache Store:</strong> Cache de traducciones
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stores Example Component */}
        <section className="bg-card overflow-hidden rounded-lg border">
          <div className="bg-muted border-b px-6 py-4">
            <h2 className="text-foreground text-lg font-semibold">Live Demo - Zustand Stores</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Interactúa con los controles para ver los stores en acción
            </p>
          </div>

          <div className="p-6">
            <StoresExample />
          </div>
        </section>

        {/* Development Notes */}
        <section className="mt-8">
          <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-900/50">
            <h2 className="text-foreground mb-4 text-lg font-semibold">📝 Notas de Desarrollo</h2>

            <div className="grid gap-6 text-sm md:grid-cols-2">
              <div>
                <h3 className="text-foreground mb-2 font-medium">
                  ✅ Características Implementadas
                </h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• TypeScript strict mode</li>
                  <li>• DevTools integration</li>
                  <li>• Persistent storage</li>
                  <li>• Selective subscriptions</li>
                  <li>• Action hooks separation</li>
                  <li>• Middleware composition</li>
                </ul>
              </div>

              <div>
                <h3 className="text-foreground mb-2 font-medium">🔧 Próximas Mejoras</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Real-time collaboration</li>
                  <li>• Optimistic updates</li>
                  <li>• Offline support</li>
                  <li>• Advanced caching strategies</li>
                  <li>• Performance monitoring</li>
                  <li>• A/B testing integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mt-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">🏗️ Arquitectura Técnica</h2>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Los stores están organizados siguiendo las mejores prácticas de Zustand y las
                recomendaciones oficiales para aplicaciones Next.js de gran escala.
              </p>

              <div className="bg-muted mt-4 rounded-lg p-4 font-mono text-xs">
                <div className="text-foreground">src/stores/</div>
                <div className="text-muted-foreground ml-2">├── page-store.ts</div>
                <div className="text-muted-foreground ml-2">├── edit-mode-store.ts</div>
                <div className="text-muted-foreground ml-2">├── user-preferences-store.ts</div>
                <div className="text-muted-foreground ml-2">├── translation-cache-store.ts</div>
                <div className="text-muted-foreground ml-2">└── index.ts</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>🔥 Next.js 15 Template • 🐻 Zustand State Management • 🎨 Tailwind CSS 4</p>
          <p className="mt-1">
            Built with TypeScript, following best practices for scalable applications
          </p>
        </footer>
      </main>
    </>
  );
}
