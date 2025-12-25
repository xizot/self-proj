'use client';

import type { MenuItem } from '@/types/menu';
import { useAuth } from '@/components';
import { filterMenuItemsByAuth } from '@/utils/filter-menu-items';
import { useMemo, useState } from 'react';
import { cn } from 'shared-ui';
import { Footer } from '../footer';
import { HeaderContent } from '../header-content';
import { MobileSidebar, Sidebar, SidebarToggle } from '../sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
}

export function SidebarLayout({ children, menuItems }: SidebarLayoutProps) {
  const { isAuthenticated } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter menu items based on authentication status
  const filteredMenuItems = useMemo(
    () => filterMenuItemsByAuth(menuItems, isAuthenticated),
    [menuItems, isAuthenticated]
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar menuItems={filteredMenuItems} isCollapsed={isCollapsed} />
      {/* Spacer for fixed sidebar */}
      <div className={cn('hidden md:block', isCollapsed ? 'w-16' : 'w-64')} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        menuItems={filteredMenuItems}
      />

      {/* Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header with Toggle */}
        <div className="sticky top-0 z-40 w-full bg-header-background">
          <div className="container flex h-16 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
              <SidebarToggle
                isOpen={isMobileOpen}
                onToggle={() => setIsMobileOpen(!isMobileOpen)}
                isMobile
              />
              <SidebarToggle
                isOpen={!isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
                isMobile={false}
              />
            </div>
            <HeaderContent showLogo={false} showNav={false} />
          </div>
        </div>

        {/* Main Content */}
        <main className="relative flex flex-1 p-4 bg-main-wrapper-background">
          <div className="absolute -top-2 -left-2 w-5 h-5 bg-sidebar"></div>
          <div className="absolute top-0 left-0 w-5 h-5 bg-main-wrapper-background rounded-full"></div>
          <div className="flex-1 bg-main-background rounded-md p-4">{children}</div>

          <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-sidebar"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 bg-main-wrapper-background rounded-full"></div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
