
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfcdqmajoazxcoxgnoka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createSiswa(username, nama) {
  const email = username + '@smkn1sorong.sch.id';
  console.log('Creating', email, '...');
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'Demo@2025'
  });
  
  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log(username, 'already registered');
        // If already registered, we should find the ID and update the profile
        const { data: profile } = await supabase.from('profiles').select('id').eq('username', username).single();
        if (profile) {
            await supabase.from('profiles').update({ nama }).eq('id', profile.id);
            console.log('Updated profile for', username, 'to', nama);
        }
        return;
    }
    console.error('Error creating', username, authError);
    return;
  }
  
  // We don't have service_role, but trigger should create profile.
  // Wait a sec for trigger
  await new Promise(r => setTimeout(r, 1000));
  
  const { error: profError } = await supabase.from('profiles').update({
    nama: nama,
    role: 'siswa'
  }).eq('id', authData.user.id);
  
  if (profError) {
    console.error('Error updating profile for', username, profError);
  } else {
    console.log('Successfully setup', username, '->', nama);
  }
}

async function run() {
  await createSiswa('prima', 'PRIMA ADI NUGRAHA SOLTIF');
  await createSiswa('alif', 'ALIF NURZALIM');
  await createSiswa('rahmad', 'RAHMAD RIZAL');
}

run();
