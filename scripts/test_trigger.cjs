const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function testTrigger() {
  const email = 'guru_test_999@smkn1sorong.sch.id';
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: 'Demo@2025',
    email_confirm: true
  });
  console.log('User created:', data?.user?.id, 'Error:', error);

  if (data?.user) {
    // Check if profile was auto-created by trigger
    const { data: prof } = await adminClient.from('profiles').select('*').eq('id', data.user.id).single();
    console.log('Profile created by trigger:', prof);

    // Clean up
    await adminClient.auth.admin.deleteUser(data.user.id);
    await adminClient.from('profiles').delete().eq('id', data.user.id);
    console.log('Cleaned up test.');
  }
}

testTrigger();
