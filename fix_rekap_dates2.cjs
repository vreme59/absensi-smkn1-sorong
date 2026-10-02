const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "'File Rekap_{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).replace(' ', '_')}_XII_TKJ_1.pdf berhasil diunduh.'",
  "`File Rekap_${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).replace(' ', '_')}_XII_TKJ_1.pdf berhasil diunduh.`"
);

data = data.replace(
  "Rekap Kehadiran Bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}",
  "Rekap Kehadiran Bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}"
);

fs.writeFileSync(file, data);
