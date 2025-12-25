'use client';

import { AuthProvider } from './auth-provider';
import { LocaleSync } from './locale-sync';
import { ThemeProvider } from './theme-provider';
import { TopLoaderProvider } from './top-loader-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LocaleSync>
        <TopLoaderProvider>
          <AuthProvider>{children}</AuthProvider>
        </TopLoaderProvider>
      </LocaleSync>
    </ThemeProvider>
  );
}
