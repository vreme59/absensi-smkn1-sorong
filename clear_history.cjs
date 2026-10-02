const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /<div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">\s*<div>\s*<span className="font-bold text-slate-800">Senin, 13 Mei 2024[\s\S]*?34\/34 Hadir \(100\%\)<\/span>\s*<\/div>/;

data = data.replace(regex, '<div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-500 italic">\n                  Belum ada riwayat kehadiran yang diekspor.\n                </div>');

fs.writeFileSync(file, data);
