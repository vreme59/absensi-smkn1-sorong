-- 1. Tambah kolom phone dan avatar_url di tabel profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Buat Storage Bucket untuk avatars (jika belum ada, lewat dashboard atau sql ini)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Setup RLS untuk Storage Bucket 'avatars'
-- Izinkan semua orang melihat avatar
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Izinkan user yang login untuk mengupload avatar mereka sendiri
-- (Path file akan disimpan sebagai: user_id/nama_file.jpg)
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Izinkan user untuk mengupdate avatar mereka sendiri
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Izinkan user untuk menghapus avatar mereka sendiri
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
