export type AttendanceStatus = 'H' | 'S' | 'I' | 'B' | 'A';

export interface Attachment {
  type: 'doctor_note' | 'dispensation' | 'guardian_letter' | 'other';
  title: string;
  fileName?: string;
  fileSize?: string;
  source?: string;
  verifiedBy?: string;
  imageUrl?: string;
  date?: string;
}

export interface Student {
  id: string;
  absentNo: string;
  name: string;
  nisn: string;
  status: AttendanceStatus;
  badge?: 'Sekretaris' | 'Ketua Kelas' | 'Perlu Tindak' | 'Baru Diubah';
  note?: string;
  attachment?: Attachment;
  warningAlert?: string;
  lastUpdated?: string;
}

export interface ClassInfo {
  name: string;
  school: string;
  totalStudents: number;
  dateStr: string;
  deadline: string;
  secretaryName: string;
  teacherJam1: string;
  homeroomTeacher: string;
}

export interface TimetablePeriod {
  period: number;
  timeRange: string;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  status: 'active' | 'upcoming' | 'completed';
}
