import * as XLSX from 'xlsx';

export interface StudentRecapItem {
  no: number;
  nisn: string;
  nama: string;
  hadir: number;
  terlambat: number;
  sakit: number;
  izin: number;
  alfa: number;
  totalPertemuan: number;
  rate: number;
  keterangan?: string;
  isBolosMapel?: boolean;
}

export interface ExportRecapOptions {
  kelasNama: string;
  mapelNama: string;
  guruNama: string;
  guruNip?: string;
  periodeLabel: string;
  students: StudentRecapItem[];
  avgRate: number;
}

export function exportAttendanceToExcel({
  kelasNama,
  mapelNama,
  guruNama,
  guruNip = '-',
  periodeLabel,
  students,
  avgRate,
}: ExportRecapOptions) {
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
  const totalPertemuan = students[0]?.totalPertemuan || 1;

  const rows: any[][] = [
    ['PEMERINTAH PROVINSI PAPUA BARAT DAYA'],
    ['DINAS PENDIDIKAN DAN KEBUDAYAAN'],
    ['SMK NEGERI 1 KOTA SORONG'],
    ['Jl. Basuki Rahmat No. 1, Remu Utara, Kec. Sorong, Kota Sorong, Papua Barat Daya 98412'],
    ['REKAPITULASI PRESENSI KEHADIRAN SISWA - FORMAT RESMI KEMENDIKBUD'],
    [],
    ['Kelas', `: ${kelasNama}`, '', 'Guru Pengajar', `: ${guruNama}`],
    ['Mata Pelajaran', `: ${mapelNama}`, '', 'NIP Guru', `: ${guruNip}`],
    ['Periode Rekap', `: ${periodeLabel}`, '', 'Tanggal Unduh', `: ${todayFormatted}`],
    ['Rata-rata Kelas', `: ${avgRate}%`, '', 'Total Siswa', `: ${students.length} Siswa`],
    [],
    [
      'NO',
      'NISN',
      'NAMA LENGKAP SISWA',
      'HADIR (H)',
      'TERLAMBAT (T)',
      'SAKIT (S)',
      'IZIN (I)',
      'ALFA (A)',
      'TOTAL PERTEMUAN',
      'PERSENTASE (%)',
      'STATUS KEDISIPLINAN',
    ],
  ];

  students.forEach((s) => {
    let statusText = 'Sangat Baik';
    if (s.isBolosMapel) {
      statusText = 'PERINGATAN: BOLOS MAPEL';
    } else if (s.alfa >= 3) {
      statusText = 'Rawan - Panggilan Wali Murid';
    } else if (s.rate < 75) {
      statusText = 'Kurang (< 75%)';
    } else if (s.rate < 85) {
      statusText = 'Cukup';
    } else if (s.rate < 95) {
      statusText = 'Baik';
    }

    rows.push([
      s.no,
      s.nisn,
      s.nama,
      s.hadir,
      s.terlambat,
      s.sakit,
      s.izin,
      s.alfa,
      s.totalPertemuan,
      `${s.rate}%`,
      statusText,
    ]);
  });

  // Summary Row
  rows.push([]);
  rows.push([
    'TOTAL KELAS',
    '',
    '',
    totalH,
    totalT,
    totalS,
    totalI,
    totalA,
    totalPertemuan * students.length,
    `${avgRate}%`,
    avgRate >= 80 ? 'TUNTAS' : 'PERLU PERHATIAN',
  ]);

  // Signature Block
  rows.push([]);
  rows.push([]);
  rows.push(['', '', '', '', '', '', '', '', `Sorong, ${todayFormatted}`]);
  rows.push(['Mengetahui,', '', '', '', '', '', '', '', 'Guru Mata Pelajaran / Wali Kelas,']);
  rows.push(['Kepala SMK Negeri 1 Sorong,', '', '', '', '', '', '', '', '']);
  rows.push([]);
  rows.push([]);
  rows.push([]);
  rows.push(['Drs. Hermanus Waromi, M.Pd.', '', '', '', '', '', '', '', guruNama]);
  rows.push(['NIP. 19680512 199303 1 008', '', '', '', '', '', '', '', `NIP. ${guruNip}`]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // NISN
    { wch: 34 }, // Nama
    { wch: 12 }, // Hadir
    { wch: 14 }, // Terlambat
    { wch: 11 }, // Sakit
    { wch: 11 }, // Izin
    { wch: 11 }, // Alfa
    { wch: 16 }, // Total Pertemuan
    { wch: 16 }, // %
    { wch: 28 }, // Status
  ];

  const workbook = XLSX.utils.book_new();
  const cleanSheetName = `Rekap_${kelasNama.replace(/[^a-zA-Z0-9]/g, '_')}`.slice(0, 31);
  XLSX.utils.book_append_sheet(workbook, worksheet, cleanSheetName);

  const cleanPeriod = periodeLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `Rekap_Presensi_${kelasNama.replace(/[^a-zA-Z0-9]/g, '_')}_${cleanPeriod}_${new Date().toISOString().split('T')[0]}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
