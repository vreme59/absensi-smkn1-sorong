const fs = require('fs');

try {
  let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
  let appData = fs.readFileSync(appFile, 'utf8');

  appData = appData.replace(
    /<BottomNav\s*currentTab=\{currentTab\}[\s\S]*?\/>/,
    (match) => `{currentTab !== 'edit-profil' && (\n        ${match}\n      )}`
  );

  fs.writeFileSync(appFile, appData);
  console.log('BottomNav hidden in edit profile');
} catch (e) {
  console.error(e);
}
