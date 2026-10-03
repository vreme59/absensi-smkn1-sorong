import React, { useState } from 'react';
import { SCHOOL_LOGO } from '../data/mockData';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, identifier?: string, password?: string) => void;
  onOpenPublicSchedule: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onOpenPublicSchedule,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Kita panggil onLoginSuccess, nanti App.tsx akan handle login lewat supabase
    // role "siswa" disini cuma formalitas karena di App.tsx role akan di-override dari profile Supabase yang di-return
    onLoginSuccess('siswa', identifier, password);
    setIsLoading(false); // Di app yang real, mungkin loading dihandle oleh parent
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden font-body">
      {/* Dekorasi Latar Belakang Sama Seperti Sebelumnya */}
      <div className="absolute top-0 w-full h-[45%] bg-primary rounded-b-[40px] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-dark/80"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-5 z-10 w-full max-w-md mx-auto mt-4">
        <div className="flex flex-col items-center mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 ring-4 ring-white/20">
            <img alt="Logo SMKN 1 Sorong" className="w-14 h-14 object-contain" src={SCHOOL_LOGO} />
          </div>
          <h1 className="font-headline font-black text-2xl text-white tracking-wide text-center">
            SMKN 1 SORONG
          </h1>
          <p className="text-sky-100 font-semibold text-sm tracking-wider uppercase mt-1">
            Portal Presensi &amp; Akademik
          </p>
        </div>

        <div className="w-full bg-white rounded-[28px] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <h2 className="font-headline font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-primary text-[28px]">account_circle</span>
            Login ke Akun Anda
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nama Lengkap / Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3.5 text-slate-400 text-[20px]">
                  badge
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan Nama Lengkap Anda"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3.5 text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier || !password}
              className="mt-4 w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span className="tracking-wide">Memeriksa Data...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Masuk Sistem</span>
                  <span className="material-symbols-outlined notranslate text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        <button
          onClick={onOpenPublicSchedule}
          className="mt-8 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 border border-white/20 animate-in slide-in-from-bottom-8 duration-700 delay-300"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">calendar_month</span>
          <span>Lihat Jadwal Publik Tanpa Login</span>
        </button>

        <div className="mt-6 flex flex-col gap-2 w-full animate-in slide-in-from-bottom-8 duration-700 delay-500 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <h3 className="text-white/90 text-[11px] font-bold text-center mb-1 flex justify-center items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[14px]">engineering</span>
            Mode Developer (Bypass)
          </h3>
          <p className="text-white/60 text-[9px] text-center mb-2">Pilih menu di bawah ini untuk bypass tanpa password.</p>
          
          <button
            type="button"
            onClick={() => {
              const username = window.prompt("Masukkan Username/Nama Guru (Cth: Haris):");
              if (username) {
                onLoginSuccess("guru", username, "BYPASS_TOKEN");
              }
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">lock_open</span>
            Bypass Guru DB Asli
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => onLoginSuccess("guru", "Bypass Guru", "12345")}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-900 text-white font-bold text-[10px] rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined notranslate text-[12px]">bug_report</span>
              Mock Guru (Dummy)
            </button>
            <button
              type="button"
              onClick={() => onLoginSuccess("siswa", "Bypass Siswa", "12345")}
              className="w-full py-2 bg-slate-500/80 hover:bg-slate-600 text-white font-bold text-[10px] rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined notranslate text-[12px]">bug_report</span>
              Mock Siswa (Dummy)
            </button>
          </div>
        </div>
      </div>

      <div className="pb-8 text-center z-10 animate-in fade-in duration-1000 delay-500">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          SIAKAD v2.0 â€¢ SMK Negeri 1 Sorong
        </p>
      </div>
    </div>
  );
};


