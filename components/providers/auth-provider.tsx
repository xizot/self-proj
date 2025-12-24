'use client';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { AuthContextValue, Role, User } from '@/types/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage or API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // TODO: Replace with actual auth check (e.g., check token, fetch user)
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Mock user for demo (password is used in actual implementation)
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        roles: ['user'],
      };

      setUser(mockUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // await fetch('/api/auth/logout', { method: 'POST' });

      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/me');
      // const data = await response.json();
      // setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // On error, logout user
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const hasRole = useCallback(
    (role: Role): boolean => {
      if (!user) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: Role[]): boolean => {
      if (!user) return false;
      return roles.some((role) => user.roles.includes(role));
    },
    [user]
  );

  const hasAllRoles = useCallback(
    (roles: Role[]): boolean => {
      if (!user) return false;
      return roles.every((role) => user.roles.includes(role));
    },
    [user]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
