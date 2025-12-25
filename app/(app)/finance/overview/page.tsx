'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';

export default function FinanceOverviewPage() {
  const t = useTranslations('pages.financeOverview.emptyState');

  return <EmptyState icon={TrendingUp} title={t('title')} description={t('description')} />;
}
