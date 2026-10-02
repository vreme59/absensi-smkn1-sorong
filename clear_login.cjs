const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/LoginScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace("useState('siswa_demo')", "useState('')");
data = data.replace("useState('Demo@2025')", "useState('')");
data = data.replace('placeholder="Masukkan username"', 'placeholder="Ketik username Anda di sini..."');

fs.writeFileSync(file, data);
console.log('Cleared default login values');
