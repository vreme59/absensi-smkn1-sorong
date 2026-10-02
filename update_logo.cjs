const fs = require('fs');

let data = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/mockData.ts', 'utf8');
data = data.replace(/export const SCHOOL_LOGO =[\s\S]*?;/, "export const SCHOOL_LOGO = '/logo-smk.png';");
fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/mockData.ts', data);
console.log('Replaced SCHOOL_LOGO in mockData.ts');

let samakanData = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/samakan/mockData.ts', 'utf8');
if (samakanData.includes('export const SCHOOL_LOGO')) {
    samakanData = samakanData.replace(/export const SCHOOL_LOGO =[\s\S]*?;/, "export const SCHOOL_LOGO = '/logo-smk.png';");
    fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/data/samakan/mockData.ts', samakanData);
    console.log('Replaced SCHOOL_LOGO in samakan/mockData.ts');
}
