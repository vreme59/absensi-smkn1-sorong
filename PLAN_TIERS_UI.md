# Tier & UI/UX Plan - Absensi SMKN1 Sorong

> DANA-inspired: friendly, rounded, large tap targets, 1-action-per-screen.

---

## 1. Tier Count: 6

Current app has 4 roles: `siswa`, `sekretaris`, `guru`, `admin`. Flawed: `sekretaris` as separate role breaks hierarchy, `admin` conflates guru piket + operator.

**Proposed: 6 tiers, hierarchical. Upper tier inherits lower permissions.**

```
Tier 6 - Operator Sekolah (Super Admin)
  Tier 5 - Guru Piket (Admin Harian)
    Tier 4 - Wali Kelas
      Tier 3 - Guru Mapel
        Tier 2 - Sekretaris
          Tier 1 - Siswa
```

### Why 6 not 4?
- `sekretaris` not standalone account. It's `siswa` + flag. Wali kelas grants/revokes.
- `guru piket` != `operator`. Piket = daily duty (validate, picket schedule). Operator = system config (manage all schedules, users, kelas).
- `wali kelas` needed as bridge: monitors one kelas, assigns sekretaris. Current app has no such role.

### Permission Matrix

| Feature | Siswa (1) | Sekretaris (2) | Guru Mapel (3) | Wali Kelas (4) | Guru Piket (5) | Operator (6) |
|---|---|---|---|---|---|---|
| **View jadwal & own attendance** | ✅ | ✅ | ✅ (own mapel) | ✅ (kelas binaan) | ✅ (all) | ✅ (all) |
| **View rekap kelas** | view only | view only | view only | ✅ monitor | ✅ | ✅ |
| **Input absen pagi (draft)** | ❌ | ✅ own kelas only | ❌ | ❌ | ❌ | ❌ |
| **Kirim panggilan guru** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Validasi absen pagi** | ❌ | ❌ | ❌ | ✅ own kelas | ✅ all kelas | ✅ |
| **Validasi absen mapel** | ❌ | ❌ | ✅ own mapel | ✅ | ✅ | ✅ |
| **Respon panggilan guru** | ❌ | ❌ | ✅ | ✅ | ✅ (priority) | ❌ |
| **Assign/revoke sekretaris** | ❌ | ❌ | ❌ | ✅ own kelas (max 2) | ❌ | ✅ override |
| **Kelola jadwal pelajaran** | ❌ | ❌ | ❌ | ❌ | ❌ (view) | ✅ |
| **Kelola jadwal piket** | ❌ | ❌ | ❌ | ❌ | ✅ (today) | ✅ (all) |
| **Kelola user/kelas** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Lihat analytics sekolah** | ❌ | ❌ | ❌ | kelas | all | all |

Key rule: `sekretaris` scoped to `kelas_id`. Cannot edit other kelas. One siswa = one kelas.

### DB Change (minimal)

```sql
-- Extend profiles.role enum
ALTER TYPE user_role ADD VALUE 'wali_kelas';
ALTER TYPE user_role ADD VALUE 'guru_piket';
ALTER TYPE user_role ADD VALUE 'operator';

-- Keep sekretaris as flag, not role. Cleaner:
-- role = 'siswa' + is_sekretaris = true
-- or role = 'sekretaris' (keep compat). Pick one.
-- Recommend: role stays, but add constraint:
ALTER TABLE profiles ADD COLUMN is_sekretaris boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN wali_kelas_id uuid REFERENCES kelas(id); -- for wali kelas
ALTER TABLE kelas ADD COLUMN wali_guru_id uuid REFERENCES profiles(id);

-- RLS: sekretaris can insert absen_harian where kelas_id = own kelas_id
```

`ponytail: start with role enum + is_sekretaris flag. Add separate permissions table when >6 roles.`

---

## 2. Role Assignment Flows

### Sekretaris Flow (Wali Kelas grants)
```
Siswa (view) -> Wali Kelas opens Kelas > Kelola Sekretaris -> picks 1-2 siswa -> toggle is_sekretaris=true -> siswa UI upgrades to sekretaris (extra buttons). Wali revokes anytime. Operator can override.
```
No self-assign. No admin bypass.

### Guru Piket Flow (Operator assigns)
```
Operator > Jadwal Piket > pick guru + date -> guru role temporarily gets piket powers for that date. Home shows "Mode Piket" badge.
```
Simpler than permanent `guru_piket` role. Use `jadwal_piket` table.

### Operator Flow
Seed one operator via SQL. Operator creates guru/wali via invite. No public register.

---

## 3. UI/UX: DANA-style

### DANA Traits to Copy
- **Top balance card** -> Top attendance summary card (rounded-2xl, gradient blue #0EA5E9 -> #0284C7, white text, soft shadow)
- **4-grid quick actions** -> 2x2 or 4 icons: Absen Pagi / Jadwal / Panggil Guru / Rekap. 56px icons, label 12px, rounded-xl bg.
- **Activity feed** -> Riwayat absensi today, timeline vertical.
- **Bottom nav 4 items** -> Beranda, Jadwal, Absensi, Profil. Center FAB not needed. Active = blue fill, inactive = grey.
- **Cards**: `rounded-2xl`, `shadow-sm`, `p-4`, `bg-white`, no borders. Spacing `gap-3`, `p-4` page padding.
- **Typography**: 14px body, 12px caption, 16px semibold title. No small 10px text.
- **Empty states**: Illustration + "Belum ada data" + CTA button (DANA-style).
- **Sheets**: Bottom sheet for confirm, not modal center.

### Screen Map per Tier (Same 4 Tabs, Content Switches)

**BottomNav (fixed 4):** Beranda | Jadwal | Absensi | Profil

**Beranda (DANA home):**
```
Siswa:       [Greeting card] + [Attendance ring 80%] + [Jadwal hari ini 2 cards] + [Riwayat pribadi]
Sekretaris:  Siswa + [Banner "Kamu sekretaris XII TKJ1"] + [Quick actions: Input Absen Pagi (primary), Panggil Guru] + [Draft status chip]
Guru Mapel:  [Mengajar / Tidak] + [Jadwal mengajar today] + [Panggilan masuk alert if any]
Wali Kelas:  Guru Mapel + [Kelas binaan summary: 30 siswa, 28 hadir] + [Validasi pending 1] + [Kelola Sekretaris button]
Guru Piket:  [Mode Piket badge amber] + [Validasi antrian all kelas] + [Jadwal piket today] + [Panggilan masuk all]
Operator:    [Admin cards: Kelola Jadwal, Kelola User, Kelola Kelas, Laporan] + [Stats sekolah]
```

**Jadwal:** Same table, but Operator sees Edit pencil, others view-only. Filter by kelas for siswa, by guru for guru.

**Absensi:**
```
Siswa:       Read-only grid, status chips, no buttons. "View mode" label.
Sekretaris:  Editable grid (H/S/I/A), Save Draft (outline), Kirim Validasi (primary blue). Attachment upload.
Wali/Piket/Operator: Validate button (Approve/Reject) on draft. No edit student status directly (avoid conflict).
Guru Mapel:  Absen Mapel per jam (separate from absen pagi).
```

**Profil:** Same card for all. Wali sees "Kelas Binaan: XII TKJ1", Piket sees "Jadwal Piket: Senin", Operator sees "Super Admin" badge. Edit phone/avatar for all. Sekretaris badge = blue dot.

### Visual Spec (DANA tokens)
- **Primary**: #0081E6 (DANA blue), hover #0070CC
- **Bg**: #F5F7FF (app), #FFFFFF cards
- **Radius**: 16px cards, 12px buttons, 999px pills
- **Shadow**: `0 4px 16px rgba(0,0,0,0.06)`
- **BottomNav**: height 64px, icon 24px, label 10px, safe-area pad

---

## 4. Implementation Roadmap

### Phase 0 - Clean (1 day)
- Delete 58 *.cjs root scripts, init git, env vars (see ANALYSIS.md steps 1-2)
- Remove bypass backdoors

### Phase 1 - Roles (2 days) - no UI yet
- Migrate DB: add `is_sekretaris`, `wali_kelas_id`, `jadwal_piket` table
- Update `useAuth` + RLS policies per tier
- Seed: 1 operator, 2 wali, 3 guru, 4 siswa (1 sekretaris)

### Phase 2 - DANA UI Shell (3 days)
- New design tokens (colors, radius)
- Refactor BottomNav, Navbar, HomeScreen to DANA layout
- One Home variant per tier (conditional render, same route)
- `ponytail: one HomeScreen with role switch, split when file >400 lines`

### Phase 3 - Sekretaris + Wali Flow (2 days)
- Wali > Kelola Sekretaris screen (list siswa, toggle)
- Sekretaris > Input Absen Pagi (draft -> kirim)
- Wali/Piket > Validasi screen

### Phase 4 - Operator (2 days)
- Jadwal CRUD (pelajaran, piket)
- User/Kelas CRUD
- Keep simple: table + add/edit sheet, no drag-drop

### Phase 5 - Polish
- Empty states, loading skeletons, toasts (DANA-style bottom toast)
- RLS test, disable old localStorage path

**Total: ~10 days solo dev. Phase 2 gives biggest UX win.**

---

## 5. What NOT to Build (YAGNI)
- No separate mobile apps (PWA via Vite, install prompt)
- No realtime chat (panggilan guru = simple row in `panggilan_guru` + poll 30s, not websocket)
- No geofence (was mock 35m, remove until real need)
- No streak gamification for v1 (keep if 1 query, else drop)
- No RBAC library (6 roles = if/switch, add CASL when >10)

---

**Next step**: Confirm tier count 6 + DANA direction. Then start Phase 0.
