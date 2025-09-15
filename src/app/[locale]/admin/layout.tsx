/**
 * Admin Layout
 * Layout base para el panel de administración con alturas optimizadas
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
    <div className="bg-background flex h-dvh flex-col overflow-hidden">
      {/* Admin header - Fixed height */}
      <header className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/60 h-[6dvh] min-h-[60px] flex-shrink-0 border-b backdrop-blur">
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <h1 className="text-foreground text-lg font-semibold md:text-xl">Admin Panel</h1>
              <div className="bg-border hidden h-6 w-px md:block" />
              <nav className="hidden items-center space-x-4 md:flex">
                <Link
                  href="/en"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ← Back to Site
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/en"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors md:hidden"
              >
                ← Back
              </Link>
              <div className="text-muted-foreground hidden text-sm lg:block">
                Content Management System
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Remaining height */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
