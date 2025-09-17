/**
 * Admin Editor Page
 * Lista y gestiona todas las páginas del CMS usando el nuevo sistema sin Lexical
 */

import { SimplePageManagerNew } from '@/components/admin/SimplePageManagerNew';
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
      className="admin-editor-page fixed inset-0"
      style={{
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* Simple Page Manager Component (Full Screen Layout) */}
      <SimplePageManagerNew />
    </div>
  );
}
