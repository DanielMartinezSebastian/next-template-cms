/**
 * Visual Editor Demo Page
 * Demonstrates the component-based visual editor
 */

import VisualEditorDemo from '@/components/internal-admin/examples/VisualEditorDemo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale }); // Common translations are at root level

  return {
    title: `${t('navigation.visual-editor-demo')} - Next.js Template`,
    description:
      'Demonstration of the component-based visual editor with all features and components.',
  };
}

export default function VisualEditorDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <VisualEditorDemo />
    </div>
  );
}
