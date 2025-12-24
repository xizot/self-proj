# Quick Start Guide

Hướng dẫn nhanh để bắt đầu phát triển.

## 🚀 Setup nhanh

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev
```

Truy cập: http://localhost:3000

## 📝 Tạo Feature mới

Tham khảo feature `test` để hiểu cấu trúc: `features/test/`

### 1. Tạo structure

```bash
features/test/
├── components/
│   ├── forms/
│   │   └── index.ts
│   ├── modals/
│   │   └── index.ts
│   └── index.ts
├── types/
│   └── index.ts
├── schemas/
│   └── index.ts
├── stores/
│   └── index.ts
├── test.tsx          # Main component
└── index.ts          # Feature exports
```

### 2. Component template

```tsx
// features/test/components/forms/test-form.tsx
interface TestFormProps {
  onSubmit: (data: unknown) => void;
}

export function TestForm({ onSubmit }: TestFormProps) {
  return <form onSubmit={onSubmit}>...</form>;
}

// features/test/components/forms/index.ts
export { TestForm } from './test-form';

// features/test/components/index.ts
export * from './forms';
export * from './modals';
```

### 3. Types & Schemas

```tsx
// features/test/types/index.ts
export interface TestType {
  id: string;
  name: string;
}

// features/test/schemas/index.ts
import { z } from 'zod';

export const testSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type TestSchemaType = z.infer<typeof testSchema>;
```

### 4. Store (Zustand)

```tsx
// features/test/stores/index.ts
import { create } from 'zustand';

interface TestState {
  isLoading: boolean;
}

interface TestActions {
  setLoading: (loading: boolean) => void;
}

export const useTestStore = create<TestState & TestActions>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

### 5. Main component

```tsx
// features/test/test.tsx
'use client';

import { TestForm } from './components';
import { useTestStore } from './stores';

export function Test() {
  const { isLoading, setLoading } = useTestStore();

  return (
    <div>
      <TestForm onSubmit={() => {}} />
    </div>
  );
}

export default Test;
```

### 6. Feature exports

```tsx
// features/test/index.ts
export { default as Test } from './test';
export * from './types';
export * from './stores';
export * from './schemas';
export * from './components';
```

### 7. Route (nếu cần)

```tsx
// app/test/page.tsx
import { Test } from '@/features/test';

export default function Page() {
  return <Test />;
}
```

## ✅ Checklist

- [ ] File names: `lowercase-kebab-case.tsx`
- [ ] Component names: `PascalCase`
- [ ] Sử dụng named exports: `export function Component() {}`
- [ ] Types trong folder `types/`
- [ ] Format code: `yarn format:fix`

## 📚 Xem thêm

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Hướng dẫn chi tiết
- [README.md](./README.md) - Project overview

