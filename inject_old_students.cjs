const fs = require('fs');

const lines = fs.readFileSync('C:/Users/ADVAN/.gemini/antigravity/brain/738102e2-e54c-475f-81a4-91eb2a1d45da/account_list.txt', 'utf8').split('\n').filter(l => l.trim());
let studentsArray = '';
lines.forEach((line, i) => {
  const parts = line.split('=> Username: ');
  const nama = parts[0].trim();
  const escapedNama = nama.replace(/'/g, "\\'");
  const urlEncoded = encodeURIComponent(nama).replace(/'/g, "\\'");
  
  studentsArray += `  {
    id: 'std-${i+1}',
    name: '${escapedNama}',
    studentNo: '${String(i+1).padStart(2, '0')}',
    nisn: '00571829${String(i).padStart(2, '0')}',
    avatarUrl: 'https://ui-avatars.com/api/?name=${urlEncoded}&background=random',
    status: 'H',
    hasAttachment: false,
    notes: '',
  },\n`;
});

let code = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/students.ts', 'utf8');
const startIndex = code.indexOf('export const INITIAL_STUDENTS: Student[] = [');
const endIndex = code.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    const newArray = 'export const INITIAL_STUDENTS: Student[] = [\n' + studentsArray + '];';
    code = code.substring(0, startIndex) + newArray + code.substring(endIndex);
    fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/students.ts', code);
    console.log('Successfully updated INITIAL_STUDENTS in data/students.ts');
}
