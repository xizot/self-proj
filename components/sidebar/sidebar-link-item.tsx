'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { LinkMenuItem } from '@/types/menu';
import { cn } from '@/utils/cn';

interface SidebarLinkItemProps {
  item: LinkMenuItem;
  isCollapsed?: boolean;
}

export function SidebarLinkItem({ item, isCollapsed = false }: SidebarLinkItemProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const isActive = pathname === item.href;
  const Icon = item.icon;
  const translatedTitle = t(item.title);

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? translatedTitle : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{translatedTitle}</span>
          {item.badge && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
