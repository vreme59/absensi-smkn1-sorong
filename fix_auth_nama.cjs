const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/hooks/useAuth.ts';
let data = fs.readFileSync(file, 'utf8');

const oldLogin = `    // Email virtual: username@smkn1sorong.sch.id
    const email = \`\${identifier.trim()}@smkn1sorong.sch.id\`;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });`;

const newLogin = `    // Cek apakah identifier adalah nama lengkap (Cari di profiles)
    let finalUsername = identifier.trim();
    const { data: profileLookup } = await supabase
      .from('profiles')
      .select('username')
      .ilike('nama', finalUsername)
      .single();

    if (profileLookup?.username) {
      finalUsername = profileLookup.username;
    }

    // Email virtual: username@smkn1sorong.sch.id
    const email = \`\${finalUsername}@smkn1sorong.sch.id\`;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });`;

data = data.replace(oldLogin, newLogin);
fs.writeFileSync(file, data);
console.log('Fixed useAuth for Nama Lengkap login');
