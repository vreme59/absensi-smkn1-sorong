const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/LoginScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/{roleConfigs\[selectedRole\].label}/g, 'Username / ID Pengguna');
data = data.replace(/placeholder={roleConfigs\[selectedRole\].idPlaceholder}/g, 'placeholder="Masukkan username"');

fs.writeFileSync(file, data);
console.log('Changed Username label in LoginScreen.tsx');
