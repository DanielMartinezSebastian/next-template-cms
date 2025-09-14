import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('errors.404.title')}</h1>
        <p className="mb-4 text-gray-600">{t('errors.404.description')}</p>
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
          {t('errors.404.go_back_home')}
        </Link>
      </div>
    </div>
  );
}
