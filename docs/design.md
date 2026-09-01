# DESIGN.md --- Design System & UI Specification

## 1. Design Direction

**Konsep:** Modern Finance Operations Dashboard

Arah visual mempertahankan karakter prototype: - dark-first; -
profesional; - compact; - data-dense tetapi tetap mudah dipindai; -
penggunaan warna semantik untuk status finansial; - rounded card dengan
border tipis; - typography modern menggunakan Inter; - angka finansial
menggunakan JetBrains Mono.

Prototype mendefinisikan background gelap `#0F1418`, panel `#161D23`,
panel kedua `#1C252C`, border `#2A353D`, teks utama `#EAF0F2`, dan teks
sekunder `#8FA1AA`. fileciteturn0file0L7-L20

## 2. Visual Tokens

### Color

  Token        Value       Usage
  ------------ ----------- --------------------------------
  `bg`         `#0F1418`   App background
  `panel`      `#161D23`   Card/panel
  `panel-2`    `#1C252C`   Input, secondary surface
  `line`       `#2A353D`   Border/divider
  `ink`        `#EAF0F2`   Primary text
  `ink-dim`    `#8FA1AA`   Secondary text
  `accent`     `#4FD1C5`   Primary accent, CTA
  `accent-2`   `#F2B84B`   Semir / warning / installment
  `danger`     `#E8636B`   Expense / unpaid / destructive
  `ok`         `#5FCB8E`   Income / paid / success

Token tersebut berasal dari palette prototype.
fileciteturn0file0L7-L19

### Semantic Color Rules

-   Hijau = uang masuk / lunas / sukses.
-   Merah = pengeluaran / belum bayar / destructive.
-   Amber = cicilan / jatuh tempo / perhatian.
-   Teal = primary action / net cashflow / brand accent.
-   Abu = metadata dan informasi sekunder.

Jangan menggunakan warna hanya sebagai satu-satunya indikator; status
harus selalu memiliki label teks.

## 3. Typography

### Font

-   Primary: Inter.
-   Numeric: JetBrains Mono.

Prototype menggunakan kedua font tersebut. fileciteturn0file0L33-L34

### Scale

  Level                 Size     Weight
  --------------- ---------- ----------
  Page title            26px        800
  Section title         15px        700
  Card value            24px        800
  Body                  13px   400--600
  Caption           11--12px   500--600
  Table header          11px        600

## 4. Spacing

Gunakan basis 4px: - 4px --- micro gap. - 8px --- compact gap. - 12px
--- field/table gap. - 16px --- grid gap. - 20px --- panel padding. -
24px --- section gap. - 32px --- page padding desktop.

Prototype menggunakan page padding 32px, panel padding 20px, dan grid
gap 16px. fileciteturn0file0L22-L31 fileciteturn0file0L62-L66

## 5. Radius & Borders

-   Default radius: 12px.
-   Input/button: 7--8px.
-   Badge: 999px.
-   Border: 1px solid `#2A353D`.

Prototype menetapkan radius utama 12px dan rounded controls.
fileciteturn0file0L19-L20

## 6. Page Layout

### Desktop

``` text
┌─────────────────────────────────────────────────────────────┐
│ Brand / Page title                          Period selector │
├─────────────────────────────────────────────────────────────┤
│ KPI 1 │ KPI 2 │ KPI 3 │ KPI 4                              │
├──────────────────────────────────┬──────────────────────────┤
│ Cashflow 6 months                │ Product contribution     │
│                                  │                          │
├──────────────────────────────────┴──────────────────────────┤
│ Status Pembayaran                                            │
│ Search | Filters | Export | Tambah                           │
│ Table                                                        │
├──────────────────────────────────┬──────────────────────────┤
│ List Pengeluaran                 │ Rekap per Kategori        │
│ Search | Filter | Month | Add    │                          │
│ Table                            │                          │
└──────────────────────────────────┴──────────────────────────┘
```

Struktur ini mengikuti struktur section pada prototype: header → KPI →
dua panel grafik → tabel pembayaran → pengeluaran + rekap kategori.
fileciteturn0file0L193-L352

## 7. Header

### Content

-   Eyebrow: `Rekap Keuangan`.
-   H1: `Dashboard Penjualan Shampo · Sabun · Semir`.
-   Subtitle singkat.
-   Period selector.

Prototype menggunakan susunan tersebut. fileciteturn0file0L193-L205

### Production Enhancement

Tambahkan: - nama user; - avatar; - tombol refresh; - last updated; -
optional notification.

Jangan membuat header terlalu tinggi.

## 8. KPI Cards

Empat kartu: 1. Total Pemasukan. 2. Total Pengeluaran. 3. Piutang. 4.
Net Cashflow.

Setiap card: - label kecil uppercase; - angka besar; - supporting
text; - top border semantic.

Prototype memakai top border hijau untuk income, merah untuk expense,
amber untuk receivable, dan teal untuk net.
fileciteturn0file0L46-L60

### Interaction

Hover: - border sedikit lebih terang; - surface naik secara subtle.

Jangan menggunakan animasi besar untuk dashboard finansial.

## 9. Chart: Cashflow

### Visual

Bar chart dua seri: - Pemasukan = hijau. - Pengeluaran = merah.

Prototype menggunakan tinggi area sekitar 180px dan legenda di bawah.
fileciteturn0file0L68-L77

### UX

Tooltip wajib menampilkan: - bulan; - pemasukan; - pengeluaran; - net.

Klik bulan dapat memfilter dashboard bila diperlukan pada fase P1.

## 10. Chart: Product Contribution

Gunakan donut chart.

Kategori: - Shampo --- teal. - Semir --- amber. - Sabun --- green.

Prototype menggunakan donut 140×140 dengan legend di sebelahnya.
fileciteturn0file0L79-L85 fileciteturn0file0L245-L258

### UX

Legend harus: - menampilkan nama; - persentase; - nominal saat
hover/detail.

## 11. Payment Table

### Columns

1.  Perusahaan.
2.  Produk.
3.  Tagihan.
4.  Jatuh Tempo.
5.  Progress Cicilan.
6.  Status.
7.  Aksi.

Prototype menggunakan kolom yang sama. fileciteturn0file0L277-L297

### Company Cell

Tampilkan: - nama perusahaan --- bold; - jenis usaha --- muted.

### Amount

Gunakan JetBrains Mono agar angka mudah dibandingkan.

### Progress

-   track: panel-2;
-   fill amber untuk cicilan;
-   fill green jika 100%;
-   teks `XX% terbayar`.

Prototype memakai pola ini. fileciteturn0file0L129-L132
fileciteturn0file0L513-L517

### Status Badge

-   Belum Bayar → merah.
-   Cicilan → amber.
-   Lunas → hijau.

Badge berbentuk pill dengan dot indicator.
fileciteturn0file0L115-L122

### Actions

Primary: - Tandai Lunas.

Secondary: - Edit/detail. - Hapus.

Production sebaiknya menambahkan tombol **Catat Pembayaran** untuk
pembayaran cicilan berdasarkan nominal aktual.

## 12. Filters

Payment filter: - Search perusahaan. - Semua. - Belum Bayar. -
Cicilan. - Lunas. - Export CSV. - Tambah Perusahaan.

Prototype menggunakan pola tersebut. fileciteturn0file0L264-L275

### Filter UX

-   Filter aktif menggunakan teal.
-   Search real-time.
-   Clear search tersedia saat field berisi.
-   Filter harus mempertahankan state ketika user membuka detail lalu
    kembali.

## 13. Expense Section

Layout dua kolom: - kiri: tabel pengeluaran; - kanan: rekap kategori.

Prototype menggunakan layout ini. fileciteturn0file0L300-L352

### Expense Table Columns

-   Keterangan.
-   Kategori.
-   Tanggal.
-   Jumlah.
-   Aksi.

### Toolbar

-   Search.
-   Category select.
-   Month selector.
-   Export.
-   Tambah Pengeluaran.

## 14. Expense Category Styling

Kategori: - Bahan Baku Sabun → green. - Bahan Baku Shampo → teal. -
Bahan Baku Semir → amber. - Kemasan & Botol → muted gray. - Operasional
→ red. - Lainnya → purple.

Palette kategori tersebut mengikuti prototype.
fileciteturn0file0L647-L660

## 15. Modal Design

Prototype memakai modal centered dengan: - overlay gelap; - panel 400px
max 90vw; - title; - hint; - field; - action buttons.
fileciteturn0file0L145-L170

### Modal Tambah Perusahaan

Fields: - Nama Perusahaan. - Keterangan/Jenis Usaha. - Produk. - Jumlah
Tagihan. - Jatuh Tempo. - Status.

### Modal Tambah Pengeluaran

Fields: - Keterangan. - Kategori. - Tanggal. - Jumlah.

### Modal Edit Pengeluaran

Field sama dengan tambah pengeluaran.

### Production Enhancement

Tambahkan: - nomor invoice; - contact person; - catatan; - nominal sudah
dibayar untuk cicilan.

## 16. Buttons

### Primary

-   Background teal.
-   Text dark.
-   Bold.
-   Radius 8px.

### Secondary

-   Transparent.
-   Border line.
-   Text muted.

### Destructive

-   Red border/text.
-   Red tinted background saat hover.

Prototype menggunakan primary teal dan secondary outlined button.
fileciteturn0file0L163-L170

## 17. Responsive Behavior

### \> 900px

-   KPI 4 kolom.
-   Chart 1.3fr / 1fr.
-   Expense 1.3fr / 1fr.

### 700--900px

-   KPI 2 kolom.
-   Panel menjadi satu kolom.
-   Table tetap horizontal scroll.

### \< 700px

-   Page padding 18px.
-   Table horizontal scrolling.
-   Controls wrap.
-   Modal 90vw.
-   KPI 1 kolom jika diperlukan.

Breakpoint dan perilaku table mobile mengikuti prototype.
fileciteturn0file0L181-L185

## 18. States

### Loading

Gunakan skeleton: - KPI rectangle. - chart placeholder. - table rows.

### Empty

Contoh: -
`Belum ada perusahaan. Tambahkan perusahaan untuk mulai memonitor pembayaran.` -
`Belum ada pengeluaran pada periode ini.`

### Error

Gunakan inline alert atau toast: - `Data gagal disimpan. Coba lagi.` -
`Data gagal dimuat.`

### Success

Toast: - `Perusahaan berhasil ditambahkan.` -
`Pengeluaran berhasil disimpan.` - `Status pembayaran diperbarui.`

## 19. Accessibility

-   Semua input memiliki label.
-   Kontras teks memenuhi standar WCAG yang relevan.
-   Status tidak hanya dibedakan berdasarkan warna.
-   Tombol memiliki accessible name.
-   Modal dapat ditutup dengan Escape.
-   Fokus keyboard tetap berada di modal ketika terbuka.
-   Tabel dapat dinavigasi dengan keyboard.

## 20. Data Formatting

### Currency

Format: `Rp 8.500.000`

Gunakan locale Indonesia.

### Date

Format UI: `12 Agu 2026`

Input tetap menggunakan native date/month input jika sesuai.

Prototype menggunakan format tanggal Indonesia untuk tampilan.
fileciteturn0file0L673-L680

## 21. Motion

Gunakan motion minimal: - 120--180ms untuk hover. - 180--240ms untuk
modal. - progress bar 250--400ms ketika berubah.

Hindari: - bounce; - parallax; - animasi looping yang mengganggu; -
perubahan layout besar.

## 22. Information Hierarchy

Urutan perhatian: 1. Net cashflow dan KPI. 2. Piutang. 3. Perusahaan
yang belum bayar. 4. Perusahaan yang mendekati jatuh tempo. 5.
Pengeluaran. 6. Rekap kategori. 7. Detail/metadata.

Dashboard harus memungkinkan owner menemukan masalah pembayaran tanpa
harus membuka halaman detail.

## 23. Recommended Production Navigation

Jika aplikasi berkembang menjadi multi-page:

-   **Dashboard**
-   **Perusahaan**
-   **Tagihan & Pembayaran**
-   **Pengeluaran**
-   **Produk**
-   **Laporan**
-   **Pengaturan**

Untuk MVP, seluruh fungsi prototype masih dapat dipertahankan dalam satu
dashboard agar implementasi awal cepat.

## 24. Design Principles

1.  **Finance first** --- angka penting harus paling mudah dipindai.
2.  **Status obvious** --- user harus langsung tahu siapa belum bayar.
3.  **Dense, not cluttered** --- banyak data tetapi tetap memiliki
    ruang.
4.  **Consistent semantics** --- satu warna memiliki satu makna.
5.  **Fast actions** --- tambah, edit, tandai lunas, dan export selalu
    dekat dengan data.
6.  **Progressive detail** --- ringkasan di dashboard, detail di
    modal/page.
7.  **Responsive by default** --- desktop menjadi prioritas tetapi
    mobile tetap usable.
