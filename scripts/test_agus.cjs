const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

async function testAgus() {
  const nisn = '0086704145';
  const username = 's' + nisn; // valid email prefix
  const email = username + '@smkn1sorong.sch.id';

  // Find existing profile
  const { data: oldProf } = await adminClient.from('profiles').select('*').eq('username', nisn).single();
  console.log('Old profile:', oldProf);

  // 1. Create auth user
  const { data: authRes, error: aErr } = await adminClient.auth.admin.createUser({
    email,
    password: 'Demo@2025',
    email_confirm: true
  });
  console.log('Auth user created:', authRes?.user?.id, 'Error:', aErr);

  const authUserId = authRes.user.id;

  // 2. Update profile id and username
  const { data: targetClass } = await adminClient.from('kelas').select('*').eq('nama', 'XII AK 1').single();
  const { error: updErr } = await adminClient.from('profiles').update({
    id: authUserId,
    username: username,
    nama: 'AGUS',
    kelas_id: targetClass.id
  }).eq('id', oldProf.id);

  console.log('Profile update result:', updErr);

  // 3. Test App Login by typing name "AGUS" exactly as useAuth.ts does
  const inputName = 'AGUS';
  const { data: profileLookup } = await anonClient
    .from('profiles')
    .select('username, nama')
    .ilike('nama', `%${inputName.trim()}%`)
    .limit(1)
    .maybeSingle();

  console.log('Profile looked up by name:', profileLookup);

  const loginEmail = `${profileLookup.username}@smkn1sorong.sch.id`;
  const { data: loginRes, error: lErr } = await anonClient.auth.signInWithPassword({
    email: loginEmail,
    password: 'Demo@2025'
  });

  console.log('Sign in by name AGUS success:', loginRes?.user?.id, 'Error:', lErr);

  if (loginRes?.user) {
    const { data: loaded } = await anonClient
      .from('profiles')
      .select('*, kelas:kelas_id(id, nama)')
      .eq('id', loginRes.user.id)
      .single();
    console.log('Profile loaded successfully for AGUS:');
    console.log(loaded);
  }
}

testAgus();
