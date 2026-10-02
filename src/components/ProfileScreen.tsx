import React from 'react';
import {
  User,
  ShieldCheck,
  School,
  Award,
  Layers,
  FileCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface Props {
  onOpenReactNativeCode: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onOpenReactNativeCode }) => {
  return (
    <div className="flex flex-col w-full pb-28">
      {/* Header Profile */}
      <div className="bg-[#005fa0] text-white px-4 pt-6 pb-8 text-center shadow-md">
        <div className="relative inline-block mx-auto mb-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYnt2a-k9qr2VrGiR_aaNyxA0kr0zTUoyDij-XJB6qo6dMjg8FwbnhLqNO9exCCHBmngm533nSRqYmZP6JCfHuekrOs7MIEzSxrxLB3Y9p7b6kz_vmOcu2eVdHJ6K2OBzJzjnQsNXJJ0L4yaOC2pFWOq5kT9LmUjuf-Ic0KY7KPRI5lxlTQxwOck9ly6Z0aUijW0_dwOqKrQ8upujFgHbM-wse0kY5Sq_d0DVyjWeOjp5SyzN_Htoh"
            alt="M. Farhan Profile"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30 shadow-lg mx-auto"
          />
          <span className="absolute bottom-0 right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </span>
        </div>
        <h2 className="text-lg font-bold font-heading">M. Farhan</h2>
        <p className="text-xs text-sky-200">Sekretaris Kelas XI RPL 1</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
            NISN: 0058291062
          </span>
          <span className="text-[11px] font-semibold bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Terverifikasi Siswa
          </span>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Verification Layers Explanation Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-[#005fa0]">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">
              Mekanisme Verifikasi 3 Lapis Presensi
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Untuk memastikan akurasi dan integritas data kehadiran, SMKN 1 Sorong menerapkan sistem verifikasi berlapis:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-100">
              <span className="w-6 h-6 rounded-full bg-[#005fa0] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Lapis 1: Sekretaris Kelas (M. Farhan)
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Mencatat kehadiran fisik awal pada pukul 07.00 - 07.45 WIT dan mengirimkan draft.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Lapis 2: Guru Jam Pertama (Budi Santoso, S.Kom.)
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Mengecek keabsahan draft saat membuka pelajaran dan memverifikasi ketidakhadiran/bolos.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Lapis 3: Wali Kelas &amp; Waka Kesiswaan
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Mengesahkan surat dokter resmi, dispensasi dinas, dan penanganan siswa bermasalah.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Institution Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-800">
            <School className="w-5 h-5 text-[#005fa0]" />
            <h3 className="font-bold text-sm">Informasi Satuan Pendidikan</h3>
          </div>
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Sekolah:</span>
              <span className="font-bold text-slate-800">SMK Negeri 1 Sorong</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>NPSN:</span>
              <span className="font-mono text-slate-800">60400262</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Jurusan:</span>
              <span className="font-semibold text-slate-800">Rekayasa Perangkat Lunak (RPL)</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Wali Kelas XI RPL 1:</span>
              <span className="font-semibold text-slate-800">Dra. Hj. Maryam, M.Pd.</span>
            </div>
          </div>
        </div>

        {/* React Native Code Card */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold flex items-center gap-1.5 text-sky-300">
              <Smartphone className="w-4 h-4" /> Kerangka Dasar React Native
            </span>
            <p className="text-[11px] text-slate-200 mt-1 max-w-[240px]">
              Dapatkan source code Expo/React Native dengan komponen responsif siap pakai.
            </p>
          </div>
          <button
            onClick={onOpenReactNativeCode}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer shrink-0"
          >
            Buka Kode
          </button>
        </div>
      </div>
    </div>
  );
};
