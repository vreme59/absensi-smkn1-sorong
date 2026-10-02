const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/Toast.tsx';
let data = fs.readFileSync(file, 'utf8');

// Update main container classes
data = data.replace('className="fixed top-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#213145] text-[#eaf1ff] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-top-6 duration-200 cursor-pointer"', 'className="fixed top-20 left-1/2 -translate-x-1/2 w-max max-w-[90vw] z-50 bg-[#213145] text-[#eaf1ff] px-3 py-2 rounded-full shadow-2xl flex items-center gap-2.5 border border-white/10 animate-in slide-in-from-top-6 duration-200 cursor-pointer"');

// Update icon container classes
data = data.replace('className={`w-9 h-9 rounded-full ${', 'className={`w-7 h-7 rounded-full ${');
data = data.replace('className="material-symbols-outlined notranslate text-[20px]"', 'className="material-symbols-outlined notranslate text-[16px]"');

// Update text sizes
data = data.replace('className="font-label-md text-[13px] font-bold text-white tracking-wide"', 'className="font-label-md text-[12px] font-bold text-white tracking-wide"');
data = data.replace('className="font-body-sm text-[12px] text-slate-300 truncate"', 'className="font-body-sm text-[11px] text-slate-300 truncate"');

fs.writeFileSync(file, data);
console.log('Shrunk Toast.tsx');
