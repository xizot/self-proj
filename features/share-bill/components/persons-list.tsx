'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';
import { useTranslations } from 'next-intl';
import type { PersonDto } from '../types/person-dto';
import { PersonRow } from './person-row';

interface PersonsListProps {
  persons: PersonDto[];
  removingId: string | null;
  onAddPerson: () => void;
  onUpdatePerson: (id: string, field: 'name' | 'amount', value: string | number) => void;
  onRemovePerson: (id: string) => void;
}

export function PersonsList({
  persons,
  removingId,
  onAddPerson,
  onUpdatePerson,
  onRemovePerson,
}: PersonsListProps) {
  const t = useTranslations('shareBill');

  return (
    <Card className="transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👥</span>
          {t('persons')} {persons.length > 0 && `(${persons.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {persons.map((person, index) => (
            <PersonRow
              key={person.id}
              person={person}
              index={index}
              isRemoving={removingId === person.id}
              onUpdate={onUpdatePerson}
              onRemove={onRemovePerson}
            />
          ))}
          <Button
            onClick={onAddPerson}
            variant="outline"
            className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary hover:bg-primary/5 active:scale-95 animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="mr-2 text-lg">➕</span>
            {t('addPerson')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
