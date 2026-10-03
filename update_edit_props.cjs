const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

const regex = /<EditProfileScreen onBack=\{\(\) => setCurrentTab\('profil'\)\} \/>/;
const replaceStr = `<EditProfileScreen onBack={() => setCurrentTab('profil')} user={currentUser} onProfileUpdated={() => window.location.reload()} />`;

appData = appData.replace(regex, replaceStr);

fs.writeFileSync(appFile, appData);
console.log('App.tsx updated EditProfileScreen props');
