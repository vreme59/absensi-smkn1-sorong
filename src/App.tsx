import { supabase } from './lib/supabase';
import React, { useState } from 'react';
import {
  INITIAL_CLASS_SUMMARY,
  INITIAL_STUDENTS as SAMAKAN_INITIAL_STUDENTS,
  INITIAL_TEACHER_ALERT,
  USER_PROFILES,
} from './data/samakan/mockData';
import { INITIAL_STUDENTS as OLD_INITIAL_STUDENTS } from './data/students';
import { Student, AttendanceStatus } from './types/attendance';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNavSamakan';
import { Toast, ToastData } from './components/Toast';
import { HomeScreen } from './components/HomeScreenSamakan';
import { LoginScreen } from './components/LoginScreen';
import { JadwalScreen } from './components/JadwalScreen';
import { ProfileScreen } from './components/ProfileScreenSamakan';
import { EditProfileScreen } from './components/EditProfileScreen';
import { ChangePasswordScreen } from './components/ChangePasswordScreen';
import { ClassAttendanceSummary, StudentAttendance, TeacherCallAlert, UserRole } from './types';
import { useAuth } from './hooks/useAuth';

// Old Attendance Screen
import { AttendanceScreen } from './components/AttendanceScreen';
import { SubmitModal } from './components/SubmitModal';
import { AttachmentModal } from './components/AttachmentModal';
import { ValidasiGuruScreen } from './components/ValidasiGuruScreen';
import { WaliKelasDashboard } from './components/WaliKelasDashboard';
import { GuruPiketDashboard } from './components/GuruPiketDashboard';

export default function App() {
  const auth = useAuth();

  // --- UI State ---
  const [isGuestPublic, setIsGuestPublic] = useState(false);
  const [currentTab, setCurrentTab] = useState<'beranda' | 'jadwal' | 'absensi' | 'profil' | 'edit-profil' | 'ganti-password' | 'wali-kelas' | 'guru-piket'>('beranda');
  const [toast, setToast] = useState<ToastData | null>(null);
  
  // Samakan state
  const [classSummary, setClassSummary] = useState<ClassAttendanceSummary>(INITIAL_CLASS_SUMMARY);
  const [samakanStudents, setSamakanStudents] = useState<StudentAttendance[]>(SAMAKAN_INITIAL_STUDENTS);
  const [teacherAlert, setTeacherAlert] = useState<TeacherCallAlert>(INITIAL_TEACHER_ALERT);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Old Attendance state
  const [oldStudents, setOldStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smkn1_attendance_students_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return OLD_INITIAL_STUDENTS;
  });
  const [isDraftSavedOffline, setIsDraftSavedOffline] = useState<boolean>(false);
  const [previousOldStudentsState, setPreviousOldStudentsState] = useState<Student[] | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [selectedStudentForAttachment, setSelectedStudentForAttachment] = useState<Student | null>(null);
  const [attachmentModalMode, setAttachmentModalMode] = useState<'view' | 'edit'>('view');

  const showToast = (title: string, description: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    setToast({ title, description, type });
    setTimeout(() => setToast(null), 4000);
  };

  const supabaseRole: UserRole = (auth.userRole as UserRole) ?? 'siswa';
  const currentUser = auth.profile
    ? {
        ...USER_PROFILES[supabaseRole] ?? USER_PROFILES.siswa,
        id: auth.profile.id,
        name: auth.profile.nama,
        phone: auth.profile.phone || '',
        avatarUrl: auth.profile.avatar_url || (USER_PROFILES[supabaseRole] ?? USER_PROFILES.siswa).avatarUrl,
        role: supabaseRole,
        roleTitle:
          supabaseRole === 'operator' ? 'Administrator Sekolah'
          : supabaseRole === 'guru_piket' ? 'Guru Piket'
          : supabaseRole === 'wali_kelas' ? 'Wali Kelas'
          : supabaseRole === 'guru' ? 'Guru Mata Pelajaran'
          : supabaseRole === 'sekretaris' ? 'Sekretaris Kelas'
          : 'Siswa',
        identifier: auth.profile.username,
        kelas_id: auth.profile.kelas_id || 'e88128be-8fc3-4973-8d69-00ef17571626',
        kelas: (auth.profile as any).kelas || { id: 'e88128be-8fc3-4973-8d69-00ef17571626', nama: 'XII TKJ 1' },
      }
    : {
        ...USER_PROFILES.siswa,
        kelas_id: 'e88128be-8fc3-4973-8d69-00ef17571626',
        kelas: { id: 'e88128be-8fc3-4973-8d69-00ef17571626', nama: 'XII TKJ 1' },
      };

  // Load real students for currentUser.kelas_id
  React.useEffect(() => {
    const targetKelasId = currentUser.kelas_id;
    if (!targetKelasId) return;

    async function loadClassStudents() {
      const { data: dbStudents } = await supabase
        .from('profiles')
        .select('id, nama, username')
        .eq('kelas_id', targetKelasId)
        .eq('role', 'siswa')
        .order('nama', { ascending: true });

      if (dbStudents && dbStudents.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: todayAbsen } = await supabase
          .from('absen_harian')
          .select('siswa_id, status, keterangan')
          .eq('kelas_id', targetKelasId)
          .eq('tanggal', todayStr);

        const statusMap: Record<string, any> = {};
        (todayAbsen || []).forEach((a: any) => {
          const s = a.status === 'Hadir' ? 'H' : a.status === 'Sakit' ? 'S' : a.status === 'Izin' ? 'I' : a.status === 'Bolos' ? 'B' : 'A';
          statusMap[a.siswa_id] = { status: s, note: a.keterangan };
        });

        const mapped: Student[] = dbStudents.map((s, idx) => {
          const numStr = String(idx + 1).padStart(2, '0');
          const existing = statusMap[s.id];
          return {
            id: s.id,
            absentNo: numStr,
            name: s.nama,
            studentNo: numStr,
            nisn: s.username.replace(/^s_?/, ''),
            status: existing ? existing.status : 'H',
            note: existing?.note || undefined,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama)}&background=005fa0&color=fff`,
          };
        });

        setOldStudents(mapped);
      }
    }

    loadClassStudents();
  }, [currentUser.kelas_id]);

  const handleLogin = async (_role: UserRole, identifier?: string, password?: string) => {
    if (!identifier || !password) return;
    setLoginError(null);

    const result = await auth.login(identifier, password);
    if (result.error) {
      setLoginError(result.error);
    } else {
      setCurrentTab('beranda');
      showToast('Login Berhasil!', `Selamat datang, ${result.profile?.nama ?? identifier}!`, 'success');
    }
  };

  const handleOpenPublicSchedule = () => {
    setIsGuestPublic(true);
    setCurrentTab('jadwal');
  };

  const handleLogout = async () => {
    await auth.logout();
    setIsGuestPublic(false);
    setCurrentTab('beranda');
    setLoginError(null);
  };

  // --- Samakan Handlers ---
  const handleSendTeacherCall = () => {
    setTeacherAlert((prev) => ({ ...prev, isActive: true, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIT', statusResponse: 'pending' }));
  };

  const handleSubmitMorningDraft = (updatedStudents: StudentAttendance[]) => {
    setSamakanStudents(updatedStudents);
    const presentCount = updatedStudents.filter((s) => s.morningStatus === 'hadir').length;
    setClassSummary((prev) => ({ ...prev, present: presentCount, sick: updatedStudents.filter(s => s.morningStatus === 'sakit').length, permitted: updatedStudents.filter(s => s.morningStatus === 'izin').length, unexcused: updatedStudents.filter(s => s.morningStatus === 'alfa').length, validationStatus: 'menunggu_acc' }));
  };

  // --- Old Attendance Handlers ---
  const handleUpdateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setOldStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          return { ...student, status, warningAlert: status === 'B' ? (student.warningAlert || 'Terdeteksi Bolos: Siswa tidak berada di kelas.') : undefined };
        }
        return student;
      })
    );
    setIsDraftSavedOffline(false);
  };


  const handleSaveOfflineDraft = () => {
    localStorage.setItem('smkn1_attendance_students_v2', JSON.stringify(oldStudents));
    setIsDraftSavedOffline(true);
    showToast('Tersimpan', 'Draft presensi berhasil disimpan secara lokal (Offline)!', 'success');
  };

  const handleConfirmSubmit = async () => {
    localStorage.setItem('smkn1_attendance_students_v2', JSON.stringify(oldStudents));
    setIsSubmitModalOpen(false);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const targetKelasId = currentUser.kelas_id;
      if (targetKelasId) {
        const rows = oldStudents.map(s => {
          const dbStatus = s.status === 'H' ? 'Hadir' : s.status === 'S' ? 'Sakit' : s.status === 'I' ? 'Izin' : s.status === 'B' ? 'Bolos' : 'Alfa';
          return {
            tanggal: todayStr,
            siswa_id: s.id,
            kelas_id: targetKelasId,
            status: dbStatus,
            keterangan: s.note || null,
            diinput_oleh: currentUser.id,
            status_validasi: 'draft' as const
          };
        });
        await supabase.from('absen_harian').upsert(rows, { onConflict: 'tanggal,siswa_id' });
      }
    } catch (e) {
      console.error('Error saving absen_harian:', e);
    }

    showToast('Berhasil', 'Draft berhasil dikirim untuk validasi!', 'success');
  };

  const handleSaveNote = (studentId: string, note: string, fileName?: string) => {
    setOldStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            note,
            badge: 'Baru Diubah',
            attachment: s.attachment
              ? { ...s.attachment, fileName: fileName || s.attachment.fileName }
              : { type: 'doctor_note', title: 'Keterangan Khusus', fileName: fileName || 'Keterangan.jpg', date: new Date().toLocaleDateString('id-ID') },
          };
        }
        return s;
      })
    );
    setSelectedStudentForAttachment(null);
    showToast('Berhasil', 'Keterangan dan lampiran berhasil diperbarui.', 'success');
  };

  // --- Loading ---
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#005fa0] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 font-medium">Memuat aplikasi...</span>
        </div>
      </div>
    );
  }

  // --- Login Screen ---
  if (!auth.isLoggedIn && !isGuestPublic) {
    return (
      <>
        <LoginScreen
          onLoginSuccess={handleLogin}
          onOpenPublicSchedule={handleOpenPublicSchedule}
        />
        {loginError && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-xs text-center">
            Ã¢ÂÅ’ {loginError}
          </div>
        )}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // --- Main App ---
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface flex flex-col justify-between font-body text-on-surface">
      {currentTab !== 'edit-profil' && currentTab !== 'ganti-password' && (
        <Navbar
          currentTab={currentTab}
          user={currentUser}
          onSelectRole={() => {}}
          onOpenHtmlModal={() => {}}
          onNavigateToTab={(tab) => setCurrentTab(tab as any)}
        />
      )}

      {isGuestPublic && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-sm">
          <span>Mode Tamu: Jadwal Pelajaran Publik SMKN 1 Sorong</span>
          <button onClick={() => setIsGuestPublic(false)} className="bg-white/80 hover:bg-white px-2 py-0.5 rounded text-[11px] text-amber-900">Masuk ke Akun</button>
        </div>
      )}

      <main className={`flex-1 w-full ${isGuestPublic ? 'pt-24' : 'pt-16'}`}>
        {currentTab === 'beranda' && (
          <HomeScreen
            user={currentUser}
            classSummary={classSummary}
            students={samakanStudents}
              oldStudents={oldStudents}
            teacherAlert={teacherAlert}
            onSendTeacherCall={handleSendTeacherCall}
            onSubmitMorningDraft={handleSubmitMorningDraft}
            onNavigateToTab={(tab) => setCurrentTab(tab as any)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'jadwal' && (
          <JadwalScreen onShowToast={showToast} user={currentUser} />
        )}

        {currentTab === 'absensi' && (
          supabaseRole === 'siswa' ? (
              <div className="w-full max-w-md mx-auto pb-20">
                <AttendanceScreen
                  readOnly={true}
                  classTitle={currentUser.kelas?.nama}
                  students={oldStudents}
                  onUpdateStudentStatus={handleUpdateStudentStatus}

                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onSaveOfflineDraft={handleSaveOfflineDraft}
                  onViewAttachment={(student) => {
                    setSelectedStudentForAttachment(student);
                    setAttachmentModalMode('view');
                  }}
                  onEditNote={(student) => {
                    setSelectedStudentForAttachment(student);
                    setAttachmentModalMode('view'); // Just view for siswa
                  }}
                  isDraftSavedOffline={isDraftSavedOffline}
                  onNavigateHome={() => setCurrentTab('beranda')}
                  containerWidthClass="max-w-md mx-auto"
                />
              </div>
            ) : (
            <ValidasiGuruScreen
              user={currentUser}
              onShowToast={showToast}
            />
          )
        )}

        {currentTab === 'wali-kelas' && (
          <WaliKelasDashboard
            user={currentUser}
            onNavigateHome={() => setCurrentTab('beranda')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'guru-piket' && (
          <GuruPiketDashboard
            user={currentUser}
            onNavigateHome={() => setCurrentTab('beranda')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'edit-profil' && (
          <EditProfileScreen onBack={() => setCurrentTab('profil')} user={currentUser} onProfileUpdated={() => { if (auth.profile) { /* refetch handled by auth state */ } }} />
        )}
        {currentTab === 'profil' && (
          <ProfileScreen
            user={currentUser}
            onLogout={handleLogout}
            onShowToast={showToast}
            onEditProfile={() => setCurrentTab('edit-profil')}
              onChangePassword={() => setCurrentTab('ganti-password')}
          />
        )}
        {currentTab === 'ganti-password' && (
          <ChangePasswordScreen onBack={() => setCurrentTab('profil')} />
        )}
      </main>

      {currentTab !== 'edit-profil' && currentTab !== 'ganti-password' && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab as any)}
          userRole={currentUser.role}
          pendingValidationCount={classSummary.validationStatus === 'menunggu_acc' ? 1 : 0}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Modals for Old Attendance Screen */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        students={oldStudents}
        onConfirmSuccess={handleConfirmSubmit}
      />
      <AttachmentModal
        student={selectedStudentForAttachment}
        mode={attachmentModalMode}
        isOpen={Boolean(selectedStudentForAttachment)}
        onClose={() => setSelectedStudentForAttachment(null)}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
}




