'use client';

import { Button } from 'shared-ui';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label: string;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'secondary';
}

export function BackButton({ label, variant = 'outline' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button variant={variant} onClick={() => router.back()}>
      {label}
    </Button>
  );
}
