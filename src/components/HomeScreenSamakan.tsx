import React, { useState } from 'react';
import { SCHEDULES_BY_DAY } from "../data/samakan/scheduleData";
import { UserProfile, StudentAttendance, ClassAttendanceSummary, TeacherCallAlert } from '../types_samakan';

interface HomeScreenProps {
  user: UserProfile;
  classSummary: ClassAttendanceSummary;
  students: StudentAttendance[];
  oldStudents?: any[];
  teacherAlert: TeacherCallAlert;
  onSendTeacherCall: () => void;
  onSubmitMorningDraft: (updatedStudents: StudentAttendance[]) => void;
  onNavigateToTab: (tab: string) => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  classSummary,
  students,
    oldStudents = [],
    teacherAlert,
  onSendTeacherCall,
  onSubmitMorningDraft,
  onNavigateToTab,
  onShowToast,
}) => {
  const [showAbsenModal, setShowAbsenModal] = useState(false);
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showRekapModal, setShowRekapModal] = useState(false);
  const [showBanner, setShowBanner] = useState(teacherAlert.isActive);
  const [localStudents, setLocalStudents] = useState<StudentAttendance[]>(students);

  // Form state for leave submission
  const [izinName, setIzinName] = useState('Kevin Pratama');
  const [izinType, setIzinType] = useState<'sakit' | 'izin'>('sakit');
  const [izinReason, setIzinReason] = useState('Demam dan flu (disertai surat dokter)');

  const handleTriggerTeacherCall = () => {
    onSendTeacherCall();
    onShowToast(
      'Panggilan Guru Dikirim! 🔔',
      'Sinyal telah dikirim ke ponsel Pak Budi Santoso & Display Ruang Guru.',
      'warning'
    );
  };

  const handleMarkAllPresent = () => {
    setLocalStudents((prev) =>
      prev.map((s) => ({
        ...s,
        morningStatus: 'hadir',
      }))
    );
    onShowToast('Semua Ditandai Hadir', 'Status draft diperbarui ke 34 siswa hadir.', 'info');
  };

  const handleSubmitDraft = () => {
    onSubmitMorningDraft(localStudents);
    setShowAbsenModal(false);
    onShowToast(
      'Draft Presensi Terkirim!',
      'Telah masuk ke antrean validasi Guru Jam Pertama (Pak Budi Santoso).',
      'success'
    );
  };

  const handleSaveIzin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIzinModal(false);
    onShowToast(
      'Pengajuan Disimpan',
      `Surat ${izinType.toUpperCase()} atas nama ${izinName} berhasil diunggah ke arsip kelas.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* DANA Style Top Surface Background Extension */}
      <div className="bg-primary pt-3 pb-10 px-4 relative overflow-hidden rounded-b-[28px] shadow-[0_12px_32px_rgba(0,95,160,0.18)]">
        {/* Fluid Curved Accent Elements */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="absolute -left-16 bottom-0 w-40 h-40 rounded-full bg-secondary-fixed/15 blur-lg pointer-events-none"></div>

        {/* Student Welcome & Role Bar */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-primary-fixed uppercase tracking-wider font-bold">
              Selamat Pagi 👋
            </span>
            <h1 className="font-headline font-bold text-xl text-white tracking-tight">
              {user.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-label-sm text-[11px] font-semibold">
                {user.roleTitle}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-primary-fixed font-label-sm text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                Di Sekolah
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              onShowToast(
                'Notifikasi SMKN 1',
                'Jam Ke-2 telah dimulai di Lab RPL 2. Presensi dibuka.',
                'info'
              )
            }
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-95 transition-all relative"
            type="button"
          >
            <span className="material-symbols-outlined notranslate text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-primary"></span>
          </button>
        </div>

        {/* Main Card Deck: DANA Balance Style Digital Attendance Wallet */}
        <div className="relative z-10 bg-gradient-to-br from-primary-container to-primary rounded-2xl p-4 text-white shadow-xl overflow-hidden border border-white/15">
          {/* Ambient Curve Vector on Card */}
          <svg
            className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-44 h-44"
            fill="none"
            viewBox="0 0 200 200"
          >
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke="white"
              strokeDasharray="12 12"
              strokeWidth="28"
            ></circle>
            <path
              d="M40 180 C 80 120, 140 140, 200 80"
              fill="none"
              stroke="white"
              strokeWidth="18"
            ></path>
          </svg>

          <div className="flex items-start justify-between relative z-10 mb-3">
            <div>
              <span className="font-label-sm text-[11px] text-primary-fixed flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined notranslate text-[16px]">verified</span> STATUS
                PRESENSI HARI INI
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-headline font-bold text-2xl tracking-tight">06:45 WIT</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 font-label-sm text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span> HADIR • VALID
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-label-sm text-[11px] text-primary-fixed font-semibold">
                Bulan Mei
              </span>
              <div className="font-headline font-bold text-xl text-white">
                {user.attendanceRate}%
              </div>
            </div>
          </div>

          {/* Streak Api Kehadiran Sub-Pill */}
          <div
            onClick={() =>
              onShowToast(
                'Lencana Disiplin Sorong 🔥',
                `Hebat! Anda telah hadir tepat waktu ${user.streakDays} hari berturut-turut tanpa terlambat.`,
                'success'
              )
            }
            className="relative z-10 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md animate-pulse">
                <span
                  className="material-symbols-outlined notranslate text-amber-950 text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-label-sm text-xs text-white font-bold">
                    {user.streakDays} Hari Berturut-turut!
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 font-label-sm text-[10px] font-bold">
                    STREAK 🔥
                  </span>
                </div>
                <p className="font-body text-[11px] text-primary-fixed leading-tight">
                  Pertahankan untuk lencana Siswa Disiplin Sorong
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined notranslate text-primary-fixed text-[20px]">
              chevron_right
            </span>
          </div>
        </div>
      </div>

      {/* Content Body Container */}
      <div className="px-4 flex flex-col gap-4 -mt-5 relative z-20">
        {/* Quick Action Grid (4-Column DANA Fintech Icon Matrix) */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_8px_24px_rgba(11,99,168,0.08)] border border-slate-100">
          <div className="grid grid-cols-4 gap-2">
            {/* Action 1: Sekretaris Input Absen Pagi */}
            <button
              onClick={() => setShowAbsenModal(true)}
              className="flex flex-col items-center group active:scale-95 transition-transform text-center"
              type="button"
            >
              <div className="relative w-12 h-12 p-3 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined notranslate text-[24px]">edit_calendar</span>
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-error text-white font-label-sm text-[9px] font-bold animate-bounce shadow">
                  Draft
                </span>
              </div>
              <span className="font-label-sm text-xs text-on-surface font-semibold mt-1.5 leading-tight line-clamp-2">
                Absen
              </span>
            </button>

            {/* Action 2: Panggil Guru (Emergency button) */}
            <button
              onClick={() => {
                setShowBanner(true);
                handleTriggerTeacherCall();
              }}
              className="flex flex-col items-center group active:scale-95 transition-transform text-center"
              type="button"
            >
              <div className="w-12 h-12 p-3 rounded-2xl bg-amber-50 flex items-center justify-center text-tertiary-container group-hover:bg-tertiary-container group-hover:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined notranslate text-[24px]">emergency_home</span>
              </div>
              <span className="font-label-sm text-xs text-on-surface font-semibold mt-1.5 leading-tight line-clamp-2">
                Panggil Guru
              </span>
            </button>

            {/* Action 3: Rekap Bulanan */}
            <button
              onClick={() => setShowRekapModal(true)}
              className="flex flex-col items-center group active:scale-95 transition-transform text-center"
              type="button"
            >
              <div className="w-12 h-12 p-3 rounded-2xl bg-secondary-fixed/50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined notranslate text-[24px]">query_stats</span>
              </div>
              <span className="font-label-sm text-xs text-on-surface font-semibold mt-1.5 leading-tight line-clamp-2">
                Rekap Bulanan
              </span>
            </button>

            {/* Action 4: Pengajuan Izin */}
            <button
              onClick={() => setShowIzinModal(true)}
              className="flex flex-col items-center group active:scale-95 transition-transform text-center"
              type="button"
            >
              <div className="w-12 h-12 p-3 rounded-2xl bg-surface-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined notranslate text-[24px]">clinical_notes</span>
              </div>
              <span className="font-label-sm text-xs text-on-surface font-semibold mt-1.5 leading-tight line-clamp-2">
                Pengajuan Izin
              </span>
            </button>
          </div>
        </div>

        {/* Alert / Banner Darurat Interaktif "Panggil Guru" */}
        {showBanner && (
          <div className="bg-gradient-to-r from-tertiary-container to-amber-600 rounded-2xl p-4 text-white shadow-lg flex flex-col gap-2.5 relative overflow-hidden animate-in fade-in duration-200">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/20 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined notranslate text-[20px] animate-bounce">
                    notifications_active
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-amber-100 font-bold">
                    Jam ke-2 • 08.45 WIT
                  </span>
                  <h2 className="font-headline font-bold text-base leading-tight">
                    Guru Belum Tiba di Kelas?
                  </h2>
                </div>
              </div>
            </div>

            <p className="font-body text-xs text-amber-50 leading-relaxed">
              Pak Budi Santoso, S.Kom. (Pemrograman Web) belum memindai check-in di Lab RPL 2.
              Sekretaris dapat mengirim sinyal kesiapan kelas.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleTriggerTeacherCall}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white text-tertiary font-bold text-xs shadow-md hover:bg-amber-50 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">cell_tower</span>
                Kirim Sinyal Panggil Guru 🔔
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                type="button"
                title="Tutup Banner"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Sekretaris Quick Review Deck (Lapis 1 Presensi Kelas) */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_6px_20px_rgba(11,99,168,0.06)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
              <h2 className="font-headline font-bold text-base text-on-surface">
                Absensi Harian XII TKJ 1
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold">
              {classSummary.totalStudents} Total Siswa
            </span>
          </div>

          {/* Quick Tally Counter Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-surface-container-low flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-emerald-600">
                {classSummary.present}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                Hadir
              </span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-amber-600">
                {classSummary.sick}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                Sakit
              </span>
            </div>
            <div className="p-2 rounded-xl bg-surface-container flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-primary">
                {classSummary.permitted}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                Izin
              </span>
            </div>
            <div className="p-2 rounded-xl bg-error-container/40 flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-error">
                {classSummary.unexcused}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                Alfa
              </span>
            </div>
          </div>

        </div>

        {/* Section: Jadwal Belajar Hari Ini */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface">
                Jadwal Belajar Hari Ini
              </h2>
              <span className="font-body text-xs text-slate-500">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('jadwal')}
              className="font-label-sm text-xs text-primary font-bold flex items-center gap-0.5 hover:underline"
            >
              Lihat Full{' '}
              <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {(() => {
              const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
              const todayName = dayNames[new Date().getDay()];
              const schedule = SCHEDULES_BY_DAY[todayName] || [];
              
              if (schedule.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm">Tidak ada jadwal hari ini. Selamat istirahat!</p>
                  </div>
                );
              }
              
              return schedule.map((item, idx) => {
                const parts = item.time.split('-');
                const start = parts[0] ? parts[0].trim() : '';
                const end = parts[1] ? parts[1].trim() : '';
                const isLive = idx === 0; // The first item is marked LIVE for UI demonstration
                
                return (
                  <div key={item.id} className={`relative bg-white rounded-2xl p-3.5 flex items-start gap-3 overflow-hidden border ${isLive ? 'shadow-[0_8px_24px_rgba(0,95,160,0.12)] ring-2 ring-primary border-sky-100' : 'shadow-sm border-slate-100'}`}>
                    <div className={`${isLive ? 'w-2 bg-primary animate-pulse' : 'w-1.5 bg-secondary-container'} absolute left-0 top-0 bottom-0`}></div>
                    <div className="w-12 flex flex-col items-center shrink-0">
                      <span className={`font-bold text-xs ${isLive ? 'text-primary' : 'text-slate-800'}`}>{start}</span>
                      <span className="text-[10px] text-slate-400">{end}</span>
                      {isLive ? (
                        <span className="px-1.5 py-0.5 mt-1.5 rounded bg-primary text-white font-bold text-[9px] animate-pulse">LIVE</span>
                      ) : (
                        <span className="material-symbols-outlined notranslate text-slate-400 text-[20px] mt-1.5">schedule</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isLive && (
                         <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Presensi Dibuka
                          </span>
                        </div>
                      )}
                      <h3 className="font-headline font-bold text-sm text-slate-900">{item.subject}</h3>
                      {isLive ? (
                        <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-900 font-semibold">{item.teacher}</span>
                          </div>
                          <button
                            onClick={() => onNavigateToTab('absensi')}
                            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary-container active:scale-95 transition-all whitespace-nowrap"
                            type="button"
                          >
                            Absen Mapel
                          </button>
                        </div>
                      ) : (
                        <p className="font-body text-xs text-slate-500 mt-1">{item.teacher}</p>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Quick Classroom Roster Preview Card */}
        {/* Catatan Sekretaris Hari Ini */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-base text-on-surface">
                Catatan Sekretaris Hari Ini
              </h2>
              <span className="font-label-sm text-xs text-tertiary font-bold">
                {oldStudents.filter(s => s.status !== 'H').length} Catatan
              </span>
            </div>
  
            <div className="space-y-2">
              {oldStudents.filter(s => s.status !== 'H').length === 0 ? (
                <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-sm">Tidak ada catatan ketidakhadiran.</span>
                </div>
              ) : (
                oldStudents.filter(s => s.status !== 'H').map(s => {
                  let bgColor = 'bg-slate-50';
                  let borderColor = 'border-slate-100';
                  let iconBg = 'bg-slate-200';
                  let iconText = 'text-slate-900';
                  let statusBg = 'bg-slate-200';
                  let statusText = 'text-slate-800';
                  let label = s.status;
                  let noteColor = 'text-slate-800';

                  if (s.status === 'S') {
                    bgColor = 'bg-amber-50/70';
                    borderColor = 'border-amber-100';
                    iconBg = 'bg-amber-200';
                    iconText = 'text-amber-900';
                    statusBg = 'bg-amber-100';
                    statusText = 'text-amber-800';
                    label = 'SAKIT';
                    noteColor = 'text-amber-800';
                  } else if (s.status === 'I') {
                    bgColor = 'bg-sky-50/70';
                    borderColor = 'border-sky-100';
                    iconBg = 'bg-sky-200';
                    iconText = 'text-sky-900';
                    statusBg = 'bg-sky-100';
                    statusText = 'text-sky-800';
                    label = 'IZIN';
                    noteColor = 'text-sky-800';
                  } else if (s.status === 'A') {
                    bgColor = 'bg-red-50/70';
                    borderColor = 'border-red-100';
                    iconBg = 'bg-red-200';
                    iconText = 'text-red-900';
                    statusBg = 'bg-red-100';
                    statusText = 'text-red-800';
                    label = 'ALFA';
                    noteColor = 'text-red-800';
                  } else if (s.status === 'B') {
                    bgColor = 'bg-orange-50/70';
                    borderColor = 'border-orange-100';
                    iconBg = 'bg-orange-200';
                    iconText = 'text-orange-900';
                    statusBg = 'bg-orange-100';
                    statusText = 'text-orange-800';
                    label = 'BOLOS';
                    noteColor = 'text-orange-800';
                  }

                  const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('');

                  return (
                    <div key={s.id} className={`p-2.5 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-between`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${iconBg} ${iconText} font-bold flex items-center justify-center text-xs`}>
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-xs text-slate-900 font-bold block truncate max-w-[160px]">
                            {s.name} ({s.studentNo})
                          </span>
                          <span className={`font-body text-[11px] ${noteColor} truncate max-w-[160px]`}>
                            {s.note || 'Tidak ada keterangan'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full ${statusBg} ${statusText} text-[10px] font-bold`}>
                        {label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        
        {/* Slide-Up Modal: Input Absen Pagi (2 Lapis Sekretaris) */}
      {showAbsenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2"></div>
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider">
                  REKAP KELAS HARI INI
                </span>
                <h2 className="font-headline font-bold text-lg text-slate-900">
                  Informasi Absensi Kelas
                </h2>
                <p className="font-body text-xs text-slate-500">
                  XII TKJ 1 • 34 Siswa Terdaftar
                </p>
              </div>
              <button
                onClick={() => setShowAbsenModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                type="button"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            {/* Student Checklist Excerpt */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Siswa Tidak Hadir Hari Ini
              </span>

              {localStudents
                .filter((s) => s.morningStatus !== 'hadir')
                .map((std) => (
                  <div
                    key={std.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-slate-900">
                        {std.studentNo} - {std.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{std.note || '-'}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                        std.morningStatus === 'sakit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {std.morningStatus}
                    </span>
                  </div>
                ))}
            </div>


          </div>
        </div>
      )}

      {/* Modal: Pengajuan Izin / Sakit */}
      {showIzinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-200">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2"></div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Formulir Pengajuan Sakit / Izin
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa XII TKJ 1 • Unggah surat & verifikasi wali kelas
                </p>
              </div>
              <button
                onClick={() => setShowIzinModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveIzin} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  value={izinName}
                  onChange={(e) => setIzinName(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIzinType('sakit')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      izinType === 'sakit'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Sakit (Dengan Surat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIzinType('izin')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      izinType === 'izin'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Izin / Dispensasi
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Keterangan &amp; Alasan
                </label>
                <textarea
                  rows={2}
                  value={izinReason}
                  onChange={(e) => setIzinReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Upload photo attachment simulation */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50">
                <span className="material-symbols-outlined notranslate text-primary text-[28px]">
                  photo_camera
                </span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  Foto Surat Dokter / Surat Tugas
                </span>
                <span className="text-[11px] text-slate-400">
                  Format JPG/PNG (Otomatis tervalidasi AI Kesiswaan)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary-container"
              >
                Kirim Pengajuan Izin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rekap Bulanan */}
      {showRekapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2"></div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Rekap Kehadiran Bulan Mei 2024
                </h3>
                <p className="text-xs text-slate-500">
                  Kelas XII TKJ 1 • Semester Genap T.A 2024/2025
                </p>
              </div>
              <button
                onClick={() => setShowRekapModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-2xl font-bold text-emerald-700">98.5%</span>
                <span className="block text-xs text-slate-600 mt-0.5 font-semibold">
                  Tingkat Kehadiran
                </span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                <span className="text-2xl font-bold text-sky-700">22 Hari</span>
                <span className="block text-xs text-slate-600 mt-0.5 font-semibold">
                  Hari Efektif KBM
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Riwayat Ketidakhadiran Kelas
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Senin, 13 Mei 2024</span>
                  <span className="block text-[11px] text-slate-500">
                    Ahmad Dani (Sakit), Cindy Laura (Izin FLS2N)
                  </span>
                </div>
                <span className="font-bold text-emerald-600">32/34 Hadir</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Jumat, 10 Mei 2024</span>
                  <span className="block text-[11px] text-slate-500">Semua siswa hadir penuh</span>
                </div>
                <span className="font-bold text-emerald-600">34/34 Hadir (100%)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowRekapModal(false);
                onShowToast(
                  'Rekap Terunduh',
                  'File Rekap_Mei_XI_RPL_1.pdf berhasil diunduh.',
                  'info'
                );
              }}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary-container flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">download</span>
              Unduh Rekap Bulanan PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { HomeScreen as HomeScreenSamakan } from './HomeScreenSamakan';
