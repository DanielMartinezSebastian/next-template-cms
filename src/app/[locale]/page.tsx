import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function Home({params}: Props) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Load translations from the new page-based structure
  const tHome = await getTranslations('Home');      // Page-specific translations
  const tCommon = await getTranslations();          // Common translations

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">{tHome('title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{tHome('subtitle')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tHome('description')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <h3 className="font-semibold text-foreground">{tHome('features.visual_editor')}</h3>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <h3 className="font-semibold text-foreground">{tHome('features.i18n')}</h3>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <h3 className="font-semibold text-foreground">{tHome('features.admin_panel')}</h3>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-background">
            <h3 className="font-semibold text-foreground">{tHome('features.seo')}</h3>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/admin"
          >
            {tHome('cta.get_started')}
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://github.com/your-username/next-edit-mode"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tHome('cta.view_docs')}
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/admin"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          {tCommon('admin')}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/docs"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          {tCommon('docs')}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {tCommon('home')}
        </Link>
      </footer>
    </div>
  );
}
