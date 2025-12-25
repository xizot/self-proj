'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { locales, type Locale } from '@/i18n/config';
import { setCookie } from '@/utils/cookie';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

/**
 * Sync locale bidirectionally between cookie and localStorage
 * - Cookie → localStorage: For SSR compatibility
 * - localStorage → Cookie: For consistency when localStorage has value but cookie doesn't
 * Uses useEffect to avoid hydration mismatch
 */
export function LocaleSync({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // Sync cookie → localStorage (for SSR compatibility)
    if (locales.includes(locale)) {
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    }

    // Sync localStorage → cookie (if localStorage has value but cookie doesn't match)
    const storedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);
    if (storedLocale && locales.includes(storedLocale as Locale)) {
      // Check if cookie matches localStorage
      const cookies = document.cookie.split(';');
      const localeCookie = cookies.find((cookie) => cookie.trim().startsWith('locale='));
      const cookieLocale = localeCookie?.split('=')[1]?.trim();

      // If cookie doesn't exist or doesn't match localStorage, sync it
      if (!cookieLocale || cookieLocale !== storedLocale) {
        setCookie('locale', storedLocale);
      }
    }
  }, [locale, mounted]);

  return <>{children}</>;
}
