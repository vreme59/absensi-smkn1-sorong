-- Jalankan di Supabase SQL Editor SETELAH membuat user guru_demo 
-- lewat Dashboard > Authentication > Users (pakai cara manual UI).
-- Script ini akan mengupdate profile-nya supaya role = 'guru'.

-- Step 1: Cek apakah email guru_demo sudah ada di auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email IN (
  'guru_demo@smkn1sorong.sch.id',
  'admin_demo@smkn1sorong.sch.id'
);
