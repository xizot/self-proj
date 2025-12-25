'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from 'shared-ui';
import { cn } from '@/utils/cn';
import type { MenuItem } from '@/types/menu';
import { SidebarMenuItem } from './sidebar-menu-item';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function MobileSidebar({ isOpen, onClose, menuItems }: MobileSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 transform border-r bg-background transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-xl font-bold">Logo</span>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
