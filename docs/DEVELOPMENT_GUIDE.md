# 🛠️ Elora - Development Guide

> **Last Updated:** February 2026  
> **Version:** 1.0  
> **Minimum Node.js:** 18.17.0

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Configuration](#project-configuration)
5. [Development Workflow](#development-workflow)
6. [Database Management](#database-management)
7. [Code Style & Conventions](#code-style--conventions)
8. [Testing Strategy](#testing-strategy)
9. [Debugging](#debugging)
10. [Common Issues](#common-issues)
11. [Deployment](#deployment)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Node.js** | 18.17.0+ | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0.0+ | Package manager | Included with Node.js |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com) |
| **VS Code** | Latest | Code editor (recommended) | [code.visualstudio.com](https://code.visualstudio.com) |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## 💻 Installation

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-org/edora.git

# Or via SSH
git clone git@github.com:your-org/edora.git

# Navigate to project directory
cd edora
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- Next.js 15
- React 19
- Prisma 6
- Tailwind CSS 4
- And 30+ other packages

### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your values
# (Use Notepad, nano, vim, or any text editor)
```

**.env Configuration:**
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Development URLs
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# SMS Gateway (optional for development)
KAVENEGAR_API_KEY="your-api-key"

# Payment Gateway (optional for development)
ZARINPAL_MERCHANT_ID="your-merchant-id"
```

**Generate JWT Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator (for development only)
```

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database schema
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

✅ **Success!** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Project Configuration

### package.json Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev --turbo` | Start dev server with Turbopack |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `db:generate` | `prisma generate` | Generate Prisma Client |
| `db:push` | `prisma db push` | Sync schema to database (dev) |
| `db:migrate` | `prisma migrate dev` | Create and apply migrations |
| `db:studio` | `prisma studio` | Open database GUI |
| `db:seed` | `tsx prisma/seed.ts` | Run seeder script |

### Next.js Configuration

**next.config.ts:**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,

  // Turbopack (faster than webpack)
  experimental: {
    turbo: {
      rules: {
        '*.css': ['css'],
      },
    },
  },

  // Image optimization
  images: {
    domains: ['localhost', 'your-cdn.com'],
  },
};

export default nextConfig;
```

### TypeScript Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🔄 Development Workflow

### Daily Development Process

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Install New Dependencies (if any)**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Make Changes**
   - Edit files in `src/`
   - Hot reload automatically happens
   - Check console for errors

5. **Test Changes**
   - Manual testing in browser
   - Check different user roles
   - Verify database changes in Prisma Studio

6. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add service filtering"
   git push origin feature/service-filtering
   ```

### Git Workflow

**Branch Naming Convention:**
```
feature/   - New features (feature/booking-calendar)
fix/       - Bug fixes (fix/otp-validation)
refactor/  - Code refactoring (refactor/auth-logic)
docs/      - Documentation (docs/api-reference)
chore/     - Maintenance (chore/update-dependencies)
```

**Commit Message Convention (Conventional Commits):**
```
feat: add service filtering to search page
fix: resolve OTP expiration bug
docs: update API documentation
refactor: simplify booking validation logic
chore: update dependencies to latest versions
```

**Git Flow:**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: implement new feature"

# 3. Push to remote
git push origin feature/new-feature

# 4. Create Pull Request on GitHub
# 5. After review, merge to main
```

---

## 🗄️ Database Management

### Prisma Commands

#### 1. Generate Client
```bash
npm run db:generate
```
Generates TypeScript types and client from `schema.prisma`.  
**When to run:** After any schema changes.

#### 2. Push Schema (Development)
```bash
npm run db:push
```
Syncs schema to database without creating migration files.  
**When to use:** Rapid prototyping, development only.

#### 3. Create Migration (Production)
```bash
npm run db:migrate
```
Creates a migration file and applies it.  
**When to use:** Production-ready changes.

**Example:**
```bash
# Add new field to User model
npm run db:migrate -- --name add_user_avatar

# This creates: prisma/migrations/20260205_add_user_avatar/migration.sql
```

#### 4. Open Prisma Studio
```bash
npm run db:studio
```
Opens GUI at [http://localhost:5555](http://localhost:5555).  
**Use for:** Viewing/editing data visually.

#### 5. Seed Database
```bash
npm run db:seed
```
Runs `prisma/seed.ts` to populate sample data.

### Schema Change Workflow

**Example: Add `rating` field to Vendor**

1. **Edit schema:**
   ```prisma
   model Vendor {
     // ... existing fields
     rating Float? @default(0)
   }
   ```

2. **Generate client:**
   ```bash
   npm run db:generate
   ```

3. **Create migration:**
   ```bash
   npm run db:migrate -- --name add_vendor_rating
   ```

4. **Verify in Prisma Studio:**
   ```bash
   npm run db:studio
   ```

### Database Reset (⚠️ Destroys all data)

```bash
# Delete database and recreate
npx prisma migrate reset

# Or manually delete dev.db
rm prisma/dev.db
npm run db:push
npm run db:seed
```

---

## 📝 Code Style & Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ServiceCard.tsx` |
| Pages | kebab-case | `vendor-register/page.tsx` |
| Utilities | camelCase | `timeUtils.ts` |
| Types | PascalCase | `VendorCalendar.ts` |
| Constants | UPPER_SNAKE_CASE | `API_URLS.ts` |

### Component Structure

**Recommended Order:**
```typescript
'use client'; // If client component

import statements...

// Types/Interfaces
interface Props {
  // ...
}

// Component
export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Derived values
  const computedValue = useMemo(() => {}, []);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Handlers
  const handleClick = () => {};
  
  // 5. Render
  return (
    <div>...</div>
  );
}

// 6. Sub-components (if any)
function SubComponent() {
  return <div>...</div>;
}
```

### Naming Conventions

**Variables & Functions:**
```typescript
// ✅ Good
const userBookings = await getCustomerBookings(userId);
const isAuthenticated = checkAuth();

// ❌ Bad
const x = await get(id);
const check = chk();
```

**Components:**
```typescript
// ✅ Good
export function ServiceCard({ service }: ServiceCardProps) {}

// ❌ Bad
export default function Card(props: any) {}
```

**Server Actions:**
```typescript
// ✅ Good
export async function createService(data: ServiceFormData) {}

// ❌ Bad
export async function create(x: any) {}
```

### TypeScript Best Practices

1. **Always define types:**
   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
   }
   
   // ❌ Bad
   const user: any = {};
   ```

2. **Use Zod for validation:**
   ```typescript
   const schema = z.object({
     name: z.string().min(2),
     price: z.number().positive(),
   });
   
   type FormData = z.infer<typeof schema>;
   ```

3. **Leverage Prisma types:**
   ```typescript
   import { Vendor, Service } from '@prisma/client';
   
   type VendorWithServices = Vendor & {
     services: Service[];
   };
   ```

### CSS/Tailwind Best Practices

1. **Use Tailwind utilities:**
   ```tsx
   // ✅ Good
   <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow">
   
   // ❌ Bad
   <div style={{ display: 'flex', padding: '24px' }}>
   ```

2. **Extract repeated patterns:**
   ```typescript
   // lib/utils.ts
   export const cardClass = "rounded-lg bg-white p-6 shadow";
   
   // Usage
   <div className={cardClass}>
   ```

3. **Use `cn()` for conditional classes:**
   ```typescript
   import { cn } from '@/lib/utils';
   
   <button className={cn(
     "px-4 py-2 rounded",
     isPrimary && "bg-blue-500 text-white",
     isDisabled && "opacity-50 cursor-not-allowed"
   )}>
   ```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Customer login with OTP
- [ ] Vendor registration flow
- [ ] Session persistence across page reloads
- [ ] Logout functionality

**Customer Flow:**
- [ ] Browse vendors
- [ ] Search and filter
- [ ] View vendor details
- [ ] Book appointment
- [ ] View bookings in dashboard

**Vendor Flow:**
- [ ] Create/edit services
- [ ] Manage staff
- [ ] Set schedules
- [ ] View bookings
- [ ] Approve/cancel bookings

**Edge Cases:**
- [ ] Booking collision prevention
- [ ] OTP expiration
- [ ] Invalid form inputs
- [ ] Network errors

### Testing Tools (To Be Implemented)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🐛 Debugging

### Development Tools

**1. React Developer Tools**
- Chrome extension for inspecting React components
- Download: [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/)

**2. Prisma Studio**
```bash
npm run db:studio
```
- Visual database browser
- Edit data directly

**3. VS Code Debugger**

**launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Debugging Techniques

**1. Console Logging:**
```typescript
console.log('User ID:', userId);
console.table(bookings);
console.error('Error:', error);
```

**2. Server Action Debugging:**
```typescript
export async function createService(data: ServiceFormData) {
  console.log('📥 Received data:', data);
  
  try {
    const result = await prisma.service.create({ data });
    console.log('✅ Created service:', result);
    return { success: true };
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error: 'Failed' };
  }
}
```

**3. Database Query Logging:**

**prisma/schema.prisma:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

---

## ⚠️ Common Issues

### Issue 1: "Prisma Client Not Generated"

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run db:generate
```

---

### Issue 2: "Database Locked" (SQLite)

**Error:**
```
database is locked
```

**Solution:**
```bash
# Close Prisma Studio and other DB connections
# Then restart dev server
npm run dev
```

---

### Issue 3: "Module Not Found"

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
1. Check path alias in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. Restart VS Code/dev server

---

### Issue 4: "Hydration Error"

**Error:**
```
Text content does not match server-rendered HTML
```

**Causes:**
- Using browser-only APIs in Server Components
- Date/time formatting differences
- Random values without consistent seeding

**Solution:**
```typescript
// ✅ Good - Use dynamic rendering
import { headers } from 'next/headers';

export default async function Page() {
  await headers(); // Forces dynamic rendering
  return <div>{new Date().toLocaleDateString()}</div>;
}

// Or mark as client component
'use client';
export default function Page() {
  return <div>{new Date().toLocaleDateString()}</div>;
}
```

---

### Issue 5: "Session Not Found"

**Error:**
```
Unauthorized. Please log in.
```

**Solution:**
1. Check cookie in browser DevTools
2. Verify `JWT_SECRET` in `.env`
3. Clear cookies and login again

---

## 🚀 Deployment

### Deployment to Vercel (Recommended)

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Login:**
```bash
vercel login
```

**3. Deploy:**
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

**4. Set Environment Variables:**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add all variables from `.env`

**5. Configure Database:**
- Use Vercel Postgres, Supabase, or Railway
- Update `DATABASE_URL` in Vercel environment variables

---

### Deployment to Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/elora
      JWT_SECRET: your-secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: elora
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Main README](../README.md)

### External Links
- [Next.js Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [Tailwind UI Components](https://tailwindui.com/)

---

## 🤝 Contributing

### Pull Request Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Checklist

- [ ] Code follows style conventions
- [ ] All TypeScript types defined
- [ ] Zod validation for user inputs
- [ ] Error handling implemented
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)
- [ ] No console.log in production code
- [ ] Environment variables not exposed

---

**Questions or Issues?**  
Create an issue on GitHub or contact the development team.

**Happy Coding! 🚀**
