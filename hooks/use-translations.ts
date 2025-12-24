import { useTranslations as useNextIntlTranslations } from 'next-intl';

/**
 * Custom hook wrapper for next-intl useTranslations
 * Provides type-safe translations
 */
export function useTranslations(namespace?: string) {
  return useNextIntlTranslations(namespace);
}

