const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

const regex = /\{currentTab !== 'edit-profil' && \(\s*<BottomNav[\s\S]*?\/>\s*\}\}\s*<Toast/;
const replaceStr = `{currentTab !== 'edit-profil' && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab as any)}
          userRole={currentUser.role}
          pendingValidationCount={classSummary.validationStatus === 'menunggu_acc' ? 1 : 0}
        />
      )}

      <Toast`;

appData = appData.replace(regex, replaceStr);

fs.writeFileSync(appFile, appData);
