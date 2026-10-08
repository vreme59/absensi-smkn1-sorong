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
            {student.absentNo ?? student.studentNo ?? '??'}
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

      {/* Warning alert if bolos */}
      {(student.status === 'B' || student.warningAlert) && (
        <div className="flex items-start gap-1.5 bg-red-50 border border-red-200/80 px-2.5 py-2 rounded-xl text-red-900">
          <span className="material-symbols-outlined notranslate text-[17px] text-red-600 shrink-0 mt-0.5">
            warning
          </span>
          <p className="text-xs leading-snug">
            <span className="font-bold text-red-700">Terdeteksi Bolos:</span>{' '}
            {(student.warningAlert || 'Siswa tidak berada di dalam kelas pada jam aktif.').replace('Terdeteksi Bolos: ', '')}
          </p>
        </div>
      )}

      {/* Dynamic Note & Attachment Box */}
      {(student.note || student.attachment) ? (
        <div className="bg-[#eff6ff] border border-blue-100 p-2.5 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#0b1c30]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined notranslate text-[16px] text-primary">
                {student.attachment ? 'attach_file' : 'edit_note'}
              </span>
              <span className="text-[11px] font-bold text-slate-800 truncate">
                {student.attachment?.title || 'Keterangan Presensi'}
              </span>
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={onEditNote}
                className="text-[11px] text-primary font-bold hover:underline cursor-pointer shrink-0 ml-2"
              >
                Ubah
              </button>
            )}
          </div>

          {student.note && (
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{student.note}"
            </p>
          )}

          {student.attachment && (
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onViewAttachment}
                className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-800 text-[11px] font-semibold hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[14px] text-primary">
                  image
                </span>
                <span className="truncate max-w-[140px]">{student.attachment?.fileName || 'Lihat Surat'}</span>
              </button>

              {student.attachment.verifiedBy && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {student.attachment.verifiedBy}
                </span>
              )}
            </div>
          )}
        </div>
      ) : !readOnly && (student.status === 'S' || student.status === 'I' || student.status === 'B' || student.status === 'A') ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEditNote}
            className="text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline cursor-pointer py-0.5"
          >
            <span className="material-symbols-outlined notranslate text-[14px]">add_circle</span>
            <span>Tambah Catatan / Lampiran</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
