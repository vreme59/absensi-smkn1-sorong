const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

async function testTeacher() {
  const { data: prof } = await adminClient.from('profiles').select('*').eq('username', 'GURUMT').single();
  console.log('Profile found:', prof);

  const { data: userCheck } = await adminClient.auth.admin.getUserById(prof.id);
  if (!userCheck?.user) {
    const { data: created, error } = await adminClient.auth.admin.createUser({
      id: prof.id,
      email: prof.username + '@smkn1sorong.sch.id',
      password: 'Demo@2025',
      email_confirm: true
    });
    console.log('Created auth user:', created?.user?.id, 'Error:', error);
  }

  const email = prof.username + '@smkn1sorong.sch.id';
  const { data: loginData, error: loginErr } = await anonClient.auth.signInWithPassword({
    email,
    password: 'Demo@2025'
  });
  console.log('Login result:', loginData?.user?.id, 'Login error:', loginErr);

  if (loginData?.user) {
    const { data: profileLoaded } = await anonClient.from('profiles').select('*, kelas:kelas_id(id, nama)').eq('id', loginData.user.id).single();
    console.log('Loaded profile for teacher:', profileLoaded);
  }
}

testTeacher();
