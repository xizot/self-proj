'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';

export default function LearningPage() {
  const t = useTranslations('pages.learning.emptyState');

  return <EmptyState icon={BookOpen} title={t('title')} description={t('description')} />;
}
