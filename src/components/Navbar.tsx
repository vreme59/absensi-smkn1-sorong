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

              </div>
    </header>
  );
};
