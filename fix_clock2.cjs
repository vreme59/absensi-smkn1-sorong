const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /<span className="font-headline font-bold text-2xl tracking-tight">06:45 WIT<\/span>[\s\S]*?<\/div>/;

const newBlock = `<span className="font-headline font-bold text-2xl tracking-tight">{timeString} WIT</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-500/25 text-slate-200 font-label-sm text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span> MENUNGGU ABSENSI
                  </span>
                </div>`;

data = data.replace(regex, newBlock);

fs.writeFileSync(file, data);
