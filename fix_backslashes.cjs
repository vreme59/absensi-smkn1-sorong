const fs = require('fs');

let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/EditProfileScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/\\`/g, '`');
data = data.replace(/\\\$/g, '$');
data = data.replace(/\\}/g, '}');

fs.writeFileSync(file, data);
console.log('Fixed backslashes');
