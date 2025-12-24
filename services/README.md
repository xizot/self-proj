# Services

Services layer để gọi API với type safety.

## User Service Example

Service ví dụ sử dụng đầy đủ các tính năng của api-client.

### Cách sử dụng

```tsx
'use client';

import { userService } from '@/services';
import { formatApiError } from '@/utils';
import { useState, useEffect } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({
        page: 1,
        pageSize: 10,
        search: 'john',
        sortBy: 'name',
        sortOrder: 'asc',
      });

      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      const errorMessage = formatApiError(error);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const newUser = await userService.createUser({
        email: 'john@example.com',
        name: 'John Doe',
        password: 'password123',
        roles: ['user'],
      });
      console.log('User created:', newUser);
    } catch (error) {
      const errorMessage = formatApiError(error);
      console.error(errorMessage);
    }
  };

  const updateUser = async (id: string) => {
    try {
      const updatedUser = await userService.updateUser(id, {
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      console.log('User updated:', updatedUser);
    } catch (error) {
      const errorMessage = formatApiError(error);
      console.error(errorMessage);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      console.log('User deleted');
      loadUsers(); // Reload list
    } catch (error) {
      const errorMessage = formatApiError(error);
      console.error(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={createUser}>Create User</button>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <button onClick={() => updateUser(user.id)}>Update</button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Methods Available

#### GET Requests

```tsx
// Get single user
const user = await userService.getUserById('123');

// Get current user
const currentUser = await userService.getCurrentUser();

// Get paginated users
const response = await userService.getUsers({
  page: 1,
  pageSize: 20,
  search: 'john',
  role: 'admin',
  sortBy: 'name',
  sortOrder: 'asc',
});
```

#### POST Requests

```tsx
// Create user
const newUser = await userService.createUser({
  email: 'john@example.com',
  name: 'John Doe',
  password: 'password123',
});

// Upload avatar
const user = await userService.uploadAvatar('123', file);

// Change password
await userService.changePassword('123', 'oldPass', 'newPass');
```

#### PUT/PATCH Requests

```tsx
// Full update (PUT)
const updated = await userService.updateUser('123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});

// Partial update (PATCH)
const patched = await userService.patchUser('123', {
  name: 'Jane Doe',
});
```

#### DELETE Requests

```tsx
await userService.deleteUser('123');
```

#### Public Endpoints

```tsx
// Skip auth for public endpoints
const stats = await userService.getUserStats();
```

### Error Handling

```tsx
import { userService } from '@/services';
import { formatApiError, formatValidationErrors } from '@/utils';

try {
  const user = await userService.createUser(data);
} catch (error) {
  // Format error message
  const errorMessage = formatApiError(error);
  console.error(errorMessage);

  // Get validation errors
  const validationErrors = formatValidationErrors(error);
  // { email: ['Invalid email'], name: ['Name is required'] }
}
```

### Type Safety

Tất cả methods đều có type safety:

```tsx
// TypeScript sẽ infer đúng type
const user: User = await userService.getUserById('123');
const users: User[] = (await userService.getUsers()).data;
```
