'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { setCookie } from '@/utils/cookie';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Combobox } from 'shared-ui/client';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const [isSwitching, setIsSwitching] = useState(false);

  const options = locales.map((loc) => ({
    id: loc,
    name: localeNames[loc],
  }));

  const handleChange = (value: string) => {
    console.log('LocaleSwitcher onChange called:', value);
    const newLocale = value as Locale;

    // Don't switch if already switching or same locale
    if (isSwitching || newLocale === locale) {
      console.log('Skipping switch:', { isSwitching, newLocale, locale });
      return;
    }

    // Validate locale
    if (!locales.includes(newLocale)) {
      console.error(`Invalid locale: ${newLocale}`);
      return;
    }

    setIsSwitching(true);

    // Set locale in localStorage (for fast access in axios)
    localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
    // Set locale in cookie (for server-side rendering)
    setCookie('locale', newLocale);

    // Reload page to apply new locale (router.refresh() doesn't work properly with next-intl)
    window.location.reload();
  };

  return (
    <Combobox
      options={options}
      value={locale}
      onChange={handleChange}
      showArrowIcon={false}
      placeholder=""
      searchPlaceholder=""
      size="sm"
      showClearIcon={false}
      suffix={<Globe className="h-4 w-4" />}
      className="w-[140px]"
    />
  );
}
