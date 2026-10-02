import { ScheduleDay, SubjectSchedule } from '../../types/attendance';

export const SCHEDULE_DAYS: ScheduleDay[] = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
  { id: 'sabtu', name: 'Sabtu' },
];

export const SCHEDULES_BY_DAY: Record<string, SubjectSchedule[]> = {
  senin: [
    {
      id: 'senin-1',
      subject: 'Materi TKA',
      time: '08.15 - 11.50',
      teacher: 'Titalae Walalayo, S.Kom',
      type: 'productive'
    },
    {
      id: 'senin-2',
      subject: 'Materi TKA',
      time: '11.50 - 13.25',
      teacher: 'Haris Titirloloby, S.Kom',
      type: 'productive'
    },
    {
      id: 'senin-3',
      subject: 'Materi TKA',
      time: '13.25 - 14.45',
      teacher: 'Yovani Romauli Sitorus, S.Pd',
      type: 'productive'
    },
  ],
  selasa: [
    {
      id: 'selasa-1',
      subject: 'PPKn',
      time: '08.15 - 09.35',
      teacher: 'Alfrida Serang Kasy, S.Pd',
      type: 'general'
    },
    {
      id: 'selasa-2',
      subject: 'Materi TKA',
      time: '09.35 - 12.30',
      teacher: 'Mohammad Sya\'ban, S.Pd',
      type: 'productive'
    },
    {
      id: 'selasa-3',
      subject: 'Materi TKA',
      time: '12.45 - 14.45',
      teacher: 'Toriq Najamudin, A.Md',
      type: 'productive'
    },
  ],
  rabu: [
    {
      id: 'rabu-1',
      subject: 'Bahasa Indonesia',
      time: '08.15 - 10.15',
      teacher: 'Dra. Yayuk Puji Hastuti',
      type: 'general'
    },
    {
      id: 'rabu-2',
      subject: 'Bahasa Inggris',
      time: '10.30 - 12.30',
      teacher: 'Dinaria Purba, A.Md, S.Pd',
      type: 'general'
    },
    {
      id: 'rabu-3',
      subject: 'Matematika',
      time: '12.45 - 14.45',
      teacher: 'Ani Widiastuti, S.T',
      type: 'general'
    },
  ],
  kamis: [
    {
      id: 'kamis-1',
      subject: 'Materi TKA',
      time: '08.15 - 12.30',
      teacher: 'Toriq Najamudin, A.Md',
      type: 'productive'
    },
    {
      id: 'kamis-2',
      subject: 'Matematika',
      time: '12.45 - 14.45',
      teacher: 'Ani Widiastuti, S.T',
      type: 'general'
    },
  ],
  jumat: [
    {
      id: 'jumat-1',
      subject: 'Materi TKA',
      time: '08.15 - 09.15',
      teacher: 'Toriq Najamudin, A.Md',
      type: 'productive'
    },
    {
      id: 'jumat-2',
      subject: 'Bahasa Indonesia',
      time: '09.15 - 11.00',
      teacher: 'Dra. Yayuk Puji Hastuti',
      type: 'general'
    },
  ],
  sabtu: [
    {
      id: 'sabtu-1',
      subject: 'Bahasa Inggris',
      time: '08.15 - 10.15',
      teacher: 'Dinaria Purba, A.Md, S.Pd',
      type: 'general'
    },
    {
      id: 'sabtu-2',
      subject: 'Materi TKA',
      time: '10.30 - 11.50',
      teacher: 'Yovani Romauli Sitorus, S.Pd',
      type: 'productive'
    },
    {
      id: 'sabtu-3',
      subject: 'Materi TKA',
      time: '12.05 - 13.25',
      teacher: 'Toriq Najamudin, A.Md',
      type: 'productive'
    },
  ],
};
