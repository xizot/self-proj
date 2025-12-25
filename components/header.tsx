'use client';

import { HeaderContent } from './header-content';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header-background">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <HeaderContent />
      </div>
    </header>
  );
}
