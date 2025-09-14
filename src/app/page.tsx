import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('HomePage');
  const tNav = await getTranslations('Navigation');

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="text-center sm:text-left">
          <h1 className="mb-4 text-4xl font-bold">{t('title')}</h1>
          <p className="mb-2 text-xl text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('description')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{t('features.visual_editor')}</h3>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{t('features.i18n')}</h3>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{t('features.admin_panel')}</h3>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{t('features.seo')}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
            href="/admin"
          >
            {t('cta.get_started')}
          </Link>
          <a
            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://github.com/your-username/next-edit-mode"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('cta.view_docs')}
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/admin"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          {tNav('admin')}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/docs"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          {tNav('docs')}
        </Link>
        <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="/">
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          {tNav('home')}
        </Link>
      </footer>
    </div>
  );
}
