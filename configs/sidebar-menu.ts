import type { MenuItem } from '@/types/menu';
import {
  BookOpen,
  Brain,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Heart,
  Home,
  LayoutDashboard,
  Receipt,
  Repeat,
  Settings,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

export const defaultMenuItems: MenuItem[] = [
  {
    type: 'link',
    href: '/',
    icon: Home,
    title: 'sidebar.menuItems.home',
  },
  {
    type: 'link',
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'sidebar.menuItems.dashboard',
  },
  {
    type: 'collapsible',
    icon: Wallet,
    title: 'sidebar.menuItems.finance',
    children: [
      {
        type: 'link',
        href: '/finance/overview',
        icon: TrendingUp,
        title: 'sidebar.menuItems.financeOverview',
      },
      {
        type: 'link',
        href: '/finance/transactions',
        icon: Receipt,
        title: 'sidebar.menuItems.financeTransactions',
      },
      {
        type: 'link',
        href: '/finance/budget',
        icon: Target,
        title: 'sidebar.menuItems.financeBudget',
      },
      {
        type: 'link',
        href: '/finance/share-bill',
        icon: Receipt,
        title: 'sidebar.menuItems.financeShareBill',
      },
    ],
  },
  {
    type: 'collapsible',
    icon: CheckSquare,
    title: 'sidebar.menuItems.work',
    children: [
      {
        type: 'link',
        href: '/tasks',
        icon: CheckSquare,
        title: 'sidebar.menuItems.tasks',
      },
      {
        type: 'link',
        href: '/projects',
        icon: LayoutDashboard,
        title: 'sidebar.menuItems.projects',
      },
      {
        type: 'link',
        href: '/templates',
        icon: Repeat,
        title: 'sidebar.menuItems.templates',
      },
    ],
  },
  {
    type: 'collapsible',
    icon: Clock,
    title: 'sidebar.menuItems.time',
    children: [
      {
        type: 'link',
        href: '/calendar',
        icon: Calendar,
        title: 'sidebar.menuItems.calendar',
      },
      {
        type: 'link',
        href: '/habits',
        icon: Repeat,
        title: 'sidebar.menuItems.habits',
      },
      {
        type: 'link',
        href: '/routines',
        icon: Clock,
        title: 'sidebar.menuItems.routines',
      },
    ],
  },
  {
    type: 'link',
    href: '/health',
    icon: Heart,
    title: 'sidebar.menuItems.health',
  },
  {
    type: 'link',
    href: '/relationships',
    icon: Users,
    title: 'sidebar.menuItems.relationships',
  },
  {
    type: 'collapsible',
    icon: Brain,
    title: 'sidebar.menuItems.knowledge',
    children: [
      {
        type: 'link',
        href: '/notes',
        icon: FileText,
        title: 'sidebar.menuItems.notes',
      },
      {
        type: 'link',
        href: '/learning',
        icon: BookOpen,
        title: 'sidebar.menuItems.learning',
      },
    ],
  },
  {
    type: 'link',
    href: '/goals',
    icon: Target,
    title: 'sidebar.menuItems.goals',
  },
  {
    type: 'link',
    href: '/settings',
    icon: Settings,
    title: 'sidebar.menuItems.settings',
  },
];
