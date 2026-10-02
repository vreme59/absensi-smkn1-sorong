// src/hooks/useAuth.ts
// Hook autentikasi — menggantikan simulasi di LoginScreen
import { useState, useEffect, useCallback } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { UserRole } from '../types';

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    profile: null,
    loading: true,
    error: null,
  });

  // Ambil profil saat ada sesi aktif
  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, kelas:kelas_id(id, nama)')
      .eq('id', userId)
      .single();

    if (error || !data) {
      setState({ profile: null, loading: false, error: 'Profil tidak ditemukan.' });
      return null;
    }
    setState({ profile: data as Profile, loading: false, error: null });
    return data as Profile;
  }, []);

  // Cek sesi saat pertama load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState({ profile: null, loading: false, error: null });
      }
    });

    // Dengarkan perubahan sesi (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState({ profile: null, loading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // Login dengan username + password
  const login = useCallback(async (identifier: string, password: string): Promise<{
    profile: Profile | null;
    error: string | null;
  }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Email virtual: username@smkn1sorong.sch.id
    const email = `${identifier.trim()}@smkn1sorong.sch.id`;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      const msg = 'Username atau password salah.';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      return { profile: null, error: msg };
    }

    const profile = await loadProfile(data.user.id);
    return { profile, error: null };
  }, [loadProfile]);

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ profile: null, loading: false, error: null });
  }, []);

  // Ganti password (wajib saat login pertama)
  const changePassword = useCallback(async (newPassword: string): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return error.message;

    // Set must_change_password = false
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', session.user.id);

      // Refresh profil
      await loadProfile(session.user.id);
    }
    return null;
  }, [loadProfile]);

  // Map role DB ke UserRole di types.ts
  const userRole: UserRole | null = state.profile
    ? (state.profile.is_sekretaris ? 'sekretaris' : state.profile.role as UserRole)
    : null;

  return {
    profile: state.profile,
    userRole,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    changePassword,
    isLoggedIn: !!state.profile,
    mustChangePassword: state.profile?.must_change_password ?? false,
  };
}
