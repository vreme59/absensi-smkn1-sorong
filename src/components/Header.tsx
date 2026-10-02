import React from 'react';
import { Code2, Smartphone } from 'lucide-react';

interface Props {
  onOpenReactNativeCode: () => void;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenReactNativeCode,
  isSimulatorMode,
  onToggleSimulator,
}) => {
  return (
    <header className="w-full bg-[#005fa0] text-white shadow-[0_4px_16px_rgba(0,95,160,0.18)] z-30 sticky top-0">
      <div className="h-16 px-4 max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img
            alt="Logo SMKN 1 Sorong Student Hub"
            className="h-8 w-auto object-contain drop-shadow-sm"
            src="https://lh3.googleusercontent.com/aida/AEtjO1W9rn4mcj87694X5B7-tJf8vbX-pFRuzXwmhdsD5w4Qze3r9vtvq6sodoyDWrU8inQpDWXYhQGVEfyxGOGWGgeod-ls4ZaYU-EijnOzzhiSoCKbd7GFi_C9zrRyBN1I0Nupm6o-oWwc1yAVFvfvtmWNNmEc87K-Bxa6bgul49AqIfXlG8byA0IaWSOFsdDNYPMPqhvYvtklYA-uNaseHw0YkMpiyIlZD_q7ofJ3VIZr3AFQpgsDRHQGkSw"
            onError={(e) => {
              // fallback if network block
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-white tracking-wide leading-tight">
                SMKN 1 SORONG
              </span>
              <span className="w-2 h-2 rounded-full bg-[#a0c9ff] animate-pulse"></span>
            </div>
            <span className="text-[11px] font-semibold text-[#d1e4ff] leading-none">
              Jadwal
            </span>
          </div>
        </div>

        {/* Actions & Profile Pill */}
        <div className="flex items-center gap-2">
          {/* React Native Code Trigger Button */}
          <button
            onClick={onOpenReactNativeCode}
            title="Lihat Kode React Native"
            className="flex items-center gap-1.5 bg-[#0078c8] hover:bg-[#006bb3] text-white px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer border border-sky-400/30"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-200" />
            <span className="hidden sm:inline">React Native Code</span>
            <span className="sm:hidden">RN Code</span>
          </button>

          {/* Profile Pill */}
          <div className="flex items-center gap-1.5 bg-[#0078c8]/80 pl-2.5 pr-1 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-sky-300/20">
            <span className="text-[11px] font-bold text-white">XI RPL 1</span>
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYnt2a-k9qr2VrGiR_aaNyxA0kr0zTUoyDij-XJB6qo6dMjg8FwbnhLqNO9exCCHBmngm533nSRqYmZP6JCfHuekrOs7MIEzSxrxLB3Y9p7b6kz_vmOcu2eVdHJ6K2OBzJzjnQsNXJJ0L4yaOC2pFWOq5kT9LmUjuf-Ic0KY7KPRI5lxlTQxwOck9ly6Z0aUijW0_dwOqKrQ8upujFgHbM-wse0kY5Sq_d0DVyjWeOjp5SyzN_Htoh"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
