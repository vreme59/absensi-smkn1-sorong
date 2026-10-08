import React from 'react';
import { exportAttendanceToExcel, StudentRecapItem } from '../utils/exportAttendance';
import { SCHOOL_LOGO } from '../data/samakan/mockData';

interface CetakRekapModalProps {
  isOpen: boolean;
  onClose: () => void;
  kelasNama: string;
  mapelNama: string;
  guruNama: string;
  guruNip?: string;
  periodeLabel: string;
  students: StudentRecapItem[];
  avgRate: number;
}

export const CetakRekapModal: React.FC<CetakRekapModalProps> = ({
  isOpen,
  onClose,
  kelasNama,
  mapelNama,
  guruNama,
  guruNip = '-',
  periodeLabel,
  students,
  avgRate,
}) => {
  if (!isOpen) return null;

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalH = students.reduce((acc, s) => acc + s.hadir, 0);
  const totalT = students.reduce((acc, s) => acc + s.terlambat, 0);
  const totalS = students.reduce((acc, s) => acc + s.sakit, 0);
  const totalI = students.reduce((acc, s) => acc + s.izin, 0);
  const totalA = students.reduce((acc, s) => acc + s.alfa, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    exportAttendanceToExcel({
      kelasNama,
      mapelNama,
      guruNama,
      guruNip,
      periodeLabel,
      students,
      avgRate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full">
        {/* Action Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined notranslate text-emerald-400 text-2xl">
              print
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Pratinjau Cetak Rekapan Resmi Kemendikbud</h2>
              <p className="text-xs text-slate-300">
                Format A4 Siap Cetak &amp; Simpan PDF • {kelasNama} • {periodeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExcel}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined notranslate text-[16px]">table_chart</span>
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined notranslate text-[16px]">print</span>
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Paper Document Preview (Printed exactly as is) */}
        <div className="p-8 sm:p-12 overflow-x-auto text-slate-900 bg-white font-serif print:p-0 print:m-0">
          <div className="max-w-[760px] mx-auto bg-white">
            {/* Kop Surat Kemendikbud */}
            <div className="flex items-center justify-between pb-3 border-b-4 border-double border-slate-900 mb-6">
              <img
                src={SCHOOL_LOGO}
                alt="Logo SMKN 1 Sorong"
                className="w-20 h-20 object-contain shrink-0"
              />
              <div className="text-center flex-1 px-4">
                <h3 className="text-xs uppercase tracking-wider font-sans font-bold text-slate-700">
                  PEMERINTAH PROVINSI PAPUA BARAT DAYA
                </h3>
                <h2 className="text-sm uppercase tracking-wide font-sans font-bold text-slate-800">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h2>
                <h1 className="text-lg uppercase tracking-tight font-sans font-black text-slate-950">
                  SMK NEGERI 1 KOTA SORONG
                </h1>
                <p className="text-[11px] font-sans text-slate-600 leading-tight mt-0.5">
                  Jalan Basuki Rahmat No. 1, Remu Utara, Kec. Sorong, Kota Sorong, Papua Barat Daya 98412
                </p>
                <p className="text-[10px] font-sans text-slate-500">
                  Laman: www.smkn1sorong.sch.id | Pos-el: info@smkn1sorong.sch.id
                </p>
              </div>
              <div className="w-20 h-20 flex items-center justify-center border border-slate-300 rounded-lg text-[10px] font-sans text-slate-400 text-center p-1 shrink-0">
                KEMENDIKBUD RISTEK
              </div>
            </div>

            {/* Judul Dokumen */}
            <div className="text-center mb-5 font-sans">
              <h2 className="text-base font-bold uppercase tracking-wider underline text-slate-900">
                LAPORAN REKAPITULASI PRESENSI KEHADIRAN SISWA
              </h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                TAHUN PELAJARAN 2026/2027 • PERIODE: {periodeLabel.toUpperCase()}
              </p>
            </div>

            {/* Metadata Ringkas */}
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs font-sans mb-4 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Satuan Pendidikan</span>
                <span className="font-semibold text-slate-900">: SMK Negeri 1 Kota Sorong</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Guru Pengajar</span>
                <span className="font-semibold text-slate-900">: {guruNama}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Kelas / Fase</span>
                <span className="font-semibold text-slate-900">: {kelasNama}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">NIP Guru</span>
                <span className="font-semibold text-slate-900">: {guruNip}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Mata Pelajaran</span>
                <span className="font-semibold text-slate-900">: {mapelNama}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-700">Rata-rata Kehadiran</span>
                <span className="font-bold text-emerald-700">: {avgRate}% ({avgRate >= 85 ? 'Tinggi' : 'Cukup'})</span>
              </div>
            </div>

            {/* Tabel Rekapitulasi Kemendikbud */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse border border-slate-800 text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-800">
                    <th className="border border-slate-800 py-1.5 px-1 w-8">NO</th>
                    <th className="border border-slate-800 py-1.5 px-2 w-24">NISN</th>
                    <th className="border border-slate-800 py-1.5 px-3 text-left">NAMA LENGKAP SISWA</th>
                    <th className="border border-slate-800 py-1.5 px-1.5 w-10">H</th>
                    <th className="border border-slate-800 py-1.5 px-1.5 w-10">T</th>
                    <th className="border border-slate-800 py-1.5 px-1.5 w-10">S</th>
                    <th className="border border-slate-800 py-1.5 px-1.5 w-10">I</th>
                    <th className="border border-slate-800 py-1.5 px-1.5 w-10">A</th>
                    <th className="border border-slate-800 py-1.5 px-2 w-14">%</th>
                    <th className="border border-slate-800 py-1.5 px-2 w-28 text-center">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => {
                    return (
                      <tr
                        key={s.nisn + idx}
                        className={`hover:bg-slate-50 ${s.isBolosMapel ? 'bg-rose-50 font-semibold' : ''} ${s.alfa >= 3 ? 'bg-amber-50' : ''}`}
                      >
                        <td className="border border-slate-800 py-1 px-1 text-center">{s.no}</td>
                        <td className="border border-slate-800 py-1 px-2 text-center font-mono">{s.nisn}</td>
                        <td className="border border-slate-800 py-1 px-3 font-medium">
                          {s.nama}
                          {s.isBolosMapel && (
                            <span className="ml-1 text-[9px] text-rose-700 font-bold uppercase underline">
                              (BOLOS MAPEL)
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-800 py-1 px-1 text-center font-bold text-emerald-800">{s.hadir}</td>
                        <td className="border border-slate-800 py-1 px-1 text-center text-amber-800">{s.terlambat}</td>
                        <td className="border border-slate-800 py-1 px-1 text-center text-purple-800">{s.sakit}</td>
                        <td className="border border-slate-800 py-1 px-1 text-center text-sky-800">{s.izin}</td>
                        <td className="border border-slate-800 py-1 px-1 text-center font-bold text-rose-800">{s.alfa}</td>
                        <td className="border border-slate-800 py-1 px-2 text-center font-bold">
                          {s.rate}%
                        </td>
                        <td className="border border-slate-800 py-1 px-2 text-center text-[10px]">
                          {s.isBolosMapel
                            ? 'Peringatan Bolos'
                            : s.alfa >= 3
                            ? 'Panggilan Orang Tua'
                            : s.rate >= 90
                            ? 'Sangat Baik'
                            : s.rate >= 75
                            ? 'Baik'
                            : 'Kurang'}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr className="bg-slate-200/80 font-bold text-slate-950 border-t-2 border-slate-900">
                    <td colSpan={3} className="border border-slate-800 py-1.5 px-3 text-center uppercase">
                      JUMLAH TOTAL REKAPITULASI
                    </td>
                    <td className="border border-slate-800 py-1.5 px-1 text-center">{totalH}</td>
                    <td className="border border-slate-800 py-1.5 px-1 text-center">{totalT}</td>
                    <td className="border border-slate-800 py-1.5 px-1 text-center">{totalS}</td>
                    <td className="border border-slate-800 py-1.5 px-1 text-center">{totalI}</td>
                    <td className="border border-slate-800 py-1.5 px-1 text-center">{totalA}</td>
                    <td className="border border-slate-800 py-1.5 px-2 text-center">{avgRate}%</td>
                    <td className="border border-slate-800 py-1.5 px-2 text-center text-[10px]">
                      {avgRate >= 80 ? 'TERVALIDASI' : 'EVALUASI'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Catatan & Ketentuan */}
            <div className="text-[10px] font-sans text-slate-600 mb-8 border border-slate-200 p-2.5 rounded bg-slate-50">
              <span className="font-bold text-slate-800">Keterangan Singkatan:</span> H = Hadir | T = Terlambat | S = Sakit | I = Izin | A = Alfa (Tanpa Keterangan).<br />
              <span className="font-bold text-slate-800">Ketentuan Kemendikbud:</span> Siswa dengan kehadiran di bawah 75% wajib mendapatkan pendampingan Wali Kelas dan Guru Bimbingan Konseling (BK).
            </div>

            {/* Lembar Pengesahan / Tanda Tangan */}
            <div className="flex justify-between items-start text-xs font-sans px-4">
              <div className="text-center w-60">
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-900">Kepala SMK Negeri 1 Kota Sorong</p>
                <div className="h-16 flex items-center justify-center">
                  {/* Stempel / TTD digital simulator */}
                  <span className="text-[9px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-0.5">
                    (Tanda Tangan &amp; Stempel Basah)
                  </span>
                </div>
                <p className="font-bold text-slate-950 underline">Drs. Hermanus Waromi, M.Pd.</p>
                <p className="text-[11px] text-slate-600">NIP. 19680512 199303 1 008</p>
              </div>

              <div className="text-center w-60">
                <p className="text-slate-600">Sorong, {todayFormatted}</p>
                <p className="font-bold text-slate-900">Guru Mata Pelajaran / Wali Kelas</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[9px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-0.5">
                    (Tanda Tangan)
                  </span>
                </div>
                <p className="font-bold text-slate-950 underline">{guruNama}</p>
                <p className="text-[11px] text-slate-600">NIP. {guruNip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
