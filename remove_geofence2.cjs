const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Biometric GPS Geofence Simulator[\s\S]*?radius hijau\.\s*<\/p>\s*<\/div>/;
data = data.replace(regex, '');

data = data.replace('const [geofenceDistance, setGeofenceDistance] = useState<number>(35); // in meters (radius 100m)\n', '');
data = data.replace('const isInsideGeofence = geofenceDistance <= 100;\n', '');

const toggleRegex = /const handleToggleGeofence = \(\) => \{[\s\S]*?^\s*\};\n/m;
data = data.replace(toggleRegex, '');

fs.writeFileSync(file, data);
