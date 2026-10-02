import React from 'react';

export type TabType = 'beranda' | 'jadwal' | 'absensi' | 'profil';

interface Props {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  containerWidthClass?: string;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  containerWidthClass = 'max-w-md sm:max-w-lg md:max-w-xl',
}) => {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: 'home' },
    { id: 'jadwal', label: 'Jadwal', icon: 'calendar_today' },
    { id: 'absensi', label: 'Absensi', icon: 'checklist' },
    { id: 'profil', label: 'Profil', icon: 'account_circle' },
  ] as const;

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full ${containerWidthClass} z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,95,160,0.08)] transition-all`}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-all cursor-pointer relative ${
                isActive ? 'text-[#005fa0] font-bold' : 'text-[#404752] hover:text-[#005fa0]'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined notranslate text-[24px] transition-transform ${
                  isActive ? 'fill scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#005fa0]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#005fa0]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
