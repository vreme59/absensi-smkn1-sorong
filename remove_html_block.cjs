const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* View \/ Download Standalone HTML Code Button \*\/\}[\s\S]*?<\/button>\s*<\/div>/;
data = data.replace(regex, '');

fs.writeFileSync(file, data);
console.log('Removed HTML button block');
