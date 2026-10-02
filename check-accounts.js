import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cfcdqmajoazxcoxgnoka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc'
);

async function checkAccounts() {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, nama, role, is_sekretaris')
    .in('username', ['guru_demo', 'siswa_demo', 'sekre_demo', 'admin_demo', 'admin']);
  
  console.log('Demo accounts in DB:', JSON.stringify(data, null, 2));
  if (error) console.log('Error:', error.message);

  // Cek semua guru
  const { data: gurus } = await supabase
    .from('profiles')
    .select('username, nama, role')
    .eq('role', 'guru')
    .limit(5);
  console.log('\nGuru accounts:', JSON.stringify(gurus, null, 2));

  // Cek sekretaris
  const { data: sekre } = await supabase
    .from('profiles')
    .select('username, nama, role, is_sekretaris')
    .eq('is_sekretaris', true)
    .limit(5);
  console.log('\nSekretaris accounts:', JSON.stringify(sekre, null, 2));
}

checkAccounts();
