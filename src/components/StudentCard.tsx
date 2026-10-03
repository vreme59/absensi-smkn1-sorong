import React from 'react';
import {
  CheckCircle,
  Stethoscope,
  FileCheck,
  AlertTriangle,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import { AttendanceStatus, Student } from '../types/attendance';

interface Props {
  readOnly?: boolean;
  student: Student;
  onStatusChange: (status: AttendanceStatus) => void;
  onViewAttachment: () => void;
  onEditNote: () => void;
}

export const StudentCard: React.FC<Props> = ({
  readOnly = false,
  student,
  onStatusChange,
  onViewAttachment,
  onEditNote,
}) => {
  // Dynamic color for avatar number circle
  const getAvatarStyle = () => {
    switch (student.status) {
      case 'H':
        return 'bg-[#dce9ff] text-[#005fa0]';
      case 'S':
        return 'bg-[#ffdbc8] text-[#753400]';
      case 'I':
        return 'bg-[#d2e4ff] text-[#00497f]';
      case 'B':
        return 'bg-red-100 text-red-700';
      case 'A':
        return 'bg-[#ffdad6] text-[#ba1a1a]';
      default:
        return 'bg-[#eff4ff] text-[#005fa0]';
    }
  };

  // Status Badge Component
  const renderStatusBadge = () => {
    switch (student.status) {
      case 'H':
        return (
          <span className="text-[11px] font-semibold bg-[#0078c8]/15 text-[#005fa0] px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[13px]">check_circle</span>
            <span>Hadir</span>
          </span>
        );
      case 'S':
        return (
          <span className="text-[11px] font-semibold bg-[#bb5800] text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined notranslate text-[13px]">sick</span>
            <span>Sakit</span>
          </span>
        );
      case 'I':
        return (
          <span className="text-[11px] font-semibold bg-[#74b4ff] text-[#004579] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined notranslate text-[13px]">assignment_turned_in</span>
            <span>Izin</span>
          </span>
        );
      case 'B':
        return (
          <span className="text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[13px]">directions_run</span>
            <span>Bolos</span>
          </span>
        );
      case 'A':
        return (
          <span className="text-[11px] font-bold bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="material-symbols-outlined notranslate text-[13px]">cancel</span>
            <span>Alfa</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,95,160,0.04)] flex flex-col gap-2.5 transition-all border ${
        student.status === 'B'
          ? 'border-red-200 shadow-[0_4px_16px_rgba(186,26,26,0.12)]'
          : student.badge === 'Baru Diubah'
          ? 'border-amber-200/80'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {/* Top Header of Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-full font-bold flex items-center justify-center font-heading text-lg shrink-0 ${getAvatarStyle()}`}
          >
            {student.absentNo}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#0b1c30] truncate">
                {student.name}
              </span>
              {student.badge === 'Sekretaris' && (
                <span className="bg-[#005fa0]/10 text-[#005fa0] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Sekretaris
                </span>
              )}
              {student.badge === 'Ketua Kelas' && (
                <span className="bg-[#bb5800]/10 text-[#bb5800] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Ketua Kelas
                </span>
              )}
              {student.badge === 'Perlu Tindak' && (
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Perlu Tindak
                </span>
              )}
              {student.badge === 'Baru Diubah' && (
                <span className="bg-[#ffdbc8] text-[#753400] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Baru Diubah
                </span>
              )}
            </div>
            <span className="text-xs text-[#404752]">NISN: {student.nisn}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="shrink-0">{renderStatusBadge()}</div>
      </div>

      {/* 5-Button Status Switcher: [H] [S] [I] [B] [A] */}
      {!readOnly && (
        <div className="grid grid-cols-5 gap-1.5 bg-[#eff4ff] p-1 rounded-xl">
          {(['H', 'S', 'I', 'B', 'A'] as AttendanceStatus[]).map((val) => {
            const isSelected = student.status === val;

            let selectedStyle = 'bg-[#005fa0] text-white shadow-sm font-bold';
            if (val === 'S') selectedStyle = 'bg-[#bb5800] text-white shadow-sm font-bold';
            if (val === 'I') selectedStyle = 'bg-[#0461a6] text-white shadow-sm font-bold';
            if (val === 'B') selectedStyle = 'bg-red-600 text-white shadow-sm font-bold';
            if (val === 'A') selectedStyle = 'bg-[#ba1a1a] text-white shadow-sm font-bold';

            return (
              <button
                key={val}
                type="button"
                disabled={readOnly}
                onClick={() => onStatusChange(val)}
                className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? selectedStyle
                    : val === 'B'
                    ? 'text-red-600 hover:bg-[#e0ecff]'
                    : 'text-[#404752] hover:bg-[#e0ecff]'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      )}

      {/* Case 1: Doctor note attachment strip (Ahmad Dani) */}
      {student.id === '02' && student.attachment && (
        <div className="flex items-center justify-between bg-[#dce9ff]/60 px-2.5 py-1.5 rounded-lg text-[#0b1c30]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="material-symbols-outlined notranslate text-[15px] text-[#bb5800]">
              attach_file
            </span>
            <span className="text-xs font-medium truncate">{student.attachment.title}</span>
          </div>
          <button
            onClick={onViewAttachment}
            className="text-[#005fa0] text-xs font-semibold shrink-0 underline ml-2 hover:text-[#004e84] cursor-pointer"
            type="button"
          >
            Lihat
          </button>
        </div>
      )}

      {/* Case 2: Dispensation note strip (Cindy Laura) */}
      {student.id === '04' && student.attachment && (
        <div className="flex items-center justify-between bg-[#dce9ff]/60 px-2.5 py-1.5 rounded-lg text-[#0b1c30]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="material-symbols-outlined notranslate text-[15px] text-[#0461a6]">
              verified
            </span>
            <span className="text-xs font-medium truncate">{student.attachment.title}</span>
          </div>
          <span className="text-xs font-bold text-[#0461a6] shrink-0">
            {student.attachment.verifiedBy || 'Waka Kesiswaan'}
          </span>
        </div>
      )}

      {/* Case 3: Bolos warning alert (Doni Tata) */}
      {student.status === 'B' && student.warningAlert && (
        <div className="flex items-start gap-1.5 bg-red-50 border border-red-200/80 px-2.5 py-2 rounded-xl text-red-900">
          <span className="material-symbols-outlined notranslate text-[17px] text-red-600 shrink-0 mt-0.5">
            warning
          </span>
          <p className="text-xs leading-snug">
            <span className="font-bold text-red-700">Terdeteksi Bolos:</span>{' '}
            {student.warningAlert.replace('Terdeteksi Bolos: ', '')}
          </p>
        </div>
      )}

      {/* Case 4: Keterangan Khusus & Lampiran box (Kevin Pratama) */}
      {student.id === '07' && (
        <div className="bg-[#dce9ff] p-2.5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-[#0b1c30]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-[16px] text-[#bb5800]">
                edit_note
              </span>
              <span className="text-xs font-bold">Keterangan Khusus &amp; Lampiran</span>
            </div>
            <button
              disabled={readOnly} onClick={onEditNote}
              className="text-xs text-[#005fa0] font-semibold hover:underline cursor-pointer"
              type="button"
            >
              Ubah
            </button>
          </div>
          <p className="text-xs text-[#404752] italic">
            "{student.note || 'Sakit demam sejak semalam, surat dokter menyusul via WA Wali Kelas.'}"
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewAttachment}
              className="flex items-center gap-1 bg-white px-2 py-1 rounded-md text-[#0b1c30] text-xs font-medium hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[14px] text-[#005fa0]">
                image
              </span>
              <span>{student.attachment?.fileName || 'Surat_Keterangan.jpg'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
