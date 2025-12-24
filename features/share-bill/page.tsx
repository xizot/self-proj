'use client';

import { useState } from 'react';
import type { PersonDto } from './types/person-dto';
import { PageHeader, DiscountCard, PersonsList, SummaryCard } from './components';

export default function ShareBillPage() {
  const [persons, setPersons] = useState<PersonDto[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const addPerson = () => {
    const newPerson: PersonDto = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    };
    setPersons([...persons, newPerson]);
  };

  const updatePerson = (id: string, field: 'name' | 'amount', value: string | number) => {
    setPersons(
      persons.map((person) => (person.id === id ? { ...person, [field]: value } : person))
    );
  };

  const removePerson = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setPersons(persons.filter((person) => person.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const totalPrice = persons.reduce((sum, person) => sum + (person.amount || 0), 0);
  const afterDiscount = Math.max(0, totalPrice - discount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader />

        <DiscountCard discount={discount} onDiscountChange={setDiscount} />

        <PersonsList
          persons={persons}
          removingId={removingId}
          onAddPerson={addPerson}
          onUpdatePerson={updatePerson}
          onRemovePerson={removePerson}
        />

        <SummaryCard
          totalPrice={totalPrice}
          discount={discount}
          afterDiscount={afterDiscount}
        />
      </div>
    </div>
  );
}

