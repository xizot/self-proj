import { apiClient } from '@/libs';
import type { PagedApiResponse } from '@/types/api';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Create User DTO
 */
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  roles?: string[];
}

/**
 * Update User DTO
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

/**
 * User List Query Params
 */
export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * User Service
 * Example service demonstrating full usage of api-client
 */
export const userService = {
  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  /**
   * Get paginated list of users
   */
  getUsers: async (params?: UserListParams): Promise<PagedApiResponse<User>> => {
    const response = await apiClient.get<PagedApiResponse<User>>('/users', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        search: params?.search,
        role: params?.role,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
      },
    });
    // Response is ApiResponse<PagedApiResponse<User>>, extract the data
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Partial update user (PATCH)
   */
  patchUser: async (id: string, data: Partial<UpdateUserDto>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Axios sẽ tự động set Content-Type với boundary khi detect FormData
    const response = await apiClient.post<User>(`/users/${id}/avatar`, formData);
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post(`/users/${id}/change-password`, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Reset user password (admin only)
   */
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/users/${id}/reset-password`, {
      newPassword,
    });
  },

  /**
   * Get user statistics (public endpoint - no auth required)
   */
  getUserStats: async (): Promise<{ total: number; active: number; inactive: number }> => {
    const response = await apiClient.get<{ total: number; active: number; inactive: number }>(
      '/users/stats',
      {
        skipAuth: true, // Public endpoint
      }
    );
    return response.data;
  },
};
