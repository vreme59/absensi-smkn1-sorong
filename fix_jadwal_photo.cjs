const fs = require('fs');

// 1. Update App.tsx
let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');
appData = appData.replace('<JadwalScreen onShowToast={showToast} />', '<JadwalScreen onShowToast={showToast} user={currentUser} />');
fs.writeFileSync(appFile, appData);

// 2. Update JadwalScreen.tsx
let jadwalFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/JadwalScreen.tsx';
let jadwalData = fs.readFileSync(jadwalFile, 'utf8');

// Add import UserProfile if not exists
if (!jadwalData.includes('UserProfile')) {
  jadwalData = jadwalData.replace("import { SCHEDULE_DAYS, SCHEDULES_BY_DAY }", "import { UserProfile } from '../types_samakan';\nimport { SCHEDULE_DAYS, SCHEDULES_BY_DAY }");
}

// Update props interface
jadwalData = jadwalData.replace(
  'interface JadwalScreenProps {\n  onShowToast: (title: string, desc: string, type?: \'success\' | \'warning\' | \'info\') => void;\n}',
  'interface JadwalScreenProps {\n  onShowToast: (title: string, desc: string, type?: \'success\' | \'warning\' | \'info\') => void;\n  user?: UserProfile;\n}'
);

// Update component signature
jadwalData = jadwalData.replace(
  'export const JadwalScreen: React.FC<JadwalScreenProps> = ({ onShowToast }) => {',
  'export const JadwalScreen: React.FC<JadwalScreenProps> = ({ onShowToast, user }) => {'
);

// Add the image tag
const oldHeader = `<div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white">Wali Kelas: Dinaria Purba, A.Md, S.Pd</span>`;

const newHeader = `{user && (
              <img
                src={user.avatarUrl}
                alt="Profil User"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 shadow-sm"
              />
            )}
            <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white">Wali Kelas: Dinaria Purba, A.Md, S.Pd</span>`;

jadwalData = jadwalData.replace(oldHeader, newHeader);
fs.writeFileSync(jadwalFile, jadwalData);

console.log('Added avatar to JadwalScreen and passed user prop');
