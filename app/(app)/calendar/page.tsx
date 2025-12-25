'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  const t = useTranslations('pages.calendar.emptyState');

  return <EmptyState icon={Calendar} title={t('title')} description={t('description')} />;
}
