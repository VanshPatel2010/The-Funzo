-- ============================================================================
-- The Funzo — Supabase Database Schema
-- Product catalogue for cycles and kids' electric remote cars
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── CATEGORIES ─────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  image_url     TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Index for ordering
CREATE INDEX idx_categories_display_order ON categories (display_order);

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────

CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id   UUID NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  images        TEXT[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  age_range     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_products_category   ON products (category_id);
CREATE INDEX idx_products_slug       ON products (slug);
CREATE INDEX idx_products_featured   ON products (is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_available  ON products (is_available) WHERE is_available = TRUE;
CREATE INDEX idx_products_created_at ON products (created_at DESC);

-- ─── ADMINS ─────────────────────────────────────────────────────────────────

CREATE TABLE admins (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ADMIN CREDENTIALS ───────────────────────────────────────────────────────
-- Stores hashed passwords for admin authentication (separate from Supabase Auth)

CREATE TABLE admin_credentials (
  admin_id      UUID PRIMARY KEY REFERENCES admins (id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STORE SETTINGS ─────────────────────────────────────────────────────────

CREATE TABLE store_settings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_number   TEXT NOT NULL,
  whatsapp_number  TEXT NOT NULL,
  instagram_url    TEXT,
  address_url      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO store_settings (
  contact_number,
  whatsapp_number,
  instagram_url,
  address_url
)
VALUES (
  '+91 6354 955 653',
  '916354955653',
  'https://www.instagram.com/thefunzo1/',
  'https://share.google/R8gBmW9VrypRLlC3m'
);

-- Index for lookups by admin email
CREATE INDEX idx_admin_credentials_admin_id ON admin_credentials (admin_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- ─── Enable RLS on all tables ───────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins     ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- ─── Helper: Check if the current user is an admin ──────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── CATEGORIES Policies ────────────────────────────────────────────────────

-- Anyone can read categories (public catalogue)
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "categories_admin_insert"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update categories
CREATE POLICY "categories_admin_update"
  ON categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete categories
CREATE POLICY "categories_admin_delete"
  ON categories FOR DELETE
  USING (is_admin());

-- ─── PRODUCTS Policies ─────────────────────────────────────────────────────

-- Anyone can read products (public catalogue)
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update products
CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete products
CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  USING (is_admin());

-- ─── ADMINS Policies ───────────────────────────────────────────────────────

-- Only authenticated admins can read the admins table
CREATE POLICY "admins_self_read"
  ON admins FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- No public insert/update/delete on admins (manage via Supabase dashboard or service role)

-- ─── STORE SETTINGS Policies ───────────────────────────────────────────────

CREATE POLICY "store_settings_public_read"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY "store_settings_admin_insert"
  ON store_settings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "store_settings_admin_update"
  ON store_settings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());
