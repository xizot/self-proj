'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';

export default function RoutinesPage() {
  const t = useTranslations('pages.routines.emptyState');

  return <EmptyState icon={Clock} title={t('title')} description={t('description')} />;
}
