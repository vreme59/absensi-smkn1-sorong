# Absensi SMKN1 Sorong - Analysis Report

**Date**: 2026-10-05  
**Status**: Critical flaws detected

---

## App Features

### Screens & Components

- **LoginScreen**: Auth via name/username + password. Converts to `${username}@smkn1sorong.sch.id`. Guest mode toggle.
- **HomeScreen**: 
  - Guru: teaching status, class counter, schedule, debug time simulator
  - Siswa/Sekretaris: attendance stats, teacher call alerts, live lesson card, morning check-in
- **AttendanceScreen**: Class roster grid. Status buttons (H/S/I/B/A). Read-only for siswa, editable for sekretaris/guru. Offline draft in localStorage.
- **JadwalScreen**: Weekly timetable (Senin-Sabtu), subject cards, live session indicator. Teacher absen_mapel modal.
- **ProfileScreen**: User card (avatar, NISN/NIP, class, homeroom, streak), mock geofence badge, edit profile/password routing.
- **EditProfileScreen**: Update name, phone, avatar upload to Supabase `avatars` bucket.
- **ChangePasswordScreen**: Update credentials via `supabase.auth.updateUser`, clear `must_change_password` flag.
- **AttachmentModal**: View/upload medical notes, dispensation letters.

### User Roles

- **admin**: School operator
- **guru**: Subject teacher, review/validate attendance, respond to class summons
- **sekretaris**: Student secretary, take morning attendance, dispatch teacher summons
- **siswa**: View schedule, read-only attendance, streak tracking

### Core Flows

1. **Auth**: Input → search profiles via ilike → resolve username → signInWithPassword → load profile
2. **Attendance**: Sekretaris drafts status → save localStorage → guru validates → record absen_mapel
3. **Teacher Summon**: Sekretaris triggers → insert `panggilan_guru` → guru responds (menuju_kelas/tugas_mandiri)
4. **Streak**: Query `streak` table → calculate fire/freeze/sleep icon

---

## Critical Bugs

### Security Vulnerabilities

**SECURITY WARNING: Hardcoded credentials and authentication backdoors present**

1. **Hardcoded Supabase Keys**: `src/lib/supabase.ts` lines 8-10 embed URL and anon key in source.
2. **Auth Bypass Backdoors**:
   - `src/App.tsx` lines 90-101: `identifier === 'Bypass Guru'` grants instant session without password
   - `src/App.tsx` lines 103-114: `password === 'BYPASS_TOKEN'` queries profiles directly, skips auth
   - `src/hooks/useAuth.ts` lines 69-81: Hardcoded `Demo@2025` triggers mockLogin
   - `src/components/LoginScreen.tsx` lines 138-175: UI buttons expose developer bypass
3. **Broken Session Management**: mockLogin sets React state without Supabase JWT. RLS queries fail.
4. **User Enumeration**: Unauthenticated ilike query on `profiles.nama` allows account probing.

### Type Errors & Compilation Failures

- **Missing Exports**: `src/data/samakan/scheduleData.ts` imports `ScheduleDay`, `SubjectSchedule` from `src/types/attendance.ts` but they don't exist. TypeScript build fails.
- **Property Mismatches**: 
  - `src/data/students.ts` uses `studentNo`, `hasAttachment`, `notes`
  - `src/types/attendance.ts` Student interface expects `absentNo`, `note`
- **Duplicate Types**: `src/types.ts` and `src/types_samakan.ts` are identical copies.
- **Missing UserProfile Props**: `phone`, `kelas_id`, `kelas` referenced in App.tsx, EditProfileScreen.tsx but absent from interface. Forces unsafe `as any` casts.

### Supabase State Disconnect

- **Split-Brain Data**: 
  - `samakanStudents` (mock data) used in HomeScreenSamakan
  - `oldStudents` stored in localStorage used in AttendanceScreen
  - `useAbsenHarian` hook queries Supabase `absen_harian` but never called
- **Brittle Reload**: `src/App.tsx` line 304 uses `window.location.reload()` instead of state mutation.
- **Global Window Mutation**: `(window as any).DEBUG_DAY_INDEX` and `.DEBUG_TIME` pollute global scope.

### Missing Error Handling

- `src/components/HomeScreenSamakan.tsx` line 78: Empty `catch (err) {}` suppresses errors.
- `src/components/EditProfileScreen.tsx` line 80: Avatar upload errors only logged to console, no user notification.

### Build Config Issues

- **package.json**:
  - Name `"react-example"`, version `"0.0.0"`
  - Server package `express` and unused `@google/genai` in frontend deps
  - Script `"clean": "rm -rf dist server.js"` fails on Windows cmd
- **tsconfig.json**:
  - `"strict": true` missing, disables type safety
  - `"allowImportingTsExtensions": true` with explicit `.tsx` imports
- **vite.config.ts**:
  - `resolve.alias['@']` maps to `.` instead of `./src`
- **.env.example**:
  - Lists unused Gemini keys, missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## Workflow Flaws

### Root Directory Pollution

**58 *.cjs/*.js fix scripts in project root**:
- Clutter: `fix_destructure2.cjs`, `fix_clock.cjs`, `patch_attendance.cjs`, etc.
- **Hardcoded Paths**: Scripts contain absolute paths from another machine (e.g., `fix_app_props.cjs` line 2: `d:/Coding/lomba website sekolah/...`). Fails on other computers.
- **Destructive String Replacement**: Raw string ops instead of AST transforms. Non-idempotent. Rerunning corrupts files.
- **No Change Tracking**: Mutations outside git history. Impossible to audit why changes occurred.

### Missing Version Control

- Directory is **not a git repo**
- No commit history, branches, or tags
- `.gitignore` omits `*.cjs`, `*.sql`, `test-*.js`, `.vscode/`, `.idea/`

### Secrets Management Failure

- Production Supabase credentials hardcoded in version-controlled source

### Missing Quality Tooling

- Zero test runners (no Vitest, Jest, Playwright)
- No linter (no ESLint config, no Prettier)
- Lint script is just `tsc --noEmit`

---

## Fix Plan

### Step 1: Initialize Git & Clean Root

```bash
# Move/delete all 58 root *.cjs and *.js scripts
mkdir _old_scripts
mv *.cjs *.js _old_scripts/

# Initialize git
git init

# Update .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
*.log
*.sql
!supabase/migrations/*.sql
_old_scripts/
EOF

git add .
git commit -m "Initial commit: clean state"
```

### Step 2: Move Credentials to Environment

Create `.env`:
```env
VITE_SUPABASE_URL=https://cfcdqmajoazxcoxgnoka.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Update `src/lib/supabase.ts`:
```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

Update `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Purge Security Backdoors

**Remove these sections**:
- `src/App.tsx` lines 89-114 (Bypass Guru, Bypass Siswa, BYPASS_TOKEN)
- `src/hooks/useAuth.ts` lines 68-81 (Demo@2025 mockLogin)
- `src/components/LoginScreen.tsx` lines 137-175 (bypass button UI)
- Delete `mockLogin` method entirely

All logins must pass through `supabase.auth.signInWithPassword`.

### Step 4: Consolidate Types & Fix Imports

Delete `src/types_samakan.ts`. Keep `src/types.ts` as single source.

Add missing properties to `UserProfile` in `src/types.ts`:
```ts
export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  identifier: string;
  avatarUrl: string;
  phone?: string;
  kelas_id?: string;
  kelas?: { id: string; nama: string };
  // ...existing props
}
```

Export missing interfaces in `src/types/attendance.ts`:
```ts
export interface ScheduleDay { 
  id: string; 
  name: string; 
}

export interface SubjectSchedule {
  id: string;
  subject: string;
  time: string;
  teacher: string;
  type: 'productive' | 'general';
}
```

Harmonize `src/data/students.ts` field names with `Student` interface (use `absentNo`, `note`).

### Step 5: Connect Supabase to Attendance

Replace localStorage in `AttendanceScreen.tsx` and `App.tsx` with:
```ts
const { students, loading, simpanDraft, validasi } = useAbsenHarian(currentUser.kelas_id);
```

Wire `handleConfirmSubmit` directly to `simpanDraft` / `validasi` hooks.

Delete abandoned `OLD_INITIAL_STUDENTS` mock array.

### Step 6: Normalize Supabase Migrations

```bash
npm install -D supabase
npx supabase init

# Move SQL files
mkdir -p supabase/migrations
mv create-demo-accounts.sql supabase/migrations/001_demo_accounts.sql
mv migration_update_profile.sql supabase/migrations/002_update_profile.sql
```

### Step 7: Fix Build Configs

**vite.config.ts**:
```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    // Remove "allowImportingTsExtensions": true
  }
}
```

**package.json**:
```json
{
  "name": "absensi-smkn1-sorong",
  "version": "1.0.0",
  "scripts": {
    "clean": "node -e \"require('fs').rmSync('dist',{recursive:true,force:true})\""
  },
  "dependencies": {
    // Remove: express, @google/genai
  }
}
```

### Step 8: Add Quality Tooling

Install:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
```

Add scripts to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "lint": "eslint src --ext .ts,.tsx",
  "format": "prettier --write src/**/*.{ts,tsx}"
}
```

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

---

## Proper Workflow Going Forward

1. **Use Git**: Commit after every logical change. Branch for features.
2. **Environment Variables**: Never commit credentials. Use `.env` locally, secrets manager in production.
3. **No Root Scripts**: Make changes via IDE or proper migration tools. Use `supabase/migrations/` for DB changes.
4. **Type Safety**: Run `npm run lint` before every commit. Enable `strict: true`.
5. **Testing**: Write tests for auth, attendance logic, Supabase queries.
6. **CI/CD**: GitHub Actions runs lint + build + test on every PR.
7. **Code Review**: No direct pushes to main. Require PR approval.

---

## Priority Order

**Immediate (Block Production)**:
1. Remove hardcoded Supabase keys (Step 2)
2. Purge auth backdoors (Step 3)
3. Initialize git (Step 1)

**High (Fix Build)**:
4. Fix type errors (Step 4)
5. Fix build configs (Step 7)

**Medium (Connect Backend)**:
6. Wire Supabase to attendance screen (Step 5)
7. Normalize migrations (Step 6)

**Low (Quality)**:
8. Add linting, testing, CI (Step 8)
