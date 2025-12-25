'use client';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div>
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {t('common.welcome')}
      </h1>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {t('common.hello')}
      </p>
    </div>
  );
}
