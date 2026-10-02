import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, ShieldAlert, X } from 'lucide-react';
import { Student } from '../types/attendance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onConfirmSuccess: () => void;
}

export const SubmitModal: React.FC<Props> = ({
  isOpen,
  onClose,
  students,
  onConfirmSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const counts = students.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    { H: 0, S: 0, I: 0, B: 0, A: 0 } as Record<string, number>
  );

  const bolosStudents = students.filter(s => s.status === 'B');

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#005fa0] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-200" />
            <h3 className="font-bold text-base">Verifikasi & Kirim Draft Presensi</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Draft Berhasil Terkirim!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Draft Presensi XI RPL 1 telah diteruskan ke portal Guru Jam 1 <strong>(Budi Santoso, S.Kom.)</strong> untuk validasi Lapis 2.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Recipient card */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0078c8] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                BS
              </div>
              <div className="text-xs">
                <span className="text-slate-500 block">Penerima Validasi Lapis 2:</span>
                <span className="font-bold text-slate-900 text-sm">Budi Santoso, S.Kom.</span>
                <span className="text-slate-600 block text-[11px]">Guru Jam Pertama • Pemodelan Perangkat Lunak</span>
              </div>
            </div>

            {/* Summary statistics */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Ringkasan Absensi Hari Ini:</span>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-sky-50 rounded-lg p-2 border border-sky-100">
                  <div className="text-[10px] text-slate-500 font-semibold">Hadir</div>
                  <div className="text-base font-bold text-[#005fa0]">{counts.H}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                  <div className="text-[10px] text-slate-500 font-semibold">Sakit</div>
                  <div className="text-base font-bold text-[#bb5800]">{counts.S}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                  <div className="text-[10px] text-slate-500 font-semibold">Izin</div>
                  <div className="text-base font-bold text-[#0461a6]">{counts.I}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                  <div className="text-[10px] text-red-600 font-bold">Bolos</div>
                  <div className="text-base font-bold text-red-600">{counts.B}</div>
                </div>
                <div className="bg-slate-100 rounded-lg p-2">
                  <div className="text-[10px] text-slate-500 font-semibold">Alfa</div>
                  <div className="text-base font-bold text-slate-700">{counts.A}</div>
                </div>
              </div>
            </div>

            {/* Bolos Warning */}
            {bolosStudents.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-800">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Peringatan Siswa Bolos Terdeteksi:</span>
                  <span>
                    {bolosStudents.map(b => `${b.name} (Absen ${b.absentNo})`).join(', ')}. Sistem akan secara otomatis meneruskan notifikasi khusus ke Guru BK dan Wali Kelas.
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Batas Pengiriman: 07.45 WIT
              </span>
              <span className="text-emerald-600 font-medium">✓ Sesuai Jadwal</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cek Ulang
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#005fa0] hover:bg-[#004e84] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Sekarang</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
