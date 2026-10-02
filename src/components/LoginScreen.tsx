import React, { useState } from 'react';
import { SCHOOL_LOGO, USER_PROFILES } from '../data/mockData';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, identifier?: string, password?: string) => void;
  onOpenPublicSchedule: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onOpenPublicSchedule,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const roleConfigs: Record<
    UserRole,
    { label: string; idPlaceholder: string; idDefault: string; pwdDefault: string; hint: string }
  > = {
    siswa: {
      label: 'Username Siswa',
      idPlaceholder: 'Masukkan username',
      idDefault: 'siswa_demo',
      pwdDefault: 'Demo@2025',
      hint: 'Role: Siswa (siswa_demo) • Akses jadwal & presensi selfie mandiri.',
    },
    sekretaris: {
      label: 'Username Sekretaris Kelas',
      idPlaceholder: 'Masukkan username',
      idDefault: 'sekre_demo',
      pwdDefault: 'Demo@2025',
      hint: 'Role: Sekretaris Kelas (sekre_demo) • Akses absensi rekap pagi & panggil guru.',
    },
    guru: {
      label: 'Username Guru',
      idPlaceholder: 'Masukkan username',
      idDefault: 'guru_demo',
      pwdDefault: 'Demo@2025',
      hint: 'Role: Guru Mata Pelajaran (guru_demo) • Validasi lapis-2 & pemanggilan darurat.',
    },
    admin: {
      label: 'Username Admin Sekolah',
      idPlaceholder: 'Masukkan username',
      idDefault: 'admin_demo',
      pwdDefault: 'Demo@2025',
      hint: 'Role: Administrator Utama (admin_demo) • Konfigurasi Roster, RLS & Master Data.',
    },
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const cfg = roleConfigs[role];
    setIdentifier(cfg.idDefault);
    setPassword(cfg.pwdDefault);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await onLoginSuccess(selectedRole, identifier, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-between">
      <div className="w-full">
        {/* DANA Style Immersive Curved Header Area */}
        <div className="relative w-full bg-[#005fa0] overflow-hidden pb-12 pt-8 px-4 text-white">
          {/* Atmospheric Decorative Circles */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#005fa0]-container opacity-40 blur-xl pointer-events-none"></div>
          <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-[#74b4ff] opacity-20 blur-lg pointer-events-none"></div>

          <div className="max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
            {/* School Logo Container */}
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center mb-3">
              <img
                alt="Logo SMKN 1 Sorong"
                className="w-full h-full object-contain"
                src={SCHOOL_LOGO}
              />
            </div>

            {/* School & System Identity */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#005fa0]-container text-white font-label-sm text-[11px] tracking-wide uppercase mb-1.5 font-bold shadow-sm">
              <span
                className="material-symbols-outlined notranslate text-[13px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              SIAKAD &amp; Presensi 2-Lapis
            </span>

            <h1 className="font-headline font-bold text-2xl tracking-tight text-white">
              SMK NEGERI 1 SORONG
            </h1>
            <p className="font-body text-xs text-[#d1e4ff] max-w-xs mt-1">
              Sistem Jadwal Terpadu, Presensi Real-Time &amp; Panggilan Pengajar
            </p>
          </div>
        </div>

        {/* Main Floating Authenticator Card Canvas */}
        <div className="relative max-w-md mx-auto px-4 -mt-6 z-20 pb-8">
          <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col gap-4 border border-slate-100">
            {/* Auth Form Inputs */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Field 1: NISN / NIP / ID Pengguna */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Username / ID Pengguna</span>
                  
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 text-primary text-[20px] pointer-events-none">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ketik username Anda di sini..."
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-body text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 2: PIN / Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>PIN / Kata Sandi</span>
                  
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 text-primary text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-12 pl-11 pr-11 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-body text-sm tracking-wider focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    <span className="material-symbols-outlined notranslate text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Utilities */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary accent-primary"
                  />
                  <span className="font-body text-xs text-slate-600">Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Silakan hubungi staf Kurikulum atau Guru Wali Kelas Anda untuk reset PIN Dapodik.')
                  }
                  className="font-body text-xs font-semibold text-primary hover:underline"
                >
                  Lupa PIN?
                </button>
              </div>

              {/* Primary DANA-Style Auth CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#005fa0] text-white font-bold text-sm shadow-md hover:bg-[#005fa0]-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined notranslate animate-spin text-[18px]">
                      progress_activity
                    </span>
                    <span>Memverifikasi RLS...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <span className="material-symbols-outlined notranslate text-[18px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow h-px bg-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Atau Akses Publik
              </span>
              <div className="flex-grow h-px bg-slate-200"></div>
            </div>

            {/* Public Schedule CTA */}
            <button
              type="button"
              onClick={onOpenPublicSchedule}
              className="w-full h-12 rounded-xl bg-surface-container text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-[0.99] transition-colors shadow-sm"
            >
              <span
                className="material-symbols-outlined notranslate text-primary text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_month
              </span>
              <span>Jadwal Pelajaran Publik (Tanpa Login)</span>
            </button>

            </div>
        </div>
      </div>

      {/* Security, Trust & Copyright Footer */}
      <div className="w-full max-w-md mx-auto px-4 pb-6 flex flex-col items-center text-center gap-1.5 text-slate-500">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <span className="material-symbols-outlined notranslate text-[16px]">lock</span>
          <span>Dilindungi Row Level Security (RLS) &amp; Multi-Role Guard</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs">
          Hak Cipta © 2024 Tim Lomba Web AI • SMK Negeri 1 Sorong, Papua Barat Daya.
        </p>
      </div>
    </div>
  );
};
