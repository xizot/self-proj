'use client';

import NextTopLoader from 'nextjs-toploader';

/**
 * Top loader provider - shows progress bar on route navigation
 */
export function TopLoaderProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#hsl(var(--primary))"
        height={3}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #hsl(var(--primary)),0 0 5px #hsl(var(--primary))"
      />
      {children}
    </>
  );
}
