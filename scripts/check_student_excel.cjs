const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const wb = XLSX.readFile('D:/Coding/lomba website sekolah/data data/DATA SISWA 12 JUNI 2025.xlsx');
const sheet = wb.Sheets['KELAS 10'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

async function check() {
  console.log('Sample rows from KELAS 10:');
  for (let i = 0; i < 10; i++) {
    console.log(rows[i]);
  }
}
check();
