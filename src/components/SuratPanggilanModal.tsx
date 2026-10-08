import React, { useState } from 'react';
import { SCHOOL_LOGO } from '../data/samakan/mockData';

export interface SuratPanggilanData {
  nomorSurat: string;
  namaSiswa: string;
  nisn: string;
  kelas: string;
  namaOrtu?: string;
  nomorHpOrtu?: string;
  alasan: string;
  totalAlfa: number;
  hariTanggalPanggilan: string;
  jamPanggilan: string;
  tempat: string;
  waliKelasNama: string;
  waliKelasNip?: string;
}

interface SuratPanggilanModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SuratPanggilanData;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SuratPanggilanModal: React.FC<SuratPanggilanModalProps> = ({
  isOpen,
  onClose,
  data,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<SuratPanggilanData>(data);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  if (!isOpen) return null;

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const phone = formData.nomorHpOrtu ? formData.nomorHpOrtu.replace(/^0/, '62').replace(/[^0-9]/g, '') : '';
    const message = `Yth. Bapak/Ibu Orang Tua/Wali dari ananda *${formData.namaSiswa}* (${formData.kelas}).\n\nKami dari pihak SMK Negeri 1 Kota Sorong menyampaikan *Surat Panggilan Orang Tua/Wali Murid* (No: ${formData.nomorSurat}) sehubungan dengan pemantauan kehadiran ananda yang tercatat tidak hadir (Alfa) sebanyak ${formData.totalAlfa} hari.\n\nMohon kehadiran Bapak/Ibu pada:\n📅 Hari/Tgl: *${formData.hariTanggalPanggilan}*\n⏰ Pukul: *${formData.jamPanggilan}*\n📍 Tempat: *${formData.tempat}*\n👤 Menemui: *${formData.waliKelasNama}* (Wali Kelas) & Guru BK.\n\nDemikian pemberitahuan ini. Kehadiran Bapak/Ibu sangat penting demi masa depan pendidikan ananda.\n\nTerima kasih.\n*SMK Negeri 1 Kota Sorong*`;
    
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onShowToast('WhatsApp Terbuka', 'Draft pesan resmi telah disiapkan untuk dikirim ke orang tua.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full">
        {/* Action Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-amber-400 text-2xl">
              mail
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Surat Panggilan Orang Tua / Wali Murid</h2>
              <p className="text-xs text-slate-300">
                {formData.namaSiswa} • Kelas {formData.kelas}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === 'preview' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Pratinjau
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === 'edit' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ubah Detail
              </button>
            </div>

            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              title="Kirim Pesan Resmi ke WhatsApp Orang Tua"
            >
              <span className="material-symbols-outlined notranslate text-[16px]">chat</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined notranslate text-[16px]">print</span>
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'edit' ? (
          <div className="p-6 bg-slate-50 flex flex-col gap-4 font-body print:hidden">
            <h3 className="text-sm font-bold text-slate-800">Sesuaikan Data Surat Panggilan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Surat</label>
                <input
                  type="text"
                  value={formData.nomorSurat}
                  onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={formData.namaOrtu || ''}
                  placeholder="Bapak/Ibu Orang Tua Siswa"
                  onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Orang Tua</label>
                <input
                  type="text"
                  value={formData.nomorHpOrtu || ''}
                  placeholder="081234567890"
                  onChange={(e) => setFormData({ ...formData, nomorHpOrtu: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hari &amp; Tanggal Pemanggilan</label>
                <input
                  type="text"
                  value={formData.hariTanggalPanggilan}
                  onChange={(e) => setFormData({ ...formData, hariTanggalPanggilan: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waktu / Pukul</label>
                <input
                  type="text"
                  value={formData.jamPanggilan}
                  onChange={(e) => setFormData({ ...formData, jamPanggilan: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tempat Menghadap</label>
                <input
                  type="text"
                  value={formData.tempat}
                  onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Alasan Pemanggilan</label>
                <textarea
                  rows={2}
                  value={formData.alasan}
                  onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('preview')}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold"
              >
                Lihat Pratinjau Surat
              </button>
            </div>
          </div>
        ) : (
          /* Official Printed Letter Layout */
          <div className="p-8 sm:p-14 bg-white text-slate-900 font-serif print:p-0 print:m-0 text-xs sm:text-[13px] leading-relaxed">
            <div className="max-w-[680px] mx-auto bg-white">
              {/* Kop Surat Resmi */}
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
                  <h1 className="text-base sm:text-lg uppercase tracking-tight font-sans font-black text-slate-950">
                    SMK NEGERI 1 KOTA SORONG
                  </h1>
                  <p className="text-[10px] sm:text-[11px] font-sans text-slate-600 leading-tight mt-0.5">
                    Jalan Basuki Rahmat No. 1, Remu Utara, Kec. Sorong, Kota Sorong, Papua Barat Daya 98412
                  </p>
                  <p className="text-[9px] font-sans text-slate-500">
                    Laman: www.smkn1sorong.sch.id | Pos-el: smkn1sorong@gmail.com
                  </p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center border border-slate-300 rounded-lg text-[9px] font-sans text-slate-400 text-center p-1 shrink-0">
                  KODE POS 98412
                </div>
              </div>

              {/* Header Surat */}
              <div className="flex justify-between items-start mb-6 font-sans">
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-20 font-semibold">Nomor</span><span>: {formData.nomorSurat}</span></div>
                  <div className="flex"><span className="w-20 font-semibold">Lampiran</span><span>: 1 (satu) Berkas Rekap Presensi</span></div>
                  <div className="flex"><span className="w-20 font-semibold">Perihal</span><span className="font-bold underline">: Panggilan Orang Tua / Wali Murid</span></div>
                </div>
                <div className="text-right">
                  <p>Sorong, {todayFormatted}</p>
                </div>
              </div>

              {/* Penerima */}
              <div className="mb-6 font-sans">
                <p>Kepada Yth.</p>
                <p className="font-bold">Bapak / Ibu Orang Tua / Wali dari:</p>
                <div className="ml-4 mt-1 border-l-2 border-slate-300 pl-3 space-y-0.5 text-xs">
                  <div className="flex"><span className="w-24 text-slate-600">Nama Siswa</span><span className="font-bold text-slate-900">: {formData.namaSiswa}</span></div>
                  <div className="flex"><span className="w-24 text-slate-600">NISN</span><span className="font-mono text-slate-800">: {formData.nisn}</span></div>
                  <div className="flex"><span className="w-24 text-slate-600">Kelas</span><span className="font-bold text-slate-800">: {formData.kelas}</span></div>
                </div>
                <p className="mt-1">di Tempat</p>
              </div>

              {/* Isi Surat */}
              <div className="space-y-3 mb-6 text-justify">
                <p>Dengan hormat,</p>
                <p>
                  Sehubungan dengan hasil rekapitulasi presensi kehadiran belajar siswa pada Tahun Pelajaran 2026/2027, ananda tersebut di atas tercatat <strong>tidak hadir tanpa keterangan (Alfa) sebanyak {formData.totalAlfa} hari</strong> ({formData.alasan}).
                </p>
                <p>
                  Guna mencari solusi bersama dan pembinaan masa depan ananda, kami mengharapkan kehadiran Bapak/Ibu Orang Tua/Wali Murid ke sekolah pada:
                </p>

                {/* Jadwal Menghadap */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 my-2 space-y-1 font-sans text-xs">
                  <div className="flex"><span className="w-28 font-semibold text-slate-700">Hari / Tanggal</span><span className="font-bold text-slate-900">: {formData.hariTanggalPanggilan}</span></div>
                  <div className="flex"><span className="w-28 font-semibold text-slate-700">Waktu / Pukul</span><span className="font-bold text-slate-900">: {formData.jamPanggilan} WIT</span></div>
                  <div className="flex"><span className="w-28 font-semibold text-slate-700">Tempat</span><span className="font-bold text-slate-900">: {formData.tempat}</span></div>
                  <div className="flex"><span className="w-28 font-semibold text-slate-700">Menemui</span><span className="font-bold text-slate-900">: {formData.waliKelasNama} (Wali Kelas) &amp; Guru BK</span></div>
                </div>

                <p>
                  Mengingat pentingnya hal ini demi kelancaran proses belajar dan kedisiplinan siswa, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.
                </p>
                <p>
                  Demikian surat panggilan ini kami sampaikan. Atas perhatian, kerja sama, dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="flex justify-between items-start font-sans text-xs mt-8 pt-4">
                <div className="text-center w-56">
                  <p className="text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900">Kepala SMK Negeri 1 Kota Sorong</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-0.5">
                      (Cap Sekolah &amp; Tanda Tangan)
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 underline">Drs. Hermanus Waromi, M.Pd.</p>
                  <p className="text-[11px] text-slate-600">NIP. 19680512 199303 1 008</p>
                </div>

                <div className="text-center w-56">
                  <p className="text-slate-600">Wali Kelas,</p>
                  <p className="font-bold text-slate-900">Kelas {formData.kelas}</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-0.5">
                      (Tanda Tangan)
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 underline">{formData.waliKelasNama}</p>
                  <p className="text-[11px] text-slate-600">NIP. {formData.waliKelasNip || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
