/**
 * Base API Response
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

/**
 * Base Paging Response
 */
export interface BasePaging {
  page: number;
  pageSize: number;
  total: number;
  totalCount: number;
}

/**
 * Paged API Response
 */
export interface PagedApiResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: BasePaging;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
  code?: string;
}

/**
 * Request Config
 */
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}
