'use client';

import { useTheme } from 'next-themes';
import { Button } from 'shared-ui';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <span>☀️</span> : <span>🌙</span>}
    </Button>
  );
}
