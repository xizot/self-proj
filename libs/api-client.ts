import { api } from './axios';

/**
 * API Client with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, config?: Parameters<typeof api.get>[1]) =>
    api.get<T>(url, config),

  /**
   * POST request
   */
  post: <T = unknown>(url: string, data?: unknown, config?: Parameters<typeof api.post>[2]) =>
    api.post<T>(url, data, config),

  /**
   * PUT request
   */
  put: <T = unknown>(url: string, data?: unknown, config?: Parameters<typeof api.put>[2]) =>
    api.put<T>(url, data, config),

  /**
   * PATCH request
   */
  patch: <T = unknown>(url: string, data?: unknown, config?: Parameters<typeof api.patch>[2]) =>
    api.patch<T>(url, data, config),

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: Parameters<typeof api.delete>[1]) =>
    api.delete<T>(url, config),
};

export default apiClient;
