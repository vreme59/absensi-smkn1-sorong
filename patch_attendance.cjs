const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/AttendanceScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

// Add readOnly prop to interface
data = data.replace('interface Props {', 'interface Props {\n  readOnly?: boolean;');

// Add readOnly to destructuring
data = data.replace('export const AttendanceScreen: React.FC<Props> = ({', 'export const AttendanceScreen: React.FC<Props> = ({\n  readOnly = false,');

// Hide "Tandai Semua"
data = data.replace(/<button\s+onClick=\{onMarkAllPresent\}/g, '{!readOnly && <button\n              onClick={onMarkAllPresent}');
data = data.replace(/<span>Tandai Semua H<\/span>\n\s*<\/button>/, '<span>Tandai Semua H</span>\n            </button>}');

// Disable radio buttons (in StudentCard, wait! StudentCard receives the click! Let's check StudentCard.tsx)
fs.writeFileSync(file, data);
console.log('Patched AttendanceScreen.tsx');
