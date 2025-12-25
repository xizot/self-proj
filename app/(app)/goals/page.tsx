'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Target } from 'lucide-react';

export default function GoalsPage() {
  const t = useTranslations('pages.goals.emptyState');

  return <EmptyState icon={Target} title={t('title')} description={t('description')} />;
}
