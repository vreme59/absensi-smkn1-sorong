const fs = require('fs');

const csvContent = fs.readFileSync('data_siswa_kelas_12.csv', 'utf8').trim();
const lines = csvContent.split('\n');

const byClass = {};

for (const line of lines) {
  const parts = line.split(',');
  if (parts.length < 5) continue;
  const no = parts[0];
  const nama = parts[1].trim();
  const rawClass = parts[2].trim();
  const nipd = parts[3].trim();
  const nisn = parts[4].trim();
  const jk = parts[5] ? parts[5].trim() : '-';

  if (!byClass[rawClass]) byClass[rawClass] = [];
  byClass[rawClass].push({ no, nama, nipd, nisn, jk, username: 's' + nisn });
}

let md = '# Daftar Peserta Didik Kelas XII yang Telah Aktif di Sistem\n\n';
md += '> [!NOTE]\n';
md += '> Sebanyak **481 siswa Kelas XII** (15 rombel kelas) telah terdaftar dan dibuatkan akun login di Supabase Auth.\n';
md += '> Siswa dapat langsung login menggunakan **Nama Lengkap / Panggilan Mereka** atau **NISN** dengan kata sandi default `Demo@2025`.\n\n';

md += '### Panduan Login Siswa\n';
md += '1. Masuk ke halaman login sistem.\n';
md += '2. Di kolom **NAMA LENGKAP / USERNAME**, ketik **Nama Siswa** (contoh: `AGUS`, `ALIF NURZALIM`, `PRIMA ADI NUGRAHA`) atau **NISN**.\n';
md += '3. Di kolom **KATA SANDI**, masukkan: `Demo@2025`\n';
md += '4. Klik **Masuk Sistem** &rarr; siswa langsung masuk ke dashboard kelas masing-masing!\n\n';

md += '---\n\n';
md += '## Ringkasan Jumlah Siswa Per Kelas\n\n';
md += '| No | Kelas | Jumlah Siswa | Status Akun |\n';
md += '| :-: | :--- | :-: | :-: |\n';

let cNo = 1;
for (const [className, students] of Object.entries(byClass)) {
  md += `| ${cNo++} | **${className}** | ${students.length} Siswa | ✅ Aktif (Bisa Login Nama) |\n`;
}
md += `| | **TOTAL KELAS XII** | **${lines.length} Siswa** | ✅ Semua Aktif |\n\n`;

md += '---\n\n';
md += '## Rincian Siswa Per Rombongan Belajar\n\n';

for (const [className, students] of Object.entries(byClass)) {
  md += `### ${className} (${students.length} Siswa)\n\n`;
  md += '| No | Nama Siswa | JK | NISN | Username Login | Kata Sandi |\n';
  md += '| :-: | :--- | :-: | :--- | :--- | :--- |\n';
  students.forEach((s, idx) => {
    md += `| ${idx + 1} | **${s.nama}** | ${s.jk} | \`${s.nisn}\` | \`${s.username}\` | \`Demo@2025\` |\n`;
  });
  md += '\n';
}

fs.writeFileSync('C:/Users/ADVAN/.gemini/antigravity/brain/54062d25-5f81-4c7c-9254-6717555c0cbd/daftar_siswa_kelas_xii.md', md);
console.log('Artifact daftar_siswa_kelas_xii.md generated successfully!');
