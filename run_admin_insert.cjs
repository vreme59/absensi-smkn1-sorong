const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const workbookSiswa = XLSX.readFile('D:/Coding/lomba website sekolah/data data/DATA SISWA 12 JUNI 2025.xlsx');
const sheetSiswaName = workbookSiswa.SheetNames[0];
const sheetSiswa = workbookSiswa.Sheets[sheetSiswaName];
const dataSiswa = XLSX.utils.sheet_to_json(sheetSiswa, {header: 1});

const formatted = dataSiswa.filter(r => r[2] === '10-TJKT-1').map(r => r[1].trim());

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
}

async function run() {
  console.log(`Starting to insert ${accountList.length} users using Service Role...`);
  
  let successCount = 0;
  
  for (const account of accountList) {
    const email = account.username + '@smkn1sorong.sch.id';
    
    // 1. Delete existing user if any to start fresh and avoid unique conflicts
    const { data: searchData } = await supabase.from('profiles').select('id').eq('username', account.username);
    if (searchData && searchData.length > 0) {
       for(const u of searchData) {
          await supabase.auth.admin.deleteUser(u.id);
       }
    }

    // Also try to list users to delete if they exist in auth but not in profiles
    // We can't search email directly easily without listUsers, but let's just use create directly and handle error
    
    console.log(`Creating user: ${account.username} (${account.nama})...`);
    
    let { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: 'Demo@2025',
      email_confirm: true // automatically confirm email
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
         // User exists in auth but we didn't find them in profiles above. We have to delete by email or handle it.
         // Let's just grab the user via listUsers (since it's only a few)
         const { data: listData } = await supabase.auth.admin.listUsers();
         const existingUser = listData.users.find(u => u.email === email);
         if (existingUser) {
             await supabase.auth.admin.deleteUser(existingUser.id);
             // try again
             const res = await supabase.auth.admin.createUser({
                email: email,
                password: 'Demo@2025',
                email_confirm: true
             });
             authData = res.data;
             authError = res.error;
         }
      }
      
      if (authError) {
        console.error(`Failed to create auth user ${email}:`, authError.message);
        continue; // skip to next
      }
    }
    
    const uid = authData.user.id;
    
    // 2. Insert into profiles
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: uid,
      username: account.username,
      nama: account.nama,
      role: 'siswa',
      is_sekretaris: false,
      kelas_id: 'e88128be-8fc3-4973-8d69-00ef17571626',
      must_change_password: false
    });
    
    if (profileError) {
      console.error(`Failed to insert profile for ${account.username}:`, profileError.message);
    } else {
      successCount++;
    }
  }
  
  console.log(`Finished! Successfully inserted ${successCount} out of ${accountList.length} users.`);
}

run();
