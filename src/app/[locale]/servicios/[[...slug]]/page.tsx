import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

export default async function ServiciosDynamicPage({ params }: Props) {
  const { locale, slug = [] } = await params;

  // Si no hay slug, mostrar la página principal de servicios
  if (slug.length === 0) {
    return (
      <div className="servicios-page">
        <h1>Servicios</h1>
        <p>Esta es la página estática de servicios.</p>
        <p>Las subpáginas dinámicas se gestionan desde el CMS.</p>

        <div className="services-list">
          <h2>Nuestros Servicios</h2>
          <ul>
            <li>Desarrollo web</li>
            <li>Consultoría técnica</li>
            <li>Soporte y mantenimiento</li>
          </ul>
        </div>
      </div>
    );
  }

  const path = `/servicios/${slug.join('/')}`;

  // Buscar página dinámica en CMS para la sección servicios
  const page = await prisma.page.findFirst({
    where: {
      fullPath: path,
      isActive: true,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="servicios-dynamic-page">
      <nav className="breadcrumb">
        <Link href="/servicios">Servicios</Link> › {slug.join(' › ')}
      </nav>

      <h1>{page.slug}</h1>
      <p>Página dinámica de servicios: {path}</p>
      <p>Locale: {locale}</p>

      <div className="content">
        {/* Aquí iría el contenido dinámico del CMS */}
        <p>Contenido dinámico gestionado desde el editor CMS</p>
      </div>
    </div>
  );
}

// Generar rutas específicas de servicios para SSG
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: {
      isActive: true,
      fullPath: {
        startsWith: '/servicios/',
        not: '/servicios', // Excluir la página base
      },
    },
    select: { fullPath: true },
  });

  return pages.map((page: { fullPath: string }) => ({
    slug: page.fullPath.replace('/servicios/', '').split('/').filter(Boolean),
  }));
}

// Configuración para ISR específica de servicios
export const revalidate = 300; // Revalidar cada 5 minutos
