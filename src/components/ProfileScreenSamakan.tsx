import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types_samakan';

interface ProfileScreenProps {
  user: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
  onOpenHtmlModal: () => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onSelectRole,
  onLogout,
  onOpenHtmlModal,
  onShowToast,
}) => {
  const [geofenceDistance, setGeofenceDistance] = useState<number>(35); // in meters (radius 100m)
  const isInsideGeofence = geofenceDistance <= 100;

  

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* Ocean Top Header Area */}
      <div className="bg-primary pt-3 pb-8 px-4 text-white relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">
            Akun &amp; Privasi Dapodik
          </span>
          <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
            SMKN 1 SORONG
          </span>
        </div>

        <div className="flex items-center gap-3.5 mt-2">
          <img
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/60 shadow-lg"
            src={user.avatarUrl}
          />
          <div className="flex flex-col min-w-0">
            <h1 className="font-headline font-bold text-lg text-white truncate">{user.name}</h1>
            <span className="text-xs text-sky-100 font-semibold">{user.roleTitle}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-md text-white">
                {user.nipOrNisnLabel}: {user.identifier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Body Content */}
      <div className="px-4 -mt-4 relative z-20 flex flex-col gap-4">
        {/* Dapodik Sync Status Badge */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[24px]">verified</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Tervalidasi Dapodik Kemendikbudristek
              </span>
              <span className="text-[11px] text-slate-500">
                Sinkronisasi Terakhir: Hari ini • 06:00 WIT
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            AKTIF
          </span>
        </div>

        

        {/* Pengaturan & Informasi */}
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
  
          {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-white border border-rose-200 text-error hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined notranslate text-[18px]">logout</span>
          <span>Keluar dari Akun</span>
        </button>

        <p className="text-[11px] text-center text-slate-400 pb-4">
          SMK Negeri 1 Sorong • Versi Aplikasi 2.4.0
        </p>
      </div>
    </div>
  );
};
