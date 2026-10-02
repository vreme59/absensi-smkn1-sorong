const fs = require('fs');

let homeCode = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx', 'utf8');

// add oldStudents prop
if (!homeCode.includes('oldStudents?: any[];')) {
   homeCode = homeCode.replace(
      'students: StudentAttendance[];',
      'students: StudentAttendance[];\n  oldStudents?: any[];'
   );
   homeCode = homeCode.replace(
      'students,\n  teacherAlert,',
      'students,\n  oldStudents = [],\n  teacherAlert,'
   );
}

const startMarker = '<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">';
const h2Text = 'Catatan Sekretaris Hari Ini';
const endMarker = '{/* Slide-Up Modal: Input Absen Pagi (2 Lapis Sekretaris) */}';

let startIdx = homeCode.indexOf(startMarker);
// Validate if it contains the h2
if (startIdx !== -1 && homeCode.substring(startIdx, startIdx + 300).includes(h2Text)) {
   let endIdx = homeCode.indexOf(endMarker, startIdx);
   if (endIdx !== -1) {
      // endIdx points to the endMarker. We need to leave the closing </div> of the parent wrapper.
      // Actually, looking at the snippet, there is:
      //         </div>
      //       </div>
      // 
      //       {/* Slide-Up Modal: Input Absen Pagi (2 Lapis Sekretaris) */}
      // The startMarker is the div itself.
      
      const dynamicCatatan = `{/* Catatan Sekretaris Hari Ini */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-base text-on-surface">
                Catatan Sekretaris Hari Ini
              </h2>
              <span className="font-label-sm text-xs text-tertiary font-bold">
                {oldStudents.filter(s => s.status !== 'H').length} Catatan
              </span>
            </div>
  
            <div className="space-y-2">
              {oldStudents.filter(s => s.status !== 'H').length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-sm">Tidak ada catatan ketidakhadiran.</span>
                </div>
              ) : (
                oldStudents.filter(s => s.status !== 'H').map(s => {
                  let bgColor = 'bg-slate-50';
                  let borderColor = 'border-slate-100';
                  let iconBg = 'bg-slate-200';
                  let iconText = 'text-slate-900';
                  let statusBg = 'bg-slate-200';
                  let statusText = 'text-slate-800';
                  let label = s.status;
                  let noteColor = 'text-slate-800';

                  if (s.status === 'S') {
                    bgColor = 'bg-amber-50/70';
                    borderColor = 'border-amber-100';
                    iconBg = 'bg-amber-200';
                    iconText = 'text-amber-900';
                    statusBg = 'bg-amber-100';
                    statusText = 'text-amber-800';
                    label = 'SAKIT';
                    noteColor = 'text-amber-800';
                  } else if (s.status === 'I') {
                    bgColor = 'bg-sky-50/70';
                    borderColor = 'border-sky-100';
                    iconBg = 'bg-sky-200';
                    iconText = 'text-sky-900';
                    statusBg = 'bg-sky-100';
                    statusText = 'text-sky-800';
                    label = 'IZIN';
                    noteColor = 'text-sky-800';
                  } else if (s.status === 'A') {
                    bgColor = 'bg-red-50/70';
                    borderColor = 'border-red-100';
                    iconBg = 'bg-red-200';
                    iconText = 'text-red-900';
                    statusBg = 'bg-red-100';
                    statusText = 'text-red-800';
                    label = 'ALFA';
                    noteColor = 'text-red-800';
                  } else if (s.status === 'B') {
                    bgColor = 'bg-orange-50/70';
                    borderColor = 'border-orange-100';
                    iconBg = 'bg-orange-200';
                    iconText = 'text-orange-900';
                    statusBg = 'bg-orange-100';
                    statusText = 'text-orange-800';
                    label = 'BOLOS';
                    noteColor = 'text-orange-800';
                  }

                  const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('');

                  return (
                    <div key={s.id} className={\`p-2.5 rounded-xl \${bgColor} border \${borderColor} flex items-center justify-between\`}>
                      <div className="flex items-center gap-2.5">
                        <div className={\`w-8 h-8 rounded-full \${iconBg} \${iconText} font-bold flex items-center justify-center text-xs\`}>
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-xs text-slate-900 font-bold block truncate max-w-[160px]">
                            {s.name} ({s.studentNo})
                          </span>
                          <span className={\`font-body text-[11px] \${noteColor} truncate max-w-[160px]\`}>
                            {s.note || 'Tidak ada keterangan'}
                          </span>
                        </div>
                      </div>
                      <span className={\`px-2 py-0.5 rounded-full \${statusBg} \${statusText} text-[10px] font-bold\`}>
                        {label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        `;

      // Wait! The replacement needs to include `</div>` for the parent wrapper correctly.
      // Let's look at the structure:
      //         </div> {/* End of Jadwal Belajar */}
      // 
      //         {/* Quick Classroom Roster Preview Card (which we replaced) */}
      //         ... Catatan Sekretaris ...
      //       </div> {/* End of parent wrapper */}
      // 
      //       {/* Slide-Up Modal... */}
      // So I just need to make sure the replacement has the same outer structure.
      
      // Let's find the closing tag just before endMarker
      let textBeforeEnd = homeCode.substring(startIdx, endIdx);
      let newTextBeforeEnd = textBeforeEnd.replace(/<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">[\s\S]*?(?=\s*<\/div>\s*\{\/\* Slide-Up Modal)/, dynamicCatatan.trim());
      
      // If the regex replacement doesn't work, we can just replace everything from startIdx to endMarker, and prepend the closing </div>
      const toReplace = homeCode.substring(startIdx, endIdx);
      
      // The `toReplace` string contains:
      // <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
      // ... Catatan Sekretaris ...
      // </div>
      // </div>
      // \n\n        
      
      // We will construct the exact replacement string manually by finding the last </div> before endIdx.
      
      homeCode = homeCode.substring(0, startIdx) + dynamicCatatan + '\n        ' + homeCode.substring(endIdx);
      fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx', homeCode);
      console.log('Successfully injected dynamic Catatan Sekretaris!');
   }
}
