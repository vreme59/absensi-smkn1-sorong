const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

// The exact string in App.tsx right now is:
//             <ProfileScreen
//               user={currentUser}
//                           onLogout={handleLogout}
//                           onShowToast={showToast}
//             />
// We will replace it using regex to be safe.

const regex = /<ProfileScreen[\s\S]*?onShowToast=\{showToast\}[\s\S]*?\/>/;

const replaceStr = `<ProfileScreen
            user={currentUser}
            onLogout={handleLogout}
            onShowToast={showToast}
            onEditProfile={() => setCurrentTab('edit-profil')}
          />`;

appData = appData.replace(regex, replaceStr);

fs.writeFileSync(appFile, appData);
