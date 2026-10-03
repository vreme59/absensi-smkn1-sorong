const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/ProfileScreenSamakan.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Pengaturan & Informasi \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Logout Button \*\/\}/;

const newBlock = `{/* Pengaturan & Informasi */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col mb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-primary rounded-full"></div>
                <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                  Pengaturan &amp; Informasi
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Akun Dapodik</span>
            </div>
            
            <div className="flex flex-col gap-5">
              <button 
                onClick={() => onShowToast('Fitur Terkunci', 'Fitur edit profil sedang dinonaktifkan oleh Admin.', 'warning')}
                className="flex items-center justify-between w-full group active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-sky-50 text-sky-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]">manage_accounts</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-slate-800">Edit Profil &amp; Foto</span>
                    <span className="text-[11px] text-slate-400 font-medium">Ubah foto atau data diri</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-300 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button 
                onClick={() => onShowToast('Ubah Kata Sandi', 'Hubungi Admin Kurikulum untuk mereset kata sandi Anda.', 'info')}
                className="flex items-center justify-between w-full group active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]">key</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-slate-800">Ubah Kata Sandi</span>
                    <span className="text-[11px] text-slate-400 font-medium">Perbarui keamanan akun &amp; PIN</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-300 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
              
              <button 
                className="flex items-center justify-between w-full group active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]">calendar_today</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-slate-800">Tahun Ajaran</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold">Aktif</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">2024/2025 - Semester Ganjil</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-300 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button 
                onClick={() => onShowToast('Notifikasi', 'Pengaturan notifikasi berhasil dibuka.', 'info')}
                className="flex items-center justify-between w-full group active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]">notifications_active</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-slate-800">Notifikasi &amp; Pengingat</span>
                    <span className="text-[11px] text-slate-400 font-medium">Alarm kelas &amp; pengumuman mapel</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-300 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button 
                onClick={() => onShowToast('Privasi', 'Melihat izin privasi Dapodik.', 'info')}
                className="flex items-center justify-between w-full group active:scale-[0.98] transition-transform text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]">shield_person</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-slate-800">Privasi &amp; Keamanan Data</span>
                    <span className="text-[11px] text-slate-400 font-medium">Izin akses &amp; enkripsi data Dapodik</span>
                  </div>
                </div>
                <span className="material-symbols-outlined notranslate text-slate-300 text-[20px] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Logout Button */}`;

data = data.replace(regex, newBlock);

fs.writeFileSync(file, data);
console.log('UI updated exactly like the image!');
