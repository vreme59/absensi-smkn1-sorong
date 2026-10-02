const fs = require('fs');
const XLSX = require('xlsx');

const workbookSiswa = XLSX.readFile('D:/Coding/lomba website sekolah/data data/DATA SISWA 12 JUNI 2025.xlsx');
const sheetSiswaName = workbookSiswa.SheetNames[0];
const sheetSiswa = workbookSiswa.Sheets[sheetSiswaName];
const dataSiswa = XLSX.utils.sheet_to_json(sheetSiswa, {header: 1});

const formatted = dataSiswa.filter(r => r[2] === '10-TJKT-1').map(r => r[1].trim());

let sql = '-- Script untuk memasukkan 37 siswa kelas XII TKJ 1 ke database\n-- Jalankan ini di SQL Editor Supabase\n\n';
let usedUsernames = new Set();
let accountList = [];

for (const nama of formatted) {
  let firstWord = nama.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
  if (firstWord === 'm' || firstWord === 'a' || firstWord === '') {
    const parts = nama.split(' ');
    firstWord = (parts[1] || parts[0]).toLowerCase().replace(/[^a-z]/g, '');
  }
  
  let username = firstWord;
  let counter = 1;
  while (usedUsernames.has(username)) {
    username = firstWord + counter;
    counter++;
  }
  usedUsernames.add(username);
  accountList.push({ nama, username });
  
  const email = username + '@smkn1sorong.sch.id';
  
  sql += '-- ' + nama + '\n';
  sql += 'INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)\n';
  sql += `SELECT gen_random_uuid(), 'authenticated', 'authenticated', '${email}', crypt('Demo@2025', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()\n`;
  sql += `WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '${email}');\n\n`;
  
  sql += 'INSERT INTO public.profiles (id, username, nama, role, is_sekretaris, kelas_id, must_change_password)\n';
  sql += `SELECT id, '${username}', '${nama}', 'siswa', false, 'e88128be-8fc3-4973-8d69-00ef17571626', false\n`;
  sql += `FROM auth.users WHERE email = '${email}'\n`;
  sql += 'ON CONFLICT (id) DO UPDATE SET nama = EXCLUDED.nama, kelas_id = EXCLUDED.kelas_id;\n\n';
}

fs.writeFileSync('C:/Users/ADVAN/.gemini/antigravity/brain/738102e2-e54c-475f-81a4-91eb2a1d45da/add_37_students.sql', sql);
fs.writeFileSync('C:/Users/ADVAN/.gemini/antigravity/brain/738102e2-e54c-475f-81a4-91eb2a1d45da/account_list.txt', accountList.map(a => `${a.nama} => Username: ${a.username}`).join('\n'));
console.log('Done generating 37 students!');
