'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { locales, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

/**
 * Sync locale to localStorage only (no cookies)
 * Uses useEffect to avoid hydration mismatch
 */
export function LocaleSync({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // Save current locale to localStorage
    if (locales.includes(locale)) {
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    }
  }, [locale, mounted]);

  return <>{children}</>;
}
