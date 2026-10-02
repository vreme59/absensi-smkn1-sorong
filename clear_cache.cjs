const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/localStorage\.getItem\('smkn1_attendance_students'\)/g, "localStorage.getItem('smkn1_attendance_students_v2')");
data = data.replace(/localStorage\.setItem\('smkn1_attendance_students'/g, "localStorage.setItem('smkn1_attendance_students_v2'");

fs.writeFileSync(file, data);
console.log('Updated localStorage key to v2');
