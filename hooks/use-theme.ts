import { useTheme as useNextTheme } from 'next-themes';

/**
 * Custom hook wrapper for next-themes useTheme
 * Provides type-safe theme management
 */
export function useTheme() {
  return useNextTheme();
}
