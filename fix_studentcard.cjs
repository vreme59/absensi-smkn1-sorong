const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/AttendanceScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(/<StudentCard\s+key=\{student\.id\}/, '<StudentCard readOnly={readOnly} key={student.id}');

fs.writeFileSync(file, data);
