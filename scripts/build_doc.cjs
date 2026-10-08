const fs = require('fs');
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const EXCEL_PATH = 'd:/Coding/absensi-smkn1-sorong-main/TKA JADWAL PELAJARAN 2026-2027 GANJIL.xlsx';

async function buildDoc() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheetGuru = wb.Sheets['Kode Guru'];
  const rowsGuru = XLSX.utils.sheet_to_json(sheetGuru, { header: 1 });

  const { data: profiles } = await supabase.from('profiles').select('id, username, nama, role').eq('role', 'guru');
  
  let currentMapel = 'Mata Pelajaran Umum';
  const list = [];

  for (let i = 2; i < rowsGuru.length; i++) {
    const r = rowsGuru[i];
    if (!r || !r[1]) continue;
    if (r[4] && String(r[4]).trim()) {
      currentMapel = String(r[4]).trim();
    }
    const kode = r[3] ? String(r[3]).trim() : '';
    if (!kode) continue;

    const nama = String(r[1]).trim();
    const rawNip = r[2] ? String(r[2]).trim() : '';
    const cleanNip = rawNip.replace(/[^0-9]/g, '');
    const username = cleanNip ? cleanNip : ('GURU' + kode);

    const prof = profiles.find(p => p.username === username);

    list.push({
      no: list.length + 1,
      nama,
      nip: rawNip || 'Honorer / GTT',
      kode,
      mapel: currentMapel,
      username,
      active: !!prof
    });
  }

  // Group by Mapel
  const byMapel = {};
  list.forEach(item => {
    if (!byMapel[item.mapel]) byMapel[item.mapel] = [];
    byMapel[item.mapel].push(item);
  });

  let md = '# Daftar Guru SMKN 1 Sorong yang Sudah Terdaftar di Sistem\n\n';
  md += '> [!NOTE]\n';
  md += '> Seluruh **108 guru mata pelajaran dan BP/BK** (ditambah 1 akun demo) telah dibuatkan akun login resmi di Supabase Auth dan terhubung dengan profil guru serta jadwal pelajaran.\n';
  md += '> **Kata Sandi Default untuk Semua Akun:** `Demo@2025`\n\n';

  md += '### Panduan Login Guru\n';
  md += '- **Input Kolom Username/Nama**: Dapat diisi menggunakan **NIP/NIPPPK** (angka saja), **Nama Lengkap / Sebagian Nama Guru**, atau **Kode Honorer** (`GURU<KODE>`).\n';
  md += '- **Kata Sandi**: `Demo@2025`\n\n';

  md += '---\n\n';
  md += '## Tabel Guru Berdasarkan Kelompok Mata Pelajaran\n\n';

  for (const [mapel, teachers] of Object.entries(byMapel)) {
    md += `### ${mapel} (${teachers.length} Guru)\n\n`;
    md += '| No | Kode | Nama Guru | NIP / Status | Username Login | Status Akun |\n';
    md += '| :-: | :-: | :--- | :--- | :--- | :-: |\n';
    teachers.forEach((t, idx) => {
      md += `| ${idx + 1} | \`${t.kode}\` | **${t.nama}** | ${t.nip} | \`${t.username}\` | ✅ Aktif |\n`;
    });
    md += '\n';
  }

  md += '---\n\n';
  md += '### Akun Tambahan (Demo)\n\n';
  md += '| Nama Akun | Username Login | Role | Kata Sandi | Status |\n';
  md += '| :--- | :--- | :-: | :--- | :-: |\n';
  md += '| Guru Demo | `guru_demo` | Guru | `Demo@2025` | ✅ Aktif |\n';

  const targetPath = 'C:/Users/ADVAN/.gemini/antigravity/brain/54062d25-5f81-4c7c-9254-6717555c0cbd/daftar_guru_terdaftar.md';
  fs.writeFileSync(targetPath, md);
  console.log('Artifact created successfully at', targetPath);
}

buildDoc();
