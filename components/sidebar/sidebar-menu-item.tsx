'use client';

import type { CollapsibleMenuItem, LinkMenuItem } from '@/types/menu';
import { SidebarCollapsibleItem } from './sidebar-collapsible-item';
import { SidebarLinkItem } from './sidebar-link-item';

interface SidebarMenuItemProps {
  item: LinkMenuItem | CollapsibleMenuItem;
  isCollapsed?: boolean;
}

export function SidebarMenuItem({ item, isCollapsed = false }: SidebarMenuItemProps) {
  if (item.type === 'link') {
    return <SidebarLinkItem item={item} isCollapsed={isCollapsed} />;
  }

  if (item.type === 'collapsible') {
    return <SidebarCollapsibleItem item={item} isCollapsed={isCollapsed} />;
  }

  return null;
}
