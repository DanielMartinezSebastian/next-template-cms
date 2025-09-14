/**
 * Example Component - Demonstrates Zustand store usage
 * This shows best practices for using the stores in React components
 */

'use client';

import {
  useCacheActions,
  useCacheMetrics,
  useCurrentPage,
  useEditModeActions,
  useEditModeEnabled,
  useLocale,
  usePageActions,
  usePreferencesActions,
} from '@/stores';

export function StoresExample() {
  // Use specific selectors for better performance
  const currentPage = useCurrentPage();
  const isEditMode = useEditModeEnabled();
  const locale = useLocale();
  const cacheMetrics = useCacheMetrics();

  // Use action hooks to access store methods
  const { setCurrentPage, addPage } = usePageActions();
  const { toggleEditMode, setSelectedComponent } = useEditModeActions();
  const { setLocale, toggleSidebar } = usePreferencesActions();
  const { clearCache } = useCacheActions();

  const handleCreatePage = () => {
    addPage({
      title: 'Nueva Página',
      slug: 'nueva-pagina',
      locale,
      components: [],
      isPublished: false,
    });
  };

  const handleToggleEditMode = () => {
    toggleEditMode();
    if (!isEditMode) {
      // When entering edit mode, clear any selection
      setSelectedComponent(null);
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    // Clear cache when language changes
    clearCache();
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-foreground text-2xl font-bold">Zustand Stores Example</h2>

      {/* Page Store Example */}
      <section className="bg-card border-border rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-lg font-semibold">Page Store</h3>
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-medium">
              Estado actual: {currentPage?.title || 'Ninguna página'}
            </p>
            <p className="mt-1">
              Este store gestiona el estado de las páginas del CMS y componentes asociados.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreatePage}
              className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-sm font-medium text-white transition-colors"
              title="Crea una nueva página en el store y la establece como página actual"
            >
              📄 Crear Nueva Página
            </button>
            {currentPage && (
              <button
                onClick={() => setCurrentPage(null)}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded px-4 py-2 text-sm font-medium transition-colors"
                title="Limpia la página actual del store"
              >
                🗑️ Limpiar Página Actual
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Edit Mode Store Example */}
      <section className="bg-card border-border rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-lg font-semibold">Edit Mode Store</h3>
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-medium">
              Modo editor: {isEditMode ? '✅ Activo' : '❌ Inactivo'}
            </p>
            <p className="mt-1">
              Controla el estado del editor visual, selección de componentes e historial de cambios.
            </p>
          </div>
          <button
            onClick={handleToggleEditMode}
            className={`rounded px-4 py-2 text-sm font-medium text-white transition-colors ${
              isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            title={
              isEditMode
                ? 'Sale del modo editor y limpia las selecciones'
                : 'Activa el modo editor para modificar componentes'
            }
          >
            {isEditMode ? '🚪 Salir del Editor' : '✏️ Activar Editor'}
          </button>
        </div>
      </section>

      {/* User Preferences Store Example */}
      <section className="bg-card border-border rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-lg font-semibold">User Preferences Store</h3>
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-medium">
              Idioma actual: {locale === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}
            </p>
            <p className="mt-1">
              Gestiona preferencias del usuario: idioma, tema, configuración del editor y sidebar.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                }`}
                title="Cambia el idioma a inglés y limpia la caché de traducciones"
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  locale === 'es'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                }`}
                title="Cambia el idioma a español y limpia la caché de traducciones"
              >
                🇪🇸 Español
              </button>
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
              title="Alterna la visibilidad del sidebar en la interfaz"
            >
              📋 Alternar Sidebar
            </button>
          </div>
        </div>
      </section>

      {/* Translation Cache Store Example */}
      <section className="bg-card border-border rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-lg font-semibold">Translation Cache Store</h3>
        <div className="space-y-3">
          <div className="text-muted-foreground text-sm">
            <p className="text-foreground font-medium">Estado de la caché de traducciones</p>
            <p className="mt-1">
              Monitorea el rendimiento del sistema de traducciones y gestiona la caché en memoria.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-foreground">
                <span className="text-muted-foreground">Tasa de aciertos:</span>{' '}
                <span className="font-medium">{(cacheMetrics.cacheHitRate * 100).toFixed(1)}%</span>
              </div>
              <div className="text-foreground">
                <span className="text-muted-foreground">Total requests:</span>{' '}
                <span className="font-medium">{cacheMetrics.totalRequests}</span>
              </div>
              <div className="text-foreground">
                <span className="text-muted-foreground">Tiempo promedio:</span>{' '}
                <span className="font-medium">{cacheMetrics.avgResponseTime.toFixed(0)}ms</span>
              </div>
              <div className="text-foreground">
                <span className="text-muted-foreground">Tasa de errores:</span>{' '}
                <span className="font-medium">{(cacheMetrics.errorRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearCache}
            className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            title="Limpia toda la caché de traducciones y reinicia las métricas"
          >
            🗑️ Limpiar Caché
          </button>
        </div>
      </section>

      {/* Store Integration Notes */}
      <section className="bg-muted border-border rounded-lg border p-4">
        <h3 className="text-foreground mb-3 text-lg font-semibold">Notas de Mejores Prácticas</h3>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>
            <span className="text-foreground font-medium">Selectores específicos:</span> Mejoran el
            rendimiento evitando re-renders innecesarios
          </li>
          <li>
            <span className="text-foreground font-medium">Action hooks:</span> Separan la lógica de
            estado de los componentes
          </li>
          <li>
            <span className="text-foreground font-medium">Persistencia automática:</span> Los stores
            se guardan en localStorage donde configurado
          </li>
          <li>
            <span className="text-foreground font-medium">DevTools:</span> Integración completa
            disponible en modo desarrollo
          </li>
          <li>
            <span className="text-foreground font-medium">TypeScript-first:</span> Tipado completo y
            validación en tiempo de compilación
          </li>
        </ul>
      </section>
    </div>
  );
}
