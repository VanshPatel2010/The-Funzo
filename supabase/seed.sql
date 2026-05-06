-- ============================================================================
-- The Funzo — Seed Data
-- 3 categories + 6 sample products
-- ============================================================================

-- ─── CATEGORIES ─────────────────────────────────────────────────────────────

INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
  (
    'a1b2c3d4-1111-4000-8000-000000000001',
    'Road Cycles',
    'road-cycles',
    'High-performance road cycles built for speed, endurance, and the open road.',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
    1
  ),
  (
    'a1b2c3d4-2222-4000-8000-000000000002',
    'Kids Cycles',
    'kids-cycles',
    'Safe, colorful, and fun cycles designed for young riders learning to explore.',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
    2
  ),
  (
    'a1b2c3d4-3333-4000-8000-000000000003',
    'Electric Remote Cars',
    'electric-remote-cars',
    'Exciting electric remote-controlled cars for kids — drive, drift, and race!',
    'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800',
    3
  );

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────

INSERT INTO products (name, slug, description, price, category_id, images, tags, is_featured, is_available, age_range) VALUES

  -- Road Cycles (2 products)
  (
    'Veloce Pro 700',
    'veloce-pro-700',
    'Lightweight carbon frame road cycle with Shimano 105 groupset. Perfect for long-distance rides and competitive cycling.',
    34999.00,
    'a1b2c3d4-1111-4000-8000-000000000001',
    ARRAY['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800'],
    ARRAY['road', 'carbon', 'shimano', 'pro'],
    TRUE,
    TRUE,
    '16+'
  ),
  (
    'Urban Glide X3',
    'urban-glide-x3',
    'Versatile hybrid cycle ideal for city commuting and weekend trail rides. Aluminium body with disc brakes.',
    18499.00,
    'a1b2c3d4-1111-4000-8000-000000000001',
    ARRAY['https://images.unsplash.com/photo-1571188654248-7a89013e5cd0?w=800'],
    ARRAY['hybrid', 'city', 'commute', 'disc-brakes'],
    FALSE,
    TRUE,
    '14+'
  ),

  -- Kids Cycles (2 products)
  (
    'Little Explorer 16"',
    'little-explorer-16',
    'Sturdy kids cycle with training wheels, adjustable seat, and a fun bell. Available in red and blue.',
    5999.00,
    'a1b2c3d4-2222-4000-8000-000000000002',
    ARRAY['https://images.unsplash.com/photo-1595558009725-9ba4e87bb0d0?w=800'],
    ARRAY['kids', 'training-wheels', 'beginner'],
    TRUE,
    TRUE,
    '4-7'
  ),
  (
    'Junior Sprint 20"',
    'junior-sprint-20',
    'Lightweight kids cycle with 6-speed gears and vibrant graphics. Ready for the next adventure.',
    8499.00,
    'a1b2c3d4-2222-4000-8000-000000000002',
    ARRAY['https://images.unsplash.com/photo-1605235186583-a8272b61f9fe?w=800'],
    ARRAY['kids', 'geared', 'adventure'],
    FALSE,
    TRUE,
    '7-12'
  ),

  -- Electric Remote Cars (2 products)
  (
    'TurboZap RC Racer',
    'turbozap-rc-racer',
    'High-speed remote control car with 2.4GHz controller, LED lights, and rechargeable battery. Top speed 15 km/h.',
    3499.00,
    'a1b2c3d4-3333-4000-8000-000000000003',
    ARRAY['https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800'],
    ARRAY['rc-car', 'high-speed', 'led', 'rechargeable'],
    TRUE,
    TRUE,
    '6+'
  ),
  (
    'DriftKing Monster Truck',
    'driftking-monster-truck',
    'All-terrain monster truck RC car with oversized wheels, suspension system, and 30-min battery life.',
    4999.00,
    'a1b2c3d4-3333-4000-8000-000000000003',
    ARRAY['https://images.unsplash.com/photo-1581235707960-23b7e8f7e284?w=800'],
    ARRAY['rc-car', 'monster-truck', 'off-road', 'all-terrain'],
    FALSE,
    TRUE,
    '8+'
  );

-- ─── ADMIN SEED ─────────────────────────────────────────────────────────────
-- To create an admin user:
-- 1. Insert email into admins table
-- 2. Hash a password using: npx ts-node lib/hash-password.ts "your-password"
-- 3. Insert the hash into admin_credentials table
-- ─
-- Example (replace admin_id and hash):
-- INSERT INTO admins (id, email) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@thefunzo.com');
-- INSERT INTO admin_credentials (admin_id, password_hash) VALUES ('550e8400-e29b-41d4-a716-446655440000', '$2a$10$...');

