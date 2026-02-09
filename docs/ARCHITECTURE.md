# 🏗️ Elora - Architecture Documentation

> **Last Updated:** February 2026  
> **Version:** 1.0  
> **Framework:** Next.js 15 (App Router)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Routing Architecture](#routing-architecture)
6. [Authentication Flow](#authentication-flow)
7. [Data Flow](#data-flow)
8. [Component Architecture](#component-architecture)
9. [State Management](#state-management)
10. [Security Architecture](#security-architecture)
11. [Deployment Architecture](#deployment-architecture)

---

## 📖 Overview

Elora is a **beauty services marketplace** built as a modern, production-ready web application. The platform connects:
- **Customers** seeking beauty services
- **Vendors** (salons, barbershops, spas) offering services
- **Staff** providing services
- **Admins** managing the platform

### Design Principles

1. **Type Safety:** TypeScript everywhere
2. **Server-First:** Leverage Next.js Server Components & Actions
3. **Progressive Enhancement:** Works without JavaScript when possible
4. **RTL Support:** Native Persian/Farsi language support
5. **Performance:** Optimized for Core Web Vitals
6. **Security:** Authentication, authorization, and input validation

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Tablet     │          │
│  │   (Chrome)   │  │   (Safari)   │  │   (iPad)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
│  ┌────────────────────────────────────────────────────────┐     │
│  │            Next.js 15 (App Router)                     │     │
│  │  ┌──────────────────────────────────────────────┐     │     │
│  │  │  React Server Components (RSC)               │     │     │
│  │  │  - Server-side rendering                      │     │     │
│  │  │  - Zero client JavaScript by default         │     │     │
│  │  └──────────────────────────────────────────────┘     │     │
│  │  ┌──────────────────────────────────────────────┐     │     │
│  │  │  Client Components                           │     │     │
│  │  │  - Interactive UI elements                   │     │     │
│  │  │  - Form handling                             │     │     │
│  │  └──────────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │            Server Actions (API Layer)                  │     │
│  │  - Authentication (OTP, Sessions)                      │     │
│  │  - Booking Management                                  │     │
│  │  - Service CRUD                                        │     │
│  │  - Staff Management                                    │     │
│  │  - Schedule Management                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │            Middleware Layer                            │     │
│  │  - Route Protection                                    │     │
│  │  - Session Verification                                │     │
│  │  - Role-Based Access Control                           │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                       DATA ACCESS LAYER                          │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              Prisma ORM                                │     │
│  │  - Type-safe database queries                          │     │
│  │  - Migration management                                │     │
│  │  - Connection pooling                                  │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌────────────────────────────────────────────────────────┐     │
│  │         SQLite (Dev) / PostgreSQL (Prod)               │     │
│  │  - User data                                           │     │
│  │  - Vendor catalog                                      │     │
│  │  - Booking records                                     │     │
│  │  - Transaction history                                 │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│  - Payment Gateway (ZarinPal/IDPay) - To be integrated          │
│  - SMS Service (Kavenegar) - To be integrated                   │
│  - CDN (for images) - To be configured                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.4 | React framework with App Router |
| **React** | 19.0.0 | UI library |
| **TypeScript** | Latest | Type safety |
| **Tailwind CSS** | 4.0 | Styling framework |
| **Framer Motion** | 12.31.0 | Animations |
| **Lucide React** | Latest | Icon library |
| **Radix UI** | Latest | Headless UI components |
| **React Hook Form** | 7.71.1 | Form management |
| **Zod** | 4.3.6 | Schema validation |
| **date-fns** | 4.1.0 | Date manipulation |
| **Recharts** | 3.7.0 | Data visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js Server Actions** | 15.1.4 | API layer |
| **Prisma** | 6.1.0 | ORM & database toolkit |
| **Jose** | 6.1.3 | JWT handling |
| **SQLite** | - | Development database |
| **PostgreSQL** | - | Production database (planned) |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Turbopack** | Fast development builds |
| **Faker.js** | Test data generation |
| **Prisma Studio** | Database GUI |

---

## 📁 Project Structure

```
edora/
├── docs/                          # 📚 Documentation
│   ├── API_DOCUMENTATION.md       # API endpoints reference
│   ├── DATABASE_SCHEMA.md         # Database design
│   ├── ARCHITECTURE.md            # This file
│   └── DEVELOPMENT_GUIDE.md       # Setup & development guide
│
├── prisma/                        # 🗄️ Database
│   ├── schema.prisma              # Database schema definition
│   ├── seed.ts                    # Sample data seeder
│   └── dev.db                     # SQLite database (dev)
│
├── src/
│   ├── app/                       # 📄 Pages & Routes (App Router)
│   │   ├── (public)/              # Public pages (landing, search, vendor)
│   │   │   ├── landing/
│   │   │   ├── search/
│   │   │   ├── vendor/[slug]/
│   │   │   └── about/
│   │   │
│   │   ├── (auth)/                # Authentication pages
│   │   │   ├── login/
│   │   │   └── vendor-register/
│   │   │
│   │   ├── (dashboard)/           # Customer dashboard
│   │   │   └── panel/
│   │   │       ├── page.tsx       # Dashboard home
│   │   │       ├── appointments/
│   │   │       ├── favorites/
│   │   │       └── profile/
│   │   │
│   │   ├── (vendor)/              # Vendor dashboard
│   │   │   └── vendor-panel/
│   │   │       ├── dashboard/
│   │   │       ├── bookings/
│   │   │       ├── calendar/
│   │   │       ├── services/
│   │   │       ├── staff/
│   │   │       ├── schedule/
│   │   │       └── finance/
│   │   │
│   │   ├── (admin)/               # Admin panel
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── users/
│   │   │       └── vendors/
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage (redirects to /landing)
│   │   └── globals.css            # Global styles
│   │
│   ├── actions/                   # 🎬 Server Actions (API)
│   │   ├── auth.ts                # Customer authentication
│   │   ├── vendor-auth.ts         # Vendor registration
│   │   ├── booking.ts             # Booking management
│   │   ├── services.ts            # Service CRUD
│   │   ├── staff.ts               # Staff management
│   │   └── schedule.ts            # Schedule management
│   │
│   ├── components/                # 🧩 React Components
│   │   ├── ui/                    # Atomic UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── service-card.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── header-client.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── landing/               # Landing page components
│   │   │   └── hero-search.tsx
│   │   │
│   │   ├── search/                # Search page components
│   │   │   ├── filter-sidebar.tsx
│   │   │   └── mobile-filters.tsx
│   │   │
│   │   ├── dashboard/             # Customer dashboard components
│   │   │   └── panel-sidebar.tsx
│   │   │
│   │   ├── vendor/                # Vendor dashboard components
│   │   │   ├── appointment-block.tsx
│   │   │   ├── appointment-popover.tsx
│   │   │   ├── booking-actions.tsx
│   │   │   ├── create-service-modal.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── day-row.tsx
│   │   │   ├── income-donut.tsx
│   │   │   ├── performance-sparkline.tsx
│   │   │   ├── staff-card.tsx
│   │   │   ├── staff-selector-modal.tsx
│   │   │   ├── time-grid.tsx
│   │   │   ├── time-slider.tsx
│   │   │   ├── transaction-list.tsx
│   │   │   ├── vendor-details.tsx
│   │   │   └── wallet-card.tsx
│   │   │
│   │   ├── admin/                 # Admin panel components
│   │   │   ├── activity-feed.tsx
│   │   │   ├── growth-chart.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   └── stat-card.tsx
│   │   │
│   │   └── about/                 # About page components
│   │       └── developer-card.tsx
│   │
│   ├── lib/                       # 🛠️ Utilities & Helpers
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── session.ts             # JWT session management
│   │   ├── get-session.ts         # Session helper
│   │   ├── utils.ts               # General utilities (cn, etc.)
│   │   ├── time-utils.ts          # Time formatting utilities
│   │   ├── availability.ts        # Booking availability logic
│   │   └── data/                  # Data fetching layers
│   │       ├── public-api.ts      # Public data access
│   │       └── customer-api.ts    # Customer data access
│   │
│   ├── types/                     # 📝 TypeScript Types
│   │   └── vendor-calendar.ts    # Calendar-specific types
│   │
│   └── middleware.ts              # 🚦 Route middleware (auth)
│
├── public/                        # 📦 Static Assets
│   ├── images/
│   └── fonts/
│
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── .gitignore
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind configuration
├── postcss.config.mjs             # PostCSS configuration
├── package.json                   # Dependencies
└── README.md                      # Project overview
```

---

## 🛣️ Routing Architecture

### Route Groups

Next.js App Router uses route groups (folders with parentheses) to organize routes without affecting URLs.

| Route Group | Purpose | Layout | Authentication |
|-------------|---------|--------|----------------|
| `(public)` | Public-facing pages | Minimal header | Not required |
| `(auth)` | Login & registration | Clean layout | Redirect if logged in |
| `(dashboard)` | Customer portal | Sidebar + header | Required (CUSTOMER) |
| `(vendor)` | Vendor management | Sidebar + header | Required (VENDOR_OWNER) |
| `(admin)` | Admin panel | Admin sidebar | Required (ADMIN) |

### Route Structure

```
URL                                    File Path                           Role Required
─────────────────────────────────────────────────────────────────────────────────────────
/                                      app/page.tsx                        None (redirect)
/landing                               app/(public)/landing/page.tsx       None
/search                                app/(public)/search/page.tsx        None
/about                                 app/(public)/about/page.tsx         None
/vendor/[slug]                         app/(public)/vendor/[slug]/page.tsx None
/vendor/[slug]/book                    app/(public)/vendor/[slug]/book/    None

/login                                 app/(auth)/login/page.tsx           None
/vendor-register                       app/(auth)/vendor-register/page.tsx None

/panel                                 app/(dashboard)/panel/page.tsx      CUSTOMER
/panel/appointments                    app/(dashboard)/panel/appointments/ CUSTOMER
/panel/favorites                       app/(dashboard)/panel/favorites/    CUSTOMER
/panel/profile                         app/(dashboard)/panel/profile/      CUSTOMER

/vendor-panel                          app/(vendor)/vendor-panel/page.tsx            VENDOR_OWNER
/vendor-panel/dashboard                app/(vendor)/vendor-panel/dashboard/          VENDOR_OWNER
/vendor-panel/bookings                 app/(vendor)/vendor-panel/bookings/           VENDOR_OWNER
/vendor-panel/calendar                 app/(vendor)/vendor-panel/calendar/           VENDOR_OWNER
/vendor-panel/services                 app/(vendor)/vendor-panel/services/           VENDOR_OWNER
/vendor-panel/staff                    app/(vendor)/vendor-panel/staff/              VENDOR_OWNER
/vendor-panel/schedule                 app/(vendor)/vendor-panel/schedule/           VENDOR_OWNER
/vendor-panel/finance                  app/(vendor)/vendor-panel/finance/            VENDOR_OWNER

/admin/dashboard                       app/(admin)/admin/dashboard/page.tsx ADMIN
/admin/users                           app/(admin)/admin/users/page.tsx     ADMIN
/admin/vendors                         app/(admin)/admin/vendors/page.tsx   ADMIN
```

---

## 🔐 Authentication Flow

### 1. Customer Login Flow

```
┌──────────┐
│  User    │
│ Arrives  │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ /login Page     │
│                 │
│ [Phone Input]   │
│ [Send OTP Btn]  │
└────┬────────────┘
     │
     │ sendOtp(phone)
     ▼
┌────────────────────┐
│ Server Action      │
│ - Generate 5-digit │
│ - Save to DB       │
│ - (Send SMS)       │
└────┬───────────────┘
     │
     ▼
┌─────────────────┐
│ /login Page     │
│                 │
│ [OTP Input]     │
│ [Verify Btn]    │
└────┬────────────┘
     │
     │ verifyOtp(phone, code)
     ▼
┌────────────────────┐
│ Server Action      │
│ - Verify OTP       │
│ - Find/Create User │
│ - Create Session   │
│ - Set Cookie       │
└────┬───────────────┘
     │
     ▼
┌──────────────────┐
│ Redirect Based   │
│ on Role:         │
│ - CUSTOMER → /panel
│ - VENDOR → /vendor-panel
│ - ADMIN → /admin
└──────────────────┘
```

### 2. Vendor Registration Flow

```
┌──────────────────┐
│ /vendor-register │
│                  │
│ Step 1: Phone    │
│ [Send OTP]       │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Step 2: Verify   │
│ [OTP Input]      │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Step 3: Details  │
│ - Business Name  │
│ - Slug           │
│ - Category       │
│ - Address        │
│ - Bio            │
│ [Register]       │
└────┬─────────────┘
     │
     │ registerVendor(data)
     ▼
┌────────────────────┐
│ Server Action      │
│ - Create/Update    │
│   User             │
│ - Set role to      │
│   VENDOR_OWNER     │
│ - Create Vendor    │
└────┬───────────────┘
     │
     ▼
┌──────────────────┐
│ Success!         │
│ Redirect to      │
│ /vendor-panel    │
└──────────────────┘
```

### 3. Session Management

**Session Structure:**
```typescript
interface SessionPayload {
  userId: string;
  role: Role;
  expiresAt: Date;
}
```

**Cookie Configuration:**
```typescript
{
  name: "session",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}
```

**Middleware Protection:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession();
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/panel')) {
    if (!session || session.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  if (request.nextUrl.pathname.startsWith('/vendor-panel')) {
    if (!session || session.role !== 'VENDOR_OWNER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // ... etc
}
```

---

## 🔄 Data Flow

### Server Components vs Client Components

**Server Components (Default):**
- Data fetching happens on server
- No JavaScript sent to client
- Direct database access via Prisma
- SEO-friendly

**Client Components (`'use client'`):**
- Interactive elements (forms, modals)
- Event handlers
- Hooks (useState, useEffect)
- Browser APIs

### Example: Vendor Dashboard Page

```
┌──────────────────────────────────────────┐
│ app/(vendor)/vendor-panel/dashboard/     │
│ page.tsx (Server Component)              │
│                                          │
│ 1. await getSession()                    │
│ 2. await getVendorStats(vendorId)        │
│ 3. await getRecentBookings(vendorId)     │
│ 4. Render with data                       │
└────────────┬─────────────────────────────┘
             │
             │ Server-side data fetching
             ▼
┌────────────────────────────────────────┐
│ lib/data/vendor-api.ts                 │
│                                        │
│ export async function getVendorStats() {│
│   return await prisma.booking.count()  │
│ }                                      │
└────────────┬───────────────────────────┘
             │
             │ Prisma query
             ▼
┌────────────────────────┐
│  Database (SQLite)     │
└────────────────────────┘
```

### Example: Booking Form (Client Component)

```
┌──────────────────────────────────────────┐
│ components/booking/booking-form.tsx      │
│ ('use client')                           │
│                                          │
│ 1. User fills form                       │
│ 2. onSubmit: call initiateBooking()      │
│ 3. Handle response                       │
└────────────┬─────────────────────────────┘
             │
             │ Server Action call
             ▼
┌────────────────────────────────────────┐
│ actions/booking.ts                     │
│ ('use server')                         │
│                                        │
│ 1. Validate input (Zod)                │
│ 2. Check authentication                │
│ 3. Check availability                  │
│ 4. Create booking transaction          │
│ 5. Return result                       │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────┐
│  Database              │
└────────────────────────┘
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
Root Layout
├── Header (Server Component)
│   └── HeaderClient (Client Component)
│       ├── Navigation
│       └── User Menu
│
└── Page (Server Component)
    ├── Server Components (data fetching)
    │   ├── VendorList
    │   └── ServiceList
    │
    └── Client Components (interactivity)
        ├── SearchBar
        ├── FilterSidebar
        └── BookingModal
            ├── DatePicker
            ├── TimePicker
            └── PaymentForm
```

### Component Patterns

#### 1. Compound Components
```typescript
// data-table.tsx
<DataTable>
  <DataTableHeader />
  <DataTableBody />
  <DataTablePagination />
</DataTable>
```

#### 2. Render Props
```typescript
<StaffSelector
  render={(staff) => <StaffCard {...staff} />}
/>
```

#### 3. Composition
```typescript
// Modal with flexible content
<Modal>
  <ModalHeader>
    <ModalTitle>Create Service</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <ServiceForm />
  </ModalBody>
</Modal>
```

---

## 🗂️ State Management

### Server State
- **Managed by:** React Server Components
- **Caching:** Next.js automatic caching
- **Revalidation:** `revalidatePath()` after mutations

### Client State
- **Forms:** React Hook Form
- **UI State:** React useState
- **Global State:** Not needed (server state preferred)

### Cache Strategy

```typescript
// Automatic ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

// Manual revalidation after mutation
await createService(data);
revalidatePath('/vendor-panel/services');
```

---

## 🔒 Security Architecture

### Layers of Security

1. **Authentication**
   - OTP-based phone verification
   - JWT sessions in HTTP-only cookies
   - 7-day token expiration

2. **Authorization**
   - Middleware-based route protection
   - Server Action permission checks
   - Database-level ownership verification

3. **Input Validation**
   - Zod schemas for all inputs
   - Type safety via TypeScript
   - Prisma prevents SQL injection

4. **Output Sanitization**
   - React automatic XSS protection
   - No `dangerouslySetInnerHTML` usage

5. **CSRF Protection**
   - Next.js Server Actions have built-in protection
   - SameSite cookie policy

### Security Checklist

- ✅ Passwords: Not used (OTP only)
- ✅ Session tokens: HTTP-only cookies
- ✅ API inputs: Zod validation
- ✅ Database queries: Parameterized (Prisma)
- ✅ Rate limiting: **TODO** (needs implementation)
- ✅ HTTPS: Required in production
- ✅ Environment variables: Never exposed to client

---

## 🚀 Deployment Architecture

### Recommended Hosting

**Option 1: Vercel (Recommended)**
```
┌─────────────────────────────────────┐
│  Vercel Edge Network (CDN)          │
│  - Static assets                    │
│  - Server-side rendering            │
│  - Edge middleware                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Serverless Functions               │
│  - Next.js API routes               │
│  - Server Actions                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Database (PostgreSQL)              │
│  - Vercel Postgres or               │
│  - Supabase or                      │
│  - Railway                          │
└─────────────────────────────────────┘
```

**Option 2: Docker + VPS**
```
┌─────────────────────────────────────┐
│  Nginx (Reverse Proxy)              │
│  - SSL/TLS termination              │
│  - Static file serving              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Next.js Container                  │
│  - Node.js runtime                  │
│  - Production build                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  PostgreSQL Container               │
│  - Persistent volume                │
└─────────────────────────────────────┘
```

### Environment Configuration

**Development:**
```env
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-change-in-production"
```

**Production:**
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/elora"
JWT_SECRET="<strong-random-secret>"
NEXT_PUBLIC_SITE_URL="https://elora.com"
```

### Build Process

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Run migrations
npm run db:migrate

# 4. Build Next.js
npm run build

# 5. Start production server
npm start
```

---

## 📊 Performance Considerations

### Optimization Strategies

1. **Database**
   - Indexed queries (see DATABASE_SCHEMA.md)
   - Connection pooling via Prisma
   - N+1 query prevention

2. **Frontend**
   - Server Components by default
   - Code splitting per route
   - Image optimization (Next.js Image)
   - Font optimization (Vazirmatn subset)

3. **Caching**
   - Static page generation where possible
   - On-demand revalidation
   - Browser caching for static assets

4. **Bundle Size**
   - Tree shaking unused code
   - Dynamic imports for heavy components
   - Tailwind CSS purging

---

## 🔮 Future Enhancements

### Planned Architecture Improvements

1. **Microservices**
   - Separate payment service
   - Notification service (SMS/Email)
   - Analytics service

2. **Real-time Features**
   - WebSocket for live booking updates
   - Push notifications
   - Live chat support

3. **Advanced Caching**
   - Redis for session storage
   - CDN for static assets
   - Database query caching

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (Vercel Analytics)
   - Database monitoring

5. **Testing**
   - Unit tests (Jest/Vitest)
   - Integration tests (Playwright)
   - E2E tests
   - Load testing

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Questions or Issues?**  
Please refer to the main [README.md](../README.md) or contact the development team.
