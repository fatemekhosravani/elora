# Elora Database Schema Documentation

## Overview
PostgreSQL database with Prisma ORM managing beauty service marketplace data.

---

## 📊 Database Models

### 🔐 **User**
Core user entity for authentication and customer bookings.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `phoneNumber` | String (Unique) | Authentication identifier |
| `fullName` | String? | Optional display name |
| `email` | String? (Unique) | Optional email |
| `role` | Role Enum | CUSTOMER, VENDOR_OWNER, STAFF, ADMIN |
| `createdAt` | DateTime | Auto-generated |
| `updatedAt` | DateTime | Auto-updated |

**Relations:**
- `vendor`: One-to-one (optional) - User can own one Vendor profile
- `bookings`: One-to-many - Bookings made as customer
- `transactions`: One-to-many - Payment history

---

### 🏪 **Vendor**
Represents a salon/beauty service business.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Business name |
| `slug` | String (Unique) | SEO-friendly URL identifier |
| `address` | String | Physical location |
| `bio` | String? (Text) | Business description |
| `logoUrl` | String? | Logo image URL |
| `phoneNumber` | String? | Contact number |
| `isActive` | Boolean | Business status (default: true) |
| `ownerId` | String (Unique) | Foreign key to User |

**Relations:**
- `owner`: Many-to-one - Linked to User (VENDOR_OWNER role)
- `services`: One-to-many - Services offered
- `staff`: One-to-many - Staff members
- `bookings`: One-to-many - All bookings at this vendor

**Indexes:** `slug`, `ownerId`

---

### 💅 **Service**
Individual beauty services offered by vendors.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Service name (e.g., "Haircut", "Manicure") |
| `description` | String? (Text) | Detailed description |
| `price` | Decimal(10,2) | Full service price |
| `depositAmount` | Decimal(10,2) | Required deposit for booking |
| `durationMinutes` | Int | Service duration |
| `isActive` | Boolean | Availability status |
| `vendorId` | String | Foreign key to Vendor |

**Relations:**
- `vendor`: Many-to-one - Belongs to a Vendor
- `staffServices`: Many-to-many - Staff who can perform this service
- `bookings`: One-to-many - Bookings for this service

**Indexes:** `vendorId`

---

### 👤 **Staff**
Employees/service providers at a vendor.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Staff member name |
| `bio` | String? (Text) | Professional bio |
| `avatarUrl` | String? | Profile picture URL |
| `isActive` | Boolean | Employment status |
| `vendorId` | String | Foreign key to Vendor |

**Relations:**
- `vendor`: Many-to-one - Belongs to a Vendor
- `staffServices`: Many-to-many - Services they can perform
- `schedules`: One-to-many - Availability schedules
- `bookings`: One-to-many - Assigned bookings

**Indexes:** `vendorId`

---

### 🔗 **StaffService** (Pivot Table)
Many-to-many relationship between Staff and Service.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `staffId` | String | Foreign key to Staff |
| `serviceId` | String | Foreign key to Service |
| `createdAt` | DateTime | Assignment date |

**Unique Constraint:** `(staffId, serviceId)`  
**Indexes:** `staffId`, `serviceId`

---

### 📅 **StaffSchedule**
Defines weekly availability for staff members.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `dayOfWeek` | Int (0-6) | 0=Sunday, 1=Monday, ..., 6=Saturday (ISO standard) |
| `startTime` | String | "HH:mm" format (e.g., "09:00") |
| `endTime` | String | "HH:mm" format (e.g., "17:30") |
| `staffId` | String | Foreign key to Staff |

**Relations:**
- `staff`: Many-to-one - Belongs to a Staff member

**Indexes:** `staffId`, `dayOfWeek`

**Note:** For Persian/Jalaali calendar mapping:
- Frontend should map Saturday (شنبه) based on the ISO week structure
- Times are stored in 24-hour format for consistency

---

### 📝 **Booking**
Core booking entity linking customers, vendors, staff, and services.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `startTime` | DateTime | Booking start (UTC) |
| `endTime` | DateTime | Booking end (UTC) |
| `totalPrice` | Decimal(10,2) | Total cost |
| `depositPaid` | Decimal(10,2) | Deposit amount paid |
| `status` | BookingStatus | Current booking state |
| `notes` | String? (Text) | Customer notes |
| `customerId` | String | Foreign key to User |
| `vendorId` | String | Foreign key to Vendor |
| `staffId` | String | Foreign key to Staff |
| `serviceId` | String | Foreign key to Service |

**Relations:**
- `customer`: Many-to-one - User who made the booking
- `vendor`: Many-to-one - Venue for the service
- `staff`: Many-to-one - Assigned staff member
- `service`: Many-to-one - Booked service
- `transactions`: One-to-many - Payment records

**Indexes:** `customerId`, `vendorId`, `staffId`, `serviceId`, `startTime`, `status`

**Important:** All DateTime fields store UTC. Convert to Jalaali on frontend.

---

### 💳 **Transaction**
Payment and transaction records.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `amount` | Decimal(10,2) | Transaction amount |
| `trackingCode` | String? (Unique) | Payment gateway reference |
| `status` | TransactionStatus | PENDING, SUCCESS, FAILED |
| `gatewayResponse` | String? (Text) | Raw gateway response |
| `userId` | String | Foreign key to User |
| `bookingId` | String? | Foreign key to Booking (nullable) |

**Relations:**
- `user`: Many-to-one - User who made the payment
- `booking`: Many-to-one (optional) - Related booking

**Indexes:** `userId`, `bookingId`, `status`, `trackingCode`

---

## 🎨 Enums

### **Role**
```prisma
enum Role {
  CUSTOMER       // Regular user booking services
  VENDOR_OWNER   // Owns and manages a Vendor
  STAFF          // Works at a Vendor (future auth)
  ADMIN          // Platform administrator
}
```

### **BookingStatus**
```prisma
enum BookingStatus {
  PENDING_PAYMENT        // Awaiting deposit/payment
  CONFIRMED              // Payment received, booking confirmed
  COMPLETED              // Service completed
  CANCELLED_BY_USER      // Customer cancelled
  CANCELLED_BY_VENDOR    // Vendor cancelled
}
```

### **TransactionStatus**
```prisma
enum TransactionStatus {
  PENDING    // Payment initiated
  SUCCESS    // Payment confirmed
  FAILED     // Payment failed
}
```

---

## 🔑 Key Design Decisions

### 1. **Authentication via Phone Number**
- Primary auth identifier: `phoneNumber` (unique)
- OTP-based login flow
- Email is optional

### 2. **Vendor Ownership**
- Each Vendor has ONE owner (User with VENDOR_OWNER role)
- One-to-one relationship via `ownerId`
- Cascade delete: Deleting owner deletes vendor

### 3. **Staff-Service Many-to-Many**
- Pivot table: `StaffService`
- Allows multiple staff to perform same service
- Flexible scheduling based on staff availability

### 4. **UTC DateTime Storage**
- All `DateTime` fields (bookings, schedules) stored in UTC
- Frontend converts to Jalaali/Persian calendar
- Ensures consistency across timezones

### 5. **Soft Delete via `isActive`**
- Vendors, Services, Staff have `isActive` flag
- Prevents breaking foreign key constraints
- Maintains historical data integrity

### 6. **Cascade vs Restrict**
- Cascade: Vendor → Services, Staff (business closure)
- Restrict: Booking → Staff, Service (prevent data loss)

---

## 🚀 Prisma Commands

### Generate Prisma Client
```bash
npm run db:generate
```

### Push Schema to Database (Dev)
```bash
npm run db:push
```

### Create Migration
```bash
npm run db:migrate
```

### Open Prisma Studio
```bash
npm run db:studio
```

### Seed Database
```bash
npm run db:seed
```

---

## 📦 Database Setup

### 1. Configure Environment
Edit `.env` and set your PostgreSQL connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/elora_db?schema=public"
```

### 2. Initialize Database
```bash
npm install
npm run db:generate
npm run db:push
```

### 3. Verify Schema
```bash
npm run db:studio
```

---

## 🔗 Relation Diagram

```
User
├─→ Vendor (one-to-one, optional)
├─→ Booking[] (as customer)
└─→ Transaction[]

Vendor
├─→ Service[]
├─→ Staff[]
└─→ Booking[]

Service
├─→ StaffService[] ←→ Staff
└─→ Booking[]

Staff
├─→ StaffService[] ←→ Service
├─→ StaffSchedule[]
└─→ Booking[]

Booking
├─→ User (customer)
├─→ Vendor
├─→ Staff
├─→ Service
└─→ Transaction[]
```

---

## 📝 Next Steps

1. **Install Dependencies:** `npm install`
2. **Configure `.env`:** Set `DATABASE_URL`
3. **Generate Client:** `npm run db:generate`
4. **Push Schema:** `npm run db:push`
5. **Create Seed Data:** Implement `prisma/seed.ts`
6. **Test Queries:** Use Prisma Studio or create API routes

---

## 📚 Related Files

- Schema: [prisma/schema.prisma](file:///c:/Users/Parham/Downloads/edora/prisma/schema.prisma)
- Client: [src/lib/prisma.ts](file:///c:/Users/Parham/Downloads/edora/src/lib/prisma.ts)
- Environment: [.env](file:///c:/Users/Parham/Downloads/edora/.env)
