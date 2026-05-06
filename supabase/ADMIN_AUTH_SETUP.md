# Admin Authentication Setup Guide

## Overview
This project uses NextAuth.js v5 with a Credentials provider to authenticate admins. Passwords are hashed using bcryptjs and stored in a separate `admin_credentials` table in Supabase.

## Database Tables

### `admins`
Stores admin email addresses.

### `admin_credentials`
Stores hashed passwords for each admin (foreign key relationship with admins table).

## Creating a New Admin User

### Step 1: Create Admin in Supabase

Add a record to the `admins` table with the admin's email:

```sql
INSERT INTO admins (email) 
VALUES ('your-admin@example.com')
RETURNING id;
```

Copy the returned `id` (UUID).

### Step 2: Hash the Password

Run the password hashing utility:

```bash
npx ts-node lib/hash-password.ts "your-secure-password"
```

This will output a bcrypt hash. Copy it.

### Step 3: Store the Password Hash

Insert the hashed password into the `admin_credentials` table:

```sql
INSERT INTO admin_credentials (admin_id, password_hash)
VALUES ('your-admin-uuid-from-step-1', 'your-hashed-password-from-step-2');
```

## Environment Variables

Ensure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Login

1. Navigate to `/admin/login`
2. Enter email and password
3. On successful authentication, you'll be redirected to `/admin/dashboard`
4. Protected routes under `/admin/*` require authentication

## Session Management

- Sessions use JWT strategy
- Default session expiration: 30 days
- Sign out available in admin dashboard

## Route Protection

The middleware at `middleware.ts` protects all `/admin/*` routes except `/admin/login`.

- Unauthenticated users accessing `/admin/*` are redirected to `/admin/login`
- After login, users are redirected back to their intended destination
