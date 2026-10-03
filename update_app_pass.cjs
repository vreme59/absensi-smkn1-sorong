const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

// 1. Add import
if (!appData.includes('ChangePasswordScreen')) {
  appData = appData.replace(
    /import \{ EditProfileScreen \} from '\.\/components\/EditProfileScreen';/,
    `import { EditProfileScreen } from './components/EditProfileScreen';\nimport { ChangePasswordScreen } from './components/ChangePasswordScreen';`
  );
}

// 2. Add to Tab types
appData = appData.replace(
  /type TabType = 'beranda' \| 'jadwal' \| 'absensi' \| 'profil' \| 'edit-profil';/,
  `type TabType = 'beranda' | 'jadwal' | 'absensi' | 'profil' | 'edit-profil' | 'ganti-password';`
);

// 3. Add to rendering
const renderTarget = `<EditProfileScreen onBack={() => setCurrentTab('profil')} user={currentUser} onProfileUpdated={() => window.location.reload()} />
          )}`;
const newRender = `${renderTarget}
          {currentTab === 'ganti-password' && (
            <ChangePasswordScreen onBack={() => setCurrentTab('profil')} />
          )}`;
appData = appData.replace(renderTarget, newRender);

// 4. Update ProfileScreen props
const profileTarget = `onEditProfile={() => setCurrentTab('edit-profil')}`;
const newProfileTarget = `onEditProfile={() => setCurrentTab('edit-profil')}\n              onChangePassword={() => setCurrentTab('ganti-password')}`;
appData = appData.replace(profileTarget, newProfileTarget);

// 5. Hide navbar when changing password
appData = appData.replace(
  /currentTab !== 'edit-profil' && <Navbar/,
  `currentTab !== 'edit-profil' && currentTab !== 'ganti-password' && <Navbar`
);
appData = appData.replace(
  /currentTab !== 'edit-profil' && \(\n\s*<BottomNav/,
  `currentTab !== 'edit-profil' && currentTab !== 'ganti-password' && (\n        <BottomNav`
);

fs.writeFileSync(appFile, appData);
console.log('App.tsx updated for password change screen');
