'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Combobox } from 'shared-ui/client';

const options = locales.map((loc) => ({
  id: loc,
  name: localeNames[loc],
}));

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const [isSwitching, setIsSwitching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (value: string) => {
    const newLocale = value as Locale;

    if (isSwitching || newLocale === locale) {
      return;
    }

    // Validate locale
    if (!locales.includes(newLocale)) {
      return;
    }

    setIsSwitching(true);

    // Save to localStorage only
    localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);

    // Clear reload flag to allow switching
    sessionStorage.removeItem('locale_reload_' + newLocale);

    // Reload page to apply new locale
    window.location.reload();
  };

  // Prevent hydration mismatch by only rendering Combobox on client
  if (!isMounted) {
    return (
      <div className="w-[140px] h-9 flex items-center justify-center">
        <Globe className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

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
