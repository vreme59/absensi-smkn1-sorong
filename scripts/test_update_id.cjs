const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function testUpdateId() {
  const { data: prof } = await adminClient.from('profiles').select('*').eq('username', 'GURUMT').single();
  console.log('Old profile:', prof);

  // Create user
  const { data: u, error: uErr } = await adminClient.auth.admin.createUser({
    email: prof.username.toLowerCase() + '@smkn1sorong.sch.id',
    password: 'Demo@2025',
    email_confirm: true
  });
  console.log('Created user:', u?.user?.id, 'Err:', uErr);

  if (u?.user) {
    const newId = u.user.id;
    // Try updating profile.id
    // But check if foreign keys in jadwal exist first
    const { count: jCount } = await adminClient.from('jadwal').select('*', { count: 'exact', head: true }).eq('guru_id', prof.id);
    console.log('Jadwal count for GURUMT:', jCount);

    // If we update jadwal first or if we update profiles directly:
    const { error: updErr } = await adminClient.from('profiles').update({ id: newId }).eq('id', prof.id);
    console.log('Update profile id error:', updErr);

    // Let's test if anonClient can sign in as GURUMT now!
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
    const anonClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: signData, error: signErr } = await anonClient.auth.signInWithPassword({
      email: prof.username.toLowerCase() + '@smkn1sorong.sch.id',
      password: 'Demo@2025'
    });
    console.log('Sign in success:', signData?.user?.id, 'error:', signErr);

    const { data: loadedProfile } = await anonClient.from('profiles').select('*').eq('id', newId).single();
    console.log('Loaded profile for logged in user:', loadedProfile);
  }
}

testUpdateId();
