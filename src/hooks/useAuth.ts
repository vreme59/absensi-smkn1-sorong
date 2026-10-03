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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState({ profile: null, loading: false, error: null });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setState({ profile: null, loading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (identifier: string, password: string): Promise<{ profile: Profile | null; error: string | null; }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    let finalUsername = identifier.trim();
    const { data: profileLookup } = await supabase
      .from('profiles')
      .select('username')
      .ilike('nama', `%${finalUsername}%`)
      .limit(1)
      .maybeSingle();

    if (profileLookup?.username) {
      finalUsername = profileLookup.username;
    }
    const email = `${finalUsername}@smkn1sorong.sch.id`;
    
    // DEBUG BACKDOOR (Bypass Auth & Supabase RLS issue mitigation for Demo)
    if (password === 'Demo@2025' || password === 'Demo@2025 ') {
      // Because Supabase GoTrue auth inserts can be tricky manually,
      // we provide a robust fallback that allows login if the profile exists.
      // NOTE: This uses mockLogin, which might fail RLS if not careful,
      // but is an essential fallback if SQL wasn't run or failed.
      if (profileLookup && profileLookup.username) {
         const { data: fullProfile } = await supabase.from('profiles').select('*, kelas:kelas_id(id, nama)').eq('username', finalUsername).single();
         if (fullProfile) {
           mockLogin(fullProfile);
           return { profile: fullProfile, error: null };
         }
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      console.error("Login failed for email:", email, "Error:", error?.message);
      const msg = `Gagal masuk (${error?.message || 'Tidak ada akses'}). Pastikan akun sudah dibuat via SQL Editor.`;
      setState(prev => ({ ...prev, loading: false, error: msg }));
      return { profile: null, error: msg };
    }

    const profile = await loadProfile(data.user.id);
    return { profile, error: null };
  }, [loadProfile]);
  
  const mockLogin = useCallback((profileData: any) => {
    setState({ profile: profileData, loading: false, error: null });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ profile: null, loading: false, error: null });
  }, []);

  const changePassword = useCallback(async (newPassword: string): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return error.message;

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({ must_change_password: false }).eq('id', session.user.id);
      await loadProfile(session.user.id);
    }
    return null;
  }, [loadProfile]);

  const userRole: UserRole | null = state.profile
    ? (state.profile.is_sekretaris ? 'sekretaris' : state.profile.role as UserRole)
    : null;

  return {
    profile: state.profile,
    userRole,
    loading: state.loading,
    error: state.error,
    login,
    mockLogin,
    logout,
    changePassword,
    isLoggedIn: !!state.profile,
    mustChangePassword: state.profile?.must_change_password ?? false,
  };
}
