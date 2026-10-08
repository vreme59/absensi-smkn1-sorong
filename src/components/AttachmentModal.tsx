import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Upload, Save, UserCheck, Calendar, ShieldCheck } from 'lucide-react';
import { Student } from '../types/attendance';

interface Props {
  student: Student | null;
  mode: 'view' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (studentId: string, note: string, fileName?: string) => void;
}

export const AttachmentModal: React.FC<Props> = ({
  student,
  mode,
  isOpen,
  onClose,
  onSaveNote,
}) => {
  const [editedNote, setEditedNote] = useState(student?.note || '');
  const [fileName, setFileName] = useState(student?.attachment?.fileName || 'Surat_Keterangan.jpg');

  if (!isOpen || !student) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(student.id, editedNote, fileName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#005fa0] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              {student.absentNo ?? student.studentNo ?? '??'}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{student.name}</h3>
              <p className="text-xs text-sky-200">NISN: {student.nisn} • XI RPL 1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Status Chip */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">Status Terkini:</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                student.status === 'S'
                  ? 'bg-[#bb5800]/15 text-[#bb5800]'
                  : student.status === 'I'
                  ? 'bg-[#0078c8]/15 text-[#0078c8]'
                  : student.status === 'B'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {student.status === 'S'
                ? '🩺 Sakit'
                : student.status === 'I'
                ? '📋 Izin'
                : student.status === 'B'
                ? '🏃 Bolos'
                : '✓ Hadir'}
            </span>
          </div>

          {/* Document Preview Card */}
          <div className="border border-sky-100 bg-sky-50/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <div className="flex items-center gap-2 text-[#005fa0]">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  {student.attachment?.title || 'Dokumen Keterangan Resmi'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Terverifikasi
              </span>
            </div>

            {/* Simulated Medical Document / Certificate */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal: {student.attachment?.date || '14 Mei 2024'}
                </span>
                <span className="font-mono text-slate-600">
                  {student.attachment?.fileName || fileName}
                </span>
              </div>

              {student.attachment?.source && (
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Penerbit: </span>
                  {student.attachment.source}
                </div>
              )}

              {student.attachment?.verifiedBy && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Divalidasi oleh: <strong>{student.attachment.verifiedBy}</strong></span>
                </div>
              )}

              {/* Note body */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-800 italic">
                "{student.note || student.attachment?.title || 'Surat keterangan sakit dari pihak keluarga / dokter.'}"
              </div>
            </div>
          </div>

          {/* Edit Note Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan Khusus & Catatan Wali Kelas:
              </label>
              <textarea
                value={editedNote}
                onChange={e => setEditedNote(e.target.value)}
                rows={3}
                placeholder="Tuliskan alasan atau keterangan lengkap..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0078c8] focus:border-transparent text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ganti Nama Lampiran / Unggah Baru:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0078c8] text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => alert('Simulasi: File lampiran baru berhasil dipilih.')}
                  className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#005fa0] hover:bg-[#004e84] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Keterangan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
