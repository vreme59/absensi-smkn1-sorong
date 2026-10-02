// src/hooks/useStreak.ts
// Hook untuk fetch streak siswa dari Supabase
import { useState, useEffect } from 'react';
import { supabase, Streak } from '../lib/supabase';

export function useStreak(siswaId: string | null) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!siswaId) { setStreak(null); return; }
    setLoading(true);
    supabase
      .from('streak')
      .select('*')
      .eq('siswa_id', siswaId)
      .single()
      .then(({ data }) => {
        setLoading(false);
        setStreak(data as Streak ?? null);
      });
  }, [siswaId]);

  // Render label & icon berdasarkan status
  const streakIcon = streak?.status === 'aktif' ? '🔥'
    : streak?.status === 'beku' ? '❄️' : '💤';
  const streakDays = streak?.jumlah ?? 0;
  const streakStatus = streak?.status ?? 'padam';

  return { streak, loading, streakIcon, streakDays, streakStatus };
}

// src/hooks/usePanggilGuru.ts
// Hook untuk tombol panggil guru
export function usePanggilGuru() {
  const [loading, setLoading] = useState(false);

  const panggilGuru = async ({
    jadwalId,
    kelasId,
    dibuat_oleh,
    pesan = 'Kelas kosong, guru belum hadir.',
  }: {
    jadwalId: string;
    kelasId: string;
    dibuat_oleh: string;
    pesan?: string;
  }): Promise<{ success: boolean; error: string | null }> => {
    const today = new Date().toISOString().split('T')[0];

    // Cek rate limit: sudah ada panggilan hari ini?
    const { data: existing } = await supabase
      .from('panggilan_guru')
      .select('id, status')
      .eq('jadwal_id', jadwalId)
      .eq('tanggal', today)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: 'Panggilan sudah dikirim untuk kelas ini hari ini.' };
    }

    setLoading(true);
    const { error } = await supabase.from('panggilan_guru').insert({
      jadwal_id: jadwalId,
      kelas_id: kelasId,
      dibuat_oleh,
      pesan,
      tanggal: today,
      status: 'menunggu',
    });
    setLoading(false);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  };

  return { panggilGuru, loading };
}
