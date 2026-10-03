const fs = require('fs');

let profileFile = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let profileData = fs.readFileSync(profileFile, 'utf8');

const regex = /export const ProfileScreen: React\.FC<ProfileScreenProps> = \(\{\s*user,\s*onSelectRole,\s*onLogout,\s*onOpenHtmlModal,\s*onShowToast\s*\}\) => \{/;

const replaceStr = `export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onSelectRole,
  onLogout,
  onOpenHtmlModal,
  onShowToast,
  onEditProfile
}) => {`;

profileData = profileData.replace(regex, replaceStr);

fs.writeFileSync(profileFile, profileData);
console.log('Fixed destructured props');
