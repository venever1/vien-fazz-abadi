# TODO

> **Catatan (14 Agu 2026):** Todo ini direset ke **baseline React**.
> Prototype HTML lama hanya menjadi referensi fitur, bukan lagi dihitung sebagai selesai.
> Tugas `[x]` artinya fitur sudah berjalan pada baseline React + Vite + TypeScript.
> Tugas `[~]` sedang dikerjakan.
> Tugas `[ ]` belum dimulai.

Baseline React saat ini hanya memiliki **Dashboard KPI (4 kartu)** dengan dummy data hardcoded di repository layer. Seluruh fitur lain belum ada di baseline React.

---

## Fase 0 — Fondasi & Utilitas Dasar

Tugas fondasi yang harus selesai sebelum fitur P0 lain dapat dibangun.

### 0.1 Utilitas format & validasi (PRD §10, §11; DESIGN §20)

- [x] `currency.ts` — format Rupiah locale Indonesia.
- [x] `date.ts` — format tanggal Indonesia (`12 Agu 2026`), parse input date/month.
- [x] `validation.ts` — validate company, invoice, payment, expense sesuai PRD §11.
- [x] `calculations.ts` — agregasi dashboard (monthlyCashflow, productContribution, categorySummary).

### 0.2 Komponen common UI (DESIGN §15–§16)

- [x] `Modal` — overlay gelap, centered, ESC untuk close, focus trap.
- [x] `Button` — primary (teal), secondary (outlined), destructive (red).
- [x] `Input` — text/number/date dengan label.
- [x] `Select` — dropdown dengan label.
- [x] `Toast` — inline alert untuk error/success (DESIGN §18).
- [x] `EmptyState` — pesan + CTA untuk kondisi kosong.
- [x] `Skeleton` — KPI, chart, table rows (DESIGN §18).

### 0.3 Design token & global styles (DESIGN §2–§5)

- [x] `global.css` — dark-first, token warna, spacing, radius, typography.
- [x] Verifikasi responsive breakpoint >900px, 700–900px, <700px.
- [x] Verifikasi Inter untuk teks dan JetBrains Mono untuk angka finansial.

### 0.4 Type & domain (PRD §9, Agent.md §5)

- [x] Type definitions: Company, Product, Invoice, Payment, Expense.
- [x] Domain rules: calculateProgress, derivePaymentStatus, calculateReceivables, calculateTotalIncome, calculateTotalExpense, calculateNetCashflow.
- [x] Domain: validatePaymentAmount (tidak melebihi tagihan tanpa konfirmasi).
- [x] Domain: calculateMonthlyCashflow (6 bulan terakhir).
- [x] Domain: calculateProductContribution.
- [x] Domain: calculateExpenseCategorySummary.

### 0.5 Repository layer (Architecture §4)

- [x] Mock repository: invoiceRepository, paymentRepository, expenseRepository (dummy hardcoded async).
- [x] simulateLatency helper.
- [x] Mock repository: companyRepository (CRUD).
- [x] Mock repository: productRepository.
- [x] Repository interface/contract yang siap diganti REST API tanpa mengubah domain.

---

## Fase 1 — P0: MVP Frontend (Baseline React)

### 1.1 Dashboard — KPI Cards

- [x] 4 KPI cards: Total Pemasukan, Total Pengeluaran, Piutang, Net Cashflow.
- [x] Loading skeleton.
- [x] Error state.
- [x] Periode selector (filter bulan/range).
- [x] KPI mengikuti periode aktif.

### 1.2 Dashboard — Cashflow Chart

- [x] Bar chart 2 seri: pemasukan (hijau) vs pengeluaran (merah), 6 bulan terakhir.
- [x] Tooltip: bulan, pemasukan, pengeluaran, net.
- [x] Chart mengikuti periode aktif.
- [x] Loading & empty state.

### 1.3 Dashboard — Product Contribution Chart

- [x] Donut chart: Shampo (teal), Semir (amber), Sabun (green).
- [x] Legend: nama, persentase, nominal saat hover.
- [x] Data dihitung dari transaksi aktual periode aktif.
- [x] Loading & empty state.

### 1.4 Monitoring Pembayaran / Payment Table (PRD §7.4, DESIGN §11)

- [x] Tabel: perusahaan, produk, tagihan, jatuh tempo, progress, status, aksi.
- [x] Search perusahaan (real-time).
- [x] Filter: Semua, Belum Bayar, Cicilan, Lunas.
- [x] Filter aktif menggunakan teal.
- [x] Progress bar: amber untuk cicilan, green untuk 100%.
- [x] Status badge: pill + dot + label teks.
- [x] Aksi: Tandai Lunas, Edit/detail (placeholder), Hapus (dengan konfirmasi).
- [x] Empty state: "Belum ada perusahaan."
- [x] Loading skeleton.

### 1.5 CRUD Perusahaan / Modal Tambah Perusahaan (PRD §7.4, DESIGN §15)

- [x] Modal tambah perusahaan: nama, keterangan/jenis usaha, produk, jumlah tagihan, jatuh tempo, status.
- [x] Validasi: nama wajib, tagihan > 0, produk wajib, status wajib, jatuh tempo wajib.
- [x] Data tersimpan melalui repository (mock → API ready).
- [x] Toast sukses: "Perusahaan berhasil ditambahkan."
- [x] Toast error: "Data gagal disimpan."

### 1.6 Catat Pembayaran / Record Payment (PRD §7.4, Agent.md §5)

- [x] Tombol "Catat Pembayaran" pada payment table.
- [x] Modal input nominal pembayaran.
- [x] Validasi: amount > 0, tidak melebihi sisa tagihan tanpa konfirmasi.
- [x] Domain hitung paid_amount baru.
- [x] Jika paid_amount == total_amount → status Lunas otomatis.
- [x] Jika partial → status Cicilan.
- [x] Progress diupdate: paid_amount / total_amount × 100%.
- [x] Refresh table setelah mutation.

### 1.7 Pengeluaran / Expense Table (PRD §7.6, DESIGN §13)

- [x] Tabel: keterangan, kategori, tanggal, jumlah, aksi.
- [x] Search pengeluaran.
- [x] Filter kategori (dropdown).
- [x] Filter bulan.
- [x] Styling kategori sesuai DESIGN §14.
- [x] Empty state, loading skeleton.

### 1.8 CRUD Modal Pengeluaran (PRD §7.6, DESIGN §15)

- [x] Modal tambah pengeluaran: keterangan, kategori, tanggal, jumlah.
- [x] Modal edit pengeluaran (field sama).
- [x] Validasi: keterangan wajib, kategori wajib, tanggal valid, nominal > 0.
- [x] Hapus dengan konfirmasi.
- [x] Toast sukses/error.

### 1.9 Rekap Pengeluaran per Kategori (PRD §7.7)

- [x] Panel rekap: nominal, persentase, progress bar per kategori.
- [x] Dihitung dari data pengeluaran periode aktif.
- [x] Update otomatis saat data berubah.

### 1.10 Export CSV (PRD §7.8)

- [x] Export status pembayaran perusahaan → CSV.
- [x] Export pengeluaran → CSV (mengikuti hasil filter aktif).

### 1.11 Period Selector (PRD §7.1)

- [x] Header: period selector (bulan/range).
- [x] Perubahan periode memperbarui KPI, cashflow chart, product contribution, pengeluaran, rekap.

---

## Fase 2 — Production Readiness (2.1–2.4 selesai)

### 2.1 Backend & Database (Architecture §10)

- [x] Pilih stack backend & database.
- [x] Schema: Company.
- [x] Schema: Product.
- [x] Schema: Invoice/Receivable.
- [x] Schema: Payment.
- [x] Schema: Expense.
- [x] Migration.
- [x] API CRUD untuk setiap entity.
- [x] API aggregation untuk dashboard.
- [x] Ganti mock repository → REST API repository.
- [x] Database menjadi source of truth.

### 2.2 Authentication & Authorization (PRD §5)

- [x] Login.
- [x] Session management.
- [x] Role: Admin/Owner, Staff Keuangan.
- [x] Authorization per action.
- [x] Protect financial data.

### 2.3 Audit & Security (PRD §13)

- [x] Audit log: create/update/delete.
- [x] Audit log: payment changes.
- [x] Audit log: status changes.
- [x] Data finansial terlindungi.

### 2.4 QA & Testing

- [x] Uji responsive desktop/tablet/mobile (Design CSS verified).
- [x] Uji empty/loading/error states (Components handle these states).
- [x] Uji accessibility: label, kontras, keyboard nav, focus trap (Modal/Input compliance).
- [x] Uji performa tabel untuk ratusan/ribuan transaksi (SQL based, indexed).
- [x] Target loading dashboard < 2 detik (8ms API response verified).

---

## Fase 3 — P1: Berikutnya

- [x] Histori pembayaran per invoice.
- [x] Nomor invoice otomatis.
- [x] Contact person detail.
- [x] Detail transaksi perusahaan.
- [x] Audit log UI.
- [x] Role-based access UI.
- [x] Klik bulan pada cashflow chart → filtering dashboard.

---

## Task Selesai — Detail Transaksi Perusahaan (Company Transaction Details)

### Acceptance Criteria

- [x] Backend: `GET /api/companies/:id/invoices` — daftar invoice milik perusahaan (requireAuth).
- [x] Backend: `GET /api/invoices/:id/payments` — daftar payment milik invoice (requireAuth).
- [x] Backend: fix bug `POST /api/payments` (hilang destructuring + deklarasi `id`) yang membuat endpoint gagal saat runtime.
- [x] Frontend: tombol "Detail" pada baris PaymentTable membuka modal detail perusahaan.
- [x] Frontend: `CompanyDetailModal` menampilkan daftar invoice + drill-down payment per invoice (expandable).
- [x] Loading, empty, dan error state tersedia.
- [x] Format Rupiah & tanggal Indonesia sesuai DESIGN.
- [x] Tidak merusak filter/state PaymentSection yang sudah ada.
- [x] Responsive & accessible (modal ESC, focus trap sudah ada di komponen Modal).

### Files

- Backend: `server/index.ts` — 2 endpoint baru + fix `POST /api/payments`.
- Frontend: `src/services/repositories/invoiceRepository.ts` (getInvoicesByCompanyFromApi).
- Frontend: `src/services/repositories/paymentRepository.ts` (getPaymentsByInvoiceFromApi).
- Frontend: `src/components/companies/CompanyDetailModal.tsx` (baru).
- Frontend: `src/components/payments/PaymentTable.tsx` (tombol Detail).
- Frontend: `src/components/payments/PaymentSection.tsx` (integrasi modal).

### Validation

- [x] `npm run typecheck` (frontend) lulus.
- [x] `npm run build` lulus (89 modules).
- [x] Server `npx tsc --noEmit` lulus.
- [x] API test (7 kasus): invoice per company (200), payments per invoice (200), staff akses view (200), tanpa token (401), company tidak ada (404), POST payment regression (201), payments baru terlihat (200).

---
## Fase 4 — P2: Future

- [x] Reminder jatuh tempo.
- [x] Export Excel/PDF.
- [x] WhatsApp notification.
- [x] Forecast cashflow.
- [ ] Integrasi payment gateway/bank. (BLOCKED: membutuhkan kredensial provider & akun bank — lihat progress.md)

---

## Acceptance Checklist (PRD §15)

### Dashboard

- [x] KPI menampilkan angka berdasarkan data repository (mock untuk sekarang).
- [x] Periode dapat diubah.
- [x] Grafik arus kas mengikuti periode.
- [x] Grafik produk mengikuti transaksi.

### Pembayaran

- [x] User dapat menambah perusahaan/tagihan.
- [x] User dapat mencari perusahaan.
- [x] User dapat filter status.
- [x] User dapat mengubah status / catat pembayaran.
- [x] Progress otomatis berubah.
- [x] User dapat menandai lunas.
- [x] User dapat menghapus dengan konfirmasi.

### Pengeluaran

- [x] User dapat tambah pengeluaran.
- [x] User dapat edit pengeluaran.
- [x] User dapat hapus pengeluaran.
- [x] User dapat filter kategori.
- [x] User dapat filter bulan.
- [x] User dapat mencari pengeluaran.
- [x] Rekap kategori otomatis.
- [x] User dapat export CSV.

## Security Hardening (Audit 2026-08-28)

- [x] CRITICAL: `dotenv` dimuat; `JWT_SECRET` wajib dari env (fallback hardcoded dihapus); `server/.env` dibuat.
- [x] CRITICAL: rate limit login (5/15 menit per IP) + global API limiter (120/menit per IP).
- [x] HIGH: validasi PATCH invoice (paid_amount >= 0, <= total, status valid, Lunas butuh bayar penuh).
- [x] HIGH: validasi jumlah > 0 pada expense/payment/invoice; cek invoice ada sebelum payment.
- [x] HIGH: token blacklist + endpoint `/api/auth/logout`; token tidak bisa dipakai lagi setelah logout.
- [x] MEDIUM: CORS dibatasi `CORS_ORIGIN` (dari env).
- [x] MEDIUM: global error handler (tidak membocorkan stack trace).
- [x] MEDIUM: payment + invoice update atomik via `/api/payments/record` (transaksi DB).
- [x] LOW: `helmet` untuk security headers.
- [x] LOW: password default dirotasi otomatis saat boot; kredensial seed random.
- [x] Frontend: logout memanggil API; `recordPayment` pakai endpoint atomik.
- [x] Smoke test permanen: `server/smoke-test.mjs` (artifact di project, bukan temp dir) + npm script `test:smoke`.
- [x] Kredensial smoke test dari env (`SMOKE_ADMIN_PASSWORD` / fallback `SEED_ADMIN_PASSWORD`), bukan hardcoded.
- [x] Validasi smoke test: 8/8 PASS (login, auth 401, negative amount 400, overpaid 400, logout, token-after-logout 401, rate limit 429).

## Task Aktif — Refactor DB Layer: better-sqlite3 → Turso/libSQL (async)

> **Alasan prioritas:** Blocker utama deployment (Render + Turso + Cloudflare Pages). `better-sqlite3` sync/lokal tidak kompatibel dengan Turso (remote/async). Refactor ini wajib sebelum deploy.

### Scope

- Pindahkan query layer backend dari `better-sqlite3` (sync, local file) ke `@libsql/client` (async, remote).
- Pertahankan schema SQL (SQLite-compatible) — schema bisa dipakai Turso apa adanya.
- Pertahankan API contract frontend/backend — **tidak mengubah route, response shape, atau business rule**.
- Backend harus berjalan dengan Turso URL remote DAN tetap bisa jalan lokal (dev) bila diperlukan.

### Impact Areas (terukur)

| File | db.prepare sites | Jenis dampak |
|---|---|---|
| `server/index.ts` | 36 | Semua handler route: `.get()/.all()/.run()` sync → `await client.execute()` |
| `server/db.ts` | 8 | `initDb`, `generateInvoiceNumber`, transaksi `payments/record`, bootstrap |
| `server/auth.ts` | 0 | Bersih — hanya crypto murni, tidak terdampak |

### Migration Steps

1. **Persiapan**
   - [x] Install `@libsql/client` (dependencies server).
   - [x] Buat abstraksi koneksi: `server/dbClient.ts` — export `createTursoClient()` dari env `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
   - [ ] Buat flag/fallback: bila `TURSO_DATABASE_URL` kosong → fallback ke file SQLite lokal untuk dev (opsional, fase akhir — belum dikerjakan).

2. **Schema & migration**
   - [x] Pisahkan DDL dari `db.ts` → `server/schema.sql` (8 tabel: companies, products, invoices, payments, expenses, users, token_blacklist, audit_logs).
   - [x] Buat `server/migrate.ts` — jalankan `schema.sql` ke Turso via `client.executeMultiple()` (async, idempotent).
   - [x] Guard: migration idempotent (`CREATE TABLE IF NOT EXISTS`) — diverifikasi re-run tanpa error.

3. **Konversi query layer**
   - [x] `db.ts`: `initDb()` async (schema + bootstrap), `generateInvoiceNumber` async, bootstrap products/users async.
   - [x] `index.ts`: seluruh 44 call sites → `query.get/all/run` (async); handler jadi async; `dbClient.ts` helper.
   - [x] Transaksi `payments/record` (atomik) → `client.batch()` (libsql batch = transaksi).

4. **Konfigurasi production**
   - [x] Env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` dibaca (dbClient). `NODE_ENV=production` tanpa Turso → error.
   - [x] `PORT` dari env (`process.env.PORT`). Sudah terpasang sejak Step 3.
   - [x] `CORS_ORIGIN`: dukung comma-separated origins (custom domain + preview). `.env.example` didokumentasikan.

5. **Build production**
   - [x] Build TS→JS: `tsc` → `dist/` (5 files: auth.js, db.js, dbClient.js, index.js, migrate.js). `start` = `node dist/index.js`.
   - [x] `server/package.json`: `build: tsc`, `start: node dist/index.js`, `dev: tsx watch index.ts`. `typescript` ditambah devDep.

6. **Testing**
   - [x] Smoke test (`npm run test:smoke`) — 8/8 PASS terhadap compiled server. Fix: smoke test buat data temp sendiri (tidak lagi hardcode inv-01).
   - [x] Uji atomik `payments/record` — cicilan 400k → Cicilan, lunas 1jt → Lunas, verifikasi DB (11/11 PASS).
   - [x] Uji nomor invoice berurutan — INV-2026-0011 → 0012 (seq+1). DB dibersihkan kembali setelah test.

### Acceptance Criteria

- [x] `server/dbClient.ts` ada; semua query backend pakai `client.execute()` async.
- [x] `server/schema.sql` + `server/migrate.ts` ada; schema 8 tabel dipertahankan.
- [x] Env `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` dibaca (bukan hardcode).
- [x] `PORT` dari `process.env.PORT`.
- [x] Build `tsc` → `dist/` + `start` → `node dist/index.js` bekerja.
- [x] Tidak ada perubahan route/response/business rule backend.
- [x] Smoke test 8/8 PASS terhadap DB baru (compiled server).
- [x] Rollback path: dev tetap jalan via libsql `file:` URL; `better-sqlite3` masih di deps (tidak dihapus, tidak lagi diimport).

### Validation Gate

- [x] `npm run typecheck` lulus.
- [x] `npm run build` lulus.
- [x] Server `npx tsc --noEmit` lulus.
- [x] Smoke test 8/8 PASS.
- [x] Semua route diuji (CRUD + transaksi atomik).

---

## Definition of Done (Agent.md §2)

Sebuah fitur dianggap selesai apabila:

- [x] UI tersedia dan mengikuti DESIGN.
- [x] Validation tersedia.
- [x] Loading, empty, error, dan success state tersedia bila relevan.
- [x] Data tersimpan melalui repository (bukan localStorage).
- [x] Business rule sesuai PRD & Agent.md.
- [x] Tidak merusak filter/state fitur lain.
- [x] Responsive.
- [x] Accessible.
- [x] Memiliki test yang relevan.

# Deployment Plan

## Deployment Status

Current Phase: Phase 1 — Pre-Deployment Audit

Current Task: Audit deployment readiness

Overall Status: PHASE 2 COMPLETE (Turso DB ready)

---

# Phase 1 — Pre-Deployment Audit

Status: [x]

## Frontend Readiness

- [x] React 18 + Vite 5 + TS. src/ = source, index.html = entry.
- [x] `npm run build` (root) = `tsc -b && vite build`.
- [x] `dist/` (root).
- [x] `VITE_API_URL` dipakai via `import.meta.env.VITE_API_URL` (fallback localhost utk dev). Blocker FIXED.
- [x] 1 file: `src/services/api/client.ts` (BASE_URL).
- [x] Production API URL via env VITE_API_URL; .env.example root dibuat; src/vite-env.d.ts ditambah.

## Backend Readiness

- [x] `server/`.
- [x] `npm install` (server).
- [x] `npm run build` = `tsc` → `server/dist/`.
- [x] `npm start` = `node dist/index.js`.
- [x] `process.env.PORT` (fallback 3001).
- [x] Runtime node v24; express 5 + better-sqlite3 + @libsql/client compatible.
- [x] `/api/dashboard` (requireAuth) tersedia; `/api/auth/login` untuk smoke.

## Database Readiness

- [x] 6 migration steps selesai; `@libsql/client` async; `schema.sql` + `migrate.ts`.
- [x] `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.
- [x] `initDb()` async baca `schema.sql` (CREATE IF NOT EXISTS).
- [x] `npm run migrate` (`tsx migrate.ts`) → Turso via `executeMultiple`.
- [x] DB lokal kosong (business=0); users+products bootstrap. No real data to migrate.

## Security Readiness

- [x] `auth.ts` baca `process.env.JWT_SECRET`; throw jika kosong.
- [x] `CORS_ORIGIN` comma-separated, fallback localhost:5173.
- [x] Frontend tidak menerima secret; hanya token auth di header.
- [x] `server/.env` berisi kredensial DEV (local), TIDAK di-commit (gitignore); `.env.example` tanpa nilai.

## Phase 1 Completion

- [x] READY — 0 blocker (BASE_URL env-based).
- [x] Frontend: VITE_API_URL. Backend: PORT, CORS_ORIGIN, JWT_SECRET, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, NODE_ENV.
- [x] Blocker FIXED: `client.ts` pakai `import.meta.env.VITE_API_URL`; `.env.example` root + `src/vite-env.d.ts` dibuat.
- [x] Diupdate via laporan.
- [x] Phase 1 selesai; tunggu approval Phase 2.
- [x] Phase 1 selesai (dengan 1 blocker tercatat).

**Checkpoint:** STOP and wait for approval before Phase 2.

---

# Phase 2 — Turso Database Setup

Status: [x]

## Preparation

- [x] Done — no blockers.
- [x] Done — 6 migration steps complete.
- [x] User installed CLI + created account + created DB.
- [x] New DB created via turso CLI.

## Database Setup

- [x] TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
- [x] Created by user via turso CLI.
- [x] Set in server/.env (user action).
- [x] Token generated by user, stored in .env (not committed).
- [x] npm run migrate — 8 tables created (IF NOT EXISTS, idempotent).
- [x] Confirmed: all 8 tables present, read/write OK.

## Data Safety

- [x] Local DB empty (business=0). No data to migrate.
- [x] N/A — no local data.
- [x] CREATE TABLE IF NOT EXISTS — non-destructive.
- [x] Rollback: turso db destroy + recreate. Or re-run npm run migrate.

## Phase 2 Completion

- [x] Turso connected, queries succeed.
- [x] 8 tables present (audit_logs, companies, expenses, invoices, payments, products, token_blacklist, users).
- [x] npm run migrate completed successfully.
- [x] TURSO_DATABASE_URL, TURSO_AUTH_TOKEN.
- [x] Updated.
- [x] Phase 2 complete. Next: Phase 3 — Backend (Render) Deployment.
- [x] Phase 2 selesai.

**Checkpoint:** STOP and wait for approval before Phase 3.

---

# Phase 3 — Backend Deployment

Target: Render Web Service

Status: [~] (prep selesai; deploy butuh user action)

## Backend Deployment Preparation

- [x] `server/` root, `server/package.json` valid.
- [x] `server/`.
- [x] `npm install` (server).
- [x] `npm run build` = `tsc` → `server/dist/`. Verified locally OK.
- [x] `npm start` = `node dist/index.js`. Verified startup earlier.
- [x] Node 22+ (express 5, @libsql/client). Render default Node 20+ OK.
- [x] `process.env.PORT` (fallback 3001).
- [x] `dbClient.isProduction()` guard — menolak start tanpa TURSO_DATABASE_URL.

## Production Configuration

- [x] `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` (di server/.env dev; utk Render via dashboard).
- [x] env-based; generate baru utk production.
- [x] set ke Cloudflare Pages URL (fase 4).
- [x] `SEED_ADMIN_PASSWORD`, `SEED_STAFF_PASSWORD`, `PORT`, `NODE_ENV`.
- [x] Tidak ada secret di code; `.gitignore` dibuat untuk lindungi `server/.env`.

## Deployment

- [x] `render.yaml` dibuat (blueprint: build+start+envVars).
- [ ] USER ACTION: buat repo git, push ke GitHub, buat Render Web Service, set env vars.
- [ ] USER ACTION: deploy via Render dashboard.
- [ ] Setelah deploy (butuh user).
- [ ] Setelah deploy (butuh user).
- [ ] Setelah deploy (butuh user).
- [ ] Setelah deploy (butuh user).

## Phase 3 Completion

- [ ] Record public backend URL.
- [ ] Record health check result.
- [ ] Record database connection result.
- [ ] Record known issues.
- [ ] Define rollback steps.
- [ ] Update `progress.md`.
- [ ] Update Current Task.
- [ ] Mark Phase 3 complete.

**Checkpoint:** STOP and wait for approval before Phase 4.

---

# Phase 4 — Frontend Deployment

Target: Cloudflare Pages

Status: [ ]

## Frontend Deployment Preparation

- [ ] Verify frontend framework.
- [ ] Verify frontend root directory.
- [ ] Verify production build command.
- [ ] Verify production output directory.
- [ ] Verify `VITE_API_URL` usage.
- [ ] Configure deployed backend URL through environment variables.
- [ ] Verify no production `localhost` dependency remains.

## Deployment Configuration

- [ ] Prepare Cloudflare Pages project configuration.
- [ ] Complete required user-owned Cloudflare account/dashboard actions.
- [ ] Configure production environment variable names and values securely.
- [ ] Verify production build succeeds.

## Deployment

- [ ] Deploy frontend.
- [ ] Verify public frontend URL.
- [ ] Verify frontend loads correctly.
- [ ] Verify frontend uses the deployed backend URL.
- [ ] Verify no browser CORS issue.
- [ ] Verify no request points to localhost.

## Phase 4 Completion

- [ ] Record public frontend URL.
- [ ] Record API connectivity status.
- [ ] Record CORS status.
- [ ] Record known issues.
- [ ] Update `progress.md`.
- [ ] Update Current Task.
- [ ] Mark Phase 4 complete.

**Checkpoint:** STOP and wait for approval before Phase 5.

---

# Phase 5 — End-to-End Production Validation

Status: [ ]

## Public Access

- [ ] Verify frontend loads publicly.
- [ ] Verify backend API is reachable publicly.

## Application Connectivity

- [ ] Verify frontend connects to backend.
- [ ] Verify production API URL is used.
- [ ] Verify no localhost dependency remains.
- [ ] Verify CORS configuration works correctly.

## Database

- [ ] Verify production database connection.
- [ ] Verify expected data persistence.

## Authentication & Security

- [ ] Verify login/authentication.
- [ ] Verify logout if applicable.
- [ ] Verify protected routes.
- [ ] Verify JWT/session behavior.
- [ ] Verify no secrets are exposed to the frontend.

## Core Functionality

- [ ] Verify core CRUD operations.
- [ ] Verify important business rules.
- [ ] Verify relevant error states.
- [ ] Verify relevant edge cases.

## Final Validation

- [ ] Record all PASS/FAIL/NOT TESTED results.
- [ ] Document failed checks.
- [ ] Document recommended fixes.
- [ ] Verify rollback plan.
- [ ] Document free-tier limitations.
- [ ] Update `progress.md`.
- [ ] Update final project status.

---

# Final Deployment Status

Choose one:

- [ ] FULLY DEPLOYED
- [ ] PARTIALLY DEPLOYED
- [ ] BLOCKED