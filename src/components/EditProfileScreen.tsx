import React, { useState, useRef } from 'react';

// Default initial student data matching the screenshot
const INITIAL_STUDENT_DATA = {
  fullName: 'Prima Adi Nugraha Soltif',
  classMajor: 'XII TKJ 1 - Teknik Komputer & Jaringan',
  academicYear: '2024/2025',
  email: 'prima.adi@smkn1sorong.sch.id',
  phone: '+62 821-9876-5432',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida/AEtjO1WXFxrh8NGKphbs6TkBNJGxfwQ_HklMCuROSehIbYPt-Rc4SG75Fo7IxWhBUrZvI4hdGo-_uGFpzCkdpGY0ROZzFQRHM_i3ii5fLjfKY-z3_PoxFtxJxqFao_poZ1CpctkdX3MmQhl6LJTNThhGd5oyjdT38WtumgJfPC9ohWGB834t8mMeZey6xe2KMxwrNhNINcqvCNsjAc9aVmaESoC8ou6yqgZ6A1nvh2E1NpxVkeRIUeuJADHuwSg',
};

// Fallback high-quality avatar if network image is blocked
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80';

export const EditProfileScreen: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [formData, setFormData] = useState(INITIAL_STUDENT_DATA);
  const [avatar, setAvatar] = useState(INITIAL_STUDENT_DATA.avatarUrl);
  const [avatarError, setAvatarError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Profil siswa berhasil diperbarui!');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showFeedbackToast('Ukuran foto maksimal 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          showFeedbackToast('Foto profil berhasil dipilih!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toast feedback helper
  const showFeedbackToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      showFeedbackToast('Profil siswa berhasil diperbarui!');
    }, 600);
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(INITIAL_STUDENT_DATA);
    setAvatar(INITIAL_STUDENT_DATA.avatarUrl);
    showFeedbackToast('Perubahan dibatalkan.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] sm:bg-slate-200/80 flex flex-col items-center justify-start sm:p-4 md:py-6 selection:bg-[#005fa0] selection:text-white">
      {/* Top Device Viewport Controls for Desktop Testing */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          SMKN 1 Sorong - Student Hub
        </span>
        <div className="flex items-center gap-1 bg-white/90 p-0.5 rounded-lg border border-slate-300/80 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-[#005fa0] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            Tampilan HP
          </button>
          <button
            type="button"
            onClick={() => setViewMode('responsive')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              viewMode === 'responsive'
                ? 'bg-[#005fa0] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">fullscreen</span>
            Responsif
          </button>
        </div>
      </div>

      {/* Main Container Card (Phone Frame or Fluid) */}
      <div
        className={`w-full bg-[#f8f9ff] flex flex-col transition-all duration-300 relative ${
          viewMode === 'mobile'
            ? 'max-w-full sm:max-w-[412px] min-h-screen sm:min-h-[840px] sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-slate-900 sm:ring-1 sm:ring-black/10 overflow-hidden'
            : 'max-w-md min-h-screen sm:min-h-[820px] sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200 overflow-hidden'
        }`}
      >
        {/* Mobile Status Bar Simulation - only on desktop frame */}
        <div className="hidden sm:flex w-full bg-white px-6 pt-2 pb-1 items-center justify-between text-[11px] font-semibold text-slate-800 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[13px]">wifi</span>
            <span className="material-symbols-outlined text-[15px]">battery_full</span>
          </div>
        </div>

        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
                className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>

            {/* School / Edit Profile Title Badge */}
            <div className="flex items-center gap-2.5">
              {/* Blue Graduation Logo Icon */}
              <div className="w-8 h-8 rounded-lg bg-[#005fa0] flex items-center justify-center text-white shadow-xs overflow-hidden">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
                </svg>
              </div>

              <h1 className="text-[19px] font-bold text-[#0b1c30] tracking-tight font-heading">
                Edit Profile
              </h1>
            </div>
          </div>

          {/* Right Header User Avatar */}
          <div className="w-8 h-8 rounded-full ring-2 ring-[#005fa0]/25 overflow-hidden bg-slate-200 shrink-0">
            <img
              src={avatarError ? FALLBACK_AVATAR : avatar}
              alt="Profil Siswa"
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col pb-8 overflow-y-auto">
          {/* Top Blue Header Arc with Dot Grid */}
          <div className="relative w-full bg-gradient-to-b from-[#005fa0] via-[#0070c0] to-[#bfe0fb] pt-6 pb-16 px-4 flex flex-col items-center overflow-hidden">
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

            {/* Glowing Ambient Light */}
            <div className="absolute top-0 w-64 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Student Avatar with Camera Button */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full p-[3px] bg-white shadow-[0_10px_25px_rgba(0,40,100,0.22)] flex items-center justify-center group">
                <img
                  src={avatarError ? FALLBACK_AVATAR : avatar}
                  alt={formData.fullName}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setAvatarError(true)}
                />

                {/* Floating Camera Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#005fa0] text-white shadow-md flex items-center justify-center hover:bg-[#004e84] active:scale-90 transition-all border-2 border-white cursor-pointer"
                  title="Ganti Foto Profil"
                  aria-label="Ganti Foto Profil"
                >
                  <span className="material-symbols-outlined text-[19px]">photo_camera</span>
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Overlapping Main White Card */}
          <div className="px-4 -mt-8 z-20 flex flex-col gap-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(11,99,168,0.08)] border border-slate-100 flex flex-col gap-4.5"
            >
              {/* Section Header: Data Siswa */}
              <div className="flex items-center gap-2 pb-0.5">
                <span className="material-symbols-outlined text-[#005fa0] text-[22px]">
                  badge
                </span>
                <h2 className="text-[18px] font-bold text-[#0b1c30] font-heading tracking-tight">
                  Data Siswa
                </h2>
              </div>

              {/* Field 1: Nama Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fullName"
                  className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1"
                >
                  Nama Lengkap
                  <span className="text-amber-700 font-bold">*</span>
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
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                    className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all shadow-inner/5"
                  />
                </div>
              </div>

              {/* Field 2: Kelas & Kompetensi Keahlian (with Academic Year) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <label
                    htmlFor="classMajor"
                    className="font-semibold text-[#0b1c30]"
                  >
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
                    value={formData.classMajor}
                    onChange={(e) =>
                      setFormData({ ...formData, classMajor: e.target.value })
                    }
                    className="w-full h-12 pl-11 pr-11 bg-[#e5eeff] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all shadow-inner/5"
                  />
                  <span
                    className="material-symbols-outlined absolute right-3.5 text-slate-400 text-[20px] pointer-events-none"
                    title="Terverifikasi oleh pihak sekolah"
                  >
                    verified
                  </span>
                </div>
              </div>

              {/* Field 3: Email Akun Belajar / Sekolah */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1"
                >
                  Email Akun Belajar / Sekolah
                  <span className="text-amber-700 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="nama@smkn1sorong.sch.id"
                    className="w-full h-12 pl-11 pr-4 bg-[#eef4fc] text-[#0b1c30] text-[14px] font-medium rounded-xl border border-transparent focus:border-[#005fa0] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#005fa0]/15 transition-all shadow-inner/5"
                  />
                </div>
              </div>

              {/* Field 4: Nomor WhatsApp Aktif */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1"
                >
                  Nomor WhatsApp Aktif
                  <span className="text-amber-700 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    call
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+62 xxx-xxxx-xxxx"
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
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
            showToast
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
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
