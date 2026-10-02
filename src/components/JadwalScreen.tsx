import React, { useState } from 'react';
import { SCHEDULE_DAYS, SCHEDULES_BY_DAY } from '../data/samakan/scheduleData';
import { ScheduleItem } from '../types_samakan';

interface JadwalScreenProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const JadwalScreen: React.FC<JadwalScreenProps> = ({ onShowToast }) => {
  const [selectedDay, setSelectedDay] = useState('selasa');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('XI RPL 1');
  const [showClassPicker, setShowClassPicker] = useState(false);

  const availableClasses = [
    { id: 'XI RPL 1', name: 'XI RPL 1 (Rekayasa Perangkat Lunak 1)' },
    { id: 'XI RPL 2', name: 'XI RPL 2 (Rekayasa Perangkat Lunak 2)' },
    { id: 'XI TKJ 1', name: 'XI TKJ 1 (Teknik Komputer Jaringan 1)' },
    { id: 'XII RPL 1', name: 'XII RPL 1 (Rekayasa Perangkat Lunak)' },
  ];

  const currentSchedules: ScheduleItem[] = (SCHEDULES_BY_DAY[selectedDay] || []).filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.subject.toLowerCase().includes(query) ||
      item.teacher.toLowerCase().includes(query) ||
      item.room.toLowerCase().includes(query)
    );
  });

  const handleExportExcel = () => {
    onShowToast(
      'Export Berhasil! 📊',
      `File Jadwal_Roster_${selectedClass.replace(/\s+/g, '_')}_Semester_Genap.xlsx berhasil diunduh.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* Ocean Top Header Area */}
      <div className="bg-primary pt-3 pb-8 px-4 text-white relative">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-xs text-primary-fixed font-bold">
            <span className="material-symbols-outlined notranslate text-[15px]">public</span>
            Portal Akses Publik
          </span>
          <span className="text-xs text-primary-fixed flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            T.A. 2024/2025 Genap
          </span>
        </div>

        {/* Class Title & Switcher */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-[11px] text-primary-fixed font-bold uppercase tracking-wider block">
              Jadwal Pelajaran
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowClassPicker(true)}>
              <h1 className="font-headline font-bold text-2xl text-white tracking-tight">
                {selectedClass}
              </h1>
              <span className="material-symbols-outlined notranslate text-[20px] text-sky-200">
                arrow_drop_down
              </span>
            </div>
            <p className="text-xs text-primary-fixed">
              {selectedClass === 'XI RPL 1'
                ? 'Rekayasa Perangkat Lunak 1'
                : 'Program Keahlian Informatika'}
            </p>
          </div>

          <button
            onClick={() => setShowClassPicker(true)}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">sync_alt</span>
            <span>Ganti</span>
          </button>
        </div>

        {/* Wali Kelas Card */}
        <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          <img
            alt="Wali Kelas"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsjqqNUms7en4dEsFynEe-Ynj70m9IRBQFAt4kd0q0EC86X5bcowEuKK7P8ESzZQ1GnZPacrA3xHhBPbyzvPgqXjtQzmUdbHn5A7iE7Obpm-e1QLGdAx5Fk04s125mVdFFPsqg4ka06-5JLRBZyHIjrxP65z71ILzB2zNoP6IS7AlEXCqB9WSOVtmqXTEZnVAJ_PElhjC9ooSUx9lDAf0vqxN8gwIyRKMT7mD_nWG0YUat6Ke_v5Cn"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white">Wali Kelas: Ibu Dra. Hartini</span>
            <span className="text-[11px] text-sky-100 flex items-center gap-1 truncate">
              <span className="material-symbols-outlined notranslate text-[13px]">meeting_room</span>
              Ruang Lab Komputer 2 (Gd. Barat)
            </span>
          </div>
        </div>
      </div>

      {/* Floating Search & Filter Bar */}
      <div className="px-4 -mt-4 relative z-20">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined notranslate text-slate-400 pl-2 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mata pelajaran / guru..."
            className="flex-1 h-9 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={() => setSearchQuery('')}
            className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary"
            title="Filter"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Choose Day Segmented Pills */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800">Pilih Hari</span>
          <span className="text-[11px] text-primary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined notranslate text-[14px]">schedule</span>
            Waktu Indonesia Timur (WIT)
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SCHEDULE_DAYS.map((day) => {
            const isActive = selectedDay === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`py-2 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{day.label}</span>
                {day.isToday && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-sky-100 text-primary'
                    }`}
                  >
                    Hari Ini
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster Section Header */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-primary"></span>
          <h2 className="font-headline font-bold text-base text-slate-900 capitalize">
            Roster Hari {selectedDay}
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
          {currentSchedules.length} Sesi Pembelajaran
        </span>
      </div>

      {/* Schedule Timeline Feed */}
      <div className="px-4 mt-3 flex flex-col gap-3">
        {currentSchedules.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
            <span className="material-symbols-outlined notranslate text-[36px] text-slate-300">
              event_busy
            </span>
            <p className="text-xs font-semibold mt-2">Tidak ada jadwal yang cocok.</p>
          </div>
        ) : (
          currentSchedules.map((item) => {
            // Break Card
            if (item.isBreak) {
              return (
                <div
                  key={item.id}
                  className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 flex items-center justify-between text-amber-900"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined notranslate text-[20px] text-amber-600">
                      {item.startTime === '12.00' ? 'restaurant' : 'coffee'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {item.subject}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700">
                    {item.startTime} - {item.endTime} WIT ({item.breakDuration})
                  </span>
                </div>
              );
            }

            // Live Period Card
            if (item.status === 'live') {
              return (
                <div
                  key={item.id}
                  className="relative bg-white rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,95,160,0.12)] border border-sky-100 ring-2 ring-primary flex flex-col gap-2 overflow-hidden"
                >
                  <div className="w-2 absolute left-0 top-0 bottom-0 bg-primary animate-pulse"></div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      SEDANG BERLANGSUNG
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.period}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined notranslate text-[16px]">schedule</span>
                        {item.startTime} - {item.endTime} WIT
                      </span>
                      <h3 className="font-headline font-bold text-base text-slate-900 mt-0.5">
                        {item.subject}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[14px]">meeting_room</span>
                      {item.room}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-white font-bold text-[10px] flex items-center justify-center">
                      BS
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{item.teacher}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Berjalan {item.progressMinutes || 55} menit</span>
                      <span>Tersisa {item.remainingMinutes || 35} menit</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal or Finished Period Card
            const isCompleted = item.status === 'completed';
            const isLast = item.status === 'last_period';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-start justify-between gap-3 ${
                  isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="material-symbols-outlined notranslate text-[15px]">schedule</span>
                    <span className="font-semibold">
                      {item.startTime} - {item.endTime} WIT
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-sm text-slate-900 mt-1 truncate">
                    {item.subject}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.teacher}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-600'
                        : isLast
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isCompleted ? 'Selesai' : isLast ? 'Sesi Penutup' : 'Sesi Berikutnya'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-surface-container text-primary text-xs font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined notranslate text-[13px]">location_on</span>
                    {item.room}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Class Discipline Statistics Deck */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined notranslate text-[18px]">query_stats</span>
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  STATISTIK REKAPITULASI
                </span>
                <h3 className="font-headline font-bold text-sm text-slate-900">
                  Presensi Kelas {selectedClass}
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-primary text-xs font-bold">
              Mei 2024
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-surface-container-low border border-sky-100 flex flex-col">
              <span className="text-xs text-slate-500 font-semibold">Tingkat Hadir</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-primary">96.8%</span>
                <span className="text-xs font-bold text-emerald-600">↗ +1.2%</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1">Sangat Disiplin</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-sky-100 flex flex-col">
              <span className="text-xs text-slate-500 font-semibold">Siswa Bolos</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-slate-900">0</span>
                <span className="text-xs font-bold text-slate-500">Siswa</span>
              </div>
              <span className="text-[11px] text-amber-700 font-bold mt-1">
                Bebas Pelanggaran 🔥
              </span>
            </div>
          </div>

          {/* Target Progress Bar */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Target Kedisiplinan Sekolah</span>
              <span className="text-primary">Target: 95.0% (Tercapai)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '96.8%' }}></div>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">table_view</span>
            <span>Export Excel Jadwal &amp; Rekap (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Official Disclaimer Notice Box */}
      <div className="px-4 mt-3">
        <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-start gap-2.5 text-slate-700">
          <span className="material-symbols-outlined notranslate text-primary text-[20px] shrink-0 mt-0.5">
            info
          </span>
          <p className="text-xs leading-relaxed text-slate-600">
            Jadwal pelajaran dapat berubah sewaktu-waktu mengikuti agenda pengujian LSP P1 dan
            kegiatan dinas guru SMKN 1 Sorong.
          </p>
        </div>
      </div>

      {/* Class Switcher Modal */}
      {showClassPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-8 duration-200">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2"></div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Pilih Roster Kelas</h3>
              <button
                onClick={() => setShowClassPicker(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined notranslate text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              {availableClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls.id);
                    setShowClassPicker(false);
                    onShowToast('Kelas Dipilih', `Memuat jadwal untuk ${cls.name}`, 'info');
                  }}
                  className={`p-3 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedClass === cls.id
                      ? 'bg-sky-50 text-primary font-bold border border-sky-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{cls.name}</span>
                  {selectedClass === cls.id && (
                    <span className="material-symbols-outlined notranslate text-primary text-[18px]">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
