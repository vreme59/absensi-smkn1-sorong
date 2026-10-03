import React, { useState } from 'react';
import { UserProfile } from '../types_samakan';
import { SCHEDULE_DAYS, SCHEDULES_BY_DAY } from '../data/samakan/scheduleData';
import { ScheduleItem } from '../types_samakan';

interface JadwalScreenProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const JadwalScreen: React.FC<JadwalScreenProps> = ({ onShowToast, user }) => {
  const [selectedDay, setSelectedDay] = useState('selasa');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('XII TKJ 1');
  const [showClassPicker, setShowClassPicker] = useState(false);

  const availableClasses = [
    { id: 'XII TKJ 1', name: 'XII TKJ 1 (Teknik Komputer Jaringan 1)' },
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
      'Export Berhasil! ðŸ“Š',
      `File Jadwal_Roster_${selectedClass.replace(/\s+/g, '_')}_Semester_Genap.xlsx berhasil diunduh.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* Ocean Top Header Area */}
      <div className="bg-primary pt-3 pb-8 px-4 text-white relative">
        <div className="flex items-center justify-end mb-2">
          <span className="text-xs text-primary-fixed flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            T.A. 2025/2026 Genap
          </span>
        </div>

        {/* Class Title */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-[11px] text-primary-fixed font-bold uppercase tracking-wider block">
              Jadwal Pelajaran
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <h1 className="font-headline font-bold text-2xl text-white tracking-tight">
                {selectedClass}
              </h1>
            </div>
            <p className="text-xs text-primary-fixed">
              {selectedClass === 'XII TKJ 1'
                ? 'Teknik Komputer Jaringan 1'
                : 'Program Keahlian Informatika'}
            </p>
          </div>
        </div>

        {/* Wali Kelas Card */}
        <div className="mt-4 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white">Wali Kelas: Dinaria Purba, A.Md, S.Pd</span>
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
      <div className="px-4 mt-6 flex flex-col gap-3 relative z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1 -mx-1">
          {SCHEDULE_DAYS.map((day, index) => {
            const isActive = selectedDay === day.id;
            // Generate dummy dates (21 to 26) based on index for the mockup
            const dateNum = 21 + index;
            const shortDay = day.name.substring(0, 3);
            
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`min-w-[64px] h-[80px] flex flex-col items-center justify-center rounded-2xl transition-all shadow-sm ${
                  isActive
                    ? 'bg-primary text-white border-none shadow-[0_8px_16px_rgba(0,95,160,0.2)]'
                    : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[11px] font-semibold mb-1 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                  {shortDay}
                </span>
                <span className={`text-xl font-headline font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {dateNum}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Pill */}
      <div className="px-4 mt-2 mb-6">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl py-2.5 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <span className="material-symbols-outlined notranslate text-[16px] text-primary">menu_book</span>
            <span>{currentSchedules.filter(i => !i.isBreak).length} Mata Pelajaran</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="material-symbols-outlined notranslate text-[16px]">schedule</span>
            <span>07:00 - 14:15 WIB</span>
          </div>
        </div>
      </div>

      {/* Schedule Timeline Feed */}
      <div className="px-4 mt-3 pb-8 relative">
        {currentSchedules.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
            <span className="material-symbols-outlined notranslate text-[36px] text-slate-300">
              event_busy
            </span>
            <p className="text-xs font-semibold mt-2">Tidak ada jadwal yang cocok.</p>
          </div>
        ) : (
          <>
            {/* The continuous vertical line that connects all items */}
            <div className="absolute top-2 bottom-8 left-[27px] w-0.5 bg-slate-200/80 z-0"></div>

            <div className="flex flex-col gap-1 relative z-10">
              {currentSchedules.map((course, index) => {
                // Since SubjectSchedule only has `time: string`, we split it.
                const [startTime = '', endTime = ''] = course.time ? course.time.split(' - ') : [];
                
                // --- REAL-TIME LOGIC ---
                const getRealTimeData = () => {
                  const daysOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
                  const now = (window as any).DEBUG_TIME || new Date();
                  
                  const debugDayIndex = (window as any).DEBUG_DAY_INDEX;
                  let currentDayIndex = debugDayIndex !== undefined ? debugDayIndex : (now.getDay() - 1);
                  if (currentDayIndex < 0 && debugDayIndex === undefined) currentDayIndex = 6; // Sun = 6
                  
                  const currentDayId = daysOrder[currentDayIndex] || 'minggu';
                  const selectedDayIdx = daysOrder.indexOf(selectedDay);
                  const todayIdx = daysOrder.indexOf(currentDayId);

                  if (selectedDayIdx < todayIdx) return { status: 'completed', progress: 100, remaining: 0 };
                  if (selectedDayIdx > todayIdx) return { status: 'upcoming', progress: 0, remaining: 0 };

                  // It is today! Check the hours.
                  const parseToMinutes = (t: string) => {
                    // time is like '08.15' or '14.45'
                    const [h, m] = t.split('.').map(Number);
                    return (h || 0) * 60 + (m || 0);
                  };
                  
                  const startMins = parseToMinutes(startTime);
                  const endMins = parseToMinutes(endTime);
                  const nowMins = now.getHours() * 60 + now.getMinutes();

                  if (nowMins > endMins) return { status: 'completed', progress: 100, remaining: 0 };
                  if (nowMins >= startMins && nowMins <= endMins) {
                    const total = endMins - startMins;
                    const elapsed = nowMins - startMins;
                    return { 
                      status: 'live', 
                      progress: Math.round((elapsed / total) * 100), 
                      remaining: total - elapsed 
                    };
                  }
                  return { status: 'upcoming', progress: 0, remaining: 0 };
                };

                const realTimeData = getRealTimeData();
                const isCompleted = realTimeData.status === 'completed';
                const isLive = realTimeData.status === 'live';
                
                // Mock a room since scheduleData doesn't have it
                const roomName = course.type === 'productive' ? 'Lab Komputer (Gd. B)' : 'Ruang Kelas XII TKJ 1';

                // Break item mockup (we can inject a break if it's index 1)
                // For now we'll just render the course as live or completed.

                // In-Progress Card
                if (isLive) {
                  return (
                    <div key={course.id} className="relative flex items-start gap-3.5 pl-0.5 mb-2">
                      {/* Glowing Orange Node */}
                      <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-3">
                        <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-md ring-4 ring-orange-200/80 animate-pulse"></div>
                      </div>

                      {/* Active Course Card */}
                      <div className="flex-1 w-full bg-primary rounded-3xl p-5 text-white shadow-xl shadow-primary/25 border border-primary/20 relative overflow-hidden transition-all duration-200 hover:shadow-2xl">
                        {/* Decorative ambient background accents */}
                        <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Top row */}
                        <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
                          <span className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            SEDANG BERLANGSUNG
                          </span>
                          <span className="text-[11px] font-semibold text-blue-100 bg-white/10 px-3 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                            Tersisa {realTimeData.remaining} Menit
                          </span>
                        </div>

                        {/* Time Slot */}
                        <div className="flex items-center gap-1.5 text-blue-100 text-[12px] font-semibold mb-2 relative z-10">
                          <span className="material-symbols-outlined notranslate text-[14px]">schedule</span>
                          <span>{startTime} - {endTime} WIB</span>
                        </div>

                        {/* Main Subject Title */}
                        <h3 className="text-xl font-headline font-extrabold leading-snug tracking-tight text-white mb-3 relative z-10">
                          {course.subject}
                        </h3>

                        {/* Teacher & Room metadata */}
                        <div className="space-y-1.5 mb-4 text-xs font-medium text-blue-100 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined notranslate text-[16px] text-blue-200">person</span>
                            <span className="truncate">{course.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined notranslate text-[16px] text-blue-200">domain</span>
                            <span className="truncate">{roomName}</span>
                          </div>
                        </div>

                        {/* Progress Bar Section */}
                        <div className="bg-black/20 rounded-2xl p-3 border border-white/10 mb-4 backdrop-blur-sm relative z-10">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-100 mb-1.5">
                            <span>Mulai: {startTime}</span>
                            <span className="text-orange-400 font-bold">{realTimeData.progress}% Berjalan</span>
                            <span>Selesai: {endTime}</span>
                          </div>
                          <div className="w-full h-2 bg-blue-950/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${realTimeData.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2.5 relative z-10">
                          <button className="w-full py-2.5 px-3 bg-white text-primary hover:bg-slate-50 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all">
                            <span className="material-symbols-outlined notranslate text-[16px]">menu_book</span>
                            <span>Lihat Materi</span>
                          </button>
                          <button className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all backdrop-blur-sm">
                            <span className="material-symbols-outlined notranslate text-[16px]">link</span>
                            <span>Modul</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Completed Card
                if (isCompleted) {
                  return (
                    <div key={course.id} className="relative flex items-start gap-3.5 pl-0.5 mb-2">
                      {/* Completed Green Check Node */}
                      <div className="relative z-10 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shrink-0 mt-3 shadow-sm">
                        <span className="material-symbols-outlined notranslate text-[14px] font-bold stroke-[3]">check</span>
                      </div>

                      {/* Completed Course Card */}
                      <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow transition-all cursor-pointer group">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="inline-flex items-center gap-1.5 bg-slate-100/90 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined notranslate text-[14px] text-slate-400">update</span>
                            <span>{startTime} - {endTime} WIB</span>
                          </div>
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            <span className="material-symbols-outlined notranslate text-[12px] font-bold">check</span>
                            <span>Selesai</span>
                          </span>
                        </div>

                        <h3 className="text-[15px] font-bold font-headline text-slate-800 leading-snug group-hover:text-primary transition-colors mb-2.5">
                          {course.subject}
                        </h3>

                        <div className="space-y-1 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined notranslate text-[16px] text-slate-400 shrink-0">person</span>
                            <span className="truncate">{course.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined notranslate text-[16px] text-slate-400 shrink-0">domain</span>
                            <span className="truncate">{roomName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Upcoming Course Card
                return (
                  <div key={course.id} className="relative flex items-start gap-3.5 pl-0.5 mb-2">
                    {/* Slate Node */}
                    <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-500 border-2 border-white shadow-sm"></div>
                    </div>

                    {/* Upcoming Course Card */}
                    <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow transition-all cursor-pointer group">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50/80 text-primary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          <span className="material-symbols-outlined notranslate text-[14px] text-primary">schedule</span>
                          <span>{startTime} - {endTime} WIB</span>
                        </div>

                        <span className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                          <span className="material-symbols-outlined notranslate text-[12px]">hourglass_empty</span>
                          <span>Belum Mulai</span>
                        </span>
                      </div>

                      <h3 className="text-[15px] font-bold font-headline text-slate-800 leading-snug group-hover:text-primary transition-colors mb-2.5">
                        {course.subject}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined notranslate text-[16px] text-slate-400 shrink-0">person</span>
                          <span className="truncate">{course.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined notranslate text-[16px] text-slate-400 shrink-0">domain</span>
                          <span className="truncate">{roomName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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

