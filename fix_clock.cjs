const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/HomeScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

// Add useEffect to import
if (!data.includes('useEffect')) {
  data = data.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
}

// Add state for clock
data = data.replace(
  'const [localStudents, setLocalStudents] = useState<StudentAttendance[]>(students);',
  'const [localStudents, setLocalStudents] = useState<StudentAttendance[]>(students);\n\n  const [currentTime, setCurrentTime] = useState(new Date());\n  useEffect(() => {\n    const timer = setInterval(() => setCurrentTime(new Date()), 1000);\n    return () => clearInterval(timer);\n  }, []);\n  const timeString = currentTime.toLocaleTimeString(\'id-ID\', { hour: \'2-digit\', minute: \'2-digit\' }).replace(\'.\', \':\');\n'
);

// Replace 06:45 WIT block
const oldTimeBlock = /<span className="font-headline font-bold text-2xl tracking-tight">06:45 WIT<\/span>[\s\S]*?<\/span>\s*<\/span>\s*<\/div>/;
const newTimeBlock = `<span className="font-headline font-bold text-2xl tracking-tight">{timeString} WIT</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-500/25 text-slate-200 font-label-sm text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span> MENUNGGU ABSENSI
                  </span>
                </div>`;
data = data.replace(oldTimeBlock, newTimeBlock);

// Make "Bulan Mei" dynamic and explain "99.1%" (I'll just keep it 99.1% or 100% and dynamic month)
data = data.replace('Bulan Mei', "Bulan {currentTime.toLocaleDateString('id-ID', { month: 'long' })}");

fs.writeFileSync(file, data);
console.log('Clock and month updated');
