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
        // Try to get user from API first
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Map database user to frontend User type
            // Convert role string to roles array
            const roles = data.user.role ? [data.user.role] : ['user'];
            const mappedUser: User = {
              id: String(data.user.id),
              email: data.user.email,
              name: data.user.name || '',
              roles,
            };
            setUser(mappedUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));
            return;
          }
        }
        // Fallback to stored user if API fails
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Try to load from localStorage as fallback
        try {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        } catch {
          // Ignore localStorage errors
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      // Map database user to frontend User type
      // Convert role string to roles array
      const roles = data.user.role ? [data.user.role] : ['user'];
      const mappedUser: User = {
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.name || '',
        roles,
      };

      setUser(mappedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));

      // Store token if provided
      if (data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      }
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
      await fetch('/api/auth/logout', { method: 'POST' });

      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        throw new Error('Failed to refresh user');
      }

      const data = await response.json();

      if (data.user) {
        // Map database user to frontend User type
        // Convert role string to roles array
        const roles = data.user.role ? [data.user.role] : ['user'];
        const mappedUser: User = {
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.name || '',
          roles,
        };
        setUser(mappedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // On error, logout user
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
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
