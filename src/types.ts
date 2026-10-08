export type UserRole = 'siswa' | 'sekretaris' | 'guru' | 'wali_kelas' | 'guru_piket' | 'operator';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  identifier: string;
  classRoom?: string;
  homeroomTeacher?: string;
  avatarUrl: string;
  nipOrNisnLabel: string;
  isAtSchool: boolean;
  attendanceRate: number;
  streakDays: number;
  phone?: string;
  kelas_id?: string;
  kelas?: { id: string; nama: string };
  is_wali_kelas?: boolean;
  wali_kelas?: { id: string; nama: string };
  is_guru_piket?: boolean;
}

export interface ScheduleItem {
  id: string;
  period: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  teacherNip?: string;
  room: string;
  status: 'completed' | 'live' | 'upcoming' | 'last_period';
  isBreak?: boolean;
  breakDuration?: string;
  progressMinutes?: number;
  remainingMinutes?: number;
}

export interface StudentAttendance {
  id: string;
  name: string;
  studentNo: string;
  nisn: string;
  avatarUrl: string;
  morningStatus: 'hadir' | 'sakit' | 'izin' | 'alfa';
  morningCheckInTime?: string;
  note?: string;
  subjectStatus: 'hadir' | 'bolos' | 'dispensasi';
  attachmentUrl?: string;
}

export interface ClassAttendanceSummary {
  className: string;
  totalStudents: number;
  present: number;
  sick: number;
  permitted: number;
  unexcused: number;
  validationStatus: 'draft' | 'menunggu_acc' | 'tervalidasi';
  validatedBy?: string;
  validatedAt?: string;
}

export interface TeacherCallAlert {
  id: string;
  className: string;
  subject: string;
  room: string;
  timestamp: string;
  message: string;
  teacherName: string;
  isActive: boolean;
  statusResponse?: 'menuju_kelas' | 'tugas_mandiri' | 'pending';
}
