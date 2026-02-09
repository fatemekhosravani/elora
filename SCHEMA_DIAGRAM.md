# Elora Database Schema - Visual Overview

## Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         USER                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ id, phoneNumber (unique), fullName, email, role        │  │
│  │ createdAt, updatedAt                                   │  │
│  └────────────────────────────────────────────────────────┘  │
└───┬────────────────┬─────────────────┬───────────────────────┘
    │                │                 │
    │ 1:1            │ 1:M             │ 1:M
    │ (optional)     │ (as customer)   │
    ▼                ▼                 ▼
┌────────────┐  ┌─────────────┐  ┌──────────────┐
│   VENDOR   │  │   BOOKING   │  │ TRANSACTION  │
└────────────┘  └─────────────┘  └──────────────┘
    │                │
    │ 1:M            │ M:1
    ▼                ▼
┌────────────┐  ┌─────────────┐
│  SERVICE   │  │    STAFF    │
└────────────┘  └─────────────┘
    │                │
    │                │ 1:M
    │                ▼
    │           ┌──────────────────┐
    │           │ STAFF_SCHEDULE   │
    │           └──────────────────┘
    │
    │ M:M (via StaffService pivot)
    └────────────────────────────────┘
```

---

## Detailed Model Relationships

### **USER** (Authentication & Profiles)
```
User
├── vendor          (1:1, optional) → Vendor
├── bookings[]      (1:M) → Booking (as customer)
└── transactions[]  (1:M) → Transaction
```

**Fields:**
- `id` (CUID)
- `phoneNumber` (Unique) ← Auth identifier
- `fullName`, `email`
- `role`: CUSTOMER | VENDOR_OWNER | STAFF | ADMIN

---

### **VENDOR** (Salon/Business)
```
Vendor
├── owner           (M:1) → User (ownerId, unique)
├── services[]      (1:M) → Service
├── staff[]         (1:M) → Staff
└── bookings[]      (1:M) → Booking
```

**Fields:**
- `id`, `name`, `slug` (Unique, SEO)
- `address`, `bio`, `logoUrl`, `phoneNumber`
- `isActive` (Soft delete)

---

### **SERVICE** (Beauty Services)
```
Service
├── vendor          (M:1) → Vendor
├── staffServices[] (M:M) ↔ Staff (via StaffService)
└── bookings[]      (1:M) → Booking
```

**Fields:**
- `name`, `description`
- `price`, `depositAmount` (Decimal)
- `durationMinutes` (Int)
- `isActive`

---

### **STAFF** (Service Providers)
```
Staff
├── vendor          (M:1) → Vendor
├── staffServices[] (M:M) ↔ Service (via StaffService)
├── schedules[]     (1:M) → StaffSchedule
└── bookings[]      (1:M) → Booking
```

**Fields:**
- `name`, `bio`, `avatarUrl`
- `isActive`

---

### **STAFF_SERVICE** (Pivot Table)
```
StaffService
├── staff   (M:1) → Staff
└── service (M:1) → Service

Unique: (staffId, serviceId)
```

**Purpose:** Allows multiple staff to perform same service.

---

### **STAFF_SCHEDULE** (Availability)
```
StaffSchedule
└── staff (M:1) → Staff
```

**Fields:**
- `dayOfWeek` (0-6, ISO: 0=Sunday)
- `startTime`, `endTime` ("HH:mm" format)

**Example:**
- Saturday (شنبه): `dayOfWeek=6`, `startTime="09:00"`, `endTime="17:00"`

---

### **BOOKING** (Appointments)
```
Booking
├── customer     (M:1) → User
├── vendor       (M:1) → Vendor
├── staff        (M:1) → Staff (Restrict delete)
├── service      (M:1) → Service (Restrict delete)
└── transactions (1:M) → Transaction
```

**Fields:**
- `startTime`, `endTime` (DateTime, UTC)
- `totalPrice`, `depositPaid` (Decimal)
- `status`: PENDING_PAYMENT | CONFIRMED | COMPLETED | CANCELLED_BY_USER | CANCELLED_BY_VENDOR
- `notes`

---

### **TRANSACTION** (Payments)
```
Transaction
├── user    (M:1) → User
└── booking (M:1, optional) → Booking (SetNull on delete)
```

**Fields:**
- `amount` (Decimal)
- `trackingCode` (Unique, payment gateway)
- `status`: PENDING | SUCCESS | FAILED
- `gatewayResponse` (JSON/Text)

---

## Cascade Deletion Rules

### ✅ **Cascade Delete** (Business Closure)
```
User (VENDOR_OWNER)
  └─→ Vendor (onDelete: Cascade)
       ├─→ Service (onDelete: Cascade)
       ├─→ Staff (onDelete: Cascade)
       │    ├─→ StaffService (onDelete: Cascade)
       │    └─→ StaffSchedule (onDelete: Cascade)
       └─→ Booking (onDelete: Cascade)
            └─→ Transaction (onDelete: SetNull on bookingId)

User (CUSTOMER)
  ├─→ Booking (onDelete: Cascade)
  └─→ Transaction (onDelete: Cascade)
```

### 🚫 **Restrict Delete** (Data Integrity)
```
Staff with Bookings → Cannot delete
Service with Bookings → Cannot delete
```

**Reason:** Preserves historical booking data.

---

## Indexes for Performance

### **User**
- `phoneNumber` (unique, auth lookup)

### **Vendor**
- `slug` (unique, SEO URLs)
- `ownerId` (join optimization)

### **Service**
- `vendorId` (filtering by vendor)

### **Staff**
- `vendorId` (filtering by vendor)

### **StaffService**
- `staffId`, `serviceId` (many-to-many joins)

### **StaffSchedule**
- `staffId`, `dayOfWeek` (availability checks)

### **Booking**
- `customerId`, `vendorId`, `staffId`, `serviceId` (joins)
- `startTime` (chronological queries)
- `status` (filtering confirmed/pending)

### **Transaction**
- `userId`, `bookingId`, `status`, `trackingCode` (payment lookups)

---

## Common Queries

### **Find Available Slots**
```typescript
// 1. Get staff schedules for a day
const staff = await prisma.staff.findUnique({
  where: { id: staffId },
  include: {
    schedules: {
      where: { dayOfWeek: requestedDayOfWeek }
    },
    bookings: {
      where: {
        startTime: {
          gte: dayStart, // Start of requested day
          lt: dayEnd     // End of requested day
        }
      }
    }
  }
});

// 2. Calculate free slots (frontend logic)
```

### **Get Vendor with Services & Staff**
```typescript
const vendor = await prisma.vendor.findUnique({
  where: { slug: 'negin-salon' },
  include: {
    services: {
      where: { isActive: true },
      include: {
        staffServices: {
          include: {
            staff: {
              where: { isActive: true }
            }
          }
        }
      }
    }
  }
});
```

### **Customer Booking History**
```typescript
const bookings = await prisma.booking.findMany({
  where: { customerId: userId },
  include: {
    vendor: true,
    service: true,
    staff: true,
    transactions: true,
  },
  orderBy: { startTime: 'desc' }
});
```

---

## Data Flow Example

### **Complete Booking Flow**

```
1. Customer browses vendors
   ↓
2. Selects service, staff, datetime
   ↓
3. Create Booking (PENDING_PAYMENT)
   ↓
4. Create Transaction (PENDING)
   ↓
5. Redirect to payment gateway
   ↓
6. Payment callback received
   ↓
7. Update Transaction (SUCCESS)
   ↓
8. Update Booking (CONFIRMED)
   ↓
9. Service completed
   ↓
10. Update Booking (COMPLETED)
```

### **Code Example**

```typescript
// Step 3-4: Create booking + transaction
const booking = await prisma.booking.create({
  data: {
    customerId: user.id,
    vendorId: vendor.id,
    staffId: staff.id,
    serviceId: service.id,
    startTime: new Date('2026-02-15T10:00:00Z'), // UTC
    endTime: new Date('2026-02-15T11:00:00Z'),
    totalPrice: service.price,
    depositPaid: 0,
    status: 'PENDING_PAYMENT',
    transactions: {
      create: {
        userId: user.id,
        amount: service.depositAmount,
        status: 'PENDING',
      }
    }
  },
  include: { transactions: true }
});

// Step 7-8: Payment success callback
await prisma.$transaction([
  prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'SUCCESS',
      trackingCode: gatewayReferenceCode,
    }
  }),
  prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: 'CONFIRMED',
      depositPaid: service.depositAmount,
    }
  })
]);
```

---

## Schema Statistics

- **Models:** 8
- **Enums:** 3
- **One-to-One Relations:** 1 (User ↔ Vendor)
- **One-to-Many Relations:** 11
- **Many-to-Many Relations:** 1 (Staff ↔ Service)
- **Indexes:** 20
- **Unique Constraints:** 5

---

## Database Size Estimates (for planning)

### **Per Vendor (Average)**
- Services: ~20 records
- Staff: ~10 records
- Schedules: ~70 records (10 staff × 7 days)
- Bookings/month: ~500 records

### **Platform-wide (100 vendors, 1 year)**
- Users: ~10,000
- Vendors: 100
- Services: ~2,000
- Staff: ~1,000
- Bookings: ~600,000
- Transactions: ~600,000

**Estimated DB Size:** ~500 MB (with indexes)

---

## 🎯 Schema Validation Checklist

✅ All foreign keys defined with proper `@relation`  
✅ Unique constraints on critical fields (phoneNumber, slug, trackingCode)  
✅ Cascading rules prevent orphaned data  
✅ Indexes on frequently queried fields  
✅ Decimal precision for currency (10, 2)  
✅ DateTime stored in UTC  
✅ Soft delete via `isActive` flags  
✅ Enum types for controlled values  
✅ Table names mapped (`@@map`)  

---

**Schema File:** [prisma/schema.prisma](file:///c:/Users/Parham/Downloads/edora/prisma/schema.prisma)  
**Documentation:** [DATABASE.md](file:///c:/Users/Parham/Downloads/edora/DATABASE.md)  
**Client:** [src/lib/prisma.ts](file:///c:/Users/Parham/Downloads/edora/src/lib/prisma.ts)
