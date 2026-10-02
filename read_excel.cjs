
const XLSX = require('xlsx');
const workbookSiswa = XLSX.readFile('../data data/DATA SISWA 12 JUNI 2025.xlsx');
const sheetSiswaName = workbookSiswa.SheetNames[0];
const sheetSiswa = workbookSiswa.Sheets[sheetSiswaName];
const dataSiswa = XLSX.utils.sheet_to_json(sheetSiswa, {header: 1});

const tkjSiswa = dataSiswa.filter(row => {
  const rowStr = row.join(' ').toLowerCase();
  return (rowStr.includes('tkj') || rowStr.includes('tjkt')) && rowStr.includes('prima');
});

console.log('Students containing Prima and TKJ/TJKT:', tkjSiswa);

const tjktClass = dataSiswa.filter(row => {
  const rowStr = row.join(' ').toLowerCase();
  return (rowStr.includes('tjkt') || rowStr.includes('tkj')) && rowStr.includes('1');
});
console.log('Sample of TKJ/TJKT 1:', tjktClass.slice(0, 5));

const workbookJadwal = XLSX.readFile('../data data/TKA JADWAL PELAJARAN 2026-2027 GANJIL.xlsx');
console.log('Jadwal Sheets:', workbookJadwal.SheetNames);
