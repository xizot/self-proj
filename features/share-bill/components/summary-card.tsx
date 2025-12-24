'use client';

import { Card, CardContent, CardHeader, CardTitle, formatCurrency } from 'shared-ui';
import { useTranslations } from 'next-intl';

interface SummaryCardProps {
  totalPrice: number;
  discount: number;
  afterDiscount: number;
}

export function SummaryCard({ totalPrice, discount, afterDiscount }: SummaryCardProps) {
  const t = useTranslations('shareBill');

  return (
    <Card className="transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 delay-300 bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          {t('summary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-all duration-200 hover:bg-muted/70">
          <span className="text-muted-foreground font-medium">{t('totalPrice')}:</span>
          <span className="text-lg font-semibold transition-all duration-300 animate-in fade-in slide-in-from-right-2">
            {formatCurrency(totalPrice, 'vi-VN', 'VND')}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-all duration-200 hover:bg-muted/70">
          <span className="text-muted-foreground font-medium">{t('discount')}:</span>
          <span className="text-lg font-semibold text-red-600 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
            -{formatCurrency(discount, 'vi-VN', 'VND')}
          </span>
        </div>
        <div className="border-t border-primary/20 pt-4">
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4 transition-all duration-300 hover:bg-primary/15 hover:scale-[1.02]">
            <span className="text-lg font-semibold">{t('afterDiscount')}:</span>
            <span
              key={afterDiscount}
              className="text-2xl font-bold text-primary transition-all duration-500 animate-in fade-in slide-in-from-right-4 zoom-in-95"
            >
              {formatCurrency(afterDiscount, 'vi-VN', 'VND')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
