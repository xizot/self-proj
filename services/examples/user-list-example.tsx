'use client';

import { formatApiError, formatValidationErrors } from '@/utils';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';
import { userService, type User } from '../user-service';

/**
 * Example component demonstrating UserService usage
 */
export function UserListExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUsers({
        page,
        pageSize: pagination.pageSize,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      setUsers(response.data);
      // setPagination(response.pagination);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const newUser = await userService.createUser({
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
        roles: ['user'],
      });

      console.log('User created:', newUser);
      // Reload users list
      loadUsers(pagination.page);
    } catch (err) {
      const errorMessage = formatApiError(err);
      const validationErrors = formatValidationErrors(err);

      console.error('Failed to create user:', errorMessage);
      console.error('Validation errors:', validationErrors);
    }
  };

  const handleUpdateUser = async (id: string) => {
    try {
      const updatedUser = await userService.updateUser(id, {
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      console.log('User updated:', updatedUser);
      // Reload users list
      loadUsers(pagination.page);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to update user:', errorMessage);
    }
  };

  const handlePatchUser = async (id: string) => {
    try {
      // Partial update using PATCH
      const patchedUser = await userService.patchUser(id, {
        name: 'Patched Name',
      });

      console.log('User patched:', patchedUser);
      loadUsers(pagination.page);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to patch user:', errorMessage);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      console.log('User deleted');
      // Reload users list
      loadUsers(pagination.page);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to delete user:', errorMessage);
    }
  };

  const handleGetUserById = async (id: string) => {
    try {
      const user = await userService.getUserById(id);
      console.log('User details:', user);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to get user:', errorMessage);
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      console.log('Current user:', currentUser);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to get current user:', errorMessage);
    }
  };

  const handleGetUserStats = async () => {
    try {
      // Public endpoint - no auth required
      const stats = await userService.getUserStats();
      console.log('User stats:', stats);
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error('Failed to get stats:', errorMessage);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div>Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Service Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreateUser}>Create User</Button>
            <Button onClick={handleGetCurrentUser} variant="outline">
              Get Current User
            </Button>
            <Button onClick={handleGetUserStats} variant="outline">
              Get Stats (Public)
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            <h3 className="font-semibold">
              Users ({pagination.total}) - Page {pagination.page} of {pagination.totalPages}
            </h3>
            {users.length === 0 ? (
              <div className="text-muted-foreground">No users found</div>
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Roles: {user.roles.join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGetUserById(user.id)}
                      >
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateUser(user.id)}>
                        Update
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePatchUser(user.id)}>
                        Patch
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
