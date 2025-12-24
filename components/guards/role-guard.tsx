'use client';

import type { Role } from '@/types/auth';
import { useAuth } from '../providers/auth-provider';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: Role[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, requireAll = false, fallback }: RoleGuardProps) {
  const { hasAnyRole, hasAllRoles } = useAuth();

  const hasAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
