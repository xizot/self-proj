'use client';

import { Card, CardContent, CardHeader, CardTitle, Input } from 'shared-ui';
import { useTranslations } from 'next-intl';

interface DiscountCardProps {
  discount: number;
  onDiscountChange: (value: number) => void;
}

export function DiscountCard({ discount, onDiscountChange }: DiscountCardProps) {
  const t = useTranslations('shareBill');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onDiscountChange(value);
  };

  return (
    <Card className="transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 delay-150">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          {t('discount')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="number"
          label={t('discountAmount')}
          placeholder="0"
          value={discount || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="transition-all duration-200 focus:scale-[1.02]"
        />
      </CardContent>
    </Card>
  );
}
