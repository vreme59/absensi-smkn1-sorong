const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const start = data.indexOf('const handleToggleGeofence');
if (start !== -1) {
  const end = data.indexOf('};', start) + 2;
  data = data.slice(0, start) + data.slice(end);
}

fs.writeFileSync(file, data);
