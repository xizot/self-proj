'use client';

import { EmptyState } from '@/components/empty-state';
import { useTranslations } from 'next-intl';
import { Repeat } from 'lucide-react';

export default function TemplatesPage() {
  const t = useTranslations('pages.templates.emptyState');

  return <EmptyState icon={Repeat} title={t('title')} description={t('description')} />;
}
