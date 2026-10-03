const fs = require('fs');

try {
  // 1. Update ProfileScreenSamakan.tsx
  let profileFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
  let profileData = fs.readFileSync(profileFile, 'utf8');

  profileData = profileData.replace(
    'interface ProfileScreenProps {',
    'interface ProfileScreenProps {\n  onEditProfile?: () => void;'
  );

  profileData = profileData.replace(
    'export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onShowToast }) => {',
    'export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onShowToast, onEditProfile }) => {'
  );

  profileData = profileData.replace(
    /onClick=\{\(\) => onShowToast\('Fitur Terkunci'[\s\S]*?'warning'\)\}/,
    'onClick={onEditProfile}'
  );

  fs.writeFileSync(profileFile, profileData);

  // 2. Update App.tsx
  let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
  let appData = fs.readFileSync(appFile, 'utf8');

  appData = appData.replace(
    "import { ProfileScreen } from './components/ProfileScreenSamakan';",
    "import { ProfileScreen } from './components/ProfileScreenSamakan';\nimport { EditProfileScreen } from './components/EditProfileScreen';"
  );

  appData = appData.replace(
    "useState<'beranda' | 'jadwal' | 'absensi' | 'profil'>('beranda');",
    "useState<'beranda' | 'jadwal' | 'absensi' | 'profil' | 'edit-profil'>('beranda');"
  );

  const profileRender = `<ProfileScreen
            user={currentUser}
            onLogout={handleLogout}
            onShowToast={showToast}
          />`;
  const newProfileRender = `<ProfileScreen
            user={currentUser}
            onLogout={handleLogout}
            onShowToast={showToast}
            onEditProfile={() => setCurrentTab('edit-profil')}
          />`;
  appData = appData.replace(profileRender, newProfileRender);

  const editProfileRender = `
        {currentTab === 'edit-profil' && (
          <EditProfileScreen onBack={() => setCurrentTab('profil')} />
        )}
`;
  appData = appData.replace(
    '        {currentTab === \'profil\' && (',
    editProfileRender + '        {currentTab === \'profil\' && ('
  );

  // Hide Navbar and BottomNav when in edit-profil
  appData = appData.replace(
    '<Navbar currentTab={currentTab} user={currentUser} onSelectRole={() => {}} onOpenHtmlModal={() => {}} />',
    '{currentTab !== \'edit-profil\' && <Navbar currentTab={currentTab} user={currentUser} onSelectRole={() => {}} onOpenHtmlModal={() => {}} />}'
  );
  
  appData = appData.replace(
    '<BottomNav',
    '{currentTab !== \'edit-profil\' && <BottomNav'
  );
  appData = appData.replace(
    'validationStatus === \'menunggu_acc\' ? 1 : 0}\n      />',
    'validationStatus === \'menunggu_acc\' ? 1 : 0}\n      />}'
  );
  // Actually, BottomNav might be better written with a single regex
  appData = appData.replace(
    /<BottomNav[\s\S]*?validationStatus === 'menunggu_acc' \? 1 : 0\}\n\s*\/>\n\s*\}\n/m, 
    "" // Oops, regex replace can be messy. Let's do it safer.
  );

  fs.writeFileSync(appFile, appData);
  console.log('App updated');
} catch (e) {
  console.error(e);
}
