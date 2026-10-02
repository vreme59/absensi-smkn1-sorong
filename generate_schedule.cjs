const fs = require('fs');

const scheduleData = [
  { hari: 'SENIN', jam: 1, waktu: '08.15 - 08.55', kode: 'TT' },
  { hari: 'SENIN', jam: 2, waktu: '08.55 - 09.35', kode: 'TT' },
  { hari: 'SENIN', jam: 3, waktu: '09.35-10.15', kode: 'TT' },
  { hari: 'SENIN', jam: 4, waktu: '10.30-11.10', kode: 'TT' },
  { hari: 'SENIN', jam: 5, waktu: '11.10-11.50', kode: 'TT' },
  { hari: 'SENIN', jam: 6, waktu: '11.50-12.30', kode: 'HS' },
  { hari: 'SENIN', jam: 7, waktu: '12.45- 13.25', kode: 'HS' },
  { hari: 'SENIN', jam: 8, waktu: '13.25- 14.05', kode: 'YS' },
  { hari: 'SENIN', jam: 9, waktu: '14.05-14.45', kode: 'YS' },
  { hari: 'SELASA', jam: 1, waktu: '08.15 - 08.55', kode: 'AS' },
  { hari: 'SELASA', jam: 2, waktu: '08.55 - 09.35', kode: 'AS' },
  { hari: 'SELASA', jam: 3, waktu: '09.35-10.15', kode: 'SB' },
  { hari: 'SELASA', jam: 4, waktu: '10.30-11.10', kode: 'SB' },
  { hari: 'SELASA', jam: 5, waktu: '11.10-11.50', kode: 'SB' },
  { hari: 'SELASA', jam: 6, waktu: '11.50-12.30', kode: 'SB' },
  { hari: 'SELASA', jam: 7, waktu: '12.45- 13.25', kode: 'TR' },
  { hari: 'SELASA', jam: 8, waktu: '13.25- 14.05', kode: 'TR' },
  { hari: 'SELASA', jam: 9, waktu: '14.05-14.45', kode: 'TR' },
  { hari: 'RABU', jam: 1, waktu: '08.15 - 08.55', kode: 'YY' },
  { hari: 'RABU', jam: 2, waktu: '08.55 - 09.35', kode: 'YY' },
  { hari: 'RABU', jam: 3, waktu: '09.35-10.15', kode: 'YY' },
  { hari: 'RABU', jam: 4, waktu: '10.30-11.10', kode: 'DP' },
  { hari: 'RABU', jam: 5, waktu: '11.10-11.50', kode: 'DP' },
  { hari: 'RABU', jam: 6, waktu: '11.50-12.30', kode: 'DP' },
  { hari: 'RABU', jam: 7, waktu: '12.45- 13.25', kode: 'AN' },
  { hari: 'RABU', jam: 8, waktu: '13.25- 14.05', kode: 'AN' },
  { hari: 'RABU', jam: 9, waktu: '14.05-14.45', kode: 'AN' },
  { hari: 'KAMIS', jam: 1, waktu: '08.15 - 08.55', kode: 'TR' },
  { hari: 'KAMIS', jam: 2, waktu: '08.55 - 09.35', kode: 'TR' },
  { hari: 'KAMIS', jam: 3, waktu: '09.35-10.15', kode: 'TR' },
  { hari: 'KAMIS', jam: 4, waktu: '10.30-11.10', kode: 'TR' },
  { hari: 'KAMIS', jam: 5, waktu: '11.10-11.50', kode: 'TR' },
  { hari: 'KAMIS', jam: 6, waktu: '11.50-12.30', kode: 'TR' },
  { hari: 'KAMIS', jam: 7, waktu: '12.45- 13.25', kode: 'AN' },
  { hari: 'KAMIS', jam: 8, waktu: '13.25- 14.05', kode: 'AN' },
  { hari: 'KAMIS', jam: 9, waktu: '14.05-14.45', kode: 'AN' },
  { hari: "JUM'AT", jam: 1, waktu: '08.15 - 08.45', kode: 'TR' },
  { hari: "JUM'AT", jam: 2, waktu: '08.45 - 09.15', kode: 'TR' },
  { hari: "JUM'AT", jam: 3, waktu: '09.15 - 09.45', kode: 'YY' },
  { hari: "JUM'AT", jam: 4, waktu: '10.00 - 10.30', kode: 'YY' },
  { hari: "JUM'AT", jam: 5, waktu: '10.30 - 11.00', kode: 'YY' },
  { hari: 'SABTU', jam: 1, waktu: '08.15 - 08.55', kode: 'DP' },
  { hari: 'SABTU', jam: 2, waktu: '08.55 - 09.35', kode: 'DP' },
  { hari: 'SABTU', jam: 3, waktu: '09.35-10.15', kode: 'DP' },
  { hari: 'SABTU', jam: 4, waktu: '10.30-11.10', kode: 'YS' },
  { hari: 'SABTU', jam: 5, waktu: '11.10-11.50', kode: 'YS' },
  { hari: 'SABTU', jam: 6, waktu: '12.05-12.45', kode: 'TR' },
  { hari: 'SABTU', jam: 7, waktu: '12.45- 13.25', kode: 'TR' }
];

const teacherInfo = {
  'TT': { nama: 'Titalae Walalayo, S.Kom', mapel: 'Materi TKA' },
  'HS': { nama: 'Haris Titirloloby, S.Kom', mapel: 'Materi TKA' },
  'YS': { nama: 'Yovani Romauli Sitorus, S.Pd', mapel: 'Materi TKA' },
  'AS': { nama: 'Alfrida Serang Kasy, S.Pd', mapel: 'PPKn' },
  'SB': { nama: "Mohammad Sya'ban, S.Pd", mapel: 'Materi TKA' },
  'TR': { nama: 'Toriq Najamudin, A.Md', mapel: 'Materi TKA' },
  'YY': { nama: 'Dra. Yayuk Puji Hastuti', mapel: 'Bahasa Indonesia' },
  'DP': { nama: 'Dinaria Purba, A.Md, S.Pd', mapel: 'Bahasa Inggris' },
  'AN': { nama: 'Ani Widiastuti, S.T', mapel: 'Matematika' }
};

// Merge consecutive blocks of same teacher
const mergedByDay = {};

scheduleData.forEach(s => {
   let day = s.hari.toLowerCase().replace(/[^a-z]/g, '');
   if (!mergedByDay[day]) mergedByDay[day] = [];
   
   const list = mergedByDay[day];
   const info = teacherInfo[s.kode];
   if (!info) return;
   
   if (list.length > 0 && list[list.length - 1].kode === s.kode) {
      // update end time
      list[list.length - 1].endTime = s.waktu.split('-')[1] ? s.waktu.split('-')[1].trim() : s.waktu;
   } else {
      list.push({
         kode: s.kode,
         mapel: info.mapel,
         guru: info.nama,
         startTime: s.waktu.split('-')[0].trim(),
         endTime: s.waktu.split('-')[1] ? s.waktu.split('-')[1].trim() : s.waktu
      });
   }
});

let content = `import { ScheduleDay, SubjectSchedule } from '../../types/attendance';

export const SCHEDULE_DAYS: ScheduleDay[] = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
  { id: 'sabtu', name: 'Sabtu' },
];

export const SCHEDULES_BY_DAY: Record<string, SubjectSchedule[]> = {\n`;

for (const [day, list] of Object.entries(mergedByDay)) {
  content += `  ${day}: [\n`;
  list.forEach((s, idx) => {
    // Escape single quotes in teacher name
    const teacherName = s.guru.replace(/'/g, "\\'");
    content += `    {
      id: '${day}-${idx+1}',
      subject: '${s.mapel}',
      time: '${s.startTime} - ${s.endTime}',
      teacher: '${teacherName}',
      type: '${s.mapel.includes('TKA') ? 'productive' : 'general'}'
    },\n`;
  });
  content += `  ],\n`;
}
content += `};\n`;

fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/samakan/scheduleData.ts', content);
console.log('Schedule generated successfully!');
