'use client';
import { useTheme } from 'next-themes';
import { Button } from 'shared-ui';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}
