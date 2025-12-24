// Export apiClient (wrapper with auto-unwrap) - main API client
export { apiClient, default as apiClientDefault } from './api-client';

// Export axiosInstance (raw AxiosInstance) - for advanced usage
export { axiosInstance, default as axiosInstanceDefault } from './axios';

// Export api helper (same as apiClient, but with different name)
export { api } from './axios';
