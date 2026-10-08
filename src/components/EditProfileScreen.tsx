import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { compressAvatarImage } from '../utils/imageCompressor';

// Fallback high-quality avatar if network image is blocked
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80';

export const EditProfileScreen: React.FC<{
  onBack: () => void;
  user: UserProfile;
  onProfileUpdated: (updated: Partial<UserProfile>) => void;
}> = ({ onBack, user, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: user.name,
    classMajor: user.roleTitle, // display only
    academicYear: '2024/2025', // display only
    email: user.identifier, // display only
    phone: user.phone || '',
  });

  const [avatar, setAvatar] = useState(user.avatarUrl || FALLBACK_AVATAR);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionNotice, setCompressionNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Profil berhasil diperbarui!');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar file selection with automatic compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        // Compress avatar to high quality max 512x512
        const result = await compressAvatarImage(file, 512, 0.85);
        setAvatar(result.dataUrl);
        setAvatarFile(result.file);
        setCompressionNotice(`Dioptimasi: ${result.originalSizeKB} KB → ${result.compressedSizeKB} KB (-${result.compressionRatioPercent}%)`);
        showFeedbackToast(`Foto berhasil dioptimasi (${result.compressedSizeKB} KB) tetap jernih! Klik Simpan.`);
      } catch (err: any) {
        console.error('Error compressing image:', err);
        showFeedbackToast('Gagal memproses gambar. Coba gambar lain.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const showFeedbackToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Tidak ada sesi login aktif.');
      
      const userId = session.user.id;
      let newAvatarUrl = avatar;

      // 1. Upload foto jika ada file baru (dengan fallback ke dataURL)
      if (avatarFile) {
        const fileName = `${userId}_${Date.now()}.jpg`;
        const filePath = `${userId}/${fileName}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true, contentType: 'image/jpeg' });
            
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            newAvatarUrl = publicUrl;
          } else {
            console.warn('Storage upload error, using compressed dataURL fallback:', uploadError);
            newAvatarUrl = avatar;
          }
        } catch (storageErr) {
          console.warn('Storage exception, using compressed dataURL fallback:', storageErr);
          newAvatarUrl = avatar;
        }
      }

      // 2. Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          nama: formData.fullName,
          phone: formData.phone,
          avatar_url: newAvatarUrl !== FALLBACK_AVATAR ? newAvatarUrl : null
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      showFeedbackToast('Foto profil & data berhasil diperbarui!');
      
      // Update parent state
      onProfileUpdated({
        name: formData.fullName,
        phone: formData.phone,
        avatarUrl: newAvatarUrl
      });
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      showFeedbackToast('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      fullName: user.name,
      classMajor: user.roleTitle,
      academicYear: '2024/2025',
      email: user.identifier,
      phone: user.phone || '',
    });
    setAvatar(user.avatarUrl || FALLBACK_AVATAR);
    setAvatarFile(null);
    showFeedbackToast('Perubahan dibatalkan.');
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative pb-20 selection:bg-[#005fa0] selection:text-white shadow-xl sm:border-x sm:border-slate-200">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#005fa0] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </div>
            <h1 className="font-bold text-[#0b1c30] text-[15px] tracking-tight">Edit Profile</h1>
          </div>
        </div>
        <img
          src={avatar}
          alt="Current User"
          className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100"
        />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Ocean Header Header with Interactive Avatar */}
        <div className="bg-[#005fa0] bg-gradient-to-b from-[#005fa0] to-[#0070bb] pt-8 pb-14 relative flex justify-center overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative group">
            <div
              className={`w-28 h-28 rounded-full border-4 ${
                avatarError ? 'border-rose-400' : 'border-white'
              } shadow-xl overflow-hidden bg-white flex items-center justify-center`}
            >
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  setAvatarError(true);
                  (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                }}
              />
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#005fa0] border-2 border-white rounded-full text-white flex items-center justify-center hover:bg-[#004e84] active:scale-95 transition-all shadow-md cursor-pointer"
                title="Ganti Foto Profil"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>

              {isCompressing && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 backdrop-blur-xs">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Kompresi...</span>
                </div>
              )}
            </div>
          </div>

          {compressionNotice && (
            <div className="relative z-10 -mt-8 mb-4 flex justify-center">
              <span className="bg-emerald-500 text-white shadow-md border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold text-center flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-[13px]">check_circle</span>
                {compressionNotice}
              </span>
            </div>
          )}

        {/* Form Container */}
        <div className="px-4 sm:px-6 -mt-6 pb-8 relative z-10">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-6">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-[#005fa0]">badge</span>
              <h2 className="font-bold text-[#0b1c30] text-[15px]">Data Siswa</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Field 1: Nama Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1">
                  Nama Lengkap <span className="text-amber-700 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    person
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all shadow-inner/5"
                  />
                </div>
              </div>

              {/* Field 2: Kelas & Kompetensi Keahlian (with Academic Year) */}
              <div className="flex flex-col gap-1.5 opacity-80 cursor-not-allowed">
                <div className="flex items-center justify-between text-[13px]">
                  <label htmlFor="classMajor" className="font-semibold text-[#0b1c30]">
                    Kelas & Kompetensi Keahlian
                  </label>
                  <span className="text-[11px] font-bold text-[#005fa0]">
                    Tahun Ajaran {formData.academicYear}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    school
                  </span>
                  <input
                    id="classMajor"
                    name="classMajor"
                    type="text"
                    disabled
                    value={formData.classMajor}
                    className="w-full h-12 pl-11 pr-11 bg-slate-100 text-slate-500 text-[14px] font-medium rounded-xl border border-transparent"
                  />
                  <span
                    className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none"
                  >
                    verified
                  </span>
                </div>
              </div>

              {/* Field 3: Email Akun Belajar / Sekolah */}
              <div className="flex flex-col gap-1.5 opacity-80 cursor-not-allowed">
                <label htmlFor="email" className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1">
                  Username Dapodik
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full h-12 pl-11 pr-4 bg-slate-100 text-slate-500 text-[14px] font-medium rounded-xl border border-transparent"
                  />
                </div>
              </div>

              {/* Field 4: Nomor WhatsApp Aktif */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1">
                  Nomor WhatsApp Aktif
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    call
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 8xx-xxxx-xxxx"
                    className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all shadow-inner/5"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-12 bg-[#005fa0] hover:bg-[#004e84] active:scale-[0.99] text-white rounded-xl text-[14px] font-semibold tracking-wide shadow-md shadow-[#005fa0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full h-10 bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-[14px] font-medium flex items-center justify-center transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Toast Notification Alert */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#1e293b] text-white shadow-2xl flex items-center gap-2.5 pointer-events-none transition-all duration-300 max-w-[90%] ${
            showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            check_circle
          </span>
          <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
            {toastMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
