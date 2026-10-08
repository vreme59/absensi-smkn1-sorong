const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

const EXCEL_PATH = 'd:/Coding/absensi-smkn1-sorong-main/TKA JADWAL PELAJARAN 2026-2027 GANJIL.xlsx';

function normalize(s) {
  return String(s || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
}

function parseTime(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 2) return null;
  const clean = (s) => {
    let t = s.trim().replace('.', ':');
    if (t.length === 5) return t + ':00';
    return t;
  };
  return { start: clean(parts[0]), end: clean(parts[1]) };
}

async function run() {
  console.log('=== STEP 1: CLEARING OLD JADWAL ===');
  const { error: delErr } = await adminClient
    .from('jadwal')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) {
    console.error('Error clearing jadwal:', delErr);
    return;
  }
  console.log('Old jadwal cleared successfully.');

  console.log('\n=== STEP 2: READING EXCEL SHEETS ===');
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheetGuru = wb.Sheets['Kode Guru'];
  const rowsGuru = XLSX.utils.sheet_to_json(sheetGuru, { header: 1 });
  const sheetJadwal = wb.Sheets['JADWAL-PBM ok'];
  const rowsJadwal = XLSX.utils.sheet_to_json(sheetJadwal, { header: 1 });

  // Get current DB data
  const { data: dbClasses } = await adminClient.from('kelas').select('*');
  const dbClassMap = new Map();
  dbClasses.forEach(c => dbClassMap.set(normalize(c.nama), c));

  const { data: dbMapels } = await adminClient.from('mapel').select('*');
  const mapelMap = new Map();
  dbMapels.forEach(m => mapelMap.set(normalize(m.nama), m));
  const defaultMapel = dbMapels.find(m => m.nama === 'Mata Pelajaran Umum') || dbMapels[0];

  const { data: dbGurus } = await adminClient.from('profiles').select('*').eq('role', 'guru');
  console.log(`Found ${dbGurus.length} existing teacher profiles.`);

  console.log('\n=== STEP 3: SYNCING TEACHERS & CREATING AUTH ACCOUNTS ===');
  let currentMapelName = 'Mata Pelajaran Umum';
  const teacherMapping = {}; // kode -> { profileId, mapelId, nama, username }
  const createdAuthList = [];

  for (let i = 2; i < rowsGuru.length; i++) {
    const r = rowsGuru[i];
    if (!r || !r[1]) continue;
    if (r[4] && String(r[4]).trim()) {
      currentMapelName = String(r[4]).trim();
    }
    const kode = r[3] ? String(r[3]).trim() : '';
    if (!kode) continue;

    const teacherName = String(r[1]).trim();
    const rawNip = r[2] ? String(r[2]).trim() : '';
    const cleanNip = rawNip.replace(/[^0-9]/g, '');

    // Determine target mapel
    const matchedMapel = mapelMap.get(normalize(currentMapelName)) || defaultMapel;

    // Find existing profile in dbGurus
    const existingProfile = dbGurus.find(dg => {
      if (cleanNip && dg.username === cleanNip) return true;
      if (dg.username === 'GURU' + kode) return true;
      if (normalize(dg.nama) === normalize(teacherName)) return true;
      return false;
    });

    const username = cleanNip ? cleanNip : ('GURU' + kode);
    const email = username.toLowerCase() + '@smkn1sorong.sch.id';

    // Check if user already exists in auth.users by email
    let authUser = null;
    if (existingProfile) {
      const { data: uData } = await adminClient.auth.admin.getUserById(existingProfile.id);
      if (uData?.user) {
        authUser = uData.user;
      }
    }

    if (!authUser) {
      // Try to create auth user
      let { data: newAuth, error: authErr } = await adminClient.auth.admin.createUser({
        email: email,
        password: 'Demo@2025',
        email_confirm: true
      });

      if (authErr && authErr.message && authErr.message.includes('already registered')) {
        // Find existing user by searching or update password
        const { data: listData } = await adminClient.auth.admin.listUsers();
        authUser = listData?.users?.find(u => u.email === email);
      } else if (newAuth?.user) {
        authUser = newAuth.user;
        createdAuthList.push({ username, email });
      } else if (authErr) {
        console.error(`Error creating auth user for ${username} (${teacherName}):`, authErr.message);
      }
    }

    if (!authUser) {
      console.error(`FATAL: Could not get or create auth user for ${username}`);
      continue;
    }

    const finalUserId = authUser.id;

    // Update profiles table so that profile.id == authUser.id
    if (existingProfile) {
      if (existingProfile.id !== finalUserId) {
        // Update profile ID to match auth user ID
        const { error: updErr } = await adminClient
          .from('profiles')
          .update({
            id: finalUserId,
            username: username,
            nama: teacherName,
            role: 'guru'
          })
          .eq('id', existingProfile.id);

        if (updErr) {
          console.error(`Error updating profile id for ${username}:`, updErr.message);
        }
      } else {
        // ID already matches, just ensure info is current
        await adminClient
          .from('profiles')
          .update({
            username: username,
            nama: teacherName,
            role: 'guru'
          })
          .eq('id', finalUserId);
      }
    } else {
      // Insert new profile
      const { error: insErr } = await adminClient.from('profiles').insert({
        id: finalUserId,
        username: username,
        nama: teacherName,
        role: 'guru',
        is_sekretaris: false,
        must_change_password: false
      });
      if (insErr) {
        console.error(`Error inserting profile for ${username}:`, insErr.message);
      }
    }

    teacherMapping[kode] = {
      profileId: finalUserId,
      mapelId: matchedMapel.id,
      mapelNama: matchedMapel.nama,
      nama: teacherName,
      username: username,
      email: email
    };
  }

  console.log(`Auth sync complete. Newly created auth users: ${createdAuthList.length}. Total teachers mapped: ${Object.keys(teacherMapping).length}`);

  console.log('\n=== STEP 4: MAPPING SCHEDULE COLUMNS TO CLASSES ===');
  const r7 = rowsJadwal[7];
  const r8 = rowsJadwal[8];
  let currentGrade = '';
  const colToClass = {};

  for (let c = 3; c < 57; c++) {
    if (r7[c]) currentGrade = String(r7[c]).trim();
    const colName = r8[c] ? String(r8[c]).trim() : '';
    if (!colName) continue;

    let gradePrefix = currentGrade.replace('KELAS', '').trim();
    let searchKey1 = normalize(gradePrefix + colName);
    let searchKey2 = normalize(colName);
    let target = dbClassMap.get(searchKey1) || dbClassMap.get(searchKey2);

    if (!target) {
      console.error(`Cannot find class for col ${c} (${currentGrade} - ${colName})`);
      return;
    }
    colToClass[c] = target;
  }
  console.log(`Successfully mapped ${Object.keys(colToClass).length} class columns.`);

  console.log('\n=== STEP 5: PARSING SCHEDULE GRID & INSERTING INTO JADWAL ===');
  let currentDay = 'Senin';
  const newJadwalRecords = [];

  for (let r = 9; r <= 88; r++) {
    const row = rowsJadwal[r];
    if (!row) continue;

    const hariCol = row[0] ? String(row[0]).trim() : '';
    if (hariCol.toUpperCase().includes('SENIN')) currentDay = 'Senin';
    else if (hariCol.toUpperCase().includes('SELASA')) currentDay = 'Selasa';
    else if (hariCol.toUpperCase().includes('RABU')) currentDay = 'Rabu';
    else if (hariCol.toUpperCase().includes('KAMIS')) currentDay = 'Kamis';
    else if (hariCol.toUpperCase().includes("JUM'AT") || hariCol.toUpperCase().includes('JUMAT')) currentDay = 'Jumat';
    else if (hariCol.toUpperCase().includes('SABTU')) currentDay = 'Sabtu';

    const jamKe = row[2];
    if (typeof jamKe === 'number' || (typeof jamKe === 'string' && /^\d+$/.test(jamKe.trim()))) {
      const parsed = parseTime(row[1]);
      if (!parsed) {
        console.error(`Error parsing time on row ${r}: ${row[1]}`);
        continue;
      }

      for (let c = 3; c < 57; c++) {
        const cellVal = row[c] ? String(row[c]).trim() : '';
        if (!cellVal || cellVal === 'NaN') continue;

        const targetClass = colToClass[c];
        const teacherCodes = cellVal.split('/').map(s => s.trim()).filter(Boolean);

        for (const code of teacherCodes) {
          const tInfo = teacherMapping[code];
          if (!tInfo) {
            console.error(`Unknown teacher code "${code}" on row ${r}, col ${c}`);
            continue;
          }

          newJadwalRecords.push({
            kelas_id: targetClass.id,
            mapel_id: tInfo.mapelId,
            guru_id: tInfo.profileId,
            hari: currentDay,
            jam_mulai: parsed.start,
            jam_selesai: parsed.end
          });
        }
      }
    }
  }

  console.log(`Parsed total ${newJadwalRecords.length} jadwal records to insert.`);

  // Batch insert into jadwal (500 records at a time)
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < newJadwalRecords.length; i += BATCH_SIZE) {
    const batch = newJadwalRecords.slice(i, i + BATCH_SIZE);
    const { error: insErr } = await adminClient.from('jadwal').insert(batch);
    if (insErr) {
      console.error(`Error inserting batch ${i / BATCH_SIZE}:`, insErr);
      return;
    }
    inserted += batch.length;
    console.log(`Inserted ${inserted} / ${newJadwalRecords.length} records...`);
  }

  console.log('\n=== STEP 6: VERIFICATION ===');
  const { count: finalCount } = await adminClient.from('jadwal').select('*', { count: 'exact', head: true });
  console.log(`Total rows in jadwal table now: ${finalCount}`);

  // Test login for 3 different teachers
  console.log('\nTesting logins with anonClient:');
  const testTeachers = ['OP', 'YY', 'HW', 'GURUMT'];
  for (const tCode of testTeachers) {
    const t = teacherMapping[tCode] || Object.values(teacherMapping).find(x => x.username === tCode);
    if (!t) continue;
    const { data: authRes, error: aErr } = await anonClient.auth.signInWithPassword({
      email: t.email,
      password: 'Demo@2025'
    });
    if (aErr) {
      console.log(`❌ Login failed for ${t.nama} (${t.email}):`, aErr.message);
    } else {
      console.log(`✅ Login SUCCESS for ${t.nama} (${t.username}): User ID ${authRes.user.id}`);
      const { data: pData } = await anonClient.from('profiles').select('*').eq('id', authRes.user.id).single();
      console.log(`   Profile loaded: Nama="${pData.nama}", Role="${pData.role}"`);
      await anonClient.auth.signOut();
    }
  }

  console.log('\nALL TASKS COMPLETED SUCCESSFULLY!');
}

run();
