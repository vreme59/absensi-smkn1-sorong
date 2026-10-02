import React, { useState } from 'react';
import { SCHOOL_LOGO } from '../data/samakan/mockData';
import { UserProfile, UserRole } from '../types_samakan';

interface NavbarProps {
  currentTab: string;
  user: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onOpenHtmlModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  user,
  onSelectRole,
  onOpenHtmlModal,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const tabLabels: Record<string, string> = {
    beranda: 'Beranda',
    jadwal: 'Jadwal',
    absensi: user.role === 'guru' ? 'Portal Pendidik' : 'Absensi',
    profil: 'Profil Pengguna',
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-primary pt-safe shadow-[0_4px_16px_rgba(0,95,160,0.18)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left: School Logo & Title */}
        <div className="flex items-center gap-2.5">
          <img
            alt="Logo SMKN 1 Sorong"
            className="h-9 w-auto object-contain drop-shadow-sm"
            src={SCHOOL_LOGO}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-[17px] text-white tracking-wide leading-tight">
                SMKN 1 SORONG
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
            </div>
            <span className="font-body text-[11px] font-semibold text-primary-fixed leading-tight">
              {tabLabels[currentTab] || 'SIAKAD'}
            </span>
          </div>
        </div>

        {/* Right: Quick HTML Code viewer button + Class/Role Pill */}
        <div className="flex items-center gap-2">
          {/* Direct HTML Code View Button */}
          <button
            onClick={onOpenHtmlModal}
            title="Lihat & Salin Kode HTML"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">code</span>
            <span>HTML</span>
          </button>

          {/* User / Class Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-primary-container/85 hover:bg-primary-container pl-2.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-white/20 transition-all active:scale-95"
              title="Ganti Role Demo"
            >
              <span className="font-body text-[11px] font-bold text-white tracking-wide">
                {user.role === 'guru' ? 'GURU' : user.classRoom || 'XI RPL 1'}
              </span>
              <img
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/50"
                src={user.avatarUrl}
              />
              <span className="material-symbols-outlined notranslate text-white text-[14px] pr-0.5">
                expand_more
              </span>
            </button>

            {/* Quick Role Switch Popover */}
            {showRoleMenu && (
              <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ganti Role Demo (Mode Juri)
                  </p>
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user.name}
                  </p>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <button
                    onClick={() => {
                      onSelectRole('sekretaris');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      user.role === 'sekretaris'
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px] text-amber-500">
                      workspace_premium
                    </span>
                    <div>
                      <span className="block">Sekretaris (Farhan)</span>
                      <span className="text-[10px] text-slate-400">Input absen & panggil</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRole('guru');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      user.role === 'guru'
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px] text-sky-600">
                      school
                    </span>
                    <div>
                      <span className="block">Guru (Pak Budi)</span>
                      <span className="text-[10px] text-slate-400">Validasi lapis 2 & mapel</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRole('siswa');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      user.role === 'siswa'
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px] text-emerald-600">
                      account_circle
                    </span>
                    <div>
                      <span className="block">Siswa (Siti Aminah)</span>
                      <span className="text-[10px] text-slate-400">Presensi mandiri & jadwal</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRole('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      user.role === 'admin'
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px] text-purple-600">
                      admin_panel_settings
                    </span>
                    <div>
                      <span className="block">Admin Kurikulum</span>
                      <span className="text-[10px] text-slate-400">Master Dapodik & RLS</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
