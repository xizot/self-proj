'use client';

import type { CollapsibleMenuItem, LinkMenuItem } from '@/types/menu';
import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SidebarSubItem } from './sidebar-sub-item';

interface SidebarCollapsibleItemProps {
  item: CollapsibleMenuItem;
  isCollapsed?: boolean;
}

export function SidebarCollapsibleItem({ item, isCollapsed = false }: SidebarCollapsibleItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  // Auto-expand if any child is active
  const hasActiveChild = useMemo(() => {
    return item.children.some((child) => {
      if (child.type === 'link') {
        return (child as LinkMenuItem).href === pathname;
      }
      return false;
    });
  }, [item.children, pathname]);

  const [isOpen, setIsOpen] = useState(hasActiveChild);

  // Sync isOpen with hasActiveChild
  if (hasActiveChild && !isOpen) {
    setIsOpen(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isCollapsed && 'justify-center px-2'
        )}
        title={isCollapsed ? item.title : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
            <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />
          </>
        )}
      </button>
      {!isCollapsed && isOpen && (
        <div className="relative ml-4 mt-1 space-y-1 pl-4">
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-border" />
          {item.children.map((child) => {
            if (child.type === 'link') {
              const linkChild = child as LinkMenuItem;
              return <SidebarSubItem key={linkChild.href} item={linkChild} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
