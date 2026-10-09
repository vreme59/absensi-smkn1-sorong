import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { exportAttendanceToExcel, StudentRecapItem } from '../utils/exportAttendance';
import { CetakRekapModal } from './CetakRekapModal';

import {
  getPerangkatKelas,
  savePerangkatKelas,
  setMandatHariIni,
  getWewenangPengabsenHariIni,
  PerangkatKelasConfig,
} from '../utils/perangkatKelasManager';

interface WaliKelasDashboardProps {
  user: UserProfile;
  onNavigateHome?: () => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export type WaliTab = 'rawan' | 'perangkat' | 'rekap';

export const WaliKelasDashboard: React.FC<WaliKelasDashboardProps> = ({
  user,
  onNavigateHome,
  onShowToast,
}) => {
  const [classes, setClasses] = useState<{ id: string; nama: string; wali_kelas_id?: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<WaliTab>('perangkat');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Perangkat Kelas & Delegasi state
  const [perangkatConfig, setPerangkatConfig] = useState<PerangkatKelasConfig | null>(null);
  const [selectedSekretarisId, setSelectedSekretarisId] = useState<string>('');
  const [selectedKetuaId, setSelectedKetuaId] = useState<string>('');
  const [selectedMandatId, setSelectedMandatId] = useState<string>('');
  const [mandatCatatanInput, setMandatCatatanInput] = useState<string>('');
  const [todayAttendanceMap, setTodayAttendanceMap] = useState<Record<string, string>>({});

  // Print Modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [periodRecords, setPeriodRecords] = useState<any[]>([]);

  // Filter period for Rekap tab
  const [selectedPeriod, setSelectedPeriod] = useState<'hari_ini' | '1_minggu' | '1_bulan' | 'semester'>('semester');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch classes and find user's homeroom class
  useEffect(() => {
    async function loadClasses() {
      try {
        const { data: allCls } = await supabase
          .from('kelas')
          .select('id, nama, wali_kelas_id')
          .order('nama', { ascending: true });

        if (allCls && allCls.length > 0) {
          setClasses(allCls);
          const myClass = allCls.find(c => c.wali_kelas_id === user.id) || allCls[0];
          setSelectedClassId(myClass.id);
        }
      } catch (err) {
        console.error('Error fetching classes for wali:', err);
      }
    }
    loadClasses();
  }, [user.id]);

  // 2. Fetch students for selected homeroom class
  useEffect(() => {
    if (!selectedClassId) return;

    async function loadStudents() {
      setLoading(true);
      try {
        const { data: stdList } = await supabase
          .from('profiles')
          .select('id, nama, username, phone')
          .eq('kelas_id', selectedClassId)
          .eq('role', 'siswa')
          .order('nama', { ascending: true });

        // Deduplicate students by name to guarantee unique count
        const seenNames = new Set<string>();
        const uniqueStudents = (stdList || []).filter(s => {
          const key = (s.nama || '').trim().toUpperCase();
          if (seenNames.has(key)) return false;
          seenNames.add(key);
          return true;
        });
        setStudents(uniqueStudents);
      } catch (err) {
        console.error('Error fetching students for wali:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, [selectedClassId]);

  const activeClass = classes.find(c => c.id === selectedClassId);
  const activeClassName = activeClass?.nama || 'Kelas';

  // Load Perangkat Kelas config & today's attendance for selected class
  useEffect(() => {
    if (!selectedClassId) return;
    const cfg = getPerangkatKelas(selectedClassId, students);
    setPerangkatConfig(cfg);
    setSelectedSekretarisId(cfg.sekretarisId || (students[1]?.id || students[0]?.id || ''));
    setSelectedKetuaId(cfg.ketuaKelasId || (students[0]?.id || ''));
    setSelectedMandatId(cfg.mandatSiswaId || '');
    setMandatCatatanInput(cfg.mandatCatatan || '');

    // Fetch today's attendance status to show realtime status of secretary & class president
    const todayStr = new Date().toISOString().split('T')[0];
    supabase
      .from('absen_harian')
      .select('siswa_id, status')
      .eq('kelas_id', selectedClassId)
      .eq('tanggal', todayStr)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((row: any) => {
          map[row.siswa_id] = row.status;
        });
        setTodayAttendanceMap(map);
      });
  }, [selectedClassId, students]);

  // Fetch real attendance records from absen_harian for period recap
  useEffect(() => {
    if (!selectedClassId) {
      setPeriodRecords([]);
      return;
    }

    async function loadPeriodAttendance() {
      try {
        let query = supabase
          .from('absen_harian')
          .select('siswa_id, status, tanggal')
          .eq('kelas_id', selectedClassId);

        const now = new Date();
        if (selectedPeriod === 'hari_ini') {
          const todayStr = now.toISOString().split('T')[0];
          query = query.eq('tanggal', todayStr);
        } else if (selectedPeriod === '1_minggu') {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          query = query.gte('tanggal', d.toISOString().split('T')[0]);
        } else if (selectedPeriod === '1_bulan') {
          const d = new Date();
          d.setDate(d.getDate() - 30);
          query = query.gte('tanggal', d.toISOString().split('T')[0]);
        }

        const { data } = await query;
        setPeriodRecords(data || []);
      } catch (e) {
        console.error('Error fetching period records:', e);
      }
    }

    loadPeriodAttendance();
  }, [selectedClassId, selectedPeriod]);

  const handleSavePerangkat = () => {
    if (!perangkatConfig || !selectedClassId) return;
    const sekName = students.find(s => s.id === selectedSekretarisId)?.nama || '';
    const ketuaName = students.find(s => s.id === selectedKetuaId)?.nama || '';

    const updated: PerangkatKelasConfig = {
      ...perangkatConfig,
      kelasId: selectedClassId,
      sekretarisId: selectedSekretarisId,
      sekretarisNama: sekName,
      ketuaKelasId: selectedKetuaId,
      ketuaKelasNama: ketuaName,
    };
    savePerangkatKelas(updated);
    setPerangkatConfig(updated);
    onShowToast('Tersimpan!', `Sekretaris (${sekName}) dan Ketua Kelas (${ketuaName}) berhasil ditetapkan.`, 'success');
  };

  const handleToggleMandat = () => {
    if (!perangkatConfig || !selectedClassId) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const isCurrentlyActive = Boolean(perangkatConfig.mandatSiswaId && perangkatConfig.mandatTanggal === todayStr);

    if (isCurrentlyActive) {
      // Cabut mandat
      const updated = setMandatHariIni(selectedClassId, null, null);
      setPerangkatConfig(updated);
      setSelectedMandatId('');
      setMandatCatatanInput('');
      onShowToast('Mandat Dicabut', 'Wewenang khusus mandat darurat telah dinonaktifkan.', 'info');
    } else {
      // Aktifkan mandat
      if (!selectedMandatId) {
        onShowToast('Pilih Siswa', 'Silakan pilih siswa yang akan diberikan mandat absensi hari ini.', 'warning');
        return;
      }
      const mandatName = students.find(s => s.id === selectedMandatId)?.nama || '';
      const updated = setMandatHariIni(selectedClassId, selectedMandatId, mandatName, mandatCatatanInput);
      setPerangkatConfig(updated);
      onShowToast('Mandat Diaktifkan!', `Wewenang pengisian absensi hari ini diberikan kepada ${mandatName}.`, 'success');
    }
  };

  // 3. Compute student attendance stats & at-risk ranking dari data riil periodRecords
  const { studentStats, atRiskStudents, avgRate, counts } = useMemo(() => {
    // Map records by student id
    const recordsByStudent: Record<string, any[]> = {};
    (periodRecords || []).forEach(r => {
      if (!recordsByStudent[r.siswa_id]) recordsByStudent[r.siswa_id] = [];
      recordsByStudent[r.siswa_id].push(r);
    });

    const stats = students.map((s, idx) => {
      const studentRecs = recordsByStudent[s.id] || [];
      let hCount = 0;
      let tCount = 0;
      let sCount = 0;
      let iCount = 0;
      let aCount = 0;

      studentRecs.forEach(r => {
        if (r.status === 'Hadir') hCount++;
        else if (r.status === 'Terlambat') tCount++;
        else if (r.status === 'Sakit') sCount++;
        else if (r.status === 'Izin') iCount++;
        else if (r.status === 'Alfa') aCount++;
      });

      const totalRecorded = hCount + tCount + sCount + iCount + aCount;
      const rate = totalRecorded > 0 ? Math.min(100, Math.round(((hCount + tCount) / totalRecorded) * 100)) : 0;

      // Risk Level berdasarkan data kehadiran nyata
      let riskLevel: 'safe' | 'warning' | 'alert' | 'critical' = 'safe';
      if (aCount >= 4 || (totalRecorded >= 4 && rate < 70)) {
        riskLevel = 'critical';
      } else if (aCount >= 2 || (totalRecorded >= 4 && rate < 80)) {
        riskLevel = 'alert';
      } else if (aCount >= 1 || (totalRecorded >= 4 && rate < 85)) {
        riskLevel = 'warning';
      }

      return {
        ...s,
        no: idx + 1,
        nisn: s.username?.replace(/^s_?/, '') || '-',
        hadir: hCount,
        terlambat: tCount,
        sakit: sCount,
        izin: iCount,
        alfa: aCount,
        totalPertemuan: totalRecorded,
        rate,
        riskLevel,
      };
    });

    const atRisk = stats
      .filter(s => s.riskLevel !== 'safe')
      .sort((a, b) => b.alfa - a.alfa || a.rate - b.rate);

    const aggH = stats.reduce((acc, s) => acc + s.hadir, 0);
    const aggT = stats.reduce((acc, s) => acc + s.terlambat, 0);
    const aggS = stats.reduce((acc, s) => acc + s.sakit, 0);
    const aggI = stats.reduce((acc, s) => acc + s.izin, 0);
    const aggA = stats.reduce((acc, s) => acc + s.alfa, 0);
    const totalEntries = aggH + aggT + aggS + aggI + aggA;
    const overallRate = totalEntries > 0 ? Math.round(((aggH + aggT) / totalEntries) * 100) : 0;

    return {
      studentStats: stats,
      atRiskStudents: atRisk,
      avgRate: overallRate,
      counts: { Hadir: aggH, Terlambat: aggT, Sakit: aggS, Izin: aggI, Alfa: aggA },
    };
  }, [students, periodRecords]);

  const handleExportExcel = () => {
    exportAttendanceToExcel({
      kelasNama: activeClassName,
      mapelNama: 'Wali Kelas (Pemantauan Kehadiran)',
      guruNama: user.name,
      guruNip: user.identifier || '-',
      periodeLabel: selectedPeriod === 'semester' ? 'Semester Ganjil 2026/2027' : selectedPeriod,
      students: studentStats as StudentRecapItem[],
      avgRate,
    });
    onShowToast('Ekspor Excel Berhasil', `Rekap presensi perwalian ${activeClassName} telah diunduh.`, 'success');
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return studentStats;
    const q = searchQuery.toLowerCase();
    return studentStats.filter(s => (s.nama || '').toLowerCase().includes(q) || (s.nisn || '').includes(q));
  }, [studentStats, searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto pb-28 min-h-screen bg-slate-50 font-body">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#003d73] to-primary pt-5 pb-6 px-4 sm:px-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined notranslate text-white text-2xl">
                supervisor_account
              </span>
            </div>
            <div>
              <h1 className="font-headline font-bold text-lg leading-tight">Dashboard Wali Kelas</h1>
              <p className="text-sky-200 text-xs">{user.name}</p>
            </div>
          </div>

          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Class Selection Dropdown */}
        <div className="mt-2 bg-white/10 rounded-2xl p-2.5 backdrop-blur-md border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider">
              Kelas Perwalian:
            </span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-sky-300"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  Kelas {c.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Homeroom Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
            <span className="text-[10px] text-sky-200 font-semibold block">Total Siswa</span>
            <span className="text-lg font-bold font-headline">{students.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
            <span className="text-[10px] text-sky-200 font-semibold block">Rata-rata Hadir</span>
            <span className="text-lg font-bold font-headline">{avgRate}%</span>
          </div>
          <div className="bg-rose-500/30 rounded-xl p-2.5 border border-rose-400/40">
            <span className="text-[10px] text-rose-200 font-semibold block">Siswa Rawan</span>
            <span className="text-lg font-bold font-headline text-rose-200">{atRiskStudents.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl p-1 shadow-md border border-slate-100 flex gap-1">
          <button
            onClick={() => setActiveTab('perangkat')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'perangkat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[16px]">assignment_ind</span>
            <span>Perangkat &amp; Mandat</span>
          </button>
          <button
            onClick={() => setActiveTab('rawan')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'rawan'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[16px]">crisis_alert</span>
            <span>Radar Rawan ({atRiskStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'rekap'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[16px]">table_chart</span>
            <span>Rekap</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 shadow-sm">
            <span className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-semibold">Memuat data perwalian {activeClassName}...</p>
          </div>
        ) : activeTab === 'perangkat' ? (
          /* TAB 0: PERANGKAT & MANDAT DELEGASI HARIAN */
          <div className="flex flex-col gap-4">
            {/* Banner Penjelasan Alur Hierarki Pengabsen */}
            <div className="bg-gradient-to-br from-indigo-900 via-[#003d73] to-slate-900 rounded-2xl p-4 text-white shadow-sm border border-indigo-700/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined notranslate text-emerald-300 text-[24px]">
                    account_tree
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-white">
                    Alur &amp; Wewenang Presensi Pagi
                  </h3>
                  <p className="text-slate-200 text-xs mt-1 leading-relaxed">
                    Wali Kelas menetapkan <strong>Sekretaris</strong> sebagai pengabsen utama. Jika sekretaris berhalangan (sakit/izin/alfa), wewenang otomatis beralih ke <strong>Ketua Kelas</strong>. Jika keduanya absen, Anda dapat memberikan <strong>Mandat Khusus</strong> ke siswa terpercaya hari ini, atau dilanjutkan oleh <strong>Guru Mapel Jam 1/2/3</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid 2-Kolom Responsif untuk Tablet & Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Status Live Wewenang Pengabsen Hari Ini */}
            {(() => {
              const wewenang = getWewenangPengabsenHariIni(
                selectedClassId,
                '',
                todayAttendanceMap,
                students
              );

              return (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-headline font-bold text-xs text-slate-800 uppercase tracking-wider">
                        Status Wewenang Presensi Hari Ini
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      Langkah #{wewenang.hierarchyStep} dari 4
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-3 border border-slate-200/60">
                    <span className="material-symbols-outlined notranslate text-primary text-[22px] shrink-0 mt-0.5">
                      {wewenang.hierarchyStep === 1 ? 'verified' : wewenang.hierarchyStep === 2 ? 'warning' : wewenang.hierarchyStep === 3 ? 'star' : 'school'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        {wewenang.activeOfficerName} ({wewenang.officerTitle})
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {wewenang.officerReason}
                      </p>
                    </div>
                  </div>

                  {/* Step indicators */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                    <div className={`p-2 rounded-xl border text-[10px] ${!wewenang.sekretarisAbsent ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'}`}>
                      <span>1. Sekretaris</span>
                    </div>
                    <div className={`p-2 rounded-xl border text-[10px] ${wewenang.sekretarisAbsent && !wewenang.ketuaAbsent ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold ring-1 ring-amber-300' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>2. Ketua Kelas</span>
                    </div>
                    <div className={`p-2 rounded-xl border text-[10px] ${wewenang.hierarchyStep === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>3. Mandat Wali</span>
                    </div>
                    <div className={`p-2 rounded-xl border text-[10px] ${wewenang.hierarchyStep === 4 ? 'bg-blue-50 border-blue-200 text-blue-800 font-bold ring-1 ring-blue-300' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>4. Guru Mapel</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Form Penetapan Sekretaris & Ketua Kelas */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3.5">
              <h4 className="font-headline font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-primary text-[18px]">badge</span>
                <span>Penetapan Perangkat Kelas Resmi</span>
              </h4>

              {/* Pilih Sekretaris */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Sekretaris Kelas (Petugas Utama):</span>
                  {selectedSekretarisId && (
                    <span className="text-[10px] text-primary font-semibold">
                      Status Hari Ini: {todayAttendanceMap[selectedSekretarisId] || 'Belum Diabsen'}
                    </span>
                  )}
                </label>
                <select
                  value={selectedSekretarisId}
                  onChange={(e) => setSelectedSekretarisId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Pilih Siswa Sebagai Sekretaris --</option>
                  {students.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {idx + 1}. {s.nama} ({s.username})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Default pengabsen harian di pagi hari saat jam masuk sekolah.
                </p>
              </div>

              {/* Pilih Ketua Kelas */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Ketua Kelas (Pengganti ke-1):</span>
                  {selectedKetuaId && (
                    <span className="text-[10px] text-amber-600 font-semibold">
                      Status Hari Ini: {todayAttendanceMap[selectedKetuaId] || 'Belum Diabsen'}
                    </span>
                  )}
                </label>
                <select
                  value={selectedKetuaId}
                  onChange={(e) => setSelectedKetuaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Pilih Siswa Sebagai Ketua Kelas --</option>
                  {students.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {idx + 1}. {s.nama} ({s.username})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Otomatis mengambil alih pengisian presensi jika Sekretaris sakit, izin, atau alfa.
                </p>
              </div>

              <button
                onClick={handleSavePerangkat}
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-[#004e84] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined notranslate text-[16px]">save</span>
                <span>Simpan Perangkat Kelas</span>
              </button>
            </div>

            {/* Seksi Mandat Darurat Hari Ini */}
            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col gap-3.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -z-10" />
              
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate text-emerald-600 text-[18px]">verified_user</span>
                  <span>Mandat Darurat Wali Kelas Hari Ini</span>
                </h4>
                {Boolean(perangkatConfig?.mandatSiswaId && perangkatConfig?.mandatTanggal === new Date().toISOString().split('T')[0]) && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    MANDAT AKTIF
                  </span>
                )}
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                Gunakan fitur ini jika <strong>Sekretaris dan Ketua Kelas keduanya tidak masuk</strong>, dan belum ada guru pengabsen. Anda sebagai Wali Kelas dapat menunjuk satu siswa yang Anda percayai untuk mengabsen kelas hari ini.
              </p>

              {/* Status Box Mandat Aktif */}
              {Boolean(perangkatConfig?.mandatSiswaId && perangkatConfig?.mandatTanggal === new Date().toISOString().split('T')[0]) ? (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-emerald-700 font-semibold">Siswa Penerima Mandat:</p>
                      <p className="text-xs font-bold text-emerald-950">{perangkatConfig?.mandatSiswaNama}</p>
                    </div>
                    <button
                      onClick={handleToggleMandat}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs transition flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined notranslate text-[14px]">cancel</span>
                      <span>Cabut Mandat</span>
                    </button>
                  </div>
                  {perangkatConfig?.mandatCatatan && (
                    <p className="text-[11px] text-emerald-800 italic bg-white/70 p-2 rounded-lg border border-emerald-100">
                      Pesan Wali Kelas: &ldquo;{perangkatConfig.mandatCatatan}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Pilih Siswa Terpercaya:
                    </label>
                    <select
                      value={selectedMandatId}
                      onChange={(e) => setSelectedMandatId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Pilih Siswa Untuk Diberi Mandat --</option>
                      {students.map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          {idx + 1}. {s.nama} ({s.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Pesan / Instruksi Wali Kelas (Opsional):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tolong bantu absenkan teman-teman kelas kita hari ini ya..."
                      value={mandatCatatanInput}
                      onChange={(e) => setMandatCatatanInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleToggleMandat}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">verified</span>
                    <span>Beri Mandat Absen Hari Ini</span>
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        ) : activeTab === 'rawan' ? (
          /* TAB 1: RADAR SISWA RAWAN */
          <div className="flex flex-col gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 leading-snug">
              <span className="font-bold block mb-0.5">⚠️ Pemantauan Kedisiplinan &amp; Kehadiran:</span>
              Daftar siswa dengan akumulasi Alfa &ge; 3 hari atau tingkat kehadiran di bawah 75% yang memerlukan perhatian khusus wali kelas.
            </div>

            {atRiskStudents.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-sm">
                <span className="material-symbols-outlined notranslate text-emerald-500 text-4xl mb-1">
                  check_circle
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Semua Siswa Terpantau Disiplin!</h3>
                <p className="text-slate-400 text-xs mt-1">Tidak ada siswa yang mencapai batas rawan presensi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {atRiskStudents.map((siswa) => {
                const isCritical = siswa.riskLevel === 'critical';
                const isAlert = siswa.riskLevel === 'alert';

                return (
                  <div
                    key={siswa.id}
                    className={`bg-white rounded-2xl p-4 border shadow-sm flex flex-col gap-3 transition ${
                      isCritical
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/30'
                        : isAlert
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl font-bold flex items-center justify-center text-sm ${
                          isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {siswa.alfa}A
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {siswa.nama}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            NISN: {siswa.nisn} • Kehadiran: {siswa.rate}%
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {isCritical ? 'Tingkat 3 (Kritis)' : 'Tingkat 2 (Waspada)'}
                      </span>
                    </div>

                    {/* Breakdown counts */}
                    <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 p-2 rounded-xl text-[10px]">
                      <div><span className="text-slate-400 block">Hadir</span><span className="font-bold text-emerald-700">{siswa.hadir}</span></div>
                      <div><span className="text-slate-400 block">Sakit</span><span className="font-bold text-purple-700">{siswa.sakit}</span></div>
                      <div><span className="text-slate-400 block">Izin</span><span className="font-bold text-sky-700">{siswa.izin}</span></div>
                      <div><span className="text-slate-400 block">Alfa</span><span className="font-bold text-rose-700">{siswa.alfa}</span></div>
                    </div>

                    {/* Status Perhatian */}
                    <div className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <span className="material-symbols-outlined notranslate text-[16px]">
                        {isCritical ? 'warning' : 'info'}
                      </span>
                      <span>{isCritical ? 'Perlu Pembinaan Khusus Wali Kelas' : 'Dalam Pemantauan Kehadiran'}</span>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: REKAPITULASI KELAS LENGKAP */
          <div className="flex flex-col gap-3">
            {/* Period selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(['hari_ini', '1_minggu', '1_bulan', 'semester'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedPeriod === p ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {p === 'hari_ini' ? 'Hari Ini' : p === '1_minggu' ? '1 Minggu' : p === '1_bulan' ? '1 Bulan' : 'Semester'}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-[16px]">table_view</span>
                <span>Ekspor Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-[16px]">print</span>
                <span>Cetak PDF Resmi</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cari siswa atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>

            {/* List */}
            <div className="flex flex-col gap-2">
              {filteredStudents.map((s, idx) => (
                <div key={s.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{s.nama}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">NISN: {s.nisn}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">
                      H:{s.hadir}
                    </span>
                    {s.alfa > 0 && (
                      <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-100">
                        A:{s.alfa}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.rate >= 90 ? 'bg-emerald-100 text-emerald-800' : s.rate >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kemendikbud Official PDF Modal */}
      <CetakRekapModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        kelasNama={activeClassName}
        mapelNama="Wali Kelas (Pemantauan Kehadiran)"
        guruNama={user.name}
        guruNip={user.identifier || '-'}
        periodeLabel={selectedPeriod === 'semester' ? 'Semester Ganjil 2026/2027' : selectedPeriod}
        students={studentStats as StudentRecapItem[]}
        avgRate={avgRate}
      />
    </div>
  );
};
