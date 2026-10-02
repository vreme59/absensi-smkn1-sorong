
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfcdqmajoazxcoxgnoka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmY2RxbWFqb2F6eGNveGdub2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjUzNzEsImV4cCI6MjEwNjM0MTM3MX0.wLxxXMBd0q8HZM0HGhfGb0yMuA-a3daofIHMK8Bxjmc'
);

async function run() {
    const { data: adminAuth } = await supabase.auth.signInWithPassword({ email: 'admin_demo@smkn1sorong.sch.id', password: 'Demo@2025' });
    if (!adminAuth.user) return console.log('Admin login failed');
    
    // We can't access auth.users directly. 
    // What if we try to insert a profile for a non-existent UUID? It will fail foreign key constraint.
    console.log('Logged in as admin');
}
run();
