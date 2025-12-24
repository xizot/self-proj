# API Client

Axios instance với interceptors để xử lý authentication và errors.

## Cấu trúc

### `libs/axios.ts`

- **`axiosInstance`**: AxiosInstance gốc với interceptors (trả về `AxiosResponse<ApiResponse<T>>`)
- **`api`**: Wrapper tự động unwrap `ApiResponse` (trả về `T` trực tiếp)

### `libs/api-client.ts`

- **`apiClient`**: Alias của `api` với tên đẹp hơn (trả về `T` trực tiếp)

### Khi nào dùng gì?

- **`apiClient`** (khuyến nghị): Dùng trong services, tự động unwrap response
- **`axiosInstance`**: Chỉ dùng khi cần access full AxiosResponse (headers, status, etc.)

## Cấu hình

### Environment Variables

Thêm vào `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Token Storage

Token được lưu trong localStorage với key:

- `token` hoặc `accessToken`

## Cách sử dụng

### Basic Usage (Khuyến nghị)

```tsx
import { apiClient } from '@/libs';

// GET request - tự động unwrap ApiResponse
const user = await apiClient.get<User>('/users/1');
console.log(user); // User object (không cần .data)

// POST request
const newUser = await apiClient.post<User>('/users', {
  name: 'John',
  email: 'john@example.com',
});
console.log(newUser); // User object
```

### Paginated Data

```tsx
import { apiClient } from '@/libs';
import type { PagedApiResponse } from '@/types/api';

// apiClient tự động unwrap, nên response chính là PagedApiResponse<User>
const response = await apiClient.get<PagedApiResponse<User>>('/users', {
  params: { page: 1, pageSize: 10 },
});

console.log(response.data); // User[]
console.log(response.pagination.page); // 1
console.log(response.pagination.total); // 100
```

### Advanced Usage (Raw AxiosInstance)

Nếu cần access full response (headers, status, etc.):

```tsx
import { axiosInstance } from '@/libs';
import type { ApiResponse } from '@/types/api';

const response = await axiosInstance.get<ApiResponse<User>>('/users/1');
console.log(response.data.data); // User object
console.log(response.status); // 200
console.log(response.headers); // Response headers
```

### Skip Auth

```tsx
// Request không cần token
const response = await apiClient.get('/public/data', {
  skipAuth: true,
});
```

### Skip Error Handler

```tsx
// Tự xử lý error
try {
  const response = await apiClient.get('/data', {
    skipErrorHandler: true,
  });
} catch (error) {
  // Custom error handling
}
```

### Error Handling

```tsx
import { apiClient } from '@/libs';
import { formatApiError, formatValidationErrors } from '@/utils';

try {
  const response = await apiClient.post('/users', data);
} catch (error) {
  // Format error message
  const errorMessage = formatApiError(error);
  console.error(errorMessage);

  // Get validation errors
  const validationErrors = formatValidationErrors(error);
  // { email: ['Invalid email'], name: ['Name is required'] }
}
```

## Error Handling

Interceptor tự động xử lý:

- **401 Unauthorized**: Xóa token và redirect đến `/login`
- **403 Forbidden**: Log error
- **404 Not Found**: Log error
- **422 Validation Error**: Log validation errors
- **500 Server Error**: Log error
- **Network Error**: Trả về network error message

## Types

### ApiResponse

```tsx
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}
```

### PagedApiResponse

```tsx
interface PagedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

### ApiError

```tsx
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
  code?: string;
}
```
