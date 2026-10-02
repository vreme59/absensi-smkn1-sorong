-- ============================================================
-- BUAT AKUN DEMO GURU & ADMIN
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Step 1: Buat user guru_demo di auth.users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud
) VALUES (
  'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'guru_demo@smkn1sorong.sch.id',
  crypt('Demo@2025', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false, 'authenticated', 'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Buat identity guru_demo
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb',
  'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa',
  'guru_demo@smkn1sorong.sch.id',
  '{"sub":"aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa","email":"guru_demo@smkn1sorong.sch.id"}',
  'email', NOW(), NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Buat profile guru_demo
INSERT INTO public.profiles (id, username, nama, role, is_sekretaris, must_change_password)
VALUES (
  'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa',
  'guru_demo', 'Guru Demo', 'guru', false, false
) ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────

-- Step 4: Buat user admin_demo di auth.users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud
) VALUES (
  'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'admin_demo@smkn1sorong.sch.id',
  crypt('Demo@2025', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false, 'authenticated', 'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Step 5: Buat identity admin_demo
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'cccccccc-0002-0002-0002-cccccccccccc',
  'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa',
  'admin_demo@smkn1sorong.sch.id',
  '{"sub":"aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa","email":"admin_demo@smkn1sorong.sch.id"}',
  'email', NOW(), NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 6: Buat profile admin_demo
INSERT INTO public.profiles (id, username, nama, role, is_sekretaris, must_change_password)
VALUES (
  'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa',
  'admin_demo', 'Admin Demo', 'admin', false, false
) ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- Verifikasi: pastikan 4 akun ini muncul
SELECT username, nama, role, must_change_password
FROM public.profiles
WHERE username IN ('guru_demo', 'admin_demo', 'sekre_demo', 'siswa_demo')
ORDER BY role;
