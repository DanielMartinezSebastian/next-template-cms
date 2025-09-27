'use client';

export function ScrollbarDemo() {
  const generateLongContent = (count: number) =>
    Array.from(
      { length: count },
      (_, i) => `Item ${i + 1} - Lorem ipsum dolor sit amet consectetur adipisicing elit.`
    );

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-4 text-3xl font-bold">Scrollbar Styles Demo</h1>
          <p className="text-muted-foreground">
            Demonstración de los diferentes estilos de scrollbar personalizados implementados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Scrollbar Thin */}
          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">Scrollbar Thin</h3>
            <div className="scrollbar-thin bg-muted max-h-64 overflow-y-auto rounded-md p-4">
              {generateLongContent(20).map((item, i) => (
                <div key={i} className="text-foreground mb-2 border-b pb-2 text-sm">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              <code>scrollbar-thin</code> - Scrollbar delgado y sutil
            </p>
          </div>

          {/* Scrollbar Admin */}
          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">Scrollbar Admin</h3>
            <div className="scrollbar-admin bg-muted max-h-64 overflow-y-auto rounded-md p-4">
              {generateLongContent(20).map((item, i) => (
                <div key={i} className="text-foreground mb-2 border-b pb-2 text-sm">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              <code>scrollbar-admin</code> - Scrollbar con estilo del panel de administración
            </p>
          </div>

          {/* Scrollbar None */}
          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">Scrollbar Hidden</h3>
            <div className="scrollbar-none bg-muted max-h-64 overflow-y-auto rounded-md p-4">
              {generateLongContent(20).map((item, i) => (
                <div key={i} className="text-foreground mb-2 border-b pb-2 text-sm">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              <code>scrollbar-none</code> - Scrollbar oculto (contenido sigue siendo scrolleable)
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Example */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-card-foreground mb-4 text-lg font-semibold">
            Horizontal Scroll Example
          </h3>
          <div className="scrollbar-admin overflow-x-auto">
            <div className="flex space-x-4" style={{ width: '200%' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary text-primary-foreground flex h-32 w-48 flex-shrink-0 items-center justify-center rounded-md"
                >
                  Card {i + 1}
                </div>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Ejemplo de scroll horizontal con <code>scrollbar-admin</code>
          </p>
        </div>

        {/* Combined Scroll Example */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-card-foreground mb-4 text-lg font-semibold">
            Combined Vertical & Horizontal Scroll
          </h3>
          <div className="scrollbar-admin max-h-64 overflow-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    {Array.from({ length: 10 }, (_, i) => (
                      <th key={i} className="text-foreground p-2 text-left">
                        Column {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 30 }, (_, row) => (
                    <tr key={row} className="border-border border-b">
                      {Array.from({ length: 10 }, (_, col) => (
                        <td key={col} className="text-foreground p-2">
                          Data {row + 1},{col + 1}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Tabla con scroll vertical y horizontal usando <code>scrollbar-admin</code>
          </p>
        </div>

        {/* Browser Compatibility Info */}
        <div className="bg-secondary/20 border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">Browser Compatibility</h3>
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>
              <strong>Webkit browsers (Chrome, Safari, Edge):</strong> Soportan estilos
              personalizados completos con gradientes y efectos hover.
            </p>
            <p>
              <strong>Firefox:</strong> Soporta <code>scrollbar-width</code> y{' '}
              <code>scrollbar-color</code> con funcionalidad limitada.
            </p>
            <p>
              <strong>Legacy browsers:</strong> Fallan graciosamente a los scrollbars nativos del
              sistema.
            </p>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-secondary/20 border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-4 text-lg font-semibold">Usage Examples</h3>
          <div className="text-muted-foreground space-y-4 text-sm">
            <div>
              <strong>Para contenido general:</strong>
              <pre className="bg-muted text-foreground mt-1 rounded p-2">
                <code>{"<div className='scrollbar-thin overflow-auto'>...</div>"}</code>
              </pre>
            </div>
            <div>
              <strong>Para paneles de administración:</strong>
              <pre className="bg-muted text-foreground mt-1 rounded p-2">
                <code>{"<div className='scrollbar-admin overflow-auto'>...</div>"}</code>
              </pre>
            </div>
            <div>
              <strong>Para ocultar scrollbars:</strong>
              <pre className="bg-muted text-foreground mt-1 rounded p-2">
                <code>{"<div className='scrollbar-none overflow-auto'>...</div>"}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
