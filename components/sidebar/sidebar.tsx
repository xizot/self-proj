'use client';

import type { MenuItem } from '@/types/menu';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { ScrollArea } from 'shared-ui/client';
import { SidebarMenuItem } from './sidebar-menu-item';

interface SidebarProps {
  menuItems: MenuItem[];
  isCollapsed?: boolean;
}

export function Sidebar({ menuItems, isCollapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col md:bg-sidebar',
        'transition-all duration-300 ease-in-out',
        'fixed left-0 top-0 h-screen z-30',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-4">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 font-bold transition-opacity',
              isCollapsed && 'justify-center'
            )}
            title={isCollapsed ? 'Logo' : undefined}
          >
            <span className={cn('text-xl', isCollapsed && 'text-lg')}>Logo</span>
          </Link>
        </div>

        {/* Menu Items */}
        <ScrollArea className="flex-1 p-4 h-full pb-16">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
