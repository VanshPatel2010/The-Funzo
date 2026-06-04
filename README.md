# The Funzo

Next.js storefront and admin panel for The Funzo product catalogue.

## Local Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

Set these locally and in production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SITE_URL=
```

- `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` must be the final production origin, for example `https://thefunzo.com`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client code or public dashboards.
- Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

## Supabase Setup

Apply the SQL schema and migrations before deploying:

```text
supabase/schema.sql
supabase/migrations/20260506_add_store_settings.sql
supabase/migrations/20260604_create_product_images_bucket.sql
```

The `product-images` storage bucket must exist and be public-read. The upload
server action also attempts to create it automatically if the service role key
has bucket-management permissions.

## Production Checklist

- Set all required environment variables in the hosting provider.
- Rotate any credentials that were ever committed, logged, or shared.
- Create at least one admin in `admins` and `admin_credentials`.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Verify `/admin/login`, product creation, category creation, image upload, sitemap, and public product pages after deployment.

## Deploy

Recommended target: Vercel.

```bash
npm run build
```

Use the default Next.js build command and output settings. No static export is
required because the app uses server actions, authenticated admin pages, and
dynamic Supabase data.
