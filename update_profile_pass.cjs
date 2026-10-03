const fs = require('fs');

let profileFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let profileData = fs.readFileSync(profileFile, 'utf8');

// Add onChangePassword to props
profileData = profileData.replace(
  /onEditProfile\?: \(\) => void;/,
  `onEditProfile?: () => void;\n  onChangePassword?: () => void;`
);

profileData = profileData.replace(
  /onEditProfile\n\}\) => \{/,
  `onEditProfile,\n  onChangePassword\n}) => {`
);

// Replace button onClick
profileData = profileData.replace(
  /onClick=\{\(\) => onShowToast\('Ubah Kata Sandi', 'Hubungi Admin Kurikulum untuk mereset kata sandi Anda.', 'info'\)\}/,
  `onClick={onChangePassword}`
);

fs.writeFileSync(profileFile, profileData);
console.log('ProfileScreenSamakan updated for password change');
