import React from 'react';

export interface ToastData {
  title: string;
  description: string;
  type?: 'success' | 'warning' | 'info' | 'error';
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: 'done_all',
    warning: 'notifications_active',
    info: 'info',
    error: 'error',
  };

  const bgColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    error: 'bg-rose-500',
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#213145] text-[#eaf1ff] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-top-6 duration-200 cursor-pointer"
    >
      <div
        className={`w-9 h-9 rounded-full ${
          bgColors[toast.type || 'success']
        } text-white flex items-center justify-center shrink-0 shadow-sm`}
      >
        <span className="material-symbols-outlined notranslate text-[20px]">
          {icons[toast.type || 'success']}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-label-md text-[13px] font-bold text-white tracking-wide">
          {toast.title}
        </h4>
        <p className="font-body-sm text-[12px] text-slate-300 truncate">
          {toast.description}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="text-slate-400 hover:text-white p-1"
      >
        <span className="material-symbols-outlined notranslate text-[18px]">close</span>
      </button>
    </div>
  );
};
