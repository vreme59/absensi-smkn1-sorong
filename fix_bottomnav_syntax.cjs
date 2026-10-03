const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

appData = appData.replace(
  "{currentTab !== 'edit-profil' && {currentTab !== 'edit-profil' && (",
  "{currentTab !== 'edit-profil' && ("
);

appData = appData.replace(
  "/>\n        )}}",
  "/>\n      )}"
);

fs.writeFileSync(appFile, appData);
