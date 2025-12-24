import type { ApiError } from '@/types/api';

/**
 * Format API error message for display
 */
export function formatApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    return apiError.message || 'An error occurred';
  }

  return 'An unexpected error occurred';
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(error: unknown): Record<string, string[]> {
  if (error && typeof error === 'object' && 'errors' in error) {
    const apiError = error as ApiError;
    return apiError.errors || {};
  }

  return {};
}

/**
 * Check if error is API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Get error status code
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.statusCode;
  }
  return undefined;
}
