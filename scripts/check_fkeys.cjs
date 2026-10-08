const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function testSingle() {
  // Let's see if any other tables reference profiles.id
  // kelas.wali_kelas_id might reference profiles.id!
  const { data: wali } = await adminClient.from('kelas').select('id, nama, wali_kelas_id').not('wali_kelas_id', 'is', null);
  console.log('Kelas with wali_kelas_id:', wali.length);
  if (wali.length > 0) {
    console.log('Sample wali:', wali.slice(0, 5));
  }

  // absen_harian.diinput_oleh / divalidasi_oleh
  const { count: countHarian } = await adminClient.from('absen_harian').select('*', { count: 'exact', head: true });
  console.log('absen_harian count:', countHarian);
}

testSingle();
