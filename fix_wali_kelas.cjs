const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/JadwalScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/<img\s+alt="Wali Kelas"[\s\S]*?\/>/, '');
data = data.replace('Ibu Dra. Hartini', 'Din Purba');

fs.writeFileSync(file, data);
console.log('Fixed Wali Kelas in JadwalScreen');
