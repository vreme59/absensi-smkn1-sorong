import React, { useState } from 'react';
import { Copy, Check, Code2, Smartphone, Layers, X, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReactNativeCodeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'App.tsx' | 'StudentCard.tsx' | 'types.ts'>('App.tsx');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appTsxCode = `/**
 * SMKN 1 SORONG - Student Hub & Presensi Pagi
 * Kerangka Dasar Aplikasi Mobile React Native Responsif
 * Kompatibel dengan Expo & React Native CLI
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  useWindowDimensions,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { StudentCard } from './components/StudentCard';
import { AttendanceStatus, Student } from './types';

// Data Awal Siswa XI RPL 1 (SMKN 1 Sorong)
const INITIAL_STUDENTS: Student[] = [
  { id: '01', absentNo: '01', name: 'Achmad Fauzi', nisn: '0058291042', status: 'H' },
  { 
    id: '02', 
    absentNo: '02', 
    name: 'Ahmad Dani', 
    nisn: '0058291043', 
    status: 'S',
    note: 'Flu / Demam - Ada Surat Dokter',
    hasAttachment: true 
  },
  { id: '03', absentNo: '03', name: 'Bella Safitri', nisn: '0058291045', status: 'H' },
  { 
    id: '04', 
    absentNo: '04', 
    name: 'Cindy Laura', 
    nisn: '0058291048', 
    status: 'I',
    note: 'Dispensasi LKS Web Tingkat Kota',
    approvedBy: 'Waka Kesiswaan'
  },
  { id: '05', absentNo: '05', name: 'David Christian', nisn: '0058291050', status: 'H' },
  { 
    id: '06', 
    absentNo: '06', 
    name: 'Doni Tata', 
    nisn: '0058291054', 
    status: 'B',
    badge: 'Perlu Tindak',
    warning: 'Terdeteksi Bolos: Siswa hadir di apel pagi namun tidak berada di kelas/mapel.'
  },
  { 
    id: '07', 
    absentNo: '07', 
    name: 'Kevin Pratama', 
    nisn: '0058291059', 
    status: 'S',
    badge: 'Baru Diubah',
    note: 'Sakit demam sejak semalam, surat dokter menyusul via WA Wali Kelas.',
    attachmentName: 'Surat_Keterangan.jpg'
  },
  { id: '08', absentNo: '08', name: 'M. Farhan', nisn: '0058291062', status: 'H', badge: 'Sekretaris' },
];

export default function App() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'need-action' | 'bolos' | 'alfa'>('all');

  // Real-time counter status presensi
  const summary = useMemo(() => {
    return students.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      },
      { H: 0, S: 0, I: 0, B: 0, A: 0 } as Record<AttendanceStatus, number>
    );
  }, [students]);

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAllPresent = () => {
    Alert.alert(
      'Tandai Semua Hadir?',
      'Semua status siswa akan diubah menjadi Hadir (H).',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Tandai Semua',
          onPress: () => {
            setStudents(prev => prev.map(s => ({ ...s, status: 'H' })));
          },
        },
      ]
    );
  };

  const handleSimpanKirim = () => {
    Alert.alert(
      'Kirim Draft Absensi?',
      'Draft akan diteruskan ke Guru Jam Pertama (Budi Santoso, S.Kom.) untuk validasi Lapis 2.',
      [
        { text: 'Cek Lagi', style: 'cancel' },
        {
          text: 'Kirim Sekarang',
          onPress: () => Alert.alert('Sukses', 'Draft Presensi Pagi berhasil dikirim!'),
        },
      ]
    );
  };

  // Filter siswa
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchQuery =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.absentNo.includes(searchQuery) ||
        s.nisn.includes(searchQuery);

      if (!matchQuery) return false;

      if (activeFilter === 'need-action') return s.status === 'S' || s.status === 'I' || s.status === 'B' || s.status === 'A';
      if (activeFilter === 'bolos') return s.status === 'B';
      if (activeFilter === 'alfa') return s.status === 'A';
      return true;
    });
  }, [students, searchQuery, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#005FA0" />

      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.schoolBrand}>
            <Text style={styles.schoolName}>SMKN 1 SORONG</Text>
            <View style={styles.liveDot} />
          </View>
          <View style={styles.classBadge}>
            <Text style={styles.classBadgeText}>XI RPL 1</Text>
          </View>
        </View>

        {/* Sub Header Presensi */}
        <View style={styles.subHeader}>
          <View>
            <Text style={styles.title}>Input Presensi Pagi</Text>
            <Text style={styles.subtitle}>Sekretaris Kelas • Verifikasi Lapis 1</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>XI RPL 1 (34)</Text>
          </View>
        </View>

        {/* Date & Deadline Info */}
        <View style={styles.infoStrip}>
          <Text style={styles.dateText}>📅 Selasa, 14 Mei 2024</Text>
          <View style={styles.deadlineBadge}>
            <Text style={styles.deadlineText}>⏰ Batas 07.45 WIT</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Card: Rekap Data Real-Time */}
        <View style={styles.rekapCard}>
          <View style={styles.rekapHeader}>
            <Text style={styles.rekapTitle}>📊 Rekap Data Real-Time</Text>
            <TouchableOpacity 
              style={styles.markAllBtn} 
              onPress={handleMarkAllPresent}
              activeOpacity={0.7}
            >
              <Text style={styles.markAllBtnText}>⚡ Tandai Semua H</Text>
            </TouchableOpacity>
          </View>

          {/* 5 Status Counters */}
          <View style={styles.counterRow}>
            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Hadir</Text>
              <Text style={[styles.counterValue, { color: '#005FA0' }]}>{summary.H}</Text>
              <View style={[styles.indicatorDot, { backgroundColor: '#005FA0' }]} />
            </View>

            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Sakit</Text>
              <Text style={[styles.counterValue, { color: '#954500' }]}>{summary.S}</Text>
              <View style={[styles.indicatorDot, { backgroundColor: '#954500' }]} />
            </View>

            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Izin</Text>
              <Text style={[styles.counterValue, { color: '#0461A6' }]}>{summary.I}</Text>
              <View style={[styles.indicatorDot, { backgroundColor: '#0461A6' }]} />
            </View>

            <View style={[styles.counterBox, styles.bolosBox]}>
              <Text style={[styles.counterLabel, { color: '#B91C1C', fontWeight: '700' }]}>Bolos</Text>
              <Text style={[styles.counterValue, { color: '#DC2626' }]}>{summary.B}</Text>
              <View style={[styles.indicatorDot, { backgroundColor: '#DC2626' }]} />
            </View>

            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Alfa</Text>
              <Text style={[styles.counterValue, { color: '#BA1A1A' }]}>{summary.A}</Text>
              <View style={[styles.indicatorDot, { backgroundColor: '#BA1A1A' }]} />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau no. absen siswa..."
            placeholderTextColor="#707883"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
              Semua ({students.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'need-action' && styles.filterChipActive]}
            onPress={() => setActiveFilter('need-action')}
          >
            <Text style={[styles.filterText, activeFilter === 'need-action' && styles.filterTextActive]}>
              Perlu Tindakan ({summary.S + summary.I + summary.B + summary.A})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'bolos' && styles.filterChipDanger]}
            onPress={() => setActiveFilter('bolos')}
          >
            <Text style={[styles.filterText, activeFilter === 'bolos' && styles.filterTextDanger]}>
              Bolos ({summary.B})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'alfa' && styles.filterChipActive]}
            onPress={() => setActiveFilter('alfa')}
          >
            <Text style={[styles.filterText, activeFilter === 'alfa' && styles.filterTextActive]}>
              Alfa ({summary.A})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Daftar Siswa */}
        <View style={styles.studentList}>
          {filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onStatusChange={newStatus => handleStatusChange(student.id, newStatus)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Sticky Bar */}
      <View style={styles.bottomDock}>
        <Text style={styles.bottomInfoText}>
          ℹ️ Draft akan dikirimkan ke Guru Jam Pertama (Budi Santoso, S.Kom.) untuk divalidasi (Lapis 2).
        </Text>
        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={handleSimpanKirim}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Simpan & Kirim Draft Absen 🚀</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={() => Alert.alert('Tersimpan', 'Draft tersimpan di penyimpanan offline perangkat.')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryBtnText}>💾 Simpan Sementara (Draft Offline)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    backgroundColor: '#005FA0',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  schoolBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  schoolName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D2E4FF',
  },
  classBadge: {
    backgroundColor: '#0078C8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  classBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#D1E4FF',
    fontSize: 11,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 120, 200, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateText: {
    color: '#D1E4FF',
    fontSize: 12,
    fontWeight: '600',
  },
  deadlineBadge: {
    backgroundColor: 'rgba(187, 88, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  deadlineText: {
    color: '#FFDBC8',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  tabletContainer: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  rekapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginTop: -16,
    shadowColor: '#005FA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  rekapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rekapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1C30',
  },
  markAllBtn: {
    backgroundColor: '#EFF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  markAllBtnText: {
    color: '#005FA0',
    fontSize: 11,
    fontWeight: '700',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  counterBox: {
    flex: 1,
    backgroundColor: '#EFF4FF',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bolosBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  counterLabel: {
    fontSize: 11,
    color: '#404752',
    fontWeight: '600',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#EFF4FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0B1C30',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5EEFF',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#005FA0',
  },
  filterChipDanger: {
    backgroundColor: '#FEE2E2',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#404752',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
  studentList: {
    gap: 10,
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2EAF4',
  },
  bottomInfoText: {
    fontSize: 11,
    color: '#404752',
    marginBottom: 8,
    lineHeight: 15,
  },
  primaryBtn: {
    height: 46,
    backgroundColor: '#005FA0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#005FA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryBtnText: {
    color: '#005FA0',
    fontSize: 12,
    fontWeight: '600',
  },
});
`;

  const studentCardCode = `/**
 * Komponen Responsif Kartu Siswa (StudentCard.tsx)
 * SMKN 1 SORONG Presensi Pagi
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AttendanceStatus, Student } from '../types';

interface StudentCardProps {
  student: Student;
  onStatusChange: (status: AttendanceStatus) => void;
}

const STATUS_KEYS: AttendanceStatus[] = ['H', 'S', 'I', 'B', 'A'];

export const StudentCard: React.FC<StudentCardProps> = ({ student, onStatusChange }) => {
  const getBadgeStyle = (status: AttendanceStatus) => {
    switch (status) {
      case 'H':
        return { bg: '#EFF4FF', text: '#005FA0', label: '✓ Hadir' };
      case 'S':
        return { bg: '#FFDBC8', text: '#954500', label: '🩺 Sakit' };
      case 'I':
        return { bg: '#74B4FF', text: '#004579', label: '📝 Izin' };
      case 'B':
        return { bg: '#FEE2E2', text: '#DC2626', label: '🏃 Bolos' };
      case 'A':
        return { bg: '#FFDAD6', text: '#93000A', label: '✕ Alfa' };
    }
  };

  const getNumberColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'H': return { bg: '#DCE9FF', text: '#005FA0' };
      case 'S': return { bg: '#FFDBC8', text: '#753400' };
      case 'I': return { bg: '#D2E4FF', text: '#00497F' };
      case 'B': return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'A': return { bg: '#FFDAD6', text: '#BA1A1A' };
    }
  };

  const currentBadge = getBadgeStyle(student.status);
  const numColor = getNumberColor(student.status);

  return (
    <View style={[styles.card, student.status === 'B' && styles.cardDanger]}>
      {/* Header Siswa */}
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={[styles.avatarNo, { backgroundColor: numColor.bg }]}>
            <Text style={[styles.avatarText, { color: numColor.text }]}>{student.absentNo}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{student.name}</Text>
              {student.badge && (
                <View style={[
                  styles.metaBadge, 
                  student.badge === 'Perlu Tindak' ? styles.metaBadgeRed : styles.metaBadgeOrange
                ]}>
                  <Text style={styles.metaBadgeText}>{student.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.nisn}>NISN: {student.nisn}</Text>
          </View>
        </View>

        {/* Status Chip */}
        <View style={[styles.statusChip, { backgroundColor: currentBadge.bg }]}>
          <Text style={[styles.statusChipText, { color: currentBadge.text }]}>
            {currentBadge.label}
          </Text>
        </View>
      </View>

      {/* Button Switcher [H] [S] [I] [B] [A] */}
      <View style={styles.buttonGroup}>
        {STATUS_KEYS.map((key) => {
          const isSelected = student.status === key;
          let activeBg = '#005FA0';
          let activeColor = '#FFFFFF';

          if (key === 'S') activeBg = '#BB5800';
          if (key === 'I') activeBg = '#0461A6';
          if (key === 'B') activeBg = '#DC2626';
          if (key === 'A') activeBg = '#BA1A1A';

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.statusBtn,
                isSelected && { backgroundColor: activeBg, elevation: 2 },
              ]}
              onPress={() => onStatusChange(key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  key === 'B' && !isSelected && { color: '#DC2626' },
                  isSelected && { color: activeColor, fontWeight: '800' },
                ]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notice / Attachment Strip jika ada */}
      {student.warning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ {student.warning}</Text>
        </View>
      )}

      {student.note && !student.warning && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>📎 {student.note}</Text>
          {student.approvedBy && (
            <Text style={styles.approvedText}>{student.approvedBy}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#005FA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2EAF4',
  },
  cardDanger: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarNo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1C30',
  },
  metaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaBadgeRed: {
    backgroundColor: '#FEE2E2',
  },
  metaBadgeOrange: {
    backgroundColor: '#FFEDD5',
  },
  metaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B91C1C',
  },
  nisn: {
    fontSize: 11,
    color: '#404752',
    marginTop: 1,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: '#EFF4FF',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  statusBtn: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#404752',
  },
  warningBox: {
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningText: {
    fontSize: 11,
    color: '#991B1B',
    lineHeight: 15,
  },
  noteBox: {
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
  },
  approvedText: {
    fontSize: 11,
    color: '#0461A6',
    fontWeight: '700',
    marginLeft: 6,
  },
});
`;

  const typesCode = `/**
 * Definisi Type Script untuk React Native Attendance App
 * types.ts
 */

export type AttendanceStatus = 'H' | 'S' | 'I' | 'B' | 'A';

export interface Student {
  id: string;
  absentNo: string;
  name: string;
  nisn: string;
  status: AttendanceStatus;
  badge?: 'Sekretaris' | 'Ketua Kelas' | 'Perlu Tindak' | 'Baru Diubah';
  note?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  approvedBy?: string;
  warning?: string;
}
`;

  const currentCode =
    activeTab === 'App.tsx'
      ? appTsxCode
      : activeTab === 'StudentCard.tsx'
      ? studentCardCode
      : typesCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1c30] text-white w-full max-w-4xl h-[90vh] max-h-[820px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        {/* Header Modal */}
        <div className="px-5 py-4 bg-[#071322] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0078c8] flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base leading-tight">
                  Kerangka Dasar Aplikasi React Native (Responsif)
                </h3>
                <span className="text-[10px] font-bold bg-[#0078c8]/30 text-[#9fcaff] px-2 py-0.5 rounded-full border border-[#0078c8]/40">
                  Expo / CLI Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Komponen native responsif untuk SMKN 1 Sorong Presensi Pagi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#0078c8] hover:bg-[#005fa0] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-5 py-2.5 bg-[#0a182b] border-b border-slate-800 flex items-center gap-2">
          {(['App.tsx', 'StudentCard.tsx', 'types.ts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#005fa0] text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#050b14] font-mono text-xs text-slate-200 selection:bg-[#0078c8]/40 leading-relaxed no-scrollbar">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#071322] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9fcaff]" />
            <span>Responsive with <code className="text-sky-300">useWindowDimensions()</code> and Flexbox</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
