import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus } from '../types/attendance';
import { StudentCard } from './StudentCard';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';

interface Props {
  readOnly?: boolean;
  students: Student[];
  onUpdateStudentStatus: (studentId: string, status: AttendanceStatus) => void;

  onOpenSubmitModal: () => void;
  onSaveOfflineDraft: () => void;
  onViewAttachment: (student: Student) => void;
  onEditNote: (student: Student) => void;
  isDraftSavedOffline: boolean;
  onNavigateHome: () => void;
  containerWidthClass?: string;
}

export const AttendanceScreen: React.FC<Props> = ({
  readOnly = false,
  students,
  onUpdateStudentStatus,

  onOpenSubmitModal,
  onSaveOfflineDraft,
  onViewAttachment,
  onEditNote,
  isDraftSavedOffline,
  onNavigateHome,
  containerWidthClass = 'max-w-md sm:max-w-lg md:max-w-xl',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'need-action' | 'bolos' | 'alfa'>('all');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Realtime counters
  const counts = useMemo(() => {
    return students.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      },
      { H: 0, S: 0, I: 0, B: 0, A: 0 } as Record<AttendanceStatus, number>
    );
  }, [students]);

  const needActionCount = counts.S + counts.I + counts.B + counts.A;

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.absentNo.includes(query) ||
        student.nisn.includes(query);

      if (!matchSearch) return false;

      // Filter category
      if (activeFilter === 'need-action') {
        return student.status === 'S' || student.status === 'I' || student.status === 'B' || student.status === 'A';
      }
      if (activeFilter === 'bolos') {
        return student.status === 'B';
      }
      if (activeFilter === 'alfa') {
        return student.status === 'A';
      }
      return true;
    });
  }, [students, searchQuery, activeFilter]);

  return (
    <div className={`flex flex-col w-full ${isDockCollapsed ? 'pb-32' : 'pb-72'}`}>
      {/* Blue Hero Subheader */}
      <div className="bg-[#005fa0] text-white px-4 pt-3 pb-5 flex flex-col gap-2 shadow-[0_8px_20px_rgba(0,95,160,0.12)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <span className="font-heading text-lg font-bold text-white leading-tight block">
                Input Absen
              </span>
            </div>
          </div>

          {/* Active Ping Pill */}
          <div className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#d2e4ff] animate-ping"></span>
            <span className="text-[11px] font-bold text-white">XII TKJ 1 (34)</span>
          </div>
        </div>

        {/* Schedule & Deadline strip */}
        <div className="flex items-center justify-between bg-[#0078c8]/30 px-3 py-1.5 rounded-xl mt-1 border border-sky-400/20">
          <div className="flex items-center gap-1.5 text-[#d1e4ff]">
            <span className="material-symbols-outlined notranslate text-[16px]">event_available</span>
            <span className="text-xs font-semibold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1 text-[#ffdbc8] text-[11px] font-bold bg-[#bb5800]/30 px-2 py-0.5 rounded-full border border-amber-500/20">
            <span className="material-symbols-outlined notranslate text-[13px]">alarm</span>
            <span>Batas 07.45 WIT</span>
          </div>
        </div>
      </div>

      {/* Floating Card: Rekap Data Real-Time */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-3.5 shadow-[0_8px_24px_rgba(0,95,160,0.08)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-[18px] text-[#005fa0]">analytics</span>
              <span className="text-sm font-bold text-[#0b1c30]">Rekap Data Real-Time</span>
            </div>
          </div>

          {/* 5-Column Counters */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {/* Hadir */}
            <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center">
              <span className="text-[#404752] text-[11px] font-semibold">Hadir</span>
              <span className="font-heading text-lg text-[#005fa0] font-bold mt-0.5" id="counter-hadir">
                {counts.H}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#005fa0] mt-1"></span>
            </div>

            {/* Sakit */}
            <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center">
              <span className="text-[#404752] text-[11px] font-semibold">Sakit</span>
              <span className="font-heading text-lg text-[#954500] font-bold mt-0.5" id="counter-sakit">
                {counts.S}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#954500] mt-1"></span>
            </div>

            {/* Izin */}
            <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center">
              <span className="text-[#404752] text-[11px] font-semibold">Izin</span>
              <span className="font-heading text-lg text-[#0461a6] font-bold mt-0.5" id="counter-izin">
                {counts.I}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0461a6] mt-1"></span>
            </div>

            {/* Bolos */}
            <div className="bg-red-50 rounded-xl p-2 flex flex-col items-center border border-red-200/60">
              <span className="text-red-700 font-bold text-[11px]">Bolos</span>
              <span className="font-heading text-lg text-red-600 font-bold mt-0.5" id="counter-bolos">
                {counts.B}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1"></span>
            </div>

            {/* Alfa */}
            <div className="bg-[#eff4ff] rounded-xl p-2 flex flex-col items-center">
              <span className="text-[#404752] text-[11px] font-semibold">Alfa</span>
              <span className="font-heading text-lg text-[#ba1a1a] font-bold mt-0.5" id="counter-alfa">
                {counts.A}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-1"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-4 mt-3 flex flex-col gap-2.5">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#404752]">
            <span className="material-symbols-outlined notranslate text-[18px]">search</span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#eff4ff] text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#707883] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0078c8] border border-transparent focus:border-transparent transition-all"
            id="search-input"
            placeholder="Cari nama atau no. absen siswa..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#005fa0] text-white shadow-sm'
                : 'bg-[#e5eeff] text-[#404752] hover:bg-[#dce9ff]'
            }`}
            type="button"
          >
            Semua ({students.length})
          </button>

          <button
            onClick={() => setActiveFilter('need-action')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              activeFilter === 'need-action'
                ? 'bg-[#005fa0] text-white shadow-sm'
                : 'bg-[#e5eeff] text-[#404752] hover:bg-[#dce9ff]'
            }`}
            type="button"
          >
            Perlu Tindakan ({needActionCount})
          </button>

          <button
            onClick={() => setActiveFilter('bolos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeFilter === 'bolos'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            type="button"
          >
            Bolos ({counts.B})
          </button>

          <button
            onClick={() => setActiveFilter('alfa')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              activeFilter === 'alfa'
                ? 'bg-[#ba1a1a] text-white shadow-sm'
                : 'bg-[#e5eeff] text-[#404752] hover:bg-[#dce9ff]'
            }`}
            type="button"
          >
            Alfa ({counts.A})
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="px-4 mt-3 flex flex-col gap-2.5" id="student-list-container">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 my-4 shadow-sm">
            <span className="material-symbols-outlined notranslate text-[32px] text-slate-400 mb-1">
              search_off
            </span>
            <p className="text-sm font-bold text-slate-700">Tidak ada siswa ditemukan</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Coba gunakan kata kunci lain atau ubah filter status
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <StudentCard readOnly={readOnly} key={student.id}
              student={student}
              onStatusChange={(status) => onUpdateStudentStatus(student.id, status)}
              onViewAttachment={() => onViewAttachment(student)}
              onEditNote={() => onEditNote(student)}
            />
          ))
        )}
      </div>

      {!readOnly && (
      <>
      {/* Sticky Bottom Bar - Perfectly aligned to containerWidthClass */}
      <div
        className={`fixed bottom-16 left-1/2 -translate-x-1/2 w-full ${containerWidthClass} z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-[0_-8px_24px_rgba(0,95,160,0.12)] flex flex-col gap-2 border-t border-slate-200/90 transition-all`}
      >
        {/* Toggle Collapse Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-1.5 text-[#404752] px-1 flex-1 min-w-0">
            <span className="material-symbols-outlined notranslate text-[16px] text-[#005fa0] shrink-0 mt-0.5">
              info
            </span>
            <span className="text-[11px] leading-tight text-[#404752] truncate">
              Draft validasi Lapis 2:{' '}
              <strong className="text-[#0b1c30]">Budi Santoso, S.Kom.</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#005fa0] hover:text-[#004e84] bg-sky-50 px-2 py-0.5 rounded-md cursor-pointer shrink-0 transition-colors ml-2"
            title={isDockCollapsed ? 'Tampilkan Tombol Kirim' : 'Sembunyikan'}
          >
            <span>{isDockCollapsed ? 'Buka Panel' : 'Perkecil'}</span>
            {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Action Buttons */}
        {!isDockCollapsed && (
          <div className="flex flex-col gap-1.5 animate-in fade-in duration-150">
            <button
              onClick={onOpenSubmitModal}
              className="w-full h-11 sm:h-12 bg-[#005fa0] hover:bg-[#0078c8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_16px_rgba(0,95,160,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
              id="btn-submit"
              type="button"
            >
              <span>Simpan &amp; Kirim Draft Absen</span>
              <span className="material-symbols-outlined notranslate text-[18px]">rocket_launch</span>
            </button>

            <button
              onClick={onSaveOfflineDraft}
              className="w-full h-8 sm:h-9 bg-transparent hover:bg-[#eff4ff] text-[#005fa0] font-semibold text-xs rounded-lg flex items-center justify-center gap-1 active:bg-[#e5eeff] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined notranslate text-[15px]">save</span>
              <span>
                {isDraftSavedOffline ? '✓ Tersimpan di Perangkat (Offline)' : 'Simpan Sementara (Draft Offline)'}
              </span>
            </button>
          </div>
        )}

        {/* Quick Send button if collapsed */}
        {isDockCollapsed && (
          <button
            onClick={onOpenSubmitModal}
            className="w-full h-9 bg-[#005fa0] hover:bg-[#0078c8] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span>Kirim Draft Absen</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      </>
      )}
    </div>
  );
};
