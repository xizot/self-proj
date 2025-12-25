'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-footer-background">
      <div className="container flex h-16 items-center justify-center px-4 bg-footer-background mx-auto">
        <p className="text-sm text-muted-foreground">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
