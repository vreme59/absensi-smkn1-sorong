// src/hooks/useJadwal.ts
// Hook untuk fetch jadwal dari Supabase
import { useState, useEffect } from 'react';
import { supabase, Jadwal, HariEnum } from '../lib/supabase';
import { ScheduleItem } from '../types';

const HARI_MAP: Record<string, HariEnum> = {
  senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu',
  kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu',
};

const JS_DAY_TO_HARI: Record<number, HariEnum> = {
  1: 'Senin', 2: 'Selasa', 3: 'Rabu',
  4: 'Kamis', 5: 'Jumat', 6: 'Sabtu',
};

function jadwalToScheduleItem(j: Jadwal, now: Date): ScheduleItem {
  const [startH, startM] = j.jam_mulai.split(':').map(Number);
  const [endH, endM] = j.jam_selesai.split(':').map(Number);
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  let status: ScheduleItem['status'] = 'upcoming';
  if (currentMins >= endMins) status = 'completed';
  else if (currentMins >= startMins && currentMins < endMins) status = 'live';

  const progressMinutes = status === 'live' ? currentMins - startMins : 0;
  const remainingMinutes = status === 'live' ? endMins - currentMins : 0;

  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    id: j.id,
    period: '',
    startTime: `${pad(startH)}.${pad(startM)}`,
    endTime: `${pad(endH)}.${pad(endM)}`,
    subject: j.mapel?.nama ?? '—',
    teacher: j.guru?.nama ?? '—',
    room: '',
    status,
    progressMinutes,
    remainingMinutes,
  };
}

// ─── Hook: fetch jadwal per kelas per hari ───────────────────────────────
export function useJadwalHarian(kelasId: string | null, hari?: HariEnum) {
  const [jadwal, setJadwal] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetHari = hari ?? JS_DAY_TO_HARI[new Date().getDay()] ?? 'Senin';

  useEffect(() => {
    if (!kelasId) { setJadwal([]); return; }

    setLoading(true);
    supabase
      .from('jadwal')
      .select('*, mapel:mapel_id(id,nama), guru:guru_id(id,nama)')
      .eq('kelas_id', kelasId)
      .eq('hari', targetHari)
      .order('jam_mulai')
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) { setError(err.message); return; }
        const now = new Date();
        setJadwal((data ?? []).map(j => jadwalToScheduleItem(j as Jadwal, now)));
      });
  }, [kelasId, targetHari]);

  return { jadwal, loading, error };
}

// ─── Hook: fetch jadwal guru hari ini ────────────────────────────────────
export function useJadwalGuru(guruId: string | null, hari?: HariEnum) {
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetHari = hari ?? JS_DAY_TO_HARI[new Date().getDay()] ?? 'Senin';

  useEffect(() => {
    if (!guruId) { setJadwal([]); return; }

    setLoading(true);
    supabase
      .from('jadwal')
      .select('*, kelas:kelas_id(id,nama), mapel:mapel_id(id,nama)')
      .eq('guru_id', guruId)
      .eq('hari', targetHari)
      .order('jam_mulai')
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) { setError(err.message); return; }
        setJadwal((data ?? []) as Jadwal[]);
      });
  }, [guruId, targetHari]);

  return { jadwal, loading, error };
}

// ─── Hook: semua kelas (untuk dropdown publik) ────────────────────────────
export function useAllKelas() {
  const [kelas, setKelas] = useState<{ id: string; nama: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('kelas')
      .select('id, nama')
      .order('nama')
      .then(({ data }) => {
        setLoading(false);
        setKelas(data ?? []);
      });
  }, []);

  return { kelas, loading };
}

// ─── Hook: jadwal semua hari (untuk tampilan mingguan) ────────────────────
export function useJadwalMingguan(kelasId: string | null) {
  const [jadwalByHari, setJadwalByHari] = useState<Record<string, ScheduleItem[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kelasId) { setJadwalByHari({}); return; }

    setLoading(true);
    supabase
      .from('jadwal')
      .select('*, mapel:mapel_id(id,nama), guru:guru_id(id,nama)')
      .eq('kelas_id', kelasId)
      .order('hari')
      .order('jam_mulai')
      .then(({ data }) => {
        setLoading(false);
        if (!data) return;

        const now = new Date();
        const grouped: Record<string, ScheduleItem[]> = {};
        (data as Jadwal[]).forEach(j => {
          const key = j.hari.toLowerCase();
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(jadwalToScheduleItem(j, now));
        });
        setJadwalByHari(grouped);
      });
  }, [kelasId]);

  return { jadwalByHari, loading };
}
