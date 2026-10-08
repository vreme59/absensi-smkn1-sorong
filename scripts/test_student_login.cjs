const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

async function testStudent() {
  const nisn = '0086704145';
  const email = nisn + '@smkn1sorong.sch.id';

  // 1. Get profile
  const { data: prof } = await adminClient.from('profiles').select('*').eq('username', nisn).single();
  console.log('Current profile in DB:', prof);

  // 2. Check or create auth user
  let authUser = null;
  const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
    email,
    password: 'Demo@2025',
    email_confirm: true
  });

  if (created?.user) {
    authUser = created.user;
  } else if (createErr?.message?.includes('already registered')) {
    const { data: list } = await adminClient.auth.admin.listUsers();
    authUser = list.users.find(u => u.email === email);
  }

  console.log('Auth user ID:', authUser?.id);

  // 3. Update profile to match authUser.id and assign to XII AK 1
  const { data: targetClass } = await adminClient.from('kelas').select('*').eq('nama', 'XII AK 1').single();
  console.log('Target class:', targetClass);

  const { error: updErr } = await adminClient.from('profiles').update({
    id: authUser.id,
    nama: 'AGUS',
    kelas_id: targetClass.id
  }).eq('username', nisn);

  console.log('Profile update error:', updErr);

  // 4. Test app login simulation by typing 'AGUS'
  const identifier = 'AGUS';
  const { data: profileLookup } = await anonClient
    .from('profiles')
    .select('username, nama')
    .ilike('nama', `%${identifier.trim()}%`)
    .limit(1)
    .maybeSingle();

  console.log('Lookup result by name:', profileLookup);

  const loginEmail = `${profileLookup.username}@smkn1sorong.sch.id`;
  const { data: loginData, error: loginErr } = await anonClient.auth.signInWithPassword({
    email: loginEmail,
    password: 'Demo@2025'
  });

  console.log('Sign in result:', loginData?.user?.id, 'Error:', loginErr);

  if (loginData?.user) {
    const { data: loadedProf } = await anonClient
      .from('profiles')
      .select('*, kelas:kelas_id(id, nama)')
      .eq('id', loginData.user.id)
      .single();
    console.log('Profile successfully loaded for student:');
    console.log(loadedProf);
  }
}

testStudent();
