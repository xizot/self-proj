# Development Guide

Hướng dẫn phát triển cho developers mới vào project.

## 📋 Mục lục

- [Setup](#setup)
- [Cấu trúc Project](#cấu-trúc-project)
- [Naming Conventions](#naming-conventions)
- [Code Style](#code-style)
- [Best Practices](#best-practices)
- [Examples](#examples)

## 🚀 Setup

### Yêu cầu

- Node.js >= 20
- Yarn (package manager)

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd self-proj

# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Scripts

```bash
# Development
yarn dev              # Start dev server (port 3000)

# Production
yarn build            # Build for production
yarn start            # Start production server (port 2026)

# Code Quality
yarn lint             # Check ESLint errors
yarn format           # Check Prettier formatting
yarn format:fix       # Auto-fix Prettier formatting
```

### VS Code Setup

Project đã có cấu hình VS Code trong `.vscode/` folder:

#### Recommended Extensions

VS Code sẽ tự động đề xuất các extensions cần thiết khi mở project:

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript** - TypeScript support
- **EditorConfig** - Editor consistency

#### Auto Features

Khi mở project với VS Code, các tính năng sau sẽ tự động hoạt động:

- ✅ **Format on Save** - Tự động format code khi save
- ✅ **Remove Unused Imports** - Tự động xóa unused imports khi save
- ✅ **Organize Imports** - Tự động sắp xếp imports khi save
- ✅ **ESLint Auto Fix** - Tự động fix ESLint errors khi save
- ✅ **Auto Save** - Tự động save khi focus change

#### Debug Configuration

Project có sẵn debug configurations trong `.vscode/launch.json`:

- **Next.js: debug server-side** - Debug server-side code
- **Next.js: debug client-side** - Debug client-side code
- **Next.js: debug full stack** - Debug cả server và client

Nhấn `F5` hoặc vào Run & Debug để sử dụng.

## 📁 Cấu trúc Project

```
self-proj/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   └── [feature]/         # Feature routes
│       └── page.tsx       # Feature page (re-export từ features/)
│
├── features/              # Feature modules (Feature-based architecture)
│   └── [feature-name]/
│       ├── page.tsx       # Main page component
│       ├── components/    # Feature-specific components
│       │   ├── index.ts   # Export all components
│       │   └── *.tsx     # Component files (lowercase-kebab-case)
│       ├── types/         # Feature-specific types
│       │   └── *.ts      # Type definitions
│       ├── schemas/       # Validation schemas (Zod, etc.)
│       ├── stores/        # State management (Zustand, etc.)
│       └── hooks/         # Feature-specific hooks
│
├── components/            # Shared components (used across features)
├── hooks/                 # Shared hooks
├── libs/                  # External library wrappers
├── utils/                 # Utility functions
├── types/                 # Global types
├── constants/             # Global constants
├── schemas/               # Global schemas
└── stores/                # Global stores
```

### Quy tắc tổ chức

1. **Feature-based architecture**: Mỗi feature là một module độc lập trong `features/`
2. **Shared resources**: Code dùng chung đặt ở root level (`components/`, `hooks/`, `utils/`, etc.)
3. **Barrel exports**: Mỗi folder có `index.ts` để export tất cả

## 📝 Naming Conventions

### Files & Folders

- **Files**: `lowercase-kebab-case.tsx` hoặc `lowercase-kebab-case.ts`
  - ✅ `person-row.tsx`
  - ✅ `discount-card.tsx`
  - ✅ `person-dto.ts`
  - ❌ `PersonRow.tsx`
  - ❌ `personRow.tsx`

- **Folders**: `lowercase-kebab-case`
  - ✅ `share-bill/`
  - ✅ `person-row/`
  - ❌ `ShareBill/`
  - ❌ `shareBill/`

### Components

- **Component names**: `PascalCase`
  - ✅ `export function PersonRow() {}`
  - ✅ `export function DiscountCard() {}`

- **Component files**: `lowercase-kebab-case.tsx`
  - ✅ `person-row.tsx` exports `PersonRow`
  - ✅ `discount-card.tsx` exports `DiscountCard`

### Types & Interfaces

- **Types**: `PascalCase` với suffix phù hợp
  - ✅ `PersonDto`
  - ✅ `PersonRowProps`
  - ✅ `DiscountCardProps`

- **Type files**: `lowercase-kebab-case.ts`
  - ✅ `person-dto.ts`
  - ✅ `api-response.ts`

### Variables & Functions

- **Variables**: `camelCase`
  - ✅ `const totalPrice = 1000`
  - ✅ `const personList = []`

- **Functions**: `camelCase`
  - ✅ `function calculateTotal() {}`
  - ✅ `const handleSubmit = () => {}`

- **Constants**: `UPPER_SNAKE_CASE`
  - ✅ `const MAX_ITEMS = 10`
  - ✅ `const API_BASE_URL = 'https://api.example.com'`

## 🎨 Code Style

### Prettier Configuration

Project sử dụng Prettier với config:

- **Tab width**: 2 spaces
- **Single quotes**: true
- **Semicolons**: true
- **Trailing commas**: ES5
- **Print width**: 100

### EditorConfig

Project có `.editorconfig` để đảm bảo consistency:

- **Indent**: 2 spaces cho TS/TSX/JS/JSX
- **End of line**: LF
- **Charset**: UTF-8

### Format Code

```bash
# Check formatting
yarn format

# Auto-fix formatting
yarn format:fix
```

## ✨ Best Practices

### 1. Component Structure

#### ✅ DO: Named exports cho tree shaking

```tsx
// components/person-row.tsx
export function PersonRow({ person }: PersonRowProps) {
  return <div>...</div>;
}

// components/index.ts
export { PersonRow } from './person-row';
```

#### ❌ DON'T: Default exports với re-export

```tsx
// ❌ Không tối ưu cho tree shaking
export default function PersonRow() {}
export { default as PersonRow } from './person-row';
```

### 2. Type Definitions

#### ✅ DO: Đặt types trong folder `types/`

```tsx
// types/person-dto.ts
export interface PersonDto {
  id: string;
  name: string;
  amount: number;
}

// components/person-row.tsx
import type { PersonDto } from '../types/person-dto';
```

#### ❌ DON'T: Đặt types inline hoặc trong component file

```tsx
// ❌ Tránh đặt types trong component file
export function PersonRow() {
  interface Person { ... } // ❌
}
```

### 3. Component Props

#### ✅ DO: Định nghĩa Props interface riêng

```tsx
// components/person-row.tsx
interface PersonRowProps {
  person: PersonDto;
  index: number;
  onUpdate: (id: string, field: string, value: unknown) => void;
}

export function PersonRow({ person, index, onUpdate }: PersonRowProps) {
  // ...
}
```

### 4. File Organization

#### ✅ DO: Tách component nhỏ, có trách nhiệm rõ ràng

```
features/share-bill/
├── components/
│   ├── page-header.tsx      # Header component
│   ├── discount-card.tsx    # Discount input card
│   ├── person-row.tsx       # Single person row
│   ├── persons-list.tsx      # List of persons
│   └── summary-card.tsx     # Summary display
└── page.tsx                 # Main page (orchestrates components)
```

#### ❌ DON'T: Một file quá lớn với nhiều components

```tsx
// ❌ Tránh
export function ShareBillPage() {
  // 500+ lines với nhiều components inline
}
```

### 5. State Management

#### ✅ DO: Sử dụng React hooks cho local state

```tsx
const [persons, setPersons] = useState<PersonDto[]>([]);
const [discount, setDiscount] = useState<number>(0);
```

#### ✅ DO: Sử dụng Zustand/Context cho global state

```tsx
// stores/user-store.ts
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 6. Imports

#### ✅ DO: Group imports theo thứ tự

```tsx
// 1. React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { formatCurrency } from 'shared-ui';

// 3. Internal imports - types first
import type { PersonDto } from './types/person-dto';

// 4. Internal imports - components
import { PersonRow, PersonsList } from './components';

// 5. Relative imports
import { calculateTotal } from './utils';
```

### 7. Path Aliases

Project sử dụng `@/*` alias cho root directory:

```tsx
// ✅ Sử dụng alias
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import type { User } from '@/types';

// ❌ Tránh relative paths dài
import { Button } from '../../../components';
```

## 📚 Examples

### Tạo Feature mới

1. **Tạo folder structure**

```bash
features/my-feature/
├── components/
│   ├── index.ts
│   └── my-component.tsx
├── types/
│   └── my-dto.ts
└── page.tsx
```

2. **Tạo component**

```tsx
// features/my-feature/components/my-component.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

3. **Export từ index**

```tsx
// features/my-feature/components/index.ts
export { MyComponent } from './my-component';
```

4. **Tạo page**

```tsx
// features/my-feature/page.tsx
'use client';

import { MyComponent } from './components';

export default function MyFeaturePage() {
  return <MyComponent title="My Feature" onAction={() => {}} />;
}
```

5. **Tạo route**

```tsx
// app/my-feature/page.tsx
import MyFeaturePage from '@/features/my-feature/page';

export default function Page() {
  return <MyFeaturePage />;
}
```

### Component với State

```tsx
'use client';

import { useState } from 'react';
import type { PersonDto } from './types/person-dto';
import { PersonRow, PersonsList } from './components';

export default function MyPage() {
  const [persons, setPersons] = useState<PersonDto[]>([]);

  const addPerson = () => {
    setPersons([...persons, { id: '1', name: '', amount: 0 }]);
  };

  return (
    <div>
      <PersonsList persons={persons} onAddPerson={addPerson} />
    </div>
  );
}
```

### Type Definition

```tsx
// types/person-dto.ts
export interface PersonDto {
  id: string;
  name: string;
  amount: number;
}

// types/api-response.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

## 🔍 Code Review Checklist

Trước khi submit PR, đảm bảo:

- [ ] Code đã được format (`yarn format:fix`)
- [ ] Không có linter errors (`yarn lint`)
- [ ] File names theo convention (lowercase-kebab-case)
- [ ] Components sử dụng named exports
- [ ] Types được định nghĩa trong folder `types/`
- [ ] Components được tách nhỏ, có trách nhiệm rõ ràng
- [ ] Imports được group và sắp xếp đúng
- [ ] Không có console.log hoặc debug code
- [ ] Code đã được test (nếu có)

## 🛠️ Tools & Libraries

### Core

- **Next.js 16**: React framework
- **React 19**: UI library
- **TypeScript 5**: Type safety

### UI

- **shared-ui**: Custom UI component library
- **Tailwind CSS 4**: Styling

### Development

- **ESLint**: Linting
- **Prettier**: Code formatting
- **EditorConfig**: Editor consistency

### Utilities

- **date-fns**: Date manipulation
- **react-hook-form**: Form handling
- **@tanstack/react-table**: Table component

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ FAQ

### Q: Khi nào nên tạo component trong `features/` vs `components/`?

**A**:

- `features/[feature]/components/`: Component chỉ dùng trong feature đó
- `components/`: Component được dùng ở nhiều features

### Q: Có nên sử dụng default export không?

**A**: Không. Luôn sử dụng named exports để tối ưu tree shaking.

### Q: Làm sao để import component từ feature khác?

**A**: Tránh import cross-feature. Nếu cần share, move component lên `components/` hoặc tạo shared component.

### Q: File có thể đặt ở đâu?

**A**:

- Components: `features/[feature]/components/` hoặc `components/`
- Types: `features/[feature]/types/` hoặc `types/`
- Utils: `features/[feature]/utils/` hoặc `utils/`
- Hooks: `features/[feature]/hooks/` hoặc `hooks/`

---

**Last updated**: 2024
