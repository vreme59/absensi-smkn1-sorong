import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data: kelas } = await supabase.from('kelas').select('*').ilike('nama', '%RPL 1%');
  console.log("Kelas:", kelas);
  
  if (kelas && kelas.length > 0) {
    const k = kelas.find(x => x.nama === 'XII RPL 1') || kelas[0];
    const { data: profiles } = await supabase.from('profiles').select('*').eq('kelas_id', k.id);
    console.log(`Found ${profiles?.length} profiles for ${k.nama}`);
    
    const { data: jadwal } = await supabase
       .from('jadwal')
       .select('*, mapel:mapel_id(nama), guru:guru_id(nama)')
       .eq('kelas_id', k.id);
    console.log(`Found ${jadwal?.length} jadwal records`);
  }
}

run();
