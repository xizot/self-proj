'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';

export default function RelationshipsPage() {
  const t = useTranslations('pages.relationships.emptyState');

  return <EmptyState icon={Users} title={t('title')} description={t('description')} />;
}
