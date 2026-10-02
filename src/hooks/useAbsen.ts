// src/hooks/useAbsen.ts
// Hook absensi harian & per mapel — simpan ke Supabase
import { useState, useEffect, useCallback } from 'react';
import { supabase, StatusAbsen, AbsenHarian } from '../lib/supabase';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// ─── Absen Harian ──────────────────────────────────────────────────────────

export function useAbsenHarian(kelasId: string | null) {
  const [absenList, setAbsenList] = useState<AbsenHarian[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = getTodayStr();

  const fetch = useCallback(async () => {
    if (!kelasId) { setAbsenList([]); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('absen_harian')
      .select('*')
      .eq('kelas_id', kelasId)
      .eq('tanggal', today);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setAbsenList((data ?? []) as AbsenHarian[]);
  }, [kelasId, today]);

  useEffect(() => { fetch(); }, [fetch]);

  // Simpan draft absen (sekretaris atau guru)
  const simpanDraft = useCallback(async (
    siswaList: { id: string; nama: string }[],
    statusMap: Record<string, StatusAbsen>,
    keteranganMap: Record<string, string>,
    inputBy: string
  ) => {
    if (!kelasId) return { success: false, error: 'Kelas tidak diketahui.' };

    const rows = siswaList.map(s => ({
      tanggal: today,
      siswa_id: s.id,
      kelas_id: kelasId,
      status: statusMap[s.id] ?? 'Hadir',
      keterangan: keteranganMap[s.id] || null,
      diinput_oleh: inputBy,
      status_validasi: 'draft' as const,
    }));

    const { error: err } = await supabase
      .from('absen_harian')
      .upsert(rows, { onConflict: 'tanggal,siswa_id' });

    if (err) return { success: false, error: err.message };
    await fetch(); // refresh
    return { success: true, error: null };
  }, [kelasId, today, fetch]);

  // Validasi absen (guru mapel pertama)
  const validasi = useCallback(async (guruId: string) => {
    if (!kelasId) return { success: false, error: 'Kelas tidak diketahui.' };

    const { error: err } = await supabase
      .from('absen_harian')
      .update({
        status_validasi: 'tervalidasi',
        divalidasi_oleh: guruId,
      })
      .eq('tanggal', today)
      .eq('kelas_id', kelasId)
      .eq('status_validasi', 'draft');

    if (err) return { success: false, error: err.message };
    await fetch();
    return { success: true, error: null };
  }, [kelasId, today, fetch]);

  const sudahValidasi = absenList.some(a => a.status_validasi === 'tervalidasi');
  const sudahDraft = absenList.length > 0;

  return { absenList, loading, error, simpanDraft, validasi, sudahValidasi, sudahDraft, refresh: fetch };
}

// ─── Absen Per Mapel ───────────────────────────────────────────────────────

export function useAbsenMapel(jadwalId: string | null) {
  const [absenList, setAbsenList] = useState<{ siswa_id: string; status: StatusAbsen }[]>([]);
  const [loading, setLoading] = useState(false);
  const today = getTodayStr();

  const fetch = useCallback(async () => {
    if (!jadwalId) { setAbsenList([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('absen_mapel')
      .select('siswa_id, status')
      .eq('jadwal_id', jadwalId)
      .eq('tanggal', today);
    setLoading(false);
    setAbsenList((data ?? []) as { siswa_id: string; status: StatusAbsen }[]);
  }, [jadwalId, today]);

  useEffect(() => { fetch(); }, [fetch]);

  const simpan = useCallback(async (
    rows: { siswa_id: string; status: StatusAbsen }[],
    guruId: string
  ) => {
    if (!jadwalId) return { success: false, error: 'Jadwal tidak diketahui.' };

    const data = rows.map(r => ({
      tanggal: today,
      jadwal_id: jadwalId,
      siswa_id: r.siswa_id,
      status: r.status,
      diinput_oleh: guruId,
    }));

    const { error: err } = await supabase
      .from('absen_mapel')
      .upsert(data, { onConflict: 'tanggal,jadwal_id,siswa_id' });

    if (err) return { success: false, error: err.message };
    await fetch();
    return { success: true, error: null };
  }, [jadwalId, today, fetch]);

  const absenMap: Record<string, StatusAbsen> = {};
  absenList.forEach(a => { absenMap[a.siswa_id] = a.status; });

  return { absenMap, loading, simpan, refresh: fetch };
}

// ─── Siswa dalam kelas ─────────────────────────────────────────────────────

export function useSiswaKelas(kelasId: string | null) {
  const [siswa, setSiswa] = useState<{ id: string; nama: string; username: string; is_sekretaris: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kelasId) { setSiswa([]); return; }
    setLoading(true);
    supabase
      .from('profiles')
      .select('id, nama, username, is_sekretaris')
      .eq('kelas_id', kelasId)
      .eq('role', 'siswa')
      .order('nama')
      .then(({ data }) => {
        setLoading(false);
        setSiswa((data ?? []) as typeof siswa);
      });
  }, [kelasId]);

  return { siswa, loading };
}
