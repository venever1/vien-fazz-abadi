# Progress

> Dokumen checkpoint proyek **Dashboard Monitoring Keuangan PT Vien Fazza Abadi**.
>
> Tujuan utama file ini adalah menjadi **titik berhenti (break point)** yang dapat dibaca kembali oleh user maupun AI/agent untuk mengetahui kondisi proyek terakhir tanpa harus menebak pekerjaan yang sudah dilakukan.

**Last updated:** 28 Agustus 2026  
**Overall status:** 🟢 Semua fase (0–4) + Acceptance Checklist + DoD selesai; DB cleanup selesai; Security hardened; task aktif: Refactor DB Layer (better-sqlite3 → Turso/libSQL)
**Current phase:** Deployment Preparation — Refactor DB Layer (better-sqlite3 → Turso/libSQL)

---

## 1. Cara Menggunakan Dokumen Ini

Setiap kali pekerjaan dihentikan, agent harus memperbarui bagian:

1. `Current Status`
2. `Current Phase`
3. `Completed`
4. `In Progress`
5. `Next Step`
6. `Known Issues / Blockers`
7. `Last Checkpoint`

Jangan menganggap sebuah fitur selesai hanya karena sudah memiliki UI. Fitur production dianggap selesai apabila data, business rule, validation, persistence, dan acceptance criteria yang relevan sudah terpenuhi.

---

# 2. Current Status

## Ringkasan

Project telah memiliki:

- PRD sebagai sumber requirement bisnis.
- DESIGN sebagai sumber visual/UI/UX.
- `architecture.md` sebagai acuan struktur dan data flow.
- `Agent.md` sebagai aturan AI/agent.
- `todo.md` sebagai daftar pekerjaan (reset ke baseline React per 14 Agu 2026).
- Baseline frontend: React + Vite + TypeScript dengan struktur folder sesuai `architecture.md` (app/components/pages/features/domain/application/services/utils/types/styles).
- Dashboard KPI (4 kartu) sudah berjalan di UI memakai dummy data hardcoded di repository layer (async, siap diganti REST API).
- Utilitas format & validasi (Fase 0.1) selesai: `currency.ts`, `date.ts`, `validation.ts`, `calculations.ts` mengikuti PRD Â§10â€“Â§11 dan siap dipakai komponen/manapun di fase berikutnya.
- Common UI components (Fase 0.2) selesai: `Button`, `TextInput`, `TextArea`, `Select`, `Modal`, `ConfirmModal`, `Toast` (provider+hook), `EmptyState`, `Skeleton`, `TableSkeleton`.
- Design token & global styles (Fase 0.3) disempurnakan: token warna semantik lengkap (ok/danger/amber/teal/purple/muted + tint), spacing scale, radius, font variabel, badge (status & kategori), progress bar, data table, toolbar, inline-alert, skeleton, responsive breakpoint >900px / 700-900px / <700px, prefers-reduced-motion.
- Domain (Fase 0.4) disempurnakan: `validatePaymentAmount`, `calculateMonthlyCashflow`, `calculateProductContribution`, `calculateExpenseCategorySummary` dipindahkan ke `domain/finance.ts` sesuai Agent.md Â§5 (business logic di domain, bukan utils). `utils/calculations.ts` menjadi re-export untuk backward-compat.
- Repository layer (Fase 0.5) selesai: `companyRepository` & `productRepository` (mock CRUD async), `types/repository.ts` berisi interface contracts (`ICompanyRepository`, `IProductRepository`, `IInvoiceRepository`, `IPaymentRepository`, `IExpenseRepository`) siap diganti REST API tanpa mengubah domain.

> **Reset catatan (14 Agu 2026):** Prototype HTML lama tidak lagi dihitung sebagai selesai di `todo.md`. Ia hanya menjadi referensi fitur. Status `[x]` sekarang berarti fitur berjalan di baseline React.

### Status Area

| Area | Status | Keterangan |
|---|---|---|
| PRD | 🟢 Selesai | Requirement utama tersedia |
| Design System | 🟢 Selesai | UI/UX specification tersedia |
| Architecture | 🟢 Selesai | Target architecture terdokumentasi |
| Agent Rules | 🟢 Selesai | Aturan agent tersedia |
| TODO | 🟢 Selesai | Checklist pekerjaan tersedia (reset ke baseline React 14 Agu 2026) |
| Frontend Foundation | 🟢 Selesai | Fase 0 lengkap: types, domain, mock repo, utilitas, common UI, design token, repository contracts |
| Dashboard KPI (React) | 🟢 Tersedia | 4 KPI dengan dummy data |
| Payment Table (React) | 🔴 Belum | Belum dibangun pada baseline React |
| Expense Table (React) | 🔴 Belum | Belum dibangun pada baseline React |
| Cashflow / Product Charts (React) | 🔴 Belum | Belum dibangun pada baseline React |
| CRUD Modal (React) | 🔴 Belum | Modal tambah/edit belum dibangun |
| Export CSV (React) | 🔴 Belum | Export belum dibangun |
| Backend/API | 🔴 Belum | Belum menjadi source of truth |
| Database | 🔴 Belum | Production database belum terhubung |
| Authentication | 🟢 Selesai | Login + session + token, 2 role, protect financial data |
| Authorization/Role | 🟢 Selesai | Admin/Owner & Staff Keuangan, role-gate UI action |
| Payment History | 🟡 Planned | Termasuk P1 |
| Audit Log | 🟡 Planned | Termasuk P1 |
| Production QA | 🔴 Belum | Menunggu implementasi production |
| QA & Testing | 🟢 Selesai | Performance < 2s, responsive, empty/loading/error, accessibility, table perf |

---

# 3. Project Completion

## Estimasi Progress Berbasis Milestone

> Angka berikut adalah **indikator checkpoint**, bukan persentase kode yang terukur. Jangan menaikkan angka hanya karena jumlah file bertambah.

| Milestone | Status |
|---|---:|
| Requirement / PRD | 100% |
| Design / UI specification | 100% |
| Architecture documentation | 100% |
| Development checklist | 100% |
| Agent guideline | 100% |
| Production backend | 0% |
| Database integration | 0% |
| Authentication & authorization | 100% |
| Production acceptance testing | 0% |

**Documentation/Foundation:** 100%  
**Production implementation:** belum dimulai/masih perlu implementasi sesuai checkpoint ini.

---

# 4. Completed

## Documentation

- [x] PRD tersedia.
- [x] DESIGN tersedia.
- [x] `architecture.md` dibuat.
- [x] `todo.md` dibuat.
- [x] `Agent.md` dibuat.
- [x] `progress.md` dibuat.

## Fase 0 â€” Fondasi & Utilitas Dasar

- [x] **0.1 Utilitas format & validasi:** `currency.ts` (termasuk `formatRupiahCompact`), `date.ts` (termasuk `isOverdue`), `validation.ts` (termasuk validasi status company), `calculations.ts` (fix bug rollover tahun).
- [x] **0.2 Komponen Common UI:** `Button` (primary/secondary/danger), `Input` (TextInput + TextArea dengan label & error state), `Select` (custom arrow), `Modal` + `ConfirmModal` (ESC to close, overlay click, aria-modal), `Toast` (`ToastProvider` + `useToast` hook), `EmptyState`, `Skeleton` + `TableSkeleton`, `PeriodSelector`. Re-exported via `src/components/common/index.ts`.
- [x] **0.3 Design token & global styles:** `global.css` diperlengkap dengan color tokens (ok, danger, amber, teal, purple + tints), radius, font variables (`Inter` & `JetBrains Mono`), badge styles, progress bar styles, data table styles, toolbar, inline-alert, skeleton, cashflow chart styles, dan 3-tier responsive breakpoints (>900px, 700-900px, <700px).
- [x] **0.4 Type & domain:** `src/domain/finance.ts` menampung seluruh business rules (`calculateProgress`, `derivePaymentStatus`, `calculateReceivables`, `calculateTotalIncome`, `calculateTotalExpense`, `calculateNetCashflow`, `validatePaymentAmount`, `calculateMonthlyCashflow`, `calculateProductContribution`, `calculateExpenseCategorySummary`). `utils/calculations.ts` bertindak sebagai re-export layer.
- [x] **0.5 Repository layer:** `companyRepository.ts` & `productRepository.ts` (mock CRUD async dengan `simulateLatency`), plus `types/repository.ts` berisi interface contracts (`ICompanyRepository`, `IProductRepository`, `IInvoiceRepository`, `IPaymentRepository`, `IExpenseRepository`).

## Fase 1.4â€“1.5 â€” Monitoring Pembayaran & Tambah Perusahaan

- [x] **1.4 Payment Table:** `PaymentSection` (tabel dengan search, filter status, `StatusBadge`, `ProgressBar`, tombol Tandai Lunas, hapus dengan `ConfirmModal`), `PaymentTable` (UI tabel), `PaymentFilters` (search real-time, dropdown filter). Loading skeleton (`TableSkeleton`), empty state.
- [x] **1.5 Add Company Modal:** `AddCompanyModal` (form: nama perusahaan, keterangan, produk [dropdown], jumlah tagihan, jatuh tempo, status). Validasi sisi klien (`validateCompanyWithInvoiceInput`) & validasi sisi server (`validateCompanyWithInvoiceInput` duplikasi). Data tersimpan ke `companyRepository` & `invoiceRepository` secara atomik (`createCompanyWithInvoice` use case). Toast sukses/error.

## Fase 1.9â€“1.11 â€” Rekap Kategori, Export CSV, Period Selector

- [x] **1.9 Rekap Pengeluaran per Kategori:** `ExpenseSummary` menampilkan nominal, persentase, dan progress bar per kategori (`calculateExpenseCategorySummary`). Dihitung dari data pengeluaran pada periode aktif (bound ke `filtered` yang sudah menerapkan period & filter), dan update otomatis saat data berubah.
- [x] **1.10 Export CSV:** `utils/exportCsv.ts` (helper BOM + blob download), `utils/exportBuilders.ts` (`buildPaymentCsv`, `buildExpenseCsv`). Tombol "Export CSV" di PaymentFilters & ExpenseFilters. Export pembayaran mengikuti hasil filter status; export pengeluaran mengikuti hasil filter aktif (search, kategori, bulan, periode).
- [x] **1.11 Period Selector:** `ExpenseSection` kini menerima `monthsBack` sebagai prop dari `DashboardPage`, sehingga pengeluaran & rekap kategori turut mengikuti periode aktif bersama KPI, cashflow chart, dan product contribution chart.
- [x] **Responsive & Typecheck:** `npm run typecheck` & `npm run build` lulus tanpa error.

Fase 1 (P0 MVP Frontend) kini lengkap.

- [x] **1.1 KPI Cards terintegrasi periode:** KPI 4 kartu (Total Pemasukan, Total Pengeluaran, Piutang, Net Cashflow) kini menggunakan data berdasarkan periode aktif dari `getDashboardSummary({ monthsBack })`.
- [x] **1.2 Cashflow Chart (SVG bar chart):** `CashflowChart` menampilkan 6 bulan (atau periode dipilih) pemasukan vs pengeluaran dalam bentuk bar dua seri. Termasuk tooltip saat hover/focus, legend, empty state, dan loading skeleton (`CashflowChartSkeleton`).
- [x] **1.3 Product Contribution Chart (SVG donut chart):** `ProductContributionChart` menampilkan donut 140Ã—140 dengan kategori Shampo (teal), Semir (amber), Sabun (ok/green). Dihitung dari data transaksi aktual pada periode aktif (`calculateProductContribution`). Dilengkapi legend interaktif (nama, persentase, nominal), tooltip saat hover, empty state, dan loading skeleton (`ProductContributionChartSkeleton`).
- [x] **Period Selector:** Dropdown di dashboard header (3 Bulan / 6 Bulan / 12 Bulan) mengontrol KPI, Cashflow Chart, dan Product Contribution Chart sekaligus.
- [x] **Responsive & Typecheck:** Grid charts responsif (1.3fr / 1fr di desktop, single column di mobile), `npm run typecheck` & `npm run build` lulus tanpa error.

## Prototype / Baseline

Berdasarkan PRD, prototype sudah menyediakan baseline untuk:

- [x] Dashboard KPI.
- [x] Grafik arus kas.
- [x] Grafik kontribusi produk.
- [x] Monitoring pembayaran.
- [x] Search perusahaan.
- [x] Filter status pembayaran.
- [x] Progress pembayaran.
- [x] Pengelolaan pengeluaran.
- [x] Search pengeluaran.
- [x] Filter kategori.
- [x] Filter bulan.
- [x] Rekap pengeluaran.
- [x] Export CSV.

PRD mencatat bahwa prototype sudah mengimplementasikan modal tambah/edit, filter, dan export pengeluaran. îˆ€fileciteîˆ‚turn0file0îˆ‚L186-L215îˆ

---

# 5. In Progress

## Production Architecture

- [x] Menyiapkan pemisahan UI / Application / Domain / Data.
- [x] Menyiapkan repository/service boundary.
- [x] Menentukan data flow production.
- [x] Memisahkan business rules dari UI.

## Production Persistence

- [x] Menentukan database sebagai source of truth.
- [x] Implementasi backend/API (Express + SQLite, CRUD endpoints).
- [x] Implementasi database (5 tables + users table seeded).
- [ ] Implementasi repository (sebagian: expenseRepository sudah REST API, lainnya masih mock).
- [ ] Migrasi dari localStorage.

## Authentication & Authorization

- [x] Login (POST /api/auth/login, scrypt hash, HMAC-SHA256 token, 24h expiry).
- [x] Session management (sessionStorage + Bearer token di setiap request API).
- [x] Role: Admin/Owner dan Staff Keuangan.
- [x] Authorization per action (requireAuth middleware, requireRole middleware tersedia).
- [x] Protect financial data (semua endpoint /api/* memerlukan token).
## Audit & Security

- [x] Audit log: create/update/delete (POST/PATCH/DELETE expenses, PATCH invoice, POST payment, POST/DELETE company).
- [x] Audit log: payment changes (POST /api/payments).
- [x] Audit log: status changes (PATCH /api/invoices/:id with STATUS_CHANGE action).
- [x] Data finansial terlindungi (semua API memerlukan autentikasi, audit-logs hanya Admin/Owner).

## Role-Based Access UI

- [x] Role-gate Add Company button in PaymentSection (Admin/Owner only).
- [x] Role-gate Add Expense button in ExpenseSection toolbar (Admin/Owner only).
- [x] Role-gate Delete action in ExpenseSection and PaymentTable (Admin/Owner only).
- [x] Backend enforces Admin/Owner role: POST /api/companies, DELETE /api/companies/:id, DELETE /api/expenses/:id, POST /api/invoices (403 for Staff).

\n# 6. Next Step

## Prioritas #1 — Detail Transaksi Perusahaan (Fase 3 P1)

Fitur fungsional dengan impact tertinggi di antara P1 tersisa. Memungkinkan user melihat seluruh riwayat invoice dan pembayaran milik satu perusahaan dalam satu modal detail.

```text
Backend API (GET /api/companies/:id/invoices, GET /api/invoices/:id/payments)
    ↓
Repository / Application Service (companyRepository / invoiceRepository)
    ↓
Frontend UI (CompanyDetailModal + PaymentTable "Detail" button)
    ↓
Typecheck & Build Validation
    ↓
API & UI Integration Testing
```

### Checklist Task Aktif

- [ ] Backend: `GET /api/companies/:id/invoices` — daftar invoice perusahaan.
- [ ] Backend: `GET /api/invoices/:id/payments` — daftar pembayaran per invoice.
- [ ] Frontend: `CompanyDetailModal` — info perusahaan + ringkasan invoice & pembayaran.
- [ ] Frontend: Tombol "Detail" di `PaymentTable` membuka modal detail.
- [ ] Loading, empty, & error state.
- [ ] Typecheck & build validation.
- [ ] API & integration testing.

---

# 7. Setelah Backend

## Payment Flow

- [ ] Create invoice/tagihan.
- [ ] Record payment.
- [ ] Hitung `paid_amount`.
- [ ] Hitung progress.
- [ ] Update status.
- [ ] Otomatis `Lunas` ketika tagihan lunas.
- [ ] Simpan histori pembayaran.
- [ ] Refresh dashboard setelah mutation.

Business rule status:

```text
Belum Bayar â†’ 0%
Cicilan     â†’ 1â€“99%
Lunas       â†’ 100%
```

îˆ€fileciteîˆ‚turn0file0îˆ‚L161-L176îˆ

## Expense Flow

- [ ] Create expense.
- [ ] Update expense.
- [ ] Delete expense.
- [ ] Search.
- [ ] Filter category.
- [ ] Filter month.
- [ ] Recalculate category summary.
- [ ] Export filtered result.

---

# 8. Setelah Core Feature

## Authentication & Authorization

- [ ] Login.
- [ ] Session management.
- [ ] Admin/Owner role.
- [ ] Staff Keuangan role.
- [ ] Authorization per action.
- [ ] Protect financial data.

PRD menyatakan role dan authentication belum tersedia pada prototype dan diperlukan pada production. îˆ€fileciteîˆ‚turn0file0îˆ‚L87-L105îˆ

## Audit

- [ ] Audit log.
- [ ] Record create/update/delete.
- [ ] Record payment changes.
- [ ] Record status changes.

Audit log termasuk prioritas P1. îˆ€fileciteîˆ‚turn0file0îˆ‚L391-L399îˆ

---

# 9. Testing Checkpoint

Sebelum project dianggap MVP production-ready:

## Dashboard

- [ ] KPI berasal dari database.
- [ ] Periode dapat diubah.
- [ ] Cashflow mengikuti periode.
- [ ] Product contribution mengikuti transaksi aktual.

## Payment

- [ ] Tambah perusahaan/tagihan.
- [ ] Search perusahaan.
- [ ] Filter status.
- [ ] Update status.
- [ ] Record cicilan.
- [ ] Progress otomatis.
- [ ] Mark as paid.
- [ ] Delete confirmation.

## Expense

- [ ] Add.
- [ ] Edit.
- [ ] Delete.
- [ ] Category filter.
- [ ] Month filter.
- [ ] Search.
- [ ] Category summary.
- [ ] CSV export.

Acceptance criteria tersebut mengikuti PRD. îˆ€fileciteîˆ‚turn0file0îˆ‚L408-L437îˆ

---

# 10. Known Issues / Blockers

## Current Known Issues

### 🔴 Prototype masih localStorage

Prototype belum menggunakan database sebagai source of truth.

**Impact:**
- belum cocok untuk penggunaan lintas perangkat;
- belum memenuhi kebutuhan production;
- belum menyediakan persistence backend yang aman.

îˆ€fileciteîˆ‚turn0file0îˆ‚L439-L446îˆ

### 🔴 Authentication belum tersedia

Role dan authentication belum tersedia pada prototype.

**Impact:**
- belum aman untuk data finansial production.

### 🟡 Nominal pembayaran aktual perlu dipastikan

PRD memberikan catatan bahwa pada production pemasukan sebaiknya berdasarkan pembayaran aktual, bukan hanya status `Lunas`, terutama jika pembayaran sebagian dicatat sebagai nominal rupiah. îˆ€fileciteîˆ‚turn0file0îˆ‚L127-L141îˆ

---

# 11. Current Data Model

```text
Company
 â”œâ”€â”€ id
 â”œâ”€â”€ company_name
 â”œâ”€â”€ business_description
 â”œâ”€â”€ contact_person
 â”œâ”€â”€ phone
 â”œâ”€â”€ address
 â”œâ”€â”€ status
 â”œâ”€â”€ created_at
 â””â”€â”€ updated_at

Product
 â”œâ”€â”€ id
 â”œâ”€â”€ name
 â”œâ”€â”€ category
 â””â”€â”€ active

Invoice / Receivable
 â”œâ”€â”€ id
 â”œâ”€â”€ company_id
 â”œâ”€â”€ invoice_number
 â”œâ”€â”€ product_id
 â”œâ”€â”€ invoice_date
 â”œâ”€â”€ due_date
 â”œâ”€â”€ total_amount
 â”œâ”€â”€ paid_amount
 â”œâ”€â”€ status
 â”œâ”€â”€ notes
 â”œâ”€â”€ created_at
 â””â”€â”€ updated_at

Payment
 â”œâ”€â”€ id
 â”œâ”€â”€ invoice_id
 â”œâ”€â”€ payment_date
 â”œâ”€â”€ amount
 â”œâ”€â”€ payment_method
 â”œâ”€â”€ reference
 â”œâ”€â”€ notes
 â””â”€â”€ created_at

Expense
 â”œâ”€â”€ id
 â”œâ”€â”€ description
 â”œâ”€â”€ category
 â”œâ”€â”€ transaction_date
 â”œâ”€â”€ amount
 â”œâ”€â”€ notes
 â”œâ”€â”€ created_at
 â””â”€â”€ updated_at
```

Model ini mengikuti data model awal PRD. îˆ€fileciteîˆ‚turn0file0îˆ‚L236-L292îˆ

---

# 12. Current Business Rules

```text
Piutang
= Î£(total_amount - paid_amount)
  untuk invoice dengan sisa > 0

Pemasukan
= Î£(payment.amount)

Pengeluaran
= Î£(expense.amount)

Net Cashflow
= Pemasukan - Pengeluaran

Progress
= paid_amount / total_amount Ã— 100%
```

îˆ€fileciteîˆ‚turn0file0îˆ‚L294-L319îˆ

---

# 13. Break / Resume Protocol

## Ketika berhenti bekerja

Agent wajib mengisi:

```text
Last Checkpoint:
Current Task:
Completed:
In Progress:
Next Step:
Blocker:
Files Changed:
Tests:
```

## Ketika melanjutkan

Agent wajib membaca:

1. `progress.md`
2. `todo.md`
3. `architecture.md`
4. `Agent.md`
5. PRD/DESIGN bila pekerjaan menyentuh requirement atau UI.

Kemudian lanjutkan dari `Next Step`, bukan mengulang pekerjaan yang sudah berstatus `[x]`.

---

# 14. Last Checkpoint

```text
Date:
1 September 2026

Phase:
Deployment — Phase 3 (Backend Render) PREP selesai; DEPLOY menunggu user action

Last completed:
- Verified: server build (tsc → dist), start (node dist/index.js), PORT env, NODE_ENV support.
- render.yaml dibuat (blueprint: build npm run build, start npm start, envVars).
- .gitignore dibuat (lindungi server/.env + secrets sebelum push ke GitHub).
- Env vars production terdokumentasi.

Current task:
Phase 3 DEPLOY — butuh user action (git repo, GitHub push, Render Web Service, env vars).

Next task:
Setelah deploy: verifikasi start, API URL, health, DB connection. Lalu Phase 4 — Frontend (Cloudflare Pages).

Blocker:
Deploy Render butuh user action (account/dashboard/credentials) — sesuai AGENTS.md.

Resume from:
Phase 3 — user menyelesaikan Render deployment, lalu verifikasi.
```


# 15. Change Log
## 2026-08-28 (Refactor DB Layer — Step 1: Persiapan)

- [x] Install `@libsql/client` v0.17.4 (dependencies `server/package.json`).
- [x] Buat `server/dbClient.ts`: `createTursoClient()` membaca `TURSO_DATABASE_URL` (wajib) + `TURSO_AUTH_TOKEN` (opsional).
- [x] Update `.env.example`: tambah section Turso (URL + token, tanpa nilai).
- [x] Validasi: `npx tsc --noEmit` lulus; module load via tsx OK (error saat URL kosong sesuai desain).
- [ ] Fallback SQLite lokal (opsional, fase akhir) — belum dikerjakan.











## 2026-09-01 (Deployment Phase 3 — Backend Render PREP)

- [x] Verified backend: build (tsc → dist), start (node dist/index.js), PORT env, NODE_ENV guard.
- [x] `render.yaml` blueprint dibuat (rootDir server, build npm run build, start npm start, envVars).
- [x] `.gitignore` dibuat — lindungi `server/.env` + secrets sebelum push ke GitHub.
- [ ] DEPLOY: menunggu user action (git repo, push GitHub, Render Web Service, set env vars).
## 2026-09-01 (Deployment Phase 2 — Turso Database Setup)

- [x] Schema migration: `npm run migrate` — 8 tables created in Turso (audit_logs, companies, expenses, invoices, payments, products, token_blacklist, users).
- [x] Verification: connectivity OK, all tables present, read/write OK.
- [x] Users/products bootstrap menunggu server start (initDb di production).
- [x] Phase 2 marked complete. Todo & Progress updated.
## 2026-08-28 (Deployment Phase 1 — Pre-Deployment Audit)

- [x] Frontend: framework, build cmd, output dir verified.
- [x] Backend: root, install/build/start, PORT env, node compat, endpoint verified.
- [x] DB: Turso refactor complete, env vars, schema+migration strategy, no local data to migrate.
- [x] Security: JWT env-based, CORS configurable, no secrets to frontend, .env not committed.
- [x] BLOCKER FIXED: `client.ts` pakai `import.meta.env.VITE_API_URL`; fallback localhost utk dev; `vite-env.d.ts` + `.env.example` dibuat.
- [x] Phase 1 marked complete; Overall Status = PHASE 1 COMPLETE (0 blocker).
## 2026-08-28 (Acceptance Criteria + Validation Gate Refactor DB Layer)

- [x] Acceptance Criteria 8/8 ditandai selesai di todo.md.
- [x] Validation Gate 5/5 ditandai selesai di todo.md.
- [x] Rollback path diklarifikasi: libsql `file:` URL untuk dev; better-sqlite3 di deps tapi tidak diimport.
## 2026-08-28 (Refactor DB Layer — Step 6: Testing)

- [x] Smoke test: `npm run test:smoke` — 8/8 PASS (fix: temp data, tidak hardcode inv-01).
- [x] Atomic payment record: POST /api/payments/record — cicilan + lunas diverifikasi, 11/11 PASS.
- [x] Invoice number sequential: INV-2026-0011 → 0012 (seq+1).
- [x] Compiled server startup + test: `node dist/index.js` — running with compiled libsql client.
- [x] DB dibersihkan setelah test (business = 0, users+products tetap).
- [x] Validasi: server tsc, frontend typecheck + build.
## 2026-08-28 (Refactor DB Layer — Step 5: Build Production)

- [x] `server/tsconfig.json`: `outDir=./dist`, `declaration: true`, `sourceMap: true`.
- [x] `server/package.json`: `build: tsc`, `start: node dist/index.js`; `typescript` devDep.
- [x] `server/migrate.ts` + `server/dbClient.ts`: fix `SOURCE_DIR` untuk `__dirname` di `dist/` (ketika kompilasi, path naik satu level).
- [x] `server/db.ts`: ganti `readFileSync` langsung → `readSchemaSql()` dari migrate.ts (single source of truth).
- [x] Build: `npm run build` → `dist/` (5 files).
- [x] Uji compiled: `node dist/index.js` — startup OK, schema + bootstrap + env-force + listen.
- [x] Validasi: server `tsc --noEmit` lulus; frontend typecheck + build lulus.
## 2026-08-28 (Refactor DB Layer — Step 4: Konfigurasi Production)

- [x] `server/index.ts`: CORS support comma-separated `CORS_ORIGIN` (Cloudflare custom domain + preview).
- [x] `server/dbClient.ts`: guard produksi — `NODE_ENV=production` tanpa `TURSO_DATABASE_URL` menolak start (cegah data loss di storage ephemeral Render).
- [x] `server/index.ts`: log startup menampilkan mode DB (Turso vs file lokal) + environment.
- [x] `server/.env.example`: blueprint produksi — Turso URL/token, CORS multi-origin, NODE_ENV.
- [x] Validasi: server `tsc --noEmit` lulus; frontend typecheck + build lulus.
- [ ] Step 5 — Build production (belum).
## 2026-08-28 (Refactor DB Layer — Step 3: Konversi Query Layer)

- [x] `server/dbClient.ts`: `getClient()` dengan fallback file lokal (`file:server/database.sqlite`) + helper `query.get/all/run`; `createTursoClient()` untuk migrate (wajib URL).
- [x] `server/db.ts`: `initDb()`, `generateInvoiceNumber()`, bootstrap products/users → async (libsql client).
- [x] `server/index.ts`: seluruh 44 call sites `db.prepare().get()/.all()/.run()` → `query.*`; semua handler async; `payments/record` pakai `client.batch()` (transaksi atomik).
- [x] `server/tsconfig.json` baru (server sebelumnya tidak pernah di-typecheck — root tsconfig hanya frontend).
- [x] Fix bug laten: `auth.ts` JWT_SECRET type narrow; `migrate.ts` return type void; `PORT` dari env.
- [x] Dev deps: `@types/express`, `@types/cors`.
- [x] Validasi: server `tsc --noEmit` lulus; conversion test 9/9 PASS; frontend typecheck + build lulus.
- [ ] Step 4 — Konfigurasi production (belum).
## 2026-08-28 (Refactor DB Layer — Step 2: Schema & Migration)

- [x] Extract DDL ke `server/schema.sql` (8 tabel, CREATE TABLE IF NOT EXISTS, PRAGMA foreign_keys).
- [x] Buat `server/migrate.ts`: async `runMigration()` via `client.executeMultiple()`; idempotent.
- [x] Tambah npm script `migrate` di `server/package.json`.
- [x] `server/check-schema.mts`: self-check 8 tabel, idempotency, foreign_keys = 1 — PASS.
- [x] Validasi: `npm run migrate` tanpa Turso → error jelas (expected).
- [x] Server `tsc --noEmit` lulus.
## 2026-08-28 (Deployment Prep — Refactor DB Task Created)

- [x] Audit arsitektur & deployment readiness: stack target Cloudflare Pages + Render + Turso.
- [x] Identifikasi blocker deploy: `better-sqlite3` (sync/local) tidak kompatibel Turso (async/remote).
- [x] Buat task refactor DB Layer di `todo.md` (scope, migration steps, impact areas, acceptance criteria).
- [x] Impact terukur: 44 `db.prepare` call sites (36 `server/index.ts` + 8 `server/db.ts`); `server/auth.ts` bersih.
- [x] Perbarui Last Checkpoint: task aktif = Refactor DB Layer.
- [ ] Implementasi refactor DB (belum dimulai — menunggu persetujuan eksekusi).

## 2026-08-28 (DB Cleanup)

- [x] Hapus data dummy/demo/test: companies/invoices/payments/expenses/audit_logs/token_blacklist = 0.
- [x] Pertahankan users (2) + products (5) + schema (8 tabel).
- [x] Matikan demo seed; bootstrap products/users per-tabel tetap.

## 2026-08-28 (Role-Based Access UI)

- [x] Frontend: PaymentSection "Tambah Perusahaan" gated untuk Admin/Owner saja.
- [x] Frontend: ExpenseSection "Tambah Pengeluaran" + Delete gated untuk Admin/Owner (onAdd optional prop).
- [x] Frontend: EmptyState action CTA conditionally rendered based on role.
- [x] Frontend: PaymentTable hanya menampilkan tombol Hapus untuk Admin.
- [x] API test: Admin dapat create company/invoice, Staff blocked (403) untuk admin-only mutations, Staff bisa update invoice.
- [x] Build + typecheck pass.


















## 2026-08-28 (Smoke Test Artifact Permanen)

- [x] Buat `server/smoke-test.mjs` permanen di project; hapus file smoke test temp (16 file).
- [x] Tambah npm script `test:smoke` di `server/package.json`.
- [x] `db.ts`: dukung `SEED_ADMIN_PASSWORD` / `SEED_STAFF_PASSWORD` dari env (test-only, idempotent).
- [x] `index.ts`: rate limit login configurable via `LOGIN_RATE_WINDOW_MS` / `LOGIN_RATE_MAX` (default aman tetap).
- [x] `.env`: tambah `SEED_ADMIN_PASSWORD` / `SEED_STAFF_PASSWORD` + rate limit test config; `.env.example` didokumentasikan.
- [x] Validasi: `npm run test:smoke` → 8/8 PASS.
- [x] Memperbarui todo.md & progress.md.
## 2026-08-28 (Security Hardening)

- [x] CRITICAL: `import dotenv/config`; `auth.ts` mewajibkan `JWT_SECRET` (hapus fallback hardcoded); buat `server/.env` + contoh di `.env.example`.
- [x] CRITICAL: `express-rate-limit` — login 5/15 menit/IP, global API 120/menit/IP.
- [x] HIGH: validasi `PATCH /api/invoices/:id` (paid_amount >= 0 & <= total, status valid).
- [x] HIGH: validasi amount > 0 di expense/payment/invoice; invoice harus ada sebelum payment.
- [x] HIGH: `token_blacklist` table + `POST /api/auth/logout`; `requireAuth` cek blacklist.
- [x] MEDIUM: CORS pakai `CORS_ORIGIN` env.
- [x] MEDIUM: global error handler (500 JSON tanpa stack trace).
- [x] MEDIUM: `POST /api/payments/record` transaksi atomik (payment + update invoice).
- [x] LOW: `helmet` security headers.
- [x] LOW: seed password random + rotasi otomatis password default `admin123`/`staff123` saat boot.
- [x] Frontend: `authApi.logout` + `AuthContext` panggil API; `recordPayment` gunakan endpoint atomik.
- [x] Typecheck + build lulus (frontend + server).
## 2026-08-28 (Definition of Done + Migrasi Repository)

- [x] `companyRepository`, `invoiceRepository`, `paymentRepository`, `productRepository` → REST API (hilangkan mock in-memory).
- [x] `expenseRepository`: implementasi `updateExpense` (PATCH) & `deleteExpense` (DELETE) yang sebelumnya placeholder.
- [x] Backend: tambah `GET /api/invoices/:id` (diperlukan `recordPayment`/`getInvoiceById`) & `DELETE /api/invoices/:id` (Admin only).
- [x] `apiClient`: tambah metode `patch`.
- [x] Hapus `simulateLatency.ts` + `mock/data.ts` (tidak terpakai lagi).
- [x] `types/repository.ts`: sesuaikan interface dengan fungsi repository aktual.
- [x] Smoke test: GET/DELETE /api/invoices/:id, POST invoice auto-number, payments per invoice — OK.
- [x] DoD (Agent.md §2) 9/9 item terpenuhi; `npm run typecheck` & `npm run build` lulus.
## 2026-08-28 (Acceptance Checklist PRD §15)

- [x] Dashboard: KPI angka dari repository, periode dapat diubah, cashflow chart mengikuti periode, product contribution mengikuti transaksi.
- [x] Pembayaran: tambah perusahaan/tagihan, search, filter status, catat pembayaran, progress otomatis, tandai lunas, hapus dengan konfirmasi.
- [x] Pengeluaran: tambah, edit, hapus, filter kategori, filter bulan, search, rekap kategori otomatis, export CSV.
- [x] Verifikasi API: 15/15 acceptance check pass (dashboard 5, pembayaran 5, pengeluaran 5).
- [x] Memperbarui todo.md (acceptance checklist seluruhnya [x]) dan progress.md.
## 2026-08-28 (Fase 4 P2: Export Excel/PDF, WhatsApp, Forecast)

- [x] `src/utils/exportSpreadsheet.ts`: `exportToExcel` (blob HTML-table .xls) + `exportToPdf` (print window).
- [x] `src/utils/exportBuilders.ts`: refactor kolom bersama; `buildPaymentExcel/Pdf`, `buildExpenseExcel/Pdf`.
- [x] `PaymentFilters` & `ExpenseFilters`: tombol Export CSV / Excel / PDF.
- [x] `src/utils/whatsapp.ts`: `normalizePhoneForWa` + `buildWhatsAppLink`.
- [x] `DueReminderInfo` + `getDueReminders`: tambah `companyPhone`.
- [x] `DueDateReminderSection`: tombol "Kirim WA" (wa.me link dengan pesan pengingat).
- [x] `calculateCashflowForecast` di domain + `ForecastSection` component.
- [x] Build + typecheck pass (frontend + server).
- [x] Self-check P2: 13 assertions lulus (forecast avg/rollover/empty, whatsapp normalize/link).
- [ ] Payment gateway/bank: BLOCKED, butuh kredensial provider & akun bank.
## 2026-08-28 (Reminder Jatuh Tempo)

- [x] Domain: daysUntilDue, deriveReminderTier, DueReminderInfo type di domain/finance.ts.
- [x] Application: getDueReminders.ts — filter invoice non-Lunas, compute daysUntilDue, tier.
- [x] Component: DueDateReminderSection — tabel overdue/due-soon/upcoming, badge danger/amber/ok.
- [x] Wire: DashboardPage menampilkan section di bawah charts.
- [x] Self-check: 6 assertions lulus (daysUntilDue = 0/7/-7/-9, tiers = overdue/due-soon/upcoming).
- [x] Build + typecheck pass (frontend + server).
## 2026-08-28 (Contact Person Detail + CashflowChart Month-Click)

- [x] Backend: `GET /api/companies/:id` (detail perusahaan: contact_person, phone, address, business_description, requireAuth, 404 jika tidak ada).
- [x] Frontend: `getCompanyFromApi` di companyRepository.
- [x] Frontend: `CompanyDetailModal` menampilkan info kontak perusahaan (jenis usaha, contact person, telepon, alamat) di atas daftar invoice.
- [x] Frontend: `CashflowChart` menerima prop `onMonthClick` (klik/Enter bar bulan).
- [x] Frontend: `getDashboardSummary` menerima `selectedMonth` — KPI + product contribution terfilter ke bulan terpilih.
- [x] Frontend: `DashboardPage` state `selectedMonth` + filter chip "Hapus Filter" + hint.
- [x] CSS: `.dashboard__filter-chip`, `.cashflow-chart__hint`.
- [x] API test (4 kasus) lulus; build + typecheck pass (frontend + server).
- [x] Memperbarui todo.md (Fase 3 P1 7/7) dan progress.md.
## 2026-08-28 (Detail Transaksi Perusahaan)

- [x] Backend: `GET /api/companies/:id/invoices` (daftar invoice milik perusahaan, requireAuth).
- [x] Backend: `GET /api/invoices/:id/payments` (daftar payment milik invoice, requireAuth).
- [x] Backend: Fix `POST /api/payments` bug (destructuring + `id` deklarasi hilang dari edit sebelumnya).
- [x] Frontend: `CompanyDetailModal` — info perusahaan + daftar invoice expandable + drill-down payment.
- [x] Frontend: Tombol "Detail" di PaymentTable, integrasi di PaymentSection.
- [x] Frontend: `getInvoicesByCompanyFromApi` (invoiceRepository) + `getPaymentsByInvoiceFromApi` (paymentRepository).
- [x] API test (7 kasus): endpoints, auth, 404, regression POST payment, payment baru terlihat.
- [x] Build + typecheck pass (frontend + server).
## 2026-08-28 (Audit Log UI)

- [x] Implementasi Audit Log UI: AuditLogSection component (tabel dengan tanggal, user, aksi, entitas, detail).
- [x] Integrasi ke DashboardPage: hanya muncul untuk admin/owner (useAuth).
- [x] Validasi akses: GET /api/audit-logs endpoint dilindungi (requireRole Admin/Owner).
- [x] Build + typecheck pass.

## 2026-08-28 (2.2 Authentication & Authorization)

- [x] Backend: `server/auth.ts` (scrypt hash, HMAC-SHA256 token).
- [x] Backend: users table + seed (admin/staff).
- [x] Backend: requireAuth + requireRole middleware; POST /api/auth/login.
- [x] Frontend: AuthContext, LoginPage, App gating, user bar, PaymentSection role-gate.

## 2026-08-28 (2.3 Audit & Security)

- [x] Backend: audit_logs table + logAudit helper.
- [x] Backend: audit-aware mutations (expenses CRUD, companies CRUD, payments POST, invoice PATCH, invoices POST).
- [x] Backend: GET /api/audit-logs (Admin only).

## 2026-08-28 (2.4 QA & Testing)

- [x] Performance: GET /api/dashboard = 8ms (< 2s).
- [x] Responsive, empty/loading/error, accessibility verified.
- [x] Build + typecheck pass.

## 2026-08-28 (Fase 3 P1)

- [x] Histori pembayaran per invoice: PaymentHistory component (modal) + Riwayat button di PaymentTable.
- [x] PaymentTable: canDelete prop (hanya Admin yang melihat tombol Hapus).
- [x] Nomor invoice otomatis: POST /api/invoices (Admin only) dengan generateInvoiceNumber() -> INV-YYYY-NNNN.
- [x] API test: auto invoice number 0005/0006 tergenerate; staff blocked 403.
- [x] Build + typecheck pass.

# 16. Definition of a Valid Checkpoint

Checkpoint dianggap valid jika orang/agent lain dapat menjawab lima pertanyaan ini hanya dari `progress.md`:

1. **Project sekarang ada di fase apa?**
2. **Apa saja yang sudah selesai?**
3. **Apa yang sedang dikerjakan?**
4. **Apa pekerjaan pertama ketika dilanjutkan?**
5. **Apa blocker atau risiko yang harus diketahui?**

Jika salah satu pertanyaan tersebut tidak dapat dijawab, update `progress.md` sebelum melakukan break.

