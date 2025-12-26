import type { LucideIcon } from 'lucide-react';

export interface LinkMenuItem {
  type: 'link';
  href: string;
  icon: LucideIcon;
  title: string;
  badge?: string | number;
  protected?: boolean;
  roles?: string[]; // Roles required to see this menu item
}

export interface CollapsibleMenuItem {
  type: 'collapsible';
  icon: LucideIcon;
  title: string;
  children: MenuItem[];
  badge?: string | number;
  protected?: boolean;
  roles?: string[]; // Roles required to see this menu item
}

export type MenuItem = LinkMenuItem | CollapsibleMenuItem;

export interface MenuConfig {
  items: MenuItem[];
}
