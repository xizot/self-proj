'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export default function HealthPage() {
  const t = useTranslations('pages.health.emptyState');

  return <EmptyState icon={Heart} title={t('title')} description={t('description')} />;
}
