# Database Initialization & Seeding Instructions

## ✅ Setup Complete
I have created the seeding script and updated the configuration files.

1.  **Seed Script:** Created `prisma/seed.ts` with all requested mock data.
2.  **Configuration:** Updated `package.json` to include `tsx` and the `prisma.seed` config.

## 🚀 Execution Commands

To initialize your database and populate it with data, run the following commands in your terminal **in this order**:

### 1. Install Dependencies
Installs `tsx` and other required packages.
```bash
npm install
```

### 2. Generate Prisma Client
Updates the generated TypeScript types (fixes `Role` import errors).
```bash
npx prisma generate
```

### 3. Run Database Migration
Creates the tables in your PostgreSQL database (requires valid `DATABASE_URL` in `.env`).
```bash
npx prisma migrate dev --name init_schema
```

### 4. Seed the Database
Runs the `prisma/seed.ts` script to populate mock data.
```bash
npx prisma db seed
```

---

## 🧐 What Data Will Be Created?

- **Users:**
  - Customer: `09120000000`
  - Vendor Owner: `09121111111`
- **Vendor:** "Rose Beauty Salon" (Slug: `rose-beauty`)
- **Services:**
  - Haircut (200k, 60min)
  - Nail Implant (450k, 120min)
  - Facial Cleansing (300k, 90min)
- **Staff:** Sarah, Mina
- **Assignments:**
  - Sarah → Haircut, Facial
  - Mina → Nail Implant, Facial
- **Schedule:** Sarah on Saturdays (10:00-18:00)
