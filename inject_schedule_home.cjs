const fs = require('fs');
let code = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx', 'utf8');

if (!code.includes('SCHEDULES_BY_DAY')) {
  code = code.replace(
    'import { UserProfile',
    'import { SCHEDULES_BY_DAY } from "../data/samakan/scheduleData";\nimport { UserProfile'
  );
}

const startComment = '{/* Section: Jadwal Belajar Hari Ini */}';
const startIdx = code.indexOf(startComment);
const endComment = '{/* Quick Classroom Roster Preview Card */}';
const endIdx = code.indexOf(endComment);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `{/* Section: Jadwal Belajar Hari Ini */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface">
                Jadwal Belajar Hari Ini
              </h2>
              <span className="font-body text-xs text-slate-500">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('jadwal')}
              className="font-label-sm text-xs text-primary font-bold flex items-center gap-0.5 hover:underline"
            >
              Lihat Full{' '}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {(() => {
              const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
              const todayName = dayNames[new Date().getDay()];
              const schedule = SCHEDULES_BY_DAY[todayName] || [];
              
              if (schedule.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm">Tidak ada jadwal hari ini. Selamat istirahat!</p>
                  </div>
                );
              }
              
              return schedule.map((item, idx) => {
                const parts = item.time.split('-');
                const start = parts[0] ? parts[0].trim() : '';
                const end = parts[1] ? parts[1].trim() : '';
                const isLive = idx === 0; // The first item is marked LIVE for UI demonstration
                
                return (
                  <div key={item.id} className={\`relative bg-white rounded-2xl p-3.5 flex items-start gap-3 overflow-hidden border \${isLive ? 'shadow-[0_8px_24px_rgba(0,95,160,0.12)] ring-2 ring-primary border-sky-100' : 'shadow-sm border-slate-100'}\`}>
                    <div className={\`\${isLive ? 'w-2 bg-primary animate-pulse' : 'w-1.5 bg-secondary-container'} absolute left-0 top-0 bottom-0\`}></div>
                    <div className="w-12 flex flex-col items-center shrink-0">
                      <span className={\`font-bold text-xs \${isLive ? 'text-primary' : 'text-slate-800'}\`}>{start}</span>
                      <span className="text-[10px] text-slate-400">{end}</span>
                      {isLive ? (
                        <span className="px-1.5 py-0.5 mt-1.5 rounded bg-primary text-white font-bold text-[9px] animate-pulse">LIVE</span>
                      ) : (
                        <span className="material-symbols-outlined text-slate-400 text-[20px] mt-1.5">schedule</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isLive && (
                         <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Presensi Dibuka
                          </span>
                        </div>
                      )}
                      <h3 className="font-headline font-bold text-sm text-slate-900">{item.subject}</h3>
                      {isLive ? (
                        <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-900 font-semibold">{item.teacher}</span>
                          </div>
                          <button
                            onClick={() => onNavigateToTab('absensi')}
                            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container active:scale-95 transition-all whitespace-nowrap"
                            type="button"
                          >
                            Absen Mapel
                          </button>
                        </div>
                      ) : (
                        <p className="font-body text-xs text-slate-500 mt-1">{item.teacher}</p>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        `;
    code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
    fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx', code);
    console.log('Replaced successfully');
} else {
    console.log('Comment not found');
}
