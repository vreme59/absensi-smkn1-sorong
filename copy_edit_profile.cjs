const fs = require('fs');

try {
  let src = 'd:/Coding/lomba website sekolah/guna ini/extracted/src/App.tsx';
  let dest = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/EditProfileScreen.tsx';

  let data = fs.readFileSync(src, 'utf8');

  data = data.replace('export default function App() {', 'export const EditProfileScreen: React.FC<{onBack: () => void}> = ({ onBack }) => {');
  
  // Replace the first onClick={handleReset} which is on the back button
  // Wait, let's find the specific back button and replace its onClick
  data = data.replace(/onClick=\{handleReset\}[\s\S]*?<span className="material-symbols-outlined text-\[24px\]">arrow_back<\/span>/, 
    'onClick={onBack}\n                className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"\n              >\n                <span className="material-symbols-outlined text-[24px]">arrow_back</span>');

  // Remove viewport controls
  const viewportRegex = /\{\/\* Top Device Viewport Controls for Desktop Testing \*\/\}[\s\S]*?\{\/\* Main App Container \*\/\}/;
  data = data.replace(viewportRegex, '{/* Main App Container */}');

  fs.writeFileSync(dest, data);
  console.log('Success');
} catch(e) {
  console.error(e);
}
