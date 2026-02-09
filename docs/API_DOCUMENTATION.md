# 📘 Elora - API Documentation

> **Last Updated:** February 2026  
> **Version:** 1.0  
> **Framework:** Next.js 15 Server Actions

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Customer APIs](#customer-apis)
4. [Vendor APIs](#vendor-apis)
5. [Public APIs](#public-apis)
6. [Admin APIs](#admin-apis)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## 📖 Overview

Elora uses **Next.js Server Actions** instead of traditional REST APIs. All server actions are marked with `'use server'` directive and provide type-safe, direct server-side function calls.

### Base Architecture
```
src/
├── actions/           # Server Actions (API endpoints)
│   ├── auth.ts        # Customer authentication
│   ├── vendor-auth.ts # Vendor registration & auth
│   ├── booking.ts     # Booking management
│   ├── services.ts    # Service CRUD operations
│   ├── staff.ts       # Staff management
│   └── schedule.ts    # Schedule management
└── lib/
    └── data/          # Data fetching layers
        ├── public-api.ts    # Public data access
        └── customer-api.ts  # Customer data access
```

---

## 🔐 Authentication

### Customer Authentication Flow

#### 1. Send OTP
**Action:** `sendOtp(phoneNumber: string)`  
**File:** `src/actions/auth.ts`

Sends a verification code to the user's phone number.

**Request:**
```typescript
await sendOtp("09123456789");
```

**Response:**
```typescript
{
  success: true,
  otp: "12345" // Only in development mode
}
// OR
{
  success: false,
  error: "Invalid phone number format" | "Database error"
}
```

**Validation:**
- Phone number must match: `/^09\d{9}$/`
- OTP expires in 2 minutes
- 5-digit numeric code

---

#### 2. Verify OTP
**Action:** `verifyOtp(phoneNumber: string, code: string)`  
**File:** `src/actions/auth.ts`

Verifies OTP and creates/authenticates user session.

**Request:**
```typescript
await verifyOtp("09123456789", "12345");
```

**Response:**
```typescript
{
  success: true,
  role: "CUSTOMER" | "VENDOR_OWNER" | "ADMIN"
}
// OR
{
  success: false,
  error: "Invalid OTP code" | "OTP expired" | "Authentication failed"
}
```

**Side Effects:**
- Creates `User` record if not exists
- Creates JWT session cookie
- Deletes used OTP from database
- Redirects to appropriate dashboard

---

#### 3. Logout
**Action:** `logout()`  
**File:** `src/actions/auth.ts`

Destroys user session and redirects to homepage.

**Request:**
```typescript
await logout();
```

**Response:**
- Redirects to `/`
- Deletes session cookie

---

### Vendor Authentication Flow

#### 1. Send Vendor OTP
**Action:** `sendVendorOtp(phoneNumber: string)`  
**File:** `src/actions/vendor-auth.ts`

Similar to customer OTP, used for vendor registration.

**Request:**
```typescript
await sendVendorOtp("09123456789");
```

**Response:**
```typescript
{
  success: true,
  otp: "12345"
}
```

---

#### 2. Verify Vendor OTP
**Action:** `verifyVendorOtp(phoneNumber: string, code: string)`  
**File:** `src/actions/vendor-auth.ts`

Verifies OTP before proceeding to registration.

**Request:**
```typescript
await verifyVendorOtp("09123456789", "12345");
```

**Response:**
```typescript
{
  success: true
}
// OR
{
  success: false,
  error: "کد نامعتبر است" | "کد منقضی شده است"
}
```

---

#### 3. Register Vendor
**Action:** `registerVendor(data)`  
**File:** `src/actions/vendor-auth.ts`

Creates vendor profile and updates user role.

**Request:**
```typescript
await registerVendor({
  phone: "09123456789",
  businessName: "آرایشگاه گلستان",
  slug: "golestan-salon",
  category: "hair-salon",
  address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  description: "بهترین خدمات آرایشی" // Optional
});
```

**Response:**
```typescript
{
  success: true,
  vendorId: "cm123abc456"
}
// OR
{
  success: false,
  error: "این نام کاربری قبلاً استفاده شده است"
}
```

**Validation:**
- `businessName`: Min 2 characters
- `slug`: Min 2 characters, must be unique
- `category`: Min 2 characters
- `address`: Min 5 characters
- Phone must have valid OTP verification

**Side Effects:**
- Creates `Vendor` record
- Updates `User.role` to `VENDOR_OWNER`
- Associates user with vendor via `ownerId`

---

## 👥 Customer APIs

### Get User Profile
**Function:** `getUserProfile(userId: string)`  
**File:** `src/lib/data/customer-api.ts`

Retrieves customer profile information.

**Request:**
```typescript
const profile = await getUserProfile("cm123abc456");
```

**Response:**
```typescript
{
  id: "cm123abc456",
  fullName: "محمد رضایی" | null,
  phoneNumber: "09123456789",
  email: "mohammad@example.com" | null,
  role: "CUSTOMER"
}
```

---

### Get Customer Bookings
**Function:** `getCustomerBookings(userId: string)`  
**File:** `src/lib/data/customer-api.ts`

Retrieves customer's booking history.

**Request:**
```typescript
const bookings = await getCustomerBookings("cm123abc456");
```

**Response:**
```typescript
[
  {
    id: "booking_123",
    startTime: "2026-02-10T10:00:00Z",
    endTime: "2026-02-10T11:00:00Z",
    status: "CONFIRMED",
    totalPrice: 500000,
    depositPaid: 100000,
    service: {
      name: "کوتاهی مو",
      price: 500000
    },
    vendor: {
      name: "آرایشگاه گلستان",
      address: "تهران، ولیعصر",
      phoneNumber: "09121234567"
    },
    staff: {
      name: "سارا محمدی",
      avatarUrl: "https://..."
    }
  }
]
```

---

### Booking Management

#### 1. Initiate Booking
**Action:** `initiateBooking(serviceId, staffId, jalaliDate, time)`  
**File:** `src/actions/booking.ts`

Creates a new booking with pending payment status.

**Request:**
```typescript
await initiateBooking(
  "service_123",    // Service ID
  "staff_456",      // Staff ID
  "1403-12-01",     // Jalaali date (YYYY-MM-DD)
  "10:00"           // Time (HH:mm)
);
```

**Response:**
```typescript
{
  success: true,
  bookingId: "booking_123",
  transactionId: "tx_456"
}
```

**Validation:**
- User must be authenticated
- Service must exist
- Staff must be available at requested time
- No time slot collision
- Date/time must be in the future

**Side Effects:**
- Creates `Booking` record with status `PENDING_PAYMENT`
- Creates `Transaction` record with status `PENDING`
- Charges `depositAmount` from service

---

#### 2. Mock Payment Callback
**Action:** `mockPaymentCallback(bookingId: string)`  
**File:** `src/actions/booking.ts`

Simulates payment gateway verification (for development).

**Request:**
```typescript
await mockPaymentCallback("booking_123");
```

**Response:**
```typescript
{
  success: true,
  message: "Payment successful",
  refId: "789456123"
}
```

**Side Effects:**
- Updates `Transaction.status` to `SUCCESS`
- Updates `Booking.status` to `CONFIRMED`
- Updates `Booking.depositPaid` amount

---

#### 3. Cancel Booking
**Action:** `cancelBooking(bookingId: string)`  
**File:** `src/actions/booking.ts`

Cancels an existing booking.

**Request:**
```typescript
await cancelBooking("booking_123");
```

**Response:**
```typescript
{
  success: true
}
```

**Validation:**
- User must own the booking
- Booking must be `PENDING_PAYMENT` or `CONFIRMED`
- Cannot cancel within 24 hours of appointment (policy)

---

## 🏪 Vendor APIs

All vendor APIs require authentication and automatically retrieve vendor profile from session.

### Service Management

#### 1. Get Vendor Services
**Action:** `getVendorServices()`  
**File:** `src/actions/services.ts`

Retrieves all services for authenticated vendor.

**Request:**
```typescript
const result = await getVendorServices();
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "service_123",
      name: "کوتاهی مو",
      description: "کوتاهی و اصلاح مو با بهترین تجهیزات",
      price: 500000,
      depositAmount: 100000,
      durationMinutes: 60,
      isActive: true,
      createdAt: "2026-01-15T10:00:00Z",
      staffServices: [
        {
          staff: {
            id: "staff_456",
            name: "سارا محمدی",
            avatarUrl: "https://..."
          }
        }
      ]
    }
  ]
}
```

---

#### 2. Create Service
**Action:** `createService(data: ServiceFormData)`  
**File:** `src/actions/services.ts`

Creates a new service for the vendor.

**Request:**
```typescript
await createService({
  name: "رنگ مو",
  price: 800000,
  depositAmount: 200000,
  duration: 120, // minutes
  description: "رنگ مو با بهترین برندهای جهانی",
  staffIds: ["staff_456", "staff_789"]
});
```

**Response:**
```typescript
{
  success: true
}
// OR
{
  success: false,
  error: {
    name: ["Name must be at least 2 characters"],
    price: ["Price must be positive"]
  }
}
```

**Validation:**
- `name`: Min 2 characters
- `price`: Must be positive number
- `depositAmount`: Must be non-negative (default: 0)
- `duration`: Must be positive integer
- `staffIds`: At least 1 staff member required

**Side Effects:**
- Creates `Service` record
- Creates `StaffService` associations
- Revalidates `/vendor-panel/services` cache

---

#### 3. Update Service
**Action:** `updateService(serviceId: string, data: ServiceFormData)`  
**File:** `src/actions/services.ts`

Updates an existing service.

**Request:**
```typescript
await updateService("service_123", {
  name: "رنگ مو (ویژه)",
  price: 900000,
  depositAmount: 250000,
  duration: 150,
  description: "رنگ مو با مواد درجه یک",
  staffIds: ["staff_456"]
});
```

**Response:**
```typescript
{
  success: true
}
```

**Validation:**
- Service must exist and belong to vendor
- Same validation as create

**Side Effects:**
- Updates `Service` record
- Deletes all old `StaffService` associations
- Creates new `StaffService` associations
- Revalidates cache

---

#### 4. Delete Service
**Action:** `deleteService(serviceId: string)`  
**File:** `src/actions/services.ts`

Deletes a service (with safety checks).

**Request:**
```typescript
await deleteService("service_123");
```

**Response:**
```typescript
{
  success: true
}
// OR
{
  success: false,
  error: "Cannot delete service. There are 3 active bookings."
}
```

**Validation:**
- Service must exist and belong to vendor
- Cannot delete if there are active bookings (`PENDING_PAYMENT` or `CONFIRMED`)

**Side Effects:**
- Deletes `Service` record
- Cascades to delete `StaffService` associations
- Revalidates cache

---

### Staff Management

#### 1. Get Vendor Staff
**Action:** `getVendorStaff()`  
**File:** `src/actions/staff.ts`

Retrieves all staff members for authenticated vendor.

**Request:**
```typescript
const result = await getVendorStaff();
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "staff_456",
      name: "سارا محمدی",
      bio: "آرایشگر با ۱۰ سال سابقه",
      avatarUrl: "https://...",
      isActive: true,
      createdAt: "2026-01-10T10:00:00Z",
      staffServices: [
        {
          service: {
            id: "service_123",
            name: "کوتاهی مو"
          }
        }
      ]
    }
  ]
}
```

---

#### 2. Create Staff
**Action:** `createStaff(data: StaffFormData)`  
**File:** `src/actions/staff.ts`

Adds a new staff member to the vendor.

**Request:**
```typescript
await createStaff({
  name: "مریم احمدی",
  bio: "متخصص میکاپ و آرایش عروس",
  avatarUrl: "https://example.com/avatar.jpg"
});
```

**Response:**
```typescript
{
  success: true
}
```

**Validation:**
- `name`: Min 2 characters
- `bio`: Max 500 characters (optional)
- `avatarUrl`: Must be valid URL (optional)

---

#### 3. Update Staff
**Action:** `updateStaff(staffId: string, data: StaffFormData)`  
**File:** `src/actions/staff.ts`

Updates staff member information.

**Request:**
```typescript
await updateStaff("staff_456", {
  name: "سارا محمدی (سرپرست)",
  bio: "آرایشگر ارشد با ۱۵ سال تجربه",
  avatarUrl: "https://..."
});
```

**Response:**
```typescript
{
  success: true
}
```

---

#### 4. Delete Staff
**Action:** `deleteStaff(staffId: string)`  
**File:** `src/actions/staff.ts`

Deletes a staff member (with safety checks).

**Request:**
```typescript
await deleteStaff("staff_456");
```

**Response:**
```typescript
{
  success: true
}
// OR
{
  success: false,
  error: "Cannot delete staff with active future bookings. Please cancel or reassign them first."
}
```

**Validation:**
- Staff must exist and belong to vendor
- Cannot delete if there are future active bookings

**Side Effects:**
- Deletes `Staff` record
- Cascades to delete `StaffService` associations
- Cascades to delete `StaffSchedule` records

---

### Schedule Management

#### 1. Get Staff Schedule
**Action:** `getStaffSchedule(staffId: string)`  
**File:** `src/actions/schedule.ts`

Retrieves weekly schedule for a staff member.

**Request:**
```typescript
await getStaffSchedule("staff_456");
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "schedule_123",
      dayOfWeek: 0, // 0=Sunday, 6=Saturday
      startTime: "09:00",
      endTime: "17:00",
      staffId: "staff_456"
    },
    {
      id: "schedule_124",
      dayOfWeek: 1,
      startTime: "10:00",
      endTime: "18:00",
      staffId: "staff_456"
    }
  ]
}
```

**Day Mapping:**
- `0` = Sunday (یکشنبه)
- `1` = Monday (دوشنبه)
- `2` = Tuesday (سه‌شنبه)
- `3` = Wednesday (چهارشنبه)
- `4` = Thursday (پنج‌شنبه)
- `5` = Friday (جمعه)
- `6` = Saturday (شنبه)

---

#### 2. Upsert Schedule
**Action:** `upsertSchedule(data: ScheduleFormData)`  
**File:** `src/actions/schedule.ts`

Creates or updates a day's schedule for a staff member.

**Request:**
```typescript
await upsertSchedule({
  staffId: "staff_456",
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "17:00"
});
```

**Response:**
```typescript
{
  success: true
}
```

**Validation:**
- `dayOfWeek`: Integer 0-6
- `startTime`: "HH:mm" format (24-hour)
- `endTime`: "HH:mm" format, must be after startTime
- Staff must belong to vendor

**Behavior:**
- If schedule exists for this day: **Updates** it
- If no schedule exists: **Creates** new one

---

#### 3. Delete Schedule
**Action:** `deleteSchedule(scheduleId: string)`  
**File:** `src/actions/schedule.ts`

Removes a day from staff's schedule.

**Request:**
```typescript
await deleteSchedule("schedule_123");
```

**Response:**
```typescript
{
  success: true
}
```

---

## 🌍 Public APIs

These functions are used for public-facing pages and don't require authentication.

### Get Featured Vendors
**Function:** `getFeaturedVendors()`  
**File:** `src/lib/data/public-api.ts`

Returns top 10 active vendors for homepage.

**Request:**
```typescript
const vendors = await getFeaturedVendors();
```

**Response:**
```typescript
[
  {
    id: "vendor_123",
    name: "آرایشگاه گلستان",
    slug: "golestan-salon",
    address: "تهران، ولیعصر",
    bio: "بهترین خدمات آرایشی",
    logoUrl: "https://...",
    phoneNumber: "09121234567",
    isActive: true,
    _count: {
      services: 12
    }
  }
]
```

---

### Get Vendor by Slug
**Function:** `getVendorBySlug(slug: string)`  
**File:** `src/lib/data/public-api.ts`

Retrieves full vendor details including services and staff.

**Request:**
```typescript
const vendor = await getVendorBySlug("golestan-salon");
```

**Response:**
```typescript
{
  id: "vendor_123",
  name: "آرایشگاه گلستان",
  slug: "golestan-salon",
  address: "تهران، ولیعصر، پلاک ۱۲۳",
  bio: "ارائه خدمات حرفه‌ای آرایشی",
  logoUrl: "https://...",
  phoneNumber: "09121234567",
  isActive: true,
  services: [
    {
      id: "service_123",
      name: "کوتاهی مو",
      description: "...",
      price: 500000,
      depositAmount: 100000,
      durationMinutes: 60,
      isActive: true
    }
  ],
  staff: [
    {
      id: "staff_456",
      name: "سارا محمدی",
      bio: "...",
      avatarUrl: "https://..."
    }
  ],
  owner: {
    fullName: "محمد رضایی",
    phoneNumber: "09121234567"
  }
}
```

---

### Search Vendors
**Function:** `searchVendors(query: string, city?: string)`  
**File:** `src/lib/data/public-api.ts`

Searches vendors by name or location.

**Request:**
```typescript
const results = await searchVendors("آرایشگاه", "تهران");
```

**Response:**
```typescript
[
  {
    id: "vendor_123",
    name: "آرایشگاه گلستان",
    slug: "golestan-salon",
    address: "تهران، ولیعصر",
    // ... other vendor fields
    _count: {
      services: 12
    }
  }
]
```

**Search Logic:**
- Searches in `name` and `address` fields (case-insensitive)
- Optional city filter for `address` field
- Only returns active vendors
- Orders by creation date (newest first)

---

## 👨‍💼 Admin APIs

*(To be implemented)*

Admin endpoints for:
- User management
- Vendor approval/rejection
- Platform analytics
- Content moderation

---

## ⚠️ Error Handling

### Response Format

All server actions follow consistent error response format:

**Success Response:**
```typescript
{
  success: true,
  data?: any,
  // ... other fields
}
```

**Error Response:**
```typescript
{
  success: false,
  error: string | object
}
```

### Error Types

1. **Validation Errors** (Zod)
```typescript
{
  success: false,
  error: {
    name: ["Name must be at least 2 characters"],
    price: ["Price must be positive"]
  }
}
```

2. **Business Logic Errors**
```typescript
{
  success: false,
  error: "Cannot delete service. There are 3 active bookings."
}
```

3. **Authentication Errors**
```typescript
{
  success: false,
  error: "Unauthorized. Please log in."
}
```

4. **Database Errors**
```typescript
{
  success: false,
  error: "Database error"
}
```

### Error Handling Best Practices

```typescript
try {
  const result = await createService(data);
  
  if (!result.success) {
    // Handle error
    console.error(result.error);
    return;
  }
  
  // Success
  console.log("Service created!");
} catch (error) {
  // Unexpected errors
  console.error("Unexpected error:", error);
}
```

---

## 🚦 Rate Limiting

Currently, there is no rate limiting implemented. For production, consider:

1. **Per-IP Limits**
   - 100 requests per minute for authenticated users
   - 20 requests per minute for OTP endpoints

2. **Per-User Limits**
   - 1000 requests per hour for authenticated APIs

3. **Implementation Options**
   - Upstash Redis Rate Limit
   - Vercel Edge Config
   - Custom middleware with Redis

---

## 🔒 Security Considerations

1. **Authentication**
   - JWT tokens stored in HTTP-only cookies
   - 2-minute OTP expiration
   - Phone number verification required

2. **Authorization**
   - All protected endpoints verify session
   - Ownership checks for vendor resources
   - Role-based access control (RBAC)

3. **Input Validation**
   - Zod schemas for all inputs
   - SQL injection prevention via Prisma
   - XSS protection via React

4. **Best Practices**
   - Never expose sensitive data in responses
   - Log security events
   - Use HTTPS in production
   - Implement CSRF protection

---

## 📚 Additional Resources

- [Database Schema Documentation](./DATABASE_SCHEMA.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Questions or Issues?**  
Please refer to the main [README.md](../README.md) or contact the development team.
