const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function testProfileUpdate() {
  const { data: prof } = await adminClient.from('profiles').select('*').eq('username', 'GURUMT').single();
  console.log('Current profile:', prof);

  // Check user in auth
  const authUserId = 'c192b6c4-0c11-4d82-81f5-45a845baa8ed';
  
  // Temporarily delete jadwal for this old prof id
  const { error: delJadwalErr } = await adminClient.from('jadwal').delete().eq('guru_id', prof.id);
  console.log('Deleted old jadwal for GURUMT:', delJadwalErr);

  // Now update profiles.id
  const { error: updErr } = await adminClient.from('profiles').update({ id: authUserId }).eq('id', prof.id);
  console.log('Update profiles.id result:', updErr);

  // Now verify with anonClient login!
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
  const anonClient = createClient(SUPABASE_URL, ANON_KEY);

  const { data: signData, error: signErr } = await anonClient.auth.signInWithPassword({
    email: 'gurumt@smkn1sorong.sch.id',
    password: 'Demo@2025'
  });
  console.log('Sign in result:', signData?.user?.id, 'Err:', signErr);

  const { data: loadedProfile, error: loadErr } = await anonClient.from('profiles').select('*').eq('id', authUserId).single();
  console.log('Loaded profile for logged in user:', loadedProfile, 'loadErr:', loadErr);
}

testProfileUpdate();
