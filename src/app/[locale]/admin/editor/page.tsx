/**
 * Admin Editor Page
 * Lista y gestiona todas las páginas del CMS
 */

import { PageManager } from '@/components/admin/PageManager';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin' });

  return {
    title: `${t('editor.title')} - Next.js Template`,
    description: t('editor.description'),
  };
}

export default async function AdminEditorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin' });

  return (
    <div
      className="admin-editor-page"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        height: '100vh',
        paddingTop: 'max(6vh, 60px)',
        minHeight: '100vh',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
      }}
    >
      <div className="w-full px-4 py-1 md:px-6">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <h1 className="text-foreground text-2xl font-bold md:text-3xl">{t('editor.title')}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t('editor.description')}</p>
        </div>

        {/* Page Manager Component */}
        <PageManager />
      </div>
    </div>
  );
}
