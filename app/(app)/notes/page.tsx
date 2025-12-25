'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';

export default function NotesPage() {
  const t = useTranslations('pages.notes.emptyState');

  return <EmptyState icon={FileText} title={t('title')} description={t('description')} />;
}
