/**
 * LocalStorage keys used throughout the application
 */
export const STORAGE_KEYS = {
  /**
   * Authentication token (primary)
   */
  TOKEN: 'token',

  /**
   * Authentication token (alternative key)
   */
  ACCESS_TOKEN: 'accessToken',

  /**
   * Current authenticated user data
   */
  USER: 'user',

  /**
   * Current locale/language preference
   */
  LOCALE: 'locale',
} as const;

/**
 * Type-safe storage keys
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
