import type { MenuItem } from '@/types/menu';
import { Home, LayoutDashboard, Receipt, Settings } from 'lucide-react';

export const defaultMenuItems: MenuItem[] = [
  {
    type: 'link',
    href: '/',
    icon: Home,
    title: 'Home',
  },
  {
    type: 'link',
    href: '/share-bill',
    icon: Receipt,
    title: 'Share Bill',
  },
  {
    type: 'collapsible',
    icon: Settings,
    title: 'Settings',
    children: [
      {
        type: 'link',
        href: '/settings',
        icon: Settings,
        title: 'Settings',
      },
      {
        type: 'link',
        href: '/dashboard',
        icon: LayoutDashboard,
        title: 'Dashboard',
      },
    ],
  },
];
