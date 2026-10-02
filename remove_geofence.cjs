const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">\s*<div className="flex items-center justify-between">\s*<div className="flex items-center gap-2.5">\s*<span className="w-8 h-8 rounded-xl bg-sky-50 text-primary flex items-center justify-center">[\s\S]*?radius hijau\.\s*<\/p>\s*<\/div>/;

data = data.replace(regex, '');
fs.writeFileSync(file, data);
