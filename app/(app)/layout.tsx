'use client';

import { SidebarLayout } from '@/components';
import { defaultMenuItems } from '@/configs/sidebar-menu';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout menuItems={defaultMenuItems}>{children}</SidebarLayout>;
}
