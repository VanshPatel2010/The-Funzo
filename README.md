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
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` must be the final production origin, for example `https://thefunzo.com`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client code or public dashboards.
- `CLOUDINARY_API_SECRET` is server-only. Never expose it in client code.
- Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

## Supabase Setup

Apply the SQL schema and migrations before deploying:

```text
supabase/schema.sql
supabase/migrations/20260506_add_store_settings.sql
```

New admin image uploads use Cloudinary and save Cloudinary URLs in Supabase.
The legacy Supabase Storage bucket migrations are only needed if you want to keep
or recreate the previous Supabase Storage upload setup:

```text
supabase/migrations/20260604_create_product_images_bucket.sql
supabase/migrations/20260611_create_category_images_bucket.sql
```

## Production Checklist

- Set all required environment variables in the hosting provider.
- Rotate any credentials that were ever committed, logged, or shared.
- Create at least one admin in `admins` and `admin_credentials`.
- Confirm Cloudinary credentials are set and the account has available credits/storage.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Verify `/admin/login`, product creation, category creation, product/category image upload, sitemap, and public product pages after deployment.

## Deploy

Recommended target: Vercel.

```bash
npm run build
```

Use the default Next.js build command and output settings. No static export is
required because the app uses server actions, authenticated admin pages, and
dynamic Supabase data.
