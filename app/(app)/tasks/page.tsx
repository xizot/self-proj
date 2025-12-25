'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  const t = useTranslations('pages.tasks.emptyState');

  return <EmptyState icon={CheckSquare} title={t('title')} description={t('description')} />;
}
