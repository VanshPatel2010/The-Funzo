# Task 3.1 — NextAuth Setup with Credentials Implementation Guide

## ✅ Implementation Complete

A complete NextAuth.js v5 admin authentication system has been set up for "The Funzo" project. This guide covers the implementation and setup instructions.

## What Was Implemented

### 1. **Dependencies Updated**
- ✅ Upgraded `next-auth` to v5.0.0-beta.20
- ✅ Added `bcryptjs` v2.4.3 for password hashing

### 2. **Database Schema Extended**
- ✅ Added `admin_credentials` table to store hashed passwords
- ✅ Foreign key relationship with `admins` table
- ✅ Updated `supabase/schema.sql`

### 3. **NextAuth Configuration**
- **File**: `lib/auth.ts`
- ✅ Configured Credentials provider (email + password only)
- ✅ Server-side password verification using bcryptjs `compare()`
- ✅ JWT session strategy
- ✅ Queries Supabase `admins` table for user email
- ✅ Validates password against `admin_credentials` table with hashed storage

### 4. **API Routes**
- **File**: `app/api/auth/[...nextauth]/route.ts`
- ✅ Updated for NextAuth v5 handler pattern
- ✅ Exports GET and POST handlers

### 5. **Route Protection**
- **File**: `middleware.ts` (root directory)
- ✅ Protects all `/admin/*` routes
- ✅ Redirects unauthenticated users to `/admin/login`
- ✅ Uses `auth()` function for session verification

### 6. **Admin Pages**
- **Login Page**: `/admin/login` (`app/admin/login/page.tsx`)
  - Minimal, centered form design
  - Email + password inputs
  - Error display for invalid credentials
  - Loading state management
  - Client component using `next-auth/react` signIn
  
- **Dashboard Page**: `/admin/dashboard` (`app/admin/dashboard/page.tsx`)
  - Protected route (middleware redirects if not authenticated)
  - Sign out functionality
  - Placeholder for future admin features

### 7. **Utilities**
- **File**: `lib/hash-password.ts`
- ✅ CLI utility to hash passwords with bcryptjs
- ✅ Usage: `npx ts-node lib/hash-password.ts "your-password"`

### 8. **Documentation**
- **File**: `supabase/ADMIN_AUTH_SETUP.md`
- ✅ Complete setup guide
- ✅ Instructions for creating admin users
- ✅ Password hashing workflow

## Project Structure

```
The Funzo/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          (Login form)
│   │   └── dashboard/
│   │       └── page.tsx          (Protected dashboard)
│   ├── api/
│   │   └── auth/
│   │       └── [...]nextauth]/
│   │           └── route.ts      (NextAuth handlers)
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── lib/
│   ├── auth.ts                   (NextAuth config)
│   ├── hash-password.ts          (Password hashing utility)
│   ├── supabase.ts
│   └── ...
├── middleware.ts                 (Route protection)
├── supabase/
│   ├── schema.sql               (With admin_credentials table)
│   ├── ADMIN_AUTH_SETUP.md      (Setup guide)
│   └── seed.sql
└── ...
```

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This will install next-auth v5 and bcryptjs.

### Step 2: Update Supabase Schema

Apply the schema updates to your Supabase database:

1. Go to your Supabase dashboard → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL

This creates/updates:
- `admins` table (if updating existing DB)
- `admin_credentials` table (new)
- Associated indexes

### Step 3: Set Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000   # For development
NEXTAUTH_SECRET=<generate-with-command-below>
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Create Your First Admin User

#### 4a. Create Admin Email Entry

In Supabase dashboard → SQL Editor:

```sql
INSERT INTO admins (email) 
VALUES ('your-email@example.com')
RETURNING id;
```

Copy the returned UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`).

#### 4b. Hash the Password

In your terminal:

```bash
npx ts-node lib/hash-password.ts "your-secure-password"
```

This outputs something like:
```
Hashed password:
$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL...

To add an admin, insert this into the admin_credentials table:
INSERT INTO admin_credentials (admin_id, password_hash)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '$2a$10$...');
```

#### 4c. Insert Password Hash

In Supabase dashboard → SQL Editor:

```sql
INSERT INTO admin_credentials (admin_id, password_hash)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '$2a$10$your-hash-here');
```

### Step 5: Test the Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin/login`

3. Enter your email and password

4. On successful login, you'll be redirected to `/admin/dashboard`

5. Click "Sign Out" to sign out

## Authentication Flow

```
User visits /admin/*
    ↓
Middleware checks session via auth()
    ↓
No session? → Redirect to /admin/login
    ↓
Submit login form (POST /api/auth/signin)
    ↓
Credentials provider:
  - Query admins table by email
  - Get password hash from admin_credentials
  - Compare provided password with hash using bcryptjs
    ↓
Hash matches? → Generate JWT session
             → Redirect to callback URL (usually /admin/dashboard)
             
No match? → Show error, stay on login
```

## Key Features

- ✅ **NextAuth.js v5** with Credentials provider
- ✅ **Email + Password auth only** (no OAuth)
- ✅ **JWT sessions** with 30-day default expiration
- ✅ **Bcryptjs password hashing** (10 salt rounds)
- ✅ **Middleware protection** on /admin/* routes
- ✅ **TypeScript throughout**
- ✅ **Minimal UI** (no external UI libraries)
- ✅ **Secure password storage** (separate admin_credentials table)
- ✅ **Error handling** with user-friendly messages

## Important Security Notes

1. **Password Hashing**: Passwords are one-way hashed with bcryptjs salt rounds = 10
2. **Session Secrets**: NEXTAUTH_SECRET must be cryptographically secure and kept confidential
3. **Service Role Key**: Never expose SUPABASE_SERVICE_ROLE_KEY in browser code (only server-side)
4. **HTTPS in Production**: Use HTTPS for all admin routes in production
5. **Password Reset**: Implement a password reset flow for production (currently not included)

## File References

- **Authentication**: [lib/auth.ts](../lib/auth.ts)
- **Middleware**: [middleware.ts](../../middleware.ts)
- **Login Page**: [app/admin/login/page.tsx](../../app/admin/login/page.tsx)
- **Dashboard**: [app/admin/dashboard/page.tsx](../../app/admin/dashboard/page.tsx)
- **API Routes**: [app/api/auth/\[...nextauth\]/route.ts](../../app/api/auth/[...nextauth]/route.ts)
- **Database Schema**: [supabase/schema.sql](../schema.sql)

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Update Supabase schema
3. ✅ Set environment variables
4. ✅ Create first admin user
5. ✅ Test login flow
6. (Suggested) Add password reset functionality
7. (Suggested) Add admin management panel
8. (Suggested) Add audit logging

---

**Status**: Implementation complete and ready for use.
**Last Updated**: April 2026
