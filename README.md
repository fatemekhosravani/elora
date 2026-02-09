# 💎 Elora - Beauty Services Marketplace

> **مارکت‌پلیس خدمات زیبایی | Beauty Services Marketplace**  
> A modern, production-ready platform connecting customers with beauty service providers.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)

---
## [CLICK FOR DEMO - DONT USE VPN](https://hirecheck.ir/)
## ✨ Features

### 🌍 Multi-Language & RTL Support
- 🇮🇷 **Native Persian (Farsi)** language support
- **RTL (Right-to-Left)** layout for optimal reading experience
- **Vazirmatn Font** for beautiful typography

### 👥 Multi-Role Architecture
- **Customers** - Browse, book, and manage appointments
- **Vendors** - Manage services, staff, and bookings
- **Staff** - Service providers (planned)
- **Admins** - Platform management

### 🔐 Secure Authentication
- **OTP-based** phone number verification
- **JWT sessions** with HTTP-only cookies
- **Role-based access control** (RBAC)

### 💼 Vendor Features
- Service catalog management
- Staff scheduling system
- Booking calendar with collision detection
- Financial dashboard
- Real-time availability management

### 📅 Smart Booking System
- Date and time slot selection
- Automatic collision prevention
- Deposit-based reservations
- Booking status tracking

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Modern UI with smooth animations

---

## 📚 Documentation

### 📖 Complete Documentation Suite

| Document | Description | Link |
|----------|-------------|------|
| **🚀 Getting Started** | Installation & setup guide | [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) |
| **🏗️ Architecture** | System design & structure | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| **📘 API Reference** | Complete API documentation | [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) |
| **🗄️ Database Schema** | Database design & ERD | [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17.0 or higher
- **npm** 9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/edora.git
cd edora

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

✅ **Open [http://localhost:3000](http://localhost:3000)** in your browser.

> **📘 For detailed setup instructions, see [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)**

---

## 🏗️ Project Structure

```
edora/
├── docs/                          # 📚 Complete documentation
│   ├── API_DOCUMENTATION.md       # API endpoints & usage
│   ├── DATABASE_SCHEMA.md         # Database design & ERD
│   ├── ARCHITECTURE.md            # System architecture
│   └── DEVELOPMENT_GUIDE.md       # Setup & development
│
├── prisma/                        # 🗄️ Database
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Sample data seeder
│
├── src/
│   ├── app/                       # 📄 Next.js App Router pages
│   │   ├── (public)/              # Public pages
│   │   ├── (auth)/                # Authentication pages
│   │   ├── (dashboard)/           # Customer dashboard
│   │   ├── (vendor)/              # Vendor panel
│   │   └── (admin)/               # Admin panel
│   │
│   ├── actions/                   # 🎬 Server Actions (API)
│   │   ├── auth.ts                # Authentication
│   │   ├── booking.ts             # Booking management
│   │   ├── services.ts            # Service CRUD
│   │   ├── staff.ts               # Staff management
│   │   └── schedule.ts            # Schedule management
│   │
│   ├── components/                # 🧩 React components
│   │   ├── ui/                    # Atomic UI components
│   │   ├── layout/                # Layout components
│   │   ├── vendor/                # Vendor-specific components
│   │   └── ...                    # Feature-specific components
│   │
│   └── lib/                       # 🛠️ Utilities
│       ├── prisma.ts              # Database client
│       ├── session.ts             # JWT session management
│       └── data/                  # Data fetching layers
│
└── public/                        # Static assets
```

---

## 💻 Tech Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.1.4 | Full-stack React framework |
| **Language** | TypeScript | Latest | Type-safe development |
| **UI Library** | React | 19.0.0 | User interface |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS |
| **Database** | SQLite/PostgreSQL | - | Data persistence |
| **ORM** | Prisma | 6.1.0 | Type-safe database access |
| **Auth** | JWT (Jose) | 6.1.3 | Session management |
| **Validation** | Zod | 4.3.6 | Schema validation |
| **Forms** | React Hook Form | 7.71.1 | Form management |

### UI Components & Libraries

- **Radix UI** - Headless accessible components
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **date-fns** - Date manipulation

> **📘 For complete tech stack details, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md)**

---

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with Turbopack |
| `build` | `npm run build` | Create production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `db:generate` | `npm run db:generate` | Generate Prisma Client |
| `db:push` | `npm run db:push` | Sync schema to database |
| `db:migrate` | `npm run db:migrate` | Create and apply migration |
| `db:studio` | `npm run db:studio` | Open Prisma Studio GUI |
| `db:seed` | `npm run db:seed` | Seed database with sample data |

---

## 🔐 Authentication Flow

Elora uses **OTP-based authentication** via phone numbers:

1. **Customer Login** - SMS verification → Dashboard
2. **Vendor Registration** - OTP verification → Business details → Vendor panel
3. **Session Management** - JWT tokens in HTTP-only cookies (7-day expiration)

> **📘 For detailed auth flow, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md#authentication-flow)**

---

## 🗄️ Database

### Schema Overview

**Core Models:**
- **User** - Platform users (customers, vendors, admins)
- **Vendor** - Business profiles (salons, spas, barbershops)
- **Service** - Individual treatments (haircut, manicure, etc.)
- **Staff** - Service providers
- **Booking** - Appointments with collision detection
- **Transaction** - Payment tracking

**Key Features:**
- ✅ Optimized indexes for performance
- ✅ Foreign key constraints
- ✅ Cascade/restrict delete rules
- ✅ Prisma ORM for type safety

> **📘 For complete database documentation, see [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)**

---

## 🛠️ Development

### Workflow

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Start dev server
npm run dev

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Code Guidelines

- ✅ **TypeScript** - All files must be typed
- ✅ **Server Actions** - Use for API logic
- ✅ **Zod Validation** - Validate all user inputs
- ✅ **Prisma** - Type-safe database queries
- ✅ **Tailwind** - Use utility classes
- ✅ **Conventional Commits** - Follow commit conventions

> **📘 For complete development guide, see [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)**

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

> **📘 For deployment instructions, see [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md#deployment)**

---

## 📊 API Documentation

All APIs are implemented as **Next.js Server Actions** for type safety and performance.

### Example API Usage

**Authentication:**
```typescript
import { sendOtp, verifyOtp } from '@/actions/auth';

// Send OTP
const result = await sendOtp('09123456789');

// Verify OTP
const auth = await verifyOtp('09123456789', '12345');
```

**Booking:**
```typescript
import { initiateBooking } from '@/actions/booking';

const booking = await initiateBooking(
  serviceId,
  staffId,
  '1403-12-01',
  '10:00'
);
```

> **📘 For complete API reference, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)**

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add vendor rating system
fix: resolve booking collision bug
docs: update API documentation
refactor: improve authentication logic
chore: update dependencies
```

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Team

Developed with ❤️ by the Elora Development Team

---

## 📞 Support

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/edora/issues)
- **Email:** support@elora.com

---

## 🔮 Roadmap

### Planned Features

- [ ] **Payment Gateway Integration** (ZarinPal, IDPay)
- [ ] **SMS Gateway** (Kavenegar)
- [ ] **Rating & Review System**
- [ ] **Favorites/Wishlist**
- [ ] **Push Notifications**
- [ ] **Real-time Updates** (WebSocket)
- [ ] **Advanced Analytics**
- [ ] **Mobile App** (React Native)

---

**⭐️ If you find this project useful, please consider giving it a star!**


