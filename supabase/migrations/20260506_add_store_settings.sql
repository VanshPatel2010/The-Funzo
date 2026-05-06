CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  instagram_url TEXT,
  address_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_settings'
      AND policyname = 'store_settings_public_read'
  ) THEN
    CREATE POLICY "store_settings_public_read"
      ON store_settings FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_settings'
      AND policyname = 'store_settings_admin_insert'
  ) THEN
    CREATE POLICY "store_settings_admin_insert"
      ON store_settings FOR INSERT
      WITH CHECK (is_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'store_settings'
      AND policyname = 'store_settings_admin_update'
  ) THEN
    CREATE POLICY "store_settings_admin_update"
      ON store_settings FOR UPDATE
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;

INSERT INTO store_settings (
  contact_number,
  whatsapp_number,
  instagram_url,
  address_url
)
SELECT
  '+91 6354 955 653',
  '916354955653',
  'https://www.instagram.com/thefunzo1/',
  'https://share.google/R8gBmW9VrypRLlC3m'
WHERE NOT EXISTS (
  SELECT 1 FROM store_settings
);
