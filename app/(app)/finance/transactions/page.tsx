'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Receipt } from 'lucide-react';

export default function FinanceTransactionsPage() {
  const t = useTranslations('pages.financeTransactions.emptyState');

  return <EmptyState icon={Receipt} title={t('title')} description={t('description')} />;
}
