import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cfcdqmajoazxcoxgnoka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc'
);

// Coba login langsung pakai kode yang sama dengan aplikasi
async function testLogin(username, password) {
  const email = `${username}@smkn1sorong.sch.id`;
  console.log(`\nMencoba login: ${email}`);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.log(`❌ GAGAL: ${error.message}`);
  } else {
    console.log(`✅ BERHASIL! User ID: ${data.user.id}`);
    await supabase.auth.signOut();
  }
}

async function run() {
  await testLogin('guru_demo', 'Demo@2025');
  await testLogin('admin_demo', 'Demo@2025');
  await testLogin('siswa_demo', 'Demo@2025');
  await testLogin('sekre_demo', 'Demo@2025');
}

run();
