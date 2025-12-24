'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from 'shared-ui';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from './providers/auth-provider';

export function Header() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { href: '/', label: t('welcome') },
    { href: '/share-bill', label: 'Share Bill' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Logo</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Locale Switcher */}
          <LocaleSwitcher />

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                {tAuth('logout')}
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">{tAuth('login')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
