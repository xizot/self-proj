'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Target } from 'lucide-react';

export default function FinanceBudgetPage() {
  const t = useTranslations('pages.financeBudget.emptyState');

  return <EmptyState icon={Target} title={t('title')} description={t('description')} />;
}
