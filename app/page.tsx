'use client';
import { AppLayout } from '@/components';
import { useTranslations } from 'next-intl';
import { Button } from 'shared-ui';
import { DatePicker } from 'shared-ui/client';
import './globals.css';

export default function Home() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background font-sans">
        <main className="flex flex-col gap-6 justify-center items-center">
          <Button>{t('common.welcome')}</Button>
          <DatePicker />
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t('common.welcome')}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t('common.hello')}
          </p>
        </main>
      </div>
    </AppLayout>
  );
}
