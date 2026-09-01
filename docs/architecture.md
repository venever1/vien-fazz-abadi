# Architecture

## 1. Tujuan

Dokumen ini menjelaskan struktur arsitektur yang direkomendasikan untuk **Dashboard Monitoring Keuangan PT Vien Fazza Abadi** berdasarkan PRD dan DESIGN. Prototype saat ini masih menggunakan data dummy dan `localStorage`; untuk production, database/backend harus menjadi source of truth. Karena PRD/DESIGN tidak menetapkan framework atau backend tertentu, struktur di bawah adalah **target architecture**, bukan klaim bahwa struktur tersebut sudah ada di prototype.

PRD menetapkan domain utama berupa pemasukan, pengeluaran, piutang, pembayaran/cicilan, rekap produk, grafik arus kas, dan export CSV. fileciteturn0file0L5-L16

## 2. Pola Arsitektur

Gunakan **layered architecture dengan prinsip Clean Architecture ringan**:

- **Presentation/UI** — halaman, komponen, modal, tabel, chart, filter.
- **Application** — use case dan orkestrasi aksi pengguna.
- **Domain** — model bisnis dan business rules.
- **Data/Infrastructure** — API, database adapter, repository, export, dan persistence.

Pola ini dipilih agar UI tidak langsung bergantung pada database. Business rules seperti perhitungan piutang, progress pembayaran, validasi nominal, dan status pembayaran ditempatkan di domain/application layer.

PRD secara eksplisit menyebut bahwa database harus menjadi source of truth pada production, sedangkan `localStorage` hanya cocok untuk prototype. fileciteturn0file0L365-L375

## 3. Struktur Folder yang Direkomendasikan

```text
/
├── src/
│   ├── app/
│   │   ├── routes/
│   │   ├── layout/
│   │   └── providers/
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── KpiCards
│   │   │   ├── CashflowChart
│   │   │   └── ProductContributionChart
│   │   ├── payments/
│   │   │   ├── PaymentTable
│   │   │   ├── PaymentFilters
│   │   │   └── PaymentStatusBadge
│   │   ├── expenses/
│   │   │   ├── ExpenseTable
│   │   │   ├── ExpenseFilters
│   │   │   └── ExpenseSummary
│   │   └── common/
│   │       ├── Modal
│   │       ├── Button
│   │       ├── Input
│   │       ├── Select
│   │       ├── Toast
│   │       └── EmptyState
│   │
│   ├── pages/
│   │   └── Dashboard/
│   │
│   ├── features/
│   │   ├── companies/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── expenses/
│   │   ├── products/
│   │   └── reports/
│   │
│   ├── domain/
│   │   ├── company/
│   │   ├── product/
│   │   ├── invoice/
│   │   ├── payment/
│   │   └── expense/
│   │
│   ├── application/
│   │   ├── dashboard/
│   │   ├── payments/
│   │   ├── expenses/
│   │   └── reports/
│   │
│   ├── services/
│   │   ├── repositories/
│   │   ├── api/
│   │   └── export/
│   │
│   ├── utils/
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── calculations.ts
│   │
│   ├── types/
│   └── styles/
│
├── public/
├── tests/
└── ...
```

Nama file dan ekstensi dapat disesuaikan dengan framework yang dipilih. PRD tidak menetapkan React, Vue, Next.js, Laravel, atau framework tertentu.

## 4. Tanggung Jawab Folder

### `/src/components`

Berisi komponen UI yang dapat digunakan ulang. Komponen tidak boleh mengandung query database langsung.

Contoh:
- `KpiCards` menampilkan Total Pemasukan, Total Pengeluaran, Piutang, dan Net Cashflow.
- `PaymentTable` menampilkan perusahaan, produk, tagihan, jatuh tempo, progress, status, dan aksi.
- `ExpenseTable` menampilkan keterangan, kategori, tanggal, jumlah, dan aksi.

Struktur dashboard tersebut mengikuti DESIGN: header → KPI → dua grafik → pembayaran → pengeluaran dan rekap kategori. fileciteturn0file1L87-L112

### `/src/features`

Berisi logika yang berhubungan langsung dengan satu domain fitur.

Contoh:
- `companies`: CRUD perusahaan.
- `invoices`: tagihan/piutang.
- `payments`: pencatatan pembayaran dan perubahan status.
- `expenses`: CRUD dan filter pengeluaran.
- `reports`: agregasi dan export.

### `/src/domain`

Berisi model dan aturan bisnis yang tidak bergantung pada UI.

Model awal yang ditetapkan PRD:
- Company
- Product
- Invoice / Receivable
- Payment
- Expense

Field-field model tersebut dijelaskan pada PRD. fileciteturn0file0L236-L292

### `/src/application`

Berisi use case seperti:

```text
getDashboardSummary()
getCashflowByPeriod()
getProductContribution()
createCompany()
updatePaymentStatus()
recordPayment()
markInvoiceAsPaid()
createExpense()
updateExpense()
deleteExpense()
exportPaymentsCsv()
exportExpensesCsv()
```

Use case menjadi penghubung antara UI dan repository/service.

### `/src/services`

Berisi implementasi komunikasi dengan sistem luar.

Contoh:

```text
CompanyRepository
InvoiceRepository
PaymentRepository
ExpenseRepository
```

Untuk production, repository dapat menggunakan REST API, GraphQL, RPC, atau mekanisme backend lain tanpa mengubah business rule di domain.

### `/src/utils`

Berisi fungsi murni dan helper umum, terutama:

- format Rupiah.
- format tanggal Indonesia.
- validasi input.
- perhitungan progress.
- agregasi dashboard.
- perhitungan cashflow.

PRD mendefinisikan formula piutang, pemasukan, pengeluaran, net cashflow, progress pembayaran, dan kontribusi produk. fileciteturn0file0L294-L319

## 5. Data Flow

Aliran data utama:

```text
User
  ↓
UI Component
  ↓
Feature / Application Use Case
  ↓
Domain Rules
  ↓
Repository / API Service
  ↓
Backend
  ↓
Database
```

Saat membaca data:

```text
Database
  ↓
Backend/API
  ↓
Repository
  ↓
Use Case
  ↓
UI State
  ↓
Dashboard / Table / Chart
```

Saat mengubah data:

```text
User
  ↓
Form / Action
  ↓
Validation
  ↓
Use Case
  ↓
Domain Rule
  ↓
Repository
  ↓
Database
  ↓
Refresh / Update State
  ↓
UI
```

## 6. Contoh Aliran Pembayaran Cicilan

1. User memilih perusahaan.
2. User memasukkan nominal pembayaran.
3. Form memvalidasi nominal > 0.
4. Application layer mengambil invoice.
5. Domain menghitung `paid_amount` baru.
6. Jika `paid_amount == total_amount`, status menjadi `Lunas`.
7. Jika pembayaran sebagian, status menjadi `Cicilan`.
8. Progress dihitung:

```text
Progress = paid_amount / total_amount × 100%
```

9. Repository menyimpan payment dan perubahan invoice.
10. Dashboard/table mengambil data terbaru.

Business rules tersebut berasal langsung dari PRD. fileciteturn0file0L218-L230 fileciteturn0file0L338-L343

## 7. Dashboard Calculation Flow

Dashboard tidak sebaiknya menghitung angka finansial secara acak di masing-masing komponen.

Gunakan satu application service/selector:

```text
Invoice + Payment + Expense
        ↓
DashboardAggregationService
        ↓
┌───────────────────────────┐
│ totalIncome               │
│ totalExpense              │
│ receivables               │
│ netCashflow               │
│ monthlyCashflow           │
│ productContribution       │
└───────────────────────────┘
        ↓
KPI + Charts
```

Formula utama:

```text
Piutang       = Σ(total_amount - paid_amount), jika sisa > 0
Pemasukan     = Σ(payment.amount)
Pengeluaran   = Σ(expense.amount)
Net Cashflow  = Pemasukan - Pengeluaran
Progress      = paid_amount / total_amount × 100%
```

fileciteturn0file0L294-L319

## 8. State dan Filter

Filter hanya mengubah data yang ditampilkan, bukan data sumber. PRD menetapkan aturan tersebut secara eksplisit. fileciteturn0file0L225-L234

Pola yang disarankan:

```text
Raw Data
   ↓
Filter State
   ↓
Derived / Filtered Data
   ↓
Table / Chart
```

Jangan menghapus atau memodifikasi `Raw Data` hanya karena user sedang melakukan pencarian atau filter.

## 9. Error, Loading, dan Empty State

Setiap feature harus memiliki tiga kondisi utama:

```text
Loading → Skeleton
Success → Data
Empty   → Empty State
Error   → Error / Toast
```

DESIGN menentukan skeleton untuk KPI, chart, dan table; empty state dengan CTA; serta toast/inline alert untuk error dan success. fileciteturn0file1L347-L367

## 10. Persistence

### Prototype

```text
UI → localStorage
```

### Production

```text
UI
 ↓
Application
 ↓
Repository
 ↓
Backend/API
 ↓
Database
```

`localStorage` tidak boleh menjadi source of truth production karena PRD mensyaratkan database sebagai source of truth dan perlindungan data finansial melalui authentication/authorization. fileciteturn0file0L365-L375

## 11. Navigation

MVP dapat mempertahankan satu dashboard. Jika aplikasi berkembang menjadi multi-page, DESIGN merekomendasikan:

```text
Dashboard
Perusahaan
Tagihan & Pembayaran
Pengeluaran
Produk
Laporan
Pengaturan
```

fileciteturn0file1L413-L426

## 12. Prinsip Implementasi

1. UI tidak mengakses database secara langsung.
2. Business rule tidak ditempatkan di komponen visual.
3. Perhitungan finansial dibuat reusable dan testable.
4. Filter tidak memodifikasi source data.
5. Semua mutation melewati validation.
6. Delete wajib meminta konfirmasi.
7. Database menjadi source of truth production.
8. Status pembayaran selalu disertai label teks, bukan warna saja.
9. Format mata uang menggunakan locale Indonesia.
10. Responsive behavior mengikuti DESIGN: desktop, tablet, dan mobile. fileciteturn0file1L322-L344
