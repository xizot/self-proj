This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Yarn

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn format       # Check Prettier formatting
yarn format:fix   # Auto-fix Prettier formatting
```

## 📚 Development Guides

- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh để bắt đầu
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Hướng dẫn chi tiết về:
  - Cấu trúc project
  - Naming conventions
  - Code style & best practices
  - Examples & templates
  - Code review checklist

## 🏗️ Project Structure

```
self-proj/
├── app/              # Next.js App Router pages
├── features/         # Feature modules (feature-based architecture)
├── components/       # Shared components
├── hooks/           # Shared hooks
├── utils/           # Utility functions
├── types/           # Global types
└── ...
```

Xem [DEVELOPMENT.md](./DEVELOPMENT.md) để biết chi tiết về cấu trúc project.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shared-ui (custom component library)
- **Form Handling**: react-hook-form
- **Code Quality**: ESLint, Prettier

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
