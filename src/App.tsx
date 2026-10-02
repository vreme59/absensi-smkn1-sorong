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
import { ClassAttendanceSummary, StudentAttendance, TeacherCallAlert, UserRole } from './types_samakan';
import { useAuth } from './hooks/useAuth';

// Old Attendance Screen
import { AttendanceScreen } from './components/AttendanceScreen';
import { SubmitModal } from './components/SubmitModal';
import { AttachmentModal } from './components/AttachmentModal';

export default function App() {
  const auth = useAuth();

  // --- UI State ---
  const [isGuestPublic, setIsGuestPublic] = useState(false);
  const [currentTab, setCurrentTab] = useState<'beranda' | 'jadwal' | 'absensi' | 'profil'>('beranda');
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
        role: supabaseRole,
        roleTitle:
          supabaseRole === 'guru' ? 'Guru Mata Pelajaran'
          : supabaseRole === 'admin' ? 'Administrator Sekolah'
          : supabaseRole === 'sekretaris' ? `Sekretaris Kelas • ${(auth.profile as any)?.kelas?.nama ?? ''}`
          : `Siswa • ${(auth.profile as any)?.kelas?.nama ?? ''}`,
        identifier: auth.profile.username,
      }
    : USER_PROFILES.siswa;

  const handleLogin = async (role: UserRole, identifier?: string, password?: string) => {
    if (!identifier || !password) return;
    setLoginError(null);
    const result = await auth.login(identifier, password);
    if (result.error) {
      setLoginError(result.error);
    } else {
      if (result.profile?.role === 'guru') {
        setCurrentTab('absensi');
      } else {
        setCurrentTab('beranda');
      }
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

  const handleMarkAllPresent = () => {
    setPreviousOldStudentsState([...oldStudents]);
    setOldStudents((prev) => prev.map((s) => ({ ...s, status: 'H' as AttendanceStatus })));
    setIsDraftSavedOffline(false);
    showToast('Berhasil', 'Semua siswa telah ditandai Hadir (H)!', 'success');
  };

  const handleSaveOfflineDraft = () => {
    localStorage.setItem('smkn1_attendance_students_v2', JSON.stringify(oldStudents));
    setIsDraftSavedOffline(true);
    showToast('Tersimpan', 'Draft presensi berhasil disimpan secara lokal (Offline)!', 'success');
  };

  const handleConfirmSubmit = () => {
    localStorage.setItem('smkn1_attendance_students_v2', JSON.stringify(oldStudents));
    setIsSubmitModalOpen(false);
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
            ❌ {loginError}
          </div>
        )}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // --- Main App ---
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between font-body text-on-surface">
      <Navbar currentTab={currentTab} user={currentUser} onSelectRole={() => {}} onOpenHtmlModal={() => {}} />

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
          <JadwalScreen onShowToast={showToast} />
        )}

        {currentTab === 'absensi' && (
          supabaseRole === 'siswa' ? (
              <div className="w-full max-w-md mx-auto pb-20">
                <AttendanceScreen
                  readOnly={true}
                  students={oldStudents}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onMarkAllPresent={handleMarkAllPresent}
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
                />
              </div>
            ) : (
            <div className="w-full max-w-md mx-auto pb-20">
              <AttendanceScreen
                students={oldStudents}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                onMarkAllPresent={handleMarkAllPresent}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                onSaveOfflineDraft={handleSaveOfflineDraft}
                onViewAttachment={(student) => {
                  setSelectedStudentForAttachment(student);
                  setAttachmentModalMode('view');
                }}
                onEditNote={(student) => {
                  setSelectedStudentForAttachment(student);
                  setAttachmentModalMode('edit');
                }}
                isDraftSavedOffline={isDraftSavedOffline}
                onNavigateHome={() => setCurrentTab('beranda')}
                containerWidthClass="max-w-md mx-auto"
              />
            </div>
          )
        )}

        {currentTab === 'profil' && (
          <ProfileScreen
            user={currentUser}
            onSelectRole={() => {}}
            onLogout={handleLogout}
            onOpenHtmlModal={() => {}}
            onShowToast={showToast}
          />
        )}
      </main>

      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        userRole={currentUser.role}
        pendingValidationCount={classSummary.validationStatus === 'menunggu_acc' ? 1 : 0}
      />

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
