/**
 * Editor Layout
 * Layout específico para el editor que anula el layout admin
 * El editor necesita ocupar toda la pantalla sin el header admin
 */

interface EditorLayoutProps {
  children: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return <div className="bg-background text-foreground fixed inset-0 z-50">{children}</div>;
}
