const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/AttendanceScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

// Add readOnly to Props interface
data = data.replace('interface Props {', 'interface Props {\n  readOnly?: boolean;');

// Add readOnly to destructuring
data = data.replace('export const AttendanceScreen: React.FC<Props> = ({', 'export const AttendanceScreen: React.FC<Props> = ({\n  readOnly = false,');

// Pass readOnly to StudentCard
data = data.replace('<StudentCard\n              key={student.id}', '<StudentCard\n              readOnly={readOnly}\n              key={student.id}');

// Hide the Tandai Semua button
data = data.replace('<button\n              onClick={onMarkAllPresent}', '{!readOnly && <button\n              onClick={onMarkAllPresent}');
data = data.replace('<span>Tandai Semua H</span>\n            </button>', '<span>Tandai Semua H</span>\n            </button>}');

fs.writeFileSync(file, data);
console.log('Fixed readOnly ReferenceError in AttendanceScreen.tsx');
