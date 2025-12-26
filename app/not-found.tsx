'use client';

import { BackButton } from '@/components/back-button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <CardTitle className="text-4xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-xl font-semibold">{t('heading')}</p>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">{t('goHome')}</Link>
            </Button>
            <BackButton label={t('goBack')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
