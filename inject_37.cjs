const fs = require('fs');

const lines = fs.readFileSync('C:/Users/ADVAN/.gemini/antigravity/brain/738102e2-e54c-475f-81a4-91eb2a1d45da/account_list.txt', 'utf8').split('\n').filter(l => l.trim());
let mockStudents = '';
lines.forEach((line, i) => {
  const parts = line.split('=> Username: ');
  const nama = parts[0].trim();
  const escapedNama = nama.replace(/'/g, "\\'");
  const urlEncoded = encodeURIComponent(nama).replace(/'/g, "\\'");
  const username = parts[1].trim();
  
  mockStudents += `  {
    id: 'std-${i+1}',
    name: '${escapedNama}',
    studentNo: '${String(i+1).padStart(2, '0')}',
    nisn: '00571829${String(i).padStart(2, '0')}',
    avatarUrl: 'https://ui-avatars.com/api/?name=${urlEncoded}&background=random',
    morningStatus: 'hadir',
    morningCheckInTime: '06:45 WIT',
    subjectStatus: 'hadir',
  },\n`;
});

let mockDataStr = fs.readFileSync('./src/data/samakan/mockData.ts', 'utf8');

const startIndex = mockDataStr.indexOf('export const INITIAL_STUDENTS: StudentAttendance[] = [');
const endIndex = mockDataStr.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    const newArray = 'export const INITIAL_STUDENTS: StudentAttendance[] = [\n' + mockStudents + '];';
    mockDataStr = mockDataStr.substring(0, startIndex) + newArray + mockDataStr.substring(endIndex);
    fs.writeFileSync('./src/data/samakan/mockData.ts', mockDataStr);
    console.log('Successfully updated INITIAL_STUDENTS in mockData.ts');
}
