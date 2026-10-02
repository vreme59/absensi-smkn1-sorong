
WITH new_user AS (
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'test@smkn1sorong.sch.id', 'abc', now(), '{}'::jsonb, '{}'::jsonb, now(), now()
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'test@smkn1sorong.sch.id')
  RETURNING id
),
user_id AS (
  SELECT id FROM new_user
  UNION ALL
  SELECT id FROM auth.users WHERE email = 'test@smkn1sorong.sch.id'
)
SELECT * FROM user_id;
