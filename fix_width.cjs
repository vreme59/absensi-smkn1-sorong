const fs = require('fs');

let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/EditProfileScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /<div className="w-full min-h-screen bg-slate-50 flex flex-col relative pb-20 selection:bg-\[#005fa0\] selection:text-white">/;
const replaceStr = `<div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative pb-20 selection:bg-[#005fa0] selection:text-white shadow-xl sm:border-x sm:border-slate-200">`;

data = data.replace(regex, replaceStr);

fs.writeFileSync(file, data);
console.log('Fixed container width for desktop');
