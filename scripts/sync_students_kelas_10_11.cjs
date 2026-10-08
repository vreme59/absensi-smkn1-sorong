const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cfcdqmajoazxcoxgnoka.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc2NTM3MSwiZXhwIjoyMTA2MzQxMzcxfQ.BpY-FGEC3NSwv1pbkG8plodFELyuduumyYhiuRRp-kw';

const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TARGET_CLASSES = [
  // Kelas X (19 classes)
  'X BR 1', 'X BR 2',
  'X AKL 1', 'X AKL 2', 'X AKL 3',
  'X MP 1', 'X MP 2', 'X MP 3',
  'X TKJ 1', 'X TKJ 2', 'X TKJ 3', 'X TKJ 4',
  'X DKV 1', 'X DKV 2',
  'X RPL 1',
  'X TGP 1', 'X TGP 2',
  'X TP',
  'X THSA',

  // Kelas XI (20 classes)
  'XI BR 1', 'XI BR 2',
  'XI AK 1', 'XI AK 2', 'XI AK 3', 'XI AK 4',
  'XI MP 1', 'XI MP 2',
  'XI DKV 1', 'XI DKV 2',
  'XI TKJ 1', 'XI TKJ 2', 'XI TKJ 3', 'XI TKJ 4', 'XI TKJ 5',
  'XI RPL',
  'XI GP 1', 'XI GP 2',
  'XI TP',
  'XI TSHA',

  // Kelas XIII (1 class)
  'XIII TGP 1'
];

const STUDENTS_PER_CLASS = 25;

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log(`=== SYNC STUDENTS FOR KELAS X, XI, XIII (${TARGET_CLASSES.length} CLASSES) ===`);
  
  // 1. Fetch DB classes
  const { data: dbClasses, error: cErr } = await adminClient.from('kelas').select('id, nama');
  if (cErr) {
    console.error('Error fetching classes:', cErr);
    return;
  }
  const classMap = new Map();
  dbClasses.forEach(c => classMap.set(c.nama, c));

  let totalCreated = 0;
  let totalErrors = 0;

  for (const className of TARGET_CLASSES) {
    const classObj = classMap.get(className);
    if (!classObj) {
      console.error(`Class not found in DB: ${className}`);
      continue;
    }

    const classCode = norm(className);
    console.log(`\nProcessing ${className} (code: ${classCode})...`);

    // Check existing students in this class
    const { data: existingProfiles } = await adminClient
      .from('profiles')
      .select('id, nama, username')
      .eq('kelas_id', classObj.id);

    const existingUsernames = new Set((existingProfiles || []).map(p => p.username));

    // Prepare items to create
    const itemsToCreate = [];
    for (let num = 1; num <= STUDENTS_PER_CLASS; num++) {
      const padNum = String(num).padStart(2, '0');
      const username = `s_${classCode}_${padNum}`;
      if (existingUsernames.has(username)) continue;

      const nama = `Siswa ${num} ${className}`;
      const email = `${username}@smkn1sorong.sch.id`;
      itemsToCreate.push({ num, username, nama, email });
    }

    if (itemsToCreate.length === 0) {
      console.log(`  All ${STUDENTS_PER_CLASS} students already exist.`);
      continue;
    }

    console.log(`  Creating ${itemsToCreate.length} student accounts...`);

    // Process in batches of 5 concurrent requests
    const BATCH_SIZE = 5;
    for (let i = 0; i < itemsToCreate.length; i += BATCH_SIZE) {
      const batch = itemsToCreate.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (item) => {
        try {
          // 1. Create or get auth user
          let authUser = null;
          const { data: uCreate, error: uErr } = await adminClient.auth.admin.createUser({
            email: item.email,
            password: 'Demo@2025',
            email_confirm: true,
            user_metadata: { role: 'siswa', name: item.nama }
          });

          if (uErr) {
            if (uErr.message?.includes('already been registered') || uErr.status === 422) {
              const { data: listData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
              authUser = (listData?.users || []).find(u => u.email === item.email);
            } else {
              console.error(`    [${item.username}] Auth create error:`, uErr.message);
              totalErrors++;
              return;
            }
          } else {
            authUser = uCreate.user;
          }

          if (!authUser) {
            console.error(`    [${item.username}] Failed to acquire authUser`);
            totalErrors++;
            return;
          }

          // 2. Upsert profile
          const { error: pErr } = await adminClient.from('profiles').upsert({
            id: authUser.id,
            username: item.username,
            nama: item.nama,
            role: 'siswa',
            kelas_id: classObj.id,
            is_sekretaris: item.num === 1,
            must_change_password: false
          });

          if (pErr) {
            console.error(`    [${item.username}] Profile upsert error:`, pErr.message);
            totalErrors++;
          } else {
            totalCreated++;
          }
        } catch (e) {
          console.error(`    [${item.username}] Exception:`, e.message);
          totalErrors++;
        }
      }));
    }
  }

  console.log(`\n========================================`);
  console.log(`ALL DONE! Total students created: ${totalCreated}, Errors: ${totalErrors}`);
  console.log(`========================================`);
}

run();
