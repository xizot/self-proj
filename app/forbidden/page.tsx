'use client';

import { BackButton } from '@/components/back-button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';
import { useAuth } from '../../components';

export default function ForbiddenPage() {
  const t = useTranslations('forbidden');
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 text-6xl">🚫</div>
          <CardTitle className="text-4xl text-destructive">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-xl font-semibold">{t('heading')}</p>
            <p className="text-muted-foreground">{t('description')}</p>
            {user && (
              <p className="text-sm text-muted-foreground">
                {t('loggedInAs')}: <span className="font-medium">{user.email}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">{t('goHome')}</Link>
            </Button>
            {user && (
              <Button variant="outline" onClick={() => logout()}>
                {t('logout')}
              </Button>
            )}
            <BackButton label={t('goBack')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
