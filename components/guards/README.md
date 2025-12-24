# Auth Guards

Hướng dẫn sử dụng AuthGuard và RoleGuard.

## AuthGuard

Bảo vệ route, yêu cầu user phải đăng nhập.

### Cách sử dụng

```tsx
// app/dashboard/page.tsx
import { AuthGuard } from '@/components/guards';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Dashboard content</div>
    </AuthGuard>
  );
}
```

### Custom redirect

```tsx
<AuthGuard redirectTo="/custom-login">
  <div>Protected content</div>
</AuthGuard>
```

### Custom loading fallback

```tsx
<AuthGuard fallback={<div>Checking authentication...</div>}>
  <div>Protected content</div>
</AuthGuard>
```

## RoleGuard

Bảo vệ route dựa trên roles của user.

### Cách sử dụng

```tsx
// app/admin/page.tsx
import { RoleGuard } from '@/components/guards';

export default function AdminPage() {
  return (
    <RoleGuard roles={['admin']}>
      <div>Admin content</div>
    </RoleGuard>
  );
}
```

### Multiple roles (OR - có 1 trong các roles)

```tsx
<RoleGuard roles={['admin', 'moderator']}>
  <div>Admin or Moderator content</div>
</RoleGuard>
```

### Multiple roles (AND - phải có tất cả roles)

```tsx
<RoleGuard roles={['admin', 'super-admin']} requireAll>
  <div>Must have both admin and super-admin roles</div>
</RoleGuard>
```

### Custom fallback

```tsx
<RoleGuard
  roles={['admin']}
  fallback={<div>You need admin role to access this page</div>}
>
  <div>Admin content</div>
</RoleGuard>
```

## Kết hợp AuthGuard và RoleGuard

```tsx
import { AuthGuard, RoleGuard } from '@/components/guards';

export default function AdminPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['admin']}>
        <div>Admin content</div>
      </RoleGuard>
    </AuthGuard>
  );
}
```

## Sử dụng useAuth hook

```tsx
'use client';

import { useAuth } from '@/hooks';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {hasRole('admin') && <div>Admin panel</div>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## useAuth API

```tsx
const {
  user,              // User | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  login,             // (email: string, password: string) => Promise<void>
  logout,            // () => Promise<void>
  refreshUser,       // () => Promise<void>
  hasRole,           // (role: Role) => boolean
  hasAnyRole,        // (roles: Role[]) => boolean
  hasAllRoles,        // (roles: Role[]) => boolean
} = useAuth();
```
