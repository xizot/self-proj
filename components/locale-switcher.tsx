'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from 'shared-ui';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const switchLocale = async (newLocale: Locale) => {
    // Set locale in cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    // Refresh page to apply new locale
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={locale === loc ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLocale(loc)}
        >
          {localeNames[loc]}
        </Button>
      ))}
    </div>
  );
}
