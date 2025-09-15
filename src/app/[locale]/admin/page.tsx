/**
 * Admin Dashboard Page
 * Página principal del panel de administración
 */

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-border border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-foreground text-xl font-semibold">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                ← Volver al sitio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pages Management */}
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="bg-primary rounded-md p-2">
                <svg
                  className="text-primary-foreground h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-foreground text-lg font-semibold">Gestión de Páginas</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Crea y edita páginas usando el editor visual con vista previa en tiempo real.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/editor/es/new"
                className="bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-md px-4 py-2 text-center"
              >
                Nueva Página
              </Link>
              <Link
                href="/admin/pages"
                className="border-border text-foreground hover:bg-muted block w-full rounded-md border px-4 py-2 text-center"
              >
                Ver Todas las Páginas
              </Link>
            </div>
          </div>

          {/* Content Management */}
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="bg-secondary rounded-md p-2">
                <svg
                  className="text-secondary-foreground h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <h2 className="text-foreground text-lg font-semibold">Gestión de Contenido</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Administra componentes, traducciones y configuraciones del sitio.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/components"
                className="border-border text-foreground hover:bg-muted block w-full rounded-md border px-4 py-2 text-center"
              >
                Componentes
              </Link>
              <Link
                href="/admin/translations"
                className="border-border text-foreground hover:bg-muted block w-full rounded-md border px-4 py-2 text-center"
              >
                Traducciones
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-md bg-green-600 p-2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-foreground text-lg font-semibold">Estado del Sistema</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Estado</span>
                <span className="text-sm font-medium text-green-600">Operativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Editor</span>
                <span className="text-sm font-medium text-green-600">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Base de datos</span>
                <span className="text-sm font-medium text-green-600">Conectada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-foreground mb-4 text-lg font-semibold">Acciones Rápidas</h3>
          <div className="bg-card border-border rounded-lg border p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Link
                href="/editor-demo"
                className="border-border hover:bg-muted flex flex-col items-center rounded-lg border p-4"
              >
                <svg
                  className="text-primary mb-2 h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="text-sm font-medium">Editor Demo</span>
              </Link>

              <Link
                href="/stores-demo"
                className="border-border hover:bg-muted flex flex-col items-center rounded-lg border p-4"
              >
                <svg
                  className="text-primary mb-2 h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium">Stores Demo</span>
              </Link>

              <Link
                href="/admin/editor/es/home"
                className="border-border hover:bg-muted flex flex-col items-center rounded-lg border p-4"
              >
                <svg
                  className="text-primary mb-2 h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
                <span className="text-sm font-medium">Editar Home</span>
              </Link>

              <Link
                href="/admin/settings"
                className="border-border hover:bg-muted flex flex-col items-center rounded-lg border p-4"
              >
                <svg
                  className="text-primary mb-2 h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Configuración</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
