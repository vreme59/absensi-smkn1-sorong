const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/LoginScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

// Remove Interactive Switch Role Segment
data = data.replace(/\{\/\* Interactive Switch Role Demo Segment[\s\S]*?\{\/\* Auth Form Inputs \*\//, '{/* Auth Form Inputs */}');

// Remove Tervalidasi Dapodik
data = data.replace(/<span className="text-\[11px\] text-primary font-semibold">\s*Tervalidasi Dapodik\s*<\/span>/, '');

// Remove Enkripsi SHA-256
data = data.replace(/<span className="text-\[11px\] text-amber-700 font-semibold">\s*Enkripsi SHA-256\s*<\/span>/, '');

// Remove Quick Campus Info Chiplet Deck
data = data.replace(/\{\/\* Quick Campus Info Chiplet Deck \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Security)/, '');

fs.writeFileSync(file, data);
console.log('Removed requested sections from LoginScreen.tsx');
