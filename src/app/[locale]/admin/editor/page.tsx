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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">{t('editor.title')}</h1>
        <p className="text-muted-foreground">{t('editor.description')}</p>
      </div>

      {/* Page Manager Component */}
      <PageManager />
    </div>
  );
}
