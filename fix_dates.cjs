const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/AttendanceScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('Selasa, 14 Mei 2024', "{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}");

fs.writeFileSync(file, data);
