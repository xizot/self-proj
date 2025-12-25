'use client';
import { AppLayout } from '@/components';
import { useTranslations } from 'next-intl';
import './globals.css';

export default function Home() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="flex flex-1 items-center justify-center bg-background font-sans">
        <div className="flex flex-col gap-6 justify-center items-center pt-10">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t('common.welcome')}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t('common.hello')}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
