const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const oldRoleSwitcherRegex = /\{\/\* Role Switcher Matrix for Jury Demo \*\/\}[\s\S]*?\{\/\* Logout Button \*\/\}/;

const newSettingsBlock = `{/* Pengaturan & Informasi */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Pengaturan &amp; Informasi
            </h3>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onShowToast('Fitur Terkunci', 'Fitur edit profil sedang dinonaktifkan oleh Admin.', 'warning')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">manage_accounts</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Edit Profil &amp; Foto</span>
                    <span className="text-[10px] text-slate-500">Ubah foto atau data diri</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-400 text-[18px]">chevron_right</span>
              </button>

              <button 
                onClick={() => onShowToast('Ubah Kata Sandi', 'Hubungi Admin Kurikulum untuk mereset kata sandi Anda.', 'info')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">password</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Ubah Kata Sandi</span>
                    <span className="text-[10px] text-slate-500">Perbarui keamanan akun</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-400 text-[18px]">chevron_right</span>
              </button>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">calendar_today</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Tahun Ajaran</span>
                    <span className="text-[10px] text-slate-500">2024/2025 - Semester Ganjil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Logout Button */}`;

data = data.replace(oldRoleSwitcherRegex, newSettingsBlock);

// Replace Logout button text and app version footer text
data = data.replace('Keluar ke Mode Demo Juri (Login Screen)', 'Keluar dari Akun');
data = data.replace('Versi Aplikasi 2.4.0 (Build AI Web Lomba 2024)', 'Versi Aplikasi 2.4.0');

fs.writeFileSync(file, data);
console.log('Profile settings updated');
