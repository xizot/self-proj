'use client';

import type { LinkMenuItem } from '@/types/menu';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SidebarSubItemProps {
  item: LinkMenuItem;
}

export function SidebarSubItem({ item }: SidebarSubItemProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const isActive = pathname === item.href;
  const translatedTitle = t(item.title);

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center rounded-md px-3 py-1.5 text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground font-medium'
      )}
    >
      <span>{translatedTitle}</span>
    </Link>
  );
}
