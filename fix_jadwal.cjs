const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/JadwalScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace("useState('XI RPL 1')", "useState('XII TKJ 1')");
data = data.replace("{ id: 'XI RPL 1', name: 'XI RPL 1 (Rekayasa Perangkat Lunak 1)' }", "{ id: 'XII TKJ 1', name: 'XII TKJ 1 (Teknik Komputer Jaringan 1)' }");
data = data.replace("selectedClass === 'XI RPL 1'", "selectedClass === 'XII TKJ 1'");
data = data.replace("'Rekayasa Perangkat Lunak 1'", "'Teknik Komputer Jaringan 1'");

fs.writeFileSync(file, data);
console.log('Fixed JadwalScreen.tsx');
