'use client';

import { useTranslations } from 'next-intl';

export function PageHeader() {
  const t = useTranslations('shareBill');

  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-500">
        {t('title')}
      </h1>
      <p className="mt-2 text-muted-foreground animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
        {t('subtitle')}
      </p>
    </div>
  );
}

