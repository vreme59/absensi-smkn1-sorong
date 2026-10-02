
const fs = require('fs');

const mockDataPath = './src/data/samakan/mockData.ts';
let mockDataStr = fs.readFileSync(mockDataPath, 'utf-8');

mockDataStr = mockDataStr.replace(/Prima Aditya/g, 'PRIMA ADI NUGRAHA SOLTIF');
mockDataStr = mockDataStr.replace(/Siti Aminah/g, 'ALIF NURZALIM');
mockDataStr = mockDataStr.replace(/Muhammad Farhan/g, 'Andi Rama Riskiansyah');
mockDataStr = mockDataStr.replace(/Kevin Pratama/g, 'CHRISTIAN A. KOMAMBA RUMBINO');
mockDataStr = mockDataStr.replace(/Doni Tata/g, 'Dorlince Ulim');
mockDataStr = mockDataStr.replace(/Ahmad Dani/g, 'CHRISTIAN NIMBROT KAAF');
mockDataStr = mockDataStr.replace(/Cindy Laura/g, 'YONAS MAMBRASAR');
mockDataStr = mockDataStr.replace(/Rina Melinda/g, 'ZULFAKAR RUMAF');

fs.writeFileSync(mockDataPath, mockDataStr);

const studentsDataPath = './src/data/students.ts';
let studentsDataStr = fs.readFileSync(studentsDataPath, 'utf-8');
studentsDataStr = studentsDataStr.replace(/Achmad Fauzi/g, 'PRIMA ADI NUGRAHA SOLTIF');
studentsDataStr = studentsDataStr.replace(/Ahmad Dani/g, 'ALIF NURZALIM');
studentsDataStr = studentsDataStr.replace(/Bella Safitri/g, 'Andi Rama Riskiansyah');
studentsDataStr = studentsDataStr.replace(/Cindy Laura/g, 'CHRISTIAN A. KOMAMBA RUMBINO');
studentsDataStr = studentsDataStr.replace(/Doni Pratama/g, 'Dorlince Ulim');
studentsDataStr = studentsDataStr.replace(/Eko Supriyanto/g, 'CHRISTIAN NIMBROT KAAF');
studentsDataStr = studentsDataStr.replace(/Farhan Maulana/g, 'YONAS MAMBRASAR');
fs.writeFileSync(studentsDataPath, studentsDataStr);

console.log('Replaced student names in mockData.ts and students.ts');
