/**
 * Admin Layout
 * Layout base para el panel de administración
 */
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Panel - Next.js Template',
  description: 'Panel de administración para gestión de contenido',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Admin header */}
      <header className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-foreground text-xl font-semibold">Admin Panel</h1>
              <div className="bg-border h-6 w-px" />
              <nav className="flex items-center space-x-4">
                <Link
                  href="/en"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ← Back to Site
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-muted-foreground text-sm">Content Management System</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
