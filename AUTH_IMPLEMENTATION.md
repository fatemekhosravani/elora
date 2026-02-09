# Authentication System Implementation

## ✅ Components Implemented

### 1. Database Schema
Updated `prisma/schema.prisma` to include the `VerificationCode` table for storing temporary OTPs.
```prisma
model VerificationCode {
  id          String   @id @default(cuid())
  phoneNumber String   @unique
  code        String
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}
```

### 2. Session Management (`src/lib/session.ts`)
- Stateless JWT implementation using `jose`.
- **Payload:** `{ userId, role, expiresAt }`.
- **Security:** HTTP-Only, Secure (prod), SameSite=Lax.
- **Duration:** 7 days.

### 3. Server Actions (`src/actions/auth.ts`)
- `sendOtp(phoneNumber)`: Validates phone (Iran format), generates 5-digit code, saves to DB. *Currently logs OTP to console.*
- `verifyOtp(phoneNumber, code)`: Validates code, checks expiry, creates/updates User, creates Session, and cleans up OTP.

### 4. Middleware (`src/middleware.ts`)
- Protects `/panel/*` (Customer/Vendor/Admin access).
- Protects `/vendor-panel/*` (Vendor/Admin only).
- Protects `/admin/*` (Admin only).
- Redirects unauthenticated users to `/login`.

## 🚀 How to Use

### Send OTP (Frontend)
```tsx
import { sendOtp } from '@/actions/auth';

// Inside a form action or handler
await sendOtp('09121234567');
```

### Verify OTP (Frontend)
```tsx
import { verifyOtp } from '@/actions/auth';

const result = await verifyOtp('09121234567', '12345');
if (result.success) {
  // Redirect based on result.role
}
```

## ⚠️ Notes
- The Login URL is set to `/login` (from `(auth)/login/page.tsx`).
- Ensure `SESSION_SECRET` is set in `.env` for production.
- Run `npx prisma db push` to apply schema changes.
