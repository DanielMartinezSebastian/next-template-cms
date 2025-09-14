import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('errors.404.title')}</h1>
        <p className="text-gray-600 mb-4">
          {t('errors.404.description')}
        </p>
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {t('errors.404.go_back_home')}
        </Link>
      </div>
    </div>
  );
}