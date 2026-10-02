import React from 'react';
import {
  QrCode,
  Calendar,
  ClipboardList,
  Flame,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Bell,
  BookOpen,
  BarChart3,
  Users,
  CheckCircle,
} from 'lucide-react';
import { TODAY_SCHEDULE } from '../data/schedule';

interface Props {
  onNavigateToAttendance: () => void;
  onNavigateToSchedule: () => void;
  onOpenReactNativeCode: () => void;
  role?: string;
  namaUser?: string;
  kelasUser?: string;
}

export const HomeScreen: React.FC<Props> = ({
  onNavigateToAttendance,
  onNavigateToSchedule,
  onOpenReactNativeCode,
  role = 'siswa',
  namaUser = 'Siswa',
  kelasUser = 'SMKN 1 Sorong',
}) => {
  const isSekretaris = role === 'sekretaris';
  const isGuru = role === 'guru';
  const isSiswa = role === 'siswa' || role === 'sekretaris';

  // ── GURU DASHBOARD ──────────────────────────────────────────────────────────
  if (isGuru) {
    return (
      <div className="flex flex-col w-full pb-28">
        {/* Header Guru */}
        <div className="bg-gradient-to-b from-[#1a3a5c] to-[#005fa0] text-white px-4 pt-4 pb-14 shadow-md relative">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">Panel Guru</span>
            <div className="flex items-center gap-1.5 text-xs text-sky-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>SMKN 1 Sorong</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold font-heading">Halo, {namaUser} 👋</h2>
            <p className="text-xs text-sky-200">Guru Mata Pelajaran • SMKN 1 Sorong</p>
          </div>
        </div>

        {/* Card jadwal mengajar hari ini */}
        <div className="px-4 -mt-10">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#005fa0] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900">Jadwal Mengajar Hari Ini</span>
                <p className="text-xs text-slate-500">Klik untuk input absen mapel</p>
              </div>
            </div>

            <button
              onClick={onNavigateToAttendance}
              className="w-full flex items-center justify-between p-3 bg-[#005fa0]/5 border border-[#005fa0]/20 rounded-xl hover:bg-[#005fa0]/10 transition-colors active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005fa0] flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-slate-900 block">Input Absen Mapel</span>
                  <span className="text-xs text-slate-500">Isi kehadiran per sesi mengajar</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#005fa0]" />
            </button>

            <button
              onClick={onNavigateToSchedule}
              className="w-full flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-slate-900 block">Jadwal Saya</span>
                  <span className="text-xs text-slate-500">Lihat roster mengajar minggu ini</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Validasi Absen Siswa</h3>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-sm text-slate-900 block">Lapis 2 — Validasi Guru</span>
                <span className="text-xs text-slate-500">Setelah sekretaris input, guru memvalidasi absen harian kelas yang diajar.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SISWA / SEKRETARIS DASHBOARD ────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-[#004e84] to-[#005fa0] text-white px-4 pt-4 pb-14 shadow-md relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
              Tahun Ajaran 2026/2027 Ganjil
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>SMKN 1 Sorong</span>
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-xl font-bold font-heading">Halo, {namaUser} 👋</h2>
          <p className="text-xs text-sky-200">
            {isSekretaris ? 'Sekretaris Kelas' : 'Siswa'} • {kelasUser}
          </p>
        </div>
      </div>

      {/* Student ID Card */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl p-4 shadow-[0_12px_28px_rgba(17,142,234,0.14)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#005fa0] flex items-center justify-center text-white font-bold text-lg ring-2 ring-[#0078c8]">
                  {namaUser.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#0b1c30]">{namaUser}</span>
                  {isSekretaris && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                      Sekretaris
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">{kelasUser}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Kehadiran</span>
              <span className="font-heading font-extrabold text-xl text-[#005fa0]">—</span>
              <span className="text-[10px] text-slate-400 font-semibold">Semester ini</span>
            </div>
          </div>

          {/* Streak Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">🔥 Streak Kehadiran</span>
                <span className="text-[10px] text-amber-100">Login untuk melihat streak kamu</span>
              </div>
            </div>
            <Award className="w-5 h-5 text-amber-200" />
          </div>

          {/* GPS Status */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl text-emerald-900 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">GPS Radius Sekolah Terpenuhi</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">Dalam Radius SMKN 1</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
          Layanan Presensi & Siswa
        </h3>
        <div className={`grid gap-2.5 ${isSekretaris ? 'grid-cols-4' : 'grid-cols-3'}`}>

          {/* Input Absen — HANYA untuk Sekretaris */}
          {isSekretaris && (
            <button
              onClick={onNavigateToAttendance}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 transition-all active:scale-95 cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0078c8]/10 text-[#005fa0] flex items-center justify-center mb-1.5 group-hover:bg-[#0078c8] group-hover:text-white transition-colors">
                <ClipboardList className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">Input Absen</span>
              <span className="text-[9px] text-[#0078c8] font-bold mt-0.5">Sekretaris</span>
            </button>
          )}

          {/* Jadwal Mapel — semua bisa */}
          <button
            onClick={onNavigateToSchedule}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 transition-all active:scale-95 cursor-pointer text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">Jadwal Mapel</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Hari Ini</span>
          </button>

          {/* Rekap Kehadiran — semua bisa */}
          <button
            onClick={() => alert('Fitur Rekap Kehadiran akan segera tersedia.')}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 transition-all active:scale-95 cursor-pointer text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">Rekap</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Kehadiran</span>
          </button>

          {/* Panggil Guru — semua bisa */}
          <button
            onClick={() => alert('Fitur Panggil Guru akan segera tersedia.')}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 transition-all active:scale-95 cursor-pointer text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">Panggil Guru</span>
            <span className="text-[9px] text-indigo-600 font-bold mt-0.5">Darurat</span>
          </button>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#005fa0]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Jadwal Mapel Hari Ini
            </h3>
          </div>
          <button
            onClick={onNavigateToSchedule}
            className="text-xs font-semibold text-[#005fa0] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {TODAY_SCHEDULE.map((item) => (
            <div
              key={item.period}
              className={`bg-white rounded-2xl p-3.5 shadow-sm border flex items-center justify-between transition-all ${
                item.status === 'active'
                  ? 'border-sky-400 bg-sky-50/30 ring-1 ring-sky-300'
                  : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    item.status === 'active'
                      ? 'bg-[#005fa0] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  J-{item.period}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.subject}</h4>
                    {item.status === 'active' && (
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Berlangsung
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {item.teacher} • <span className="font-semibold text-slate-800">{item.room}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                {item.timeRange.replace(' WIT', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
