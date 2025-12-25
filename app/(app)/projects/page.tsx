'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { LayoutDashboard } from 'lucide-react';

export default function ProjectsPage() {
  const t = useTranslations('pages.projects.emptyState');

  return <EmptyState icon={LayoutDashboard} title={t('title')} description={t('description')} />;
}
