'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { defaultLocale, locales, type Locale } from '@/i18n/config';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

interface IntlProviderProps {
  children: React.ReactNode;
  initialMessages: Record<string, string>;
}

export function IntlProvider({ children, initialMessages }: IntlProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get locale from localStorage
    const storedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale;

    if (storedLocale && locales.includes(storedLocale)) {
      setLocale(storedLocale);

      // Load messages for the stored locale
      if (storedLocale !== defaultLocale) {
        import(`@/messages/${storedLocale}.json`)
          .then((module) => {
            setMessages(module.default);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
