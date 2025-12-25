'use client';

import { cn } from '@/utils/cn';
import { Menu, PanelLeft, X } from 'lucide-react';
import { Button } from 'shared-ui';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  className?: string;
}

export function SidebarToggle({
  isOpen,
  onToggle,
  isMobile = false,
  className,
}: SidebarToggleProps) {
  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn('md:hidden', className)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn('hidden md:flex cursor-pointer', className)}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  );
}
