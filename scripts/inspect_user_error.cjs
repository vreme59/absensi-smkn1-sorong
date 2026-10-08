const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function inspectSchema() {
  // Try calling pg_tables or information_schema via rpc if available, or just test creating user with prof.id vs new id
  console.log('Testing createUser with new id but email GURUMT@smkn1sorong.sch.id...');
  const res1 = await adminClient.auth.admin.createUser({
    email: 'GURUMT@smkn1sorong.sch.id',
    password: 'Demo@2025',
    email_confirm: true
  });
  console.log('Result without explicit id:', res1.data?.user?.id, 'Error:', res1.error);
  if (res1.data?.user) {
    await adminClient.auth.admin.deleteUser(res1.data.user.id);
  }

  console.log('\nTesting createUser with lower-case gurumt@smkn1sorong.sch.id...');
  const res2 = await adminClient.auth.admin.createUser({
    email: 'gurumt@smkn1sorong.sch.id',
    password: 'Demo@2025',
    email_confirm: true
  });
  console.log('Result lowercase without explicit id:', res2.data?.user?.id, 'Error:', res2.error);
  if (res2.data?.user) {
    await adminClient.auth.admin.deleteUser(res2.data.user.id);
  }
}

inspectSchema();
