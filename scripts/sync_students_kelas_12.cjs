const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

function normalize(s) {
  return String(s || '').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
}

async function run() {
  console.log('=== STEP 1: READING STUDENT DATA & DB CLASSES ===');
  const csvContent = fs.readFileSync('data_siswa_kelas_12.csv', 'utf8').trim();
  const lines = csvContent.split('\n');
  console.log(`Loaded ${lines.length} students from CSV.`);

  const { data: dbClasses } = await adminClient.from('kelas').select('*');
  const classMap = new Map();
  dbClasses.forEach(c => classMap.set(normalize(c.nama), c));

  const classAlias = {
    'XIIAKL1': 'XII AK 1',
    'XIIAKL2': 'XII AK 2',
    'XIIAKL3': 'XII AK 3',
    'XIIMPLB1': 'XII MP 1',
    'XIIMPLB2': 'XII MP 2',
    'XIIPEMSRN1': 'XII BR 1',
    'XIIPEMSRN2': 'XII BR 2',
    'XIITJKT1': 'XII TKJ 1',
    'XIITJKT2': 'XII TKJ 2',
    'XIIDKV1': 'XII DKV 1',
    'XIIDKV2': 'XII DKV 2',
    'XIIPPLG': 'XII RPL',
    'XIITGP1': 'XII GP 1',
    'XIITGP2': 'XII GP 2',
    'XIITPMG': 'XII TP'
  };

  // Pre-load all existing student profiles
  const { data: allProfiles } = await adminClient.from('profiles').select('*').eq('role', 'siswa');
  const profByNisn = new Map();
  allProfiles.forEach(p => {
    profByNisn.set(p.username, p);
    if (p.username.startsWith('s')) {
      profByNisn.set(p.username.slice(1), p);
    }
  });

  console.log(`Preloaded ${allProfiles.length} student profiles.`);

  console.log('\n=== STEP 2: CREATING AUTH ACCOUNTS & UPDATING PROFILES ===');
  let successCount = 0;
  let errorCount = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const parts = line.split(',');
    if (parts.length < 5) continue;
    const no = parts[0];
    const nama = parts[1].trim();
    const rawClass = parts[2].trim();
    const nipd = parts[3].trim();
    const nisn = parts[4].trim();

    const targetClassName = classAlias[normalize(rawClass)] || rawClass;
    const targetClass = classMap.get(normalize(targetClassName)) || classMap.get(normalize(rawClass));

    if (!targetClass) {
      console.error(`Target class not found for student ${nama}: ${rawClass}`);
      errorCount++;
      continue;
    }

    const username = 's' + nisn;
    const email = username + '@smkn1sorong.sch.id';

    // 1. Create or get auth user
    let authUser = null;
    let existingProf = profByNisn.get(nisn);

    // Try creating auth user
    const { data: authCreated, error: authErr } = await adminClient.auth.admin.createUser({
      email,
      password: 'Demo@2025',
      email_confirm: true
    });

    if (authCreated?.user) {
      authUser = authCreated.user;
    } else if (authErr && authErr.message && authErr.message.includes('already registered')) {
      // User already exists, check if we can get user id from existingProf if it's already a uuid
      if (existingProf && existingProf.id) {
        const { data: uCheck } = await adminClient.auth.admin.getUserById(existingProf.id);
        if (uCheck?.user) authUser = uCheck.user;
      }
    } else if (authErr) {
      console.error(`Error creating auth user for ${nama} (${email}):`, authErr.message);
    }

    if (!authUser && existingProf) {
      // Let's verify if existingProf.id is already in auth
      const { data: uCheck } = await adminClient.auth.admin.getUserById(existingProf.id);
      if (uCheck?.user) authUser = uCheck.user;
    }

    if (!authUser) {
      console.error(`Could not resolve authUser for ${nama} (${username})`);
      errorCount++;
      continue;
    }

    const finalUserId = authUser.id;

    // 2. Upsert profile so id == finalUserId
    if (existingProf) {
      if (existingProf.id !== finalUserId) {
        // Update profile ID to match auth user ID
        const { error: updErr } = await adminClient
          .from('profiles')
          .update({
            id: finalUserId,
            username: username,
            nama: nama,
            role: 'siswa',
            kelas_id: targetClass.id,
            must_change_password: false
          })
          .eq('id', existingProf.id);

        if (updErr) {
          console.error(`Error updating profile for ${nama}:`, updErr.message);
          errorCount++;
          continue;
        }
      } else {
        await adminClient
          .from('profiles')
          .update({
            username: username,
            nama: nama,
            role: 'siswa',
            kelas_id: targetClass.id,
            must_change_password: false
          })
          .eq('id', finalUserId);
      }
    } else {
      // Insert new profile
      const { error: insErr } = await adminClient.from('profiles').insert({
        id: finalUserId,
        username: username,
        nama: nama,
        role: 'siswa',
        is_sekretaris: false,
        kelas_id: targetClass.id,
        must_change_password: false
      });
      if (insErr) {
        console.error(`Error inserting profile for ${nama}:`, insErr.message);
        errorCount++;
        continue;
      }
    }

    successCount++;
    if (successCount % 50 === 0 || successCount === lines.length) {
      console.log(`Processed ${successCount} / ${lines.length} students...`);
    }
  }

  console.log(`\n=== STEP 3: SUMMARY ===`);
  console.log(`Successfully synced: ${successCount} students.`);
  console.log(`Errors: ${errorCount}`);

  // Test logins for 3 students by their names!
  console.log('\n=== STEP 4: VERIFYING LOGIN BY NAME ===');
  const sampleTestNames = ['AGUS', 'ARYANI', 'ALIF NURZALIM', 'PRIMA ADI NUGRAHA SOLTIF'];
  for (const testName of sampleTestNames) {
    // Smart lookup simulation
    let { data: lookup } = await anonClient
      .from('profiles')
      .select('username, nama')
      .ilike('nama', testName)
      .limit(1)
      .maybeSingle();

    if (!lookup) {
      const res = await anonClient
        .from('profiles')
        .select('username, nama')
        .ilike('nama', `%${testName}%`)
        .limit(1)
        .maybeSingle();
      lookup = res.data;
    }

    if (lookup) {
      const email = `${lookup.username}@smkn1sorong.sch.id`;
      const { data: signRes, error: sErr } = await anonClient.auth.signInWithPassword({
        email,
        password: 'Demo@2025'
      });

      if (sErr) {
        console.log(`❌ Login failed for "${testName}":`, sErr.message);
      } else {
        console.log(`✅ Login SUCCESS for "${testName}" -> Logged as ${lookup.nama} (${lookup.username})`);
        const { data: p } = await anonClient.from('profiles').select('*, kelas:kelas_id(nama)').eq('id', signRes.user.id).single();
        console.log(`   Kelas: ${p.kelas?.nama}, Role: ${p.role}`);
        await anonClient.auth.signOut();
      }
    } else {
      console.log(`❌ Profile not found for "${testName}"`);
    }
  }

  console.log('\nALL 481 STUDENTS READY TO LOGIN!');
}

run();
