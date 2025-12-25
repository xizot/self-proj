/**
 * Set cookie value
 */
export function setCookie(name: string, value: string, maxAge = 31536000): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

/**
 * Get cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1]?.trim() || null : null;
}
