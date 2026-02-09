# 🗄️ Elora - Database Schema Documentation

> **Last Updated:** February 2026  
> **Version:** 1.0  
> **Database:** SQLite (Development) / PostgreSQL (Production Ready)  
> **ORM:** Prisma 6.1.0

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Data Models](#data-models)
4. [Enumerations](#enumerations)
5. [Relationships](#relationships)
6. [Indexes](#indexes)
7. [Constraints](#constraints)
8. [Migration Guide](#migration-guide)

---

## 📖 Overview

Elora's database schema is designed for a beauty services marketplace connecting customers with vendors (salons, barbershops, spas).

### Key Features
- ✅ Multi-role user system (Customer, Vendor Owner, Staff, Admin)
- ✅ Flexible vendor-service-staff relationships
- ✅ Recurring schedule management
- ✅ Booking collision prevention
- ✅ Payment tracking with transaction history
- ✅ OTP-based authentication

### Database Configuration

```prisma
datasource db {
  provider = "sqlite"           // Development
  url      = "file:./dev.db"
}

// For Production (PostgreSQL):
// provider = "postgresql"
// url      = env("DATABASE_URL")
```

---

## 🎨 Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│  (Customer/ │
│   Vendor/   │
│   Admin)    │
└──────┬──────┘
       │
       │ 1:1 (optional)
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────┐
│   Vendor     │   │   Booking       │
│  (Business)  │   │  (Appointment)  │
└──────┬───────┘   └────────┬────────┘
       │                    │
       │ 1:N                │ N:1
       ├─────────┬──────────┤
       │         │          │
       ▼         ▼          ▼
┌──────────┐ ┌────────┐ ┌──────────────┐
│ Service  │ │ Staff  │ │ Transaction  │
│(Haircut) │ │(Stylist)│ │  (Payment)   │
└────┬─────┘ └───┬────┘ └──────────────┘
     │           │
     │ N:M       │
     └─────┬─────┘
           │
           ▼
    ┌──────────────┐
    │StaffService  │
    │  (Pivot)     │
    └──────────────┘
           │
           ▼
    ┌──────────────────┐
    │ StaffSchedule    │
    │(Weekly Hours)    │
    └──────────────────┘
    
    ┌──────────────────┐
    │VerificationCode  │
    │   (OTP Auth)     │
    └──────────────────┘
```

---

## 📊 Data Models

### 1. User

**Purpose:** Core entity for all platform users

```prisma
model User {
  id          String   @id @default(cuid())
  phoneNumber String   @unique
  fullName    String?
  email       String?  @unique
  role        Role     @default(CUSTOMER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  vendor       Vendor?
  bookings     Booking[]
  transactions Transaction[]

  @@index([phoneNumber])
  @@map("users")
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `phoneNumber` | String | Unique, Indexed | Primary authentication method (format: `09XXXXXXXXX`) |
| `fullName` | String? | Optional | Display name |
| `email` | String? | Unique, Optional | Secondary contact |
| `role` | Role Enum | Default: CUSTOMER | User type (CUSTOMER, VENDOR_OWNER, STAFF, ADMIN) |
| `createdAt` | DateTime | Auto | Registration timestamp |
| `updatedAt` | DateTime | Auto | Last modification |

**Relationships:**
- 1:1 with `Vendor` (optional) - A user can own one vendor profile
- 1:N with `Booking` - Customer's bookings
- 1:N with `Transaction` - Payment history

**Business Rules:**
- Phone number is the primary identifier
- Role can be upgraded (e.g., CUSTOMER → VENDOR_OWNER)
- Email is optional but must be unique if provided

---

### 2. Vendor

**Purpose:** Represents a business (salon, spa, barbershop)

```prisma
model Vendor {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  address     String
  bio         String?
  logoUrl     String?
  phoneNumber String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  ownerId  String @unique
  owner    User   @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  services Service[]
  staff    Staff[]
  bookings Booking[]

  @@index([slug])
  @@index([ownerId])
  @@map("vendors")
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `name` | String | Required | Business name (e.g., "آرایشگاه گلستان") |
| `slug` | String | Unique, Indexed | URL-friendly identifier (e.g., "golestan-salon") |
| `address` | String | Required | Physical location |
| `bio` | String? | Optional | Business description (max ~5000 chars) |
| `logoUrl` | String? | Optional | Logo image URL |
| `phoneNumber` | String? | Optional | Business contact number |
| `isActive` | Boolean | Default: true | Business operational status |
| `ownerId` | String | FK, Unique | References `User.id` |

**Relationships:**
- N:1 with `User` (owner) - One user owns one vendor
- 1:N with `Service` - Services offered
- 1:N with `Staff` - Employees
- 1:N with `Booking` - All bookings at this location

**Business Rules:**
- Slug must be unique for SEO-friendly URLs
- Deleting owner user cascades to delete vendor
- Only active vendors appear in public search

---

### 3. Service

**Purpose:** Individual treatments/services offered by vendors

```prisma
model Service {
  id              String  @id @default(cuid())
  name            String
  description     String?
  price           Float
  depositAmount   Float
  durationMinutes Int
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  vendorId String
  vendor   Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  staffServices StaffService[]
  bookings      Booking[]

  @@index([vendorId])
  @@map("services")
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `name` | String | Required | Service name (e.g., "کوتاهی مو") |
| `description` | String? | Optional | Detailed description |
| `price` | Float | Required | Full service price (Rials) |
| `depositAmount` | Float | Required | Booking deposit (Rials) |
| `durationMinutes` | Int | Required | Service duration (e.g., 60) |
| `isActive` | Boolean | Default: true | Service availability |
| `vendorId` | String | FK, Indexed | References `Vendor.id` |

**Relationships:**
- N:1 with `Vendor` - Belongs to one vendor
- N:M with `Staff` via `StaffService` - Multiple staff can provide same service
- 1:N with `Booking` - Booking history

**Business Rules:**
- Cannot be deleted if active bookings exist
- Multiple staff can be assigned to one service
- Duration determines booking slot size

---

### 4. Staff

**Purpose:** Service providers (stylists, beauticians, etc.)

```prisma
model Staff {
  id        String   @id @default(cuid())
  name      String
  bio       String?
  avatarUrl String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  vendorId String
  vendor   Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  staffServices StaffService[]
  schedules     StaffSchedule[]
  bookings      Booking[]

  @@index([vendorId])
  @@map("staff")
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `name` | String | Required | Staff member name |
| `bio` | String? | Optional | Professional bio (max ~500 chars) |
| `avatarUrl` | String? | Optional | Profile picture URL |
| `isActive` | Boolean | Default: true | Employment status |
| `vendorId` | String | FK, Indexed | References `Vendor.id` |

**Relationships:**
- N:1 with `Vendor` - Works at one vendor
- N:M with `Service` via `StaffService` - Can provide multiple services
- 1:N with `StaffSchedule` - Weekly availability
- 1:N with `Booking` - Assigned appointments

**Business Rules:**
- Cannot be deleted if future active bookings exist
- Must have at least one schedule to accept bookings
- Multiple services can be assigned

---

### 5. StaffService (Pivot Table)

**Purpose:** Many-to-many relationship between Staff and Service

```prisma
model StaffService {
  id String @id @default(cuid())

  staffId   String
  staff     Staff   @relation(fields: [staffId], references: [id], onDelete: Cascade)

  serviceId String
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([staffId, serviceId])
  @@index([staffId])
  @@index([serviceId])
  @@map("staff_services")
}
```

**Business Rules:**
- Composite unique constraint prevents duplicate assignments
- Cascades on staff or service deletion
- Used to determine which staff can perform which services

---

### 6. StaffSchedule

**Purpose:** Recurring weekly availability for staff members

```prisma
model StaffSchedule {
  id        String @id @default(cuid())
  dayOfWeek Int    // 0=Sunday, 6=Saturday
  startTime String // "HH:mm" format (e.g., "09:00")
  endTime   String // "HH:mm" format (e.g., "17:00")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  staffId String
  staff   Staff  @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@index([staffId])
  @@index([dayOfWeek])
  @@map("staff_schedules")
}
```

| Field | Type | Description |
|-------|------|-------------|
| `dayOfWeek` | Int | ISO day: 0=Sunday, 1=Monday, ..., 6=Saturday |
| `startTime` | String | Opening time in "HH:mm" format (24-hour) |
| `endTime` | String | Closing time in "HH:mm" format |

**Day Mapping (Persian Calendar Context):**
```
0 = Sunday      (یکشنبه)
1 = Monday      (دوشنبه)
2 = Tuesday     (سه‌شنبه)
3 = Wednesday   (چهارشنبه)
4 = Thursday    (پنج‌شنبه)
5 = Friday      (جمعه)
6 = Saturday    (شنبه)
```

**Business Rules:**
- One schedule per staff per day
- End time must be after start time
- Used for availability checking before booking
- Frontend must handle Jalaali ↔ Gregorian conversion

---

### 7. Booking

**Purpose:** Customer appointments/reservations

```prisma
model Booking {
  id         String        @id @default(cuid())
  startTime  DateTime      // UTC timestamp
  endTime    DateTime      // UTC timestamp
  totalPrice  Float
  depositPaid Float @default(0)
  status     BookingStatus @default(PENDING_PAYMENT)
  notes      String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  customerId String
  customer   User   @relation(fields: [customerId], references: [id], onDelete: Cascade)

  vendorId String
  vendor   Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  staffId String
  staff   Staff  @relation(fields: [staffId], references: [id], onDelete: Restrict)

  serviceId String
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Restrict)

  transactions Transaction[]

  @@index([customerId])
  @@index([vendorId])
  @@index([staffId])
  @@index([serviceId])
  @@index([startTime])
  @@index([status])
  @@map("bookings")
}
```

| Field | Type | Description |
|-------|------|-------------|
| `startTime` | DateTime | Appointment start (UTC) |
| `endTime` | DateTime | Appointment end (UTC) |
| `totalPrice` | Float | Full service price |
| `depositPaid` | Float | Amount paid as deposit |
| `status` | BookingStatus | Current state (see enum below) |
| `notes` | String? | Customer notes |

**Relationships:**
- N:1 with `User` (customer)
- N:1 with `Vendor`
- N:1 with `Staff`
- N:1 with `Service`
- 1:N with `Transaction`

**Business Rules:**
- Collision detection: Check overlapping bookings for same staff
- Times stored in UTC, converted to Jalaali on frontend
- Cannot book in the past
- Staff deletion restricted if future bookings exist
- Service deletion restricted if active bookings exist

---

### 8. Transaction

**Purpose:** Payment tracking and history

```prisma
model Transaction {
  id           String            @id @default(cuid())
  amount       Float
  trackingCode String?           @unique
  status       TransactionStatus @default(PENDING)
  gatewayResponse String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  bookingId String?
  booking   Booking? @relation(fields: [bookingId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([bookingId])
  @@index([status])
  @@index([trackingCode])
  @@map("transactions")
}
```

| Field | Type | Description |
|-------|------|-------------|
| `amount` | Float | Payment amount (Rials) |
| `trackingCode` | String? | Gateway reference number (e.g., ZarinPal RefID) |
| `status` | TransactionStatus | PENDING, SUCCESS, FAILED |
| `gatewayResponse` | String? | Raw JSON response from payment gateway |
| `bookingId` | String? | Associated booking (nullable for refunds) |

**Business Rules:**
- Initially created with status PENDING
- Updated to SUCCESS after gateway verification
- Tracking code must be unique
- Booking deletion sets bookingId to NULL (not cascades)

---

### 9. VerificationCode

**Purpose:** OTP authentication temporary storage

```prisma
model VerificationCode {
  id          String   @id @default(cuid())
  phoneNumber String   @unique
  code        String   // 5-digit code
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([phoneNumber])
  @@map("verification_codes")
}
```

| Field | Type | Description |
|-------|------|-------------|
| `phoneNumber` | String | Recipient phone number (unique) |
| `code` | String | 5-digit OTP code |
| `expiresAt` | DateTime | Expiration timestamp (2 minutes) |

**Business Rules:**
- Upserted on OTP send (replaces existing)
- Deleted after successful verification
- Expires in 2 minutes
- One active code per phone number

---

## 🎯 Enumerations

### Role

```prisma
enum Role {
  CUSTOMER      // Regular platform user
  VENDOR_OWNER  // Business owner
  STAFF         // Employee (not implemented as User in current schema)
  ADMIN         // Platform administrator
}
```

**Usage:**
- Determines dashboard access
- Used in authorization middleware
- Can be upgraded (e.g., customer becomes vendor owner)

---

### BookingStatus

```prisma
enum BookingStatus {
  PENDING_PAYMENT       // Created, awaiting payment
  CONFIRMED             // Payment verified, appointment active
  COMPLETED             // Service delivered
  CANCELLED_BY_USER     // Customer cancelled
  CANCELLED_BY_VENDOR   // Vendor cancelled
}
```

**State Machine:**
```
  [CREATE]
     ↓
PENDING_PAYMENT → [Payment Success] → CONFIRMED → COMPLETED
     ↓                                     ↓
     ↓                                     ↓
CANCELLED_BY_USER              CANCELLED_BY_VENDOR
```

---

### TransactionStatus

```prisma
enum TransactionStatus {
  PENDING   // Awaiting gateway verification
  SUCCESS   // Payment confirmed
  FAILED    // Payment rejected or error
}
```

---

## 🔗 Relationships

### Summary Table

| From | To | Type | Cascade Behavior |
|------|-----|------|------------------|
| User → Vendor | 1:1 | Optional | Cascade Delete |
| User → Booking | 1:N | Required | Cascade Delete |
| User → Transaction | 1:N | Required | Cascade Delete |
| Vendor → Service | 1:N | Required | Cascade Delete |
| Vendor → Staff | 1:N | Required | Cascade Delete |
| Vendor → Booking | 1:N | Required | Cascade Delete |
| Staff → StaffService | 1:N | Required | Cascade Delete |
| Service → StaffService | 1:N | Required | Cascade Delete |
| Staff → StaffSchedule | 1:N | Required | Cascade Delete |
| Staff → Booking | 1:N | Required | Restrict Delete |
| Service → Booking | 1:N | Required | Restrict Delete |
| Booking → Transaction | 1:N | Optional | Set Null on Delete |

### Cascade Rules Explanation

- **Cascade Delete:** Child records are automatically deleted
  - Deleting Vendor → Deletes all Services, Staff, Bookings
  - Deleting Staff → Deletes StaffServices, StaffSchedules

- **Restrict Delete:** Cannot delete if child records exist
  - Cannot delete Staff with future bookings
  - Cannot delete Service with active bookings

- **Set Null:** Child record's FK becomes NULL
  - Deleting Booking → Transactions remain but bookingId = NULL

---

## 🔍 Indexes

### Purpose of Indexes

| Model | Indexed Columns | Purpose |
|-------|----------------|---------|
| User | `phoneNumber` | Fast authentication lookup |
| Vendor | `slug`, `ownerId` | SEO URLs, owner-based queries |
| Service | `vendorId` | Vendor's service list |
| Staff | `vendorId` | Vendor's staff list |
| StaffService | `staffId`, `serviceId` | Pivot table lookups |
| StaffSchedule | `staffId`, `dayOfWeek` | Availability queries |
| Booking | `customerId`, `vendorId`, `staffId`, `serviceId`, `startTime`, `status` | Fast filtering and collision detection |
| Transaction | `userId`, `bookingId`, `status`, `trackingCode` | Payment history and verification |
| VerificationCode | `phoneNumber` | OTP lookup |

---

## 🛡️ Constraints

### Unique Constraints

| Model | Field | Reason |
|-------|-------|--------|
| User | `phoneNumber` | Primary authentication method |
| User | `email` | Prevent duplicate accounts |
| Vendor | `slug` | SEO-friendly URLs must be unique |
| Vendor | `ownerId` | One user = one vendor profile |
| StaffService | `[staffId, serviceId]` | Prevent duplicate assignments |
| Transaction | `trackingCode` | Unique payment reference |
| VerificationCode | `phoneNumber` | One active OTP per phone |

### Foreign Key Constraints

All foreign keys enforce referential integrity via Prisma's relation system.

---

## 🚀 Migration Guide

### Initial Setup

```bash
# Generate Prisma Client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with sample data
npm run db:seed
```

### Development Workflow

```bash
# Make schema changes in schema.prisma

# Create migration
npm run db:migrate -- --name add_vendor_rating

# Apply migration
npm run db:push
```

### Production Migration

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:pass@host:5432/elora"

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## 🔄 Schema Evolution

### Planned Features

1. **Ratings & Reviews**
   ```prisma
   model Review {
     id         String   @id @default(cuid())
     rating     Int      // 1-5
     comment    String?
     customerId String
     vendorId   String
     bookingId  String
     createdAt  DateTime @default(now())
   }
   ```

2. **Vendor Categories**
   ```prisma
   enum VendorCategory {
     HAIR_SALON
     BARBERSHOP
     SPA
     NAIL_SALON
     MAKEUP_STUDIO
   }
   
   // Add to Vendor model:
   // category VendorCategory
   ```

3. **Staff User Accounts**
   - Link staff to User records for staff portal access
   - Add `staffId String?` to User model

4. **Loyalty Program**
   ```prisma
   model LoyaltyPoints {
     id       String @id @default(cuid())
     userId   String
     points   Int
     vendorId String
   }
   ```

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

---

**Questions or Issues?**  
Please refer to the main [README.md](../README.md) or contact the development team.
