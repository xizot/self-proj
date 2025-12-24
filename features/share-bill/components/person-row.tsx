'use client';

import { Button, Input } from 'shared-ui';
import { useTranslations } from 'next-intl';
import type { PersonDto } from '../types/person-dto';

interface PersonRowProps {
  person: PersonDto;
  index: number;
  isRemoving: boolean;
  onUpdate: (id: string, field: 'name' | 'amount', value: string | number) => void;
  onRemove: (id: string) => void;
}

export function PersonRow({
  person,
  index,
  isRemoving,
  onUpdate,
  onRemove,
}: PersonRowProps) {
  const t = useTranslations('shareBill');
  const tCommon = useTranslations('common');

  return (
    <div
      className={`grid gap-3 rounded-lg border bg-card p-4 transition-all duration-300 md:grid-cols-[1fr_200px_auto] ${
        isRemoving
          ? 'animate-out fade-out slide-out-to-right-4 scale-95 opacity-0'
          : 'animate-in fade-in slide-in-from-left-4 hover:shadow-md hover:border-primary/50 hover:scale-[1.01]'
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <Input
        type="text"
        placeholder={t('enterPersonName')}
        value={person.name}
        onChange={(e) => onUpdate(person.id, 'name', e.target.value)}
        className="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
      />
      <Input
        type="number"
        placeholder="0"
        value={person.amount || ''}
        onChange={(e) => onUpdate(person.id, 'amount', parseFloat(e.target.value) || 0)}
        min="0"
        step="0.01"
        className="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
      />
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onRemove(person.id)}
        className="transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
      >
        {tCommon('remove')}
      </Button>
    </div>
  );
}
