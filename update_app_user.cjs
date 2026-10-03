const fs = require('fs');

let appFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let appData = fs.readFileSync(appFile, 'utf8');

// Update currentUser construction
const regex = /const currentUser = auth\.profile\s*\?\s*\{\s*\.\.\.USER_PROFILES\[supabaseRole\] \?\? USER_PROFILES\.siswa,[\s\S]*?identifier: auth\.profile\.username,\s*\}/;

const replaceStr = `const currentUser = auth.profile
    ? {
        ...USER_PROFILES[supabaseRole] ?? USER_PROFILES.siswa,
        id: auth.profile.id,
        name: auth.profile.nama,
        phone: auth.profile.phone || '',
        avatarUrl: auth.profile.avatar_url || (USER_PROFILES[supabaseRole] ?? USER_PROFILES.siswa).avatarUrl,
        role: supabaseRole,
        roleTitle:
          supabaseRole === 'guru' ? 'Guru Mata Pelajaran'
          : supabaseRole === 'admin' ? 'Administrator Sekolah'
          : supabaseRole === 'sekretaris' ? \`Sekretaris Kelas • \${(auth.profile as any)?.kelas?.nama ?? ''}\`
          : \`Siswa • \${(auth.profile as any)?.kelas?.nama ?? ''}\`,
        identifier: auth.profile.username,
      }`;

appData = appData.replace(regex, replaceStr);

fs.writeFileSync(appFile, appData);
console.log('App.tsx updated to use dynamic phone and avatar');
