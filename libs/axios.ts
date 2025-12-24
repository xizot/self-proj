import type { ApiError, ApiResponse, RequestConfig } from '@/types/api';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { STORAGE_KEYS } from '@/constants/storage-keys';

// Get token from localStorage (or from auth context/store)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as InternalAxiosRequestConfig & { skipAuth?: boolean };

    // Skip auth if flag is set
    if (requestConfig.skipAuth) {
      return config;
    }

    // Add token to headers
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - let axios set Content-Type automatically with boundary
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const config = error.config as AxiosRequestConfig & RequestConfig;

    // Skip error handler if flag is set
    if (config?.skipErrorHandler) {
      return Promise.reject(error);
    }

    // Handle different error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            // Redirect to login page
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data?.message || 'You do not have permission');
          if (typeof window !== 'undefined') {
            // Redirect to forbidden page
            window.location.href = '/forbidden';
          }
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data?.message || 'Resource not found');
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data?.errors || data?.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data?.message || 'Internal server error');
          break;

        default:
          console.error('API Error:', data?.message || error.message);
      }

      // Create standardized error object
      const apiError: ApiError = {
        message: data?.message || error.message || 'An error occurred',
        errors: data?.errors,
        statusCode: status,
        code: data?.code,
      };

      return Promise.reject(apiError);
    }

    // Network error or other errors
    if (error.request) {
      const networkError: ApiError = {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      };
      return Promise.reject(networkError);
    }

    // Other errors
    return Promise.reject(error);
  }
);

// Helper function to make requests with type safety (auto unwrap ApiResponse)
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig & RequestConfig) =>
    axiosInstance.get<ApiResponse<T>>(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig & RequestConfig) =>
    axiosInstance.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig & RequestConfig) =>
    axiosInstance.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig & RequestConfig) =>
    axiosInstance.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig & RequestConfig) =>
    axiosInstance.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};

// Export axios instance for advanced usage (if needed)
export default axiosInstance;
