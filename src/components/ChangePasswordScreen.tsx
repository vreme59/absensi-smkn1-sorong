import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const ChangePasswordScreen: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showFeedbackToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showFeedbackToast('Kata sandi tidak cocok!', 'error');
      return;
    }
    if (password.length < 6) {
      showFeedbackToast('Kata sandi minimal 6 karakter!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('profiles').update({ must_change_password: false }).eq('id', session.user.id);
      }

      showFeedbackToast('Kata sandi berhasil diubah!', 'success');
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err: any) {
      showFeedbackToast(err.message || 'Gagal mengubah kata sandi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative pb-20 selection:bg-[#005fa0] selection:text-white shadow-xl sm:border-x sm:border-slate-200">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center border-b border-slate-100 shadow-sm gap-2">
        <button type="button" onClick={onBack} className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">key</span>
          </div>
          <h1 className="font-bold text-[#0b1c30] text-[15px] tracking-tight">Ubah Kata Sandi</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-8 relative z-10">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-6">
          <p className="text-sm text-slate-600 font-medium">Buat kata sandi baru yang kuat untuk mengamankan akun Dapodik / Student Hub Anda.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1">Kata Sandi Baru</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1">Ulangi Kata Sandi Baru</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">lock_reset</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi kata sandi"
                  className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white rounded-xl text-[14px] font-semibold tracking-wide shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Kata Sandi'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={\`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full \${toastType === 'success' ? 'bg-[#1e293b]' : 'bg-rose-600'} text-white shadow-2xl flex items-center gap-2.5 pointer-events-none transition-all duration-300 max-w-[90%] \${showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}\`}>
        <span className="material-symbols-outlined text-white text-[20px]">
          {toastType === 'success' ? 'check_circle' : 'error'}
        </span>
        <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">{toastMessage}</span>
      </div>
    </div>
  );
};
