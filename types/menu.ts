import type { LucideIcon } from 'lucide-react';

export interface LinkMenuItem {
  type: 'link';
  href: string;
  icon: LucideIcon;
  title: string;
  badge?: string | number;
  protected?: boolean;
}

export interface CollapsibleMenuItem {
  type: 'collapsible';
  icon: LucideIcon;
  title: string;
  children: MenuItem[];
  badge?: string | number;
  protected?: boolean;
}

export type MenuItem = LinkMenuItem | CollapsibleMenuItem;

export interface MenuConfig {
  items: MenuItem[];
}
