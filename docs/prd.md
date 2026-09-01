# PRD --- Sistem Monitoring Keuangan & Pembayaran PT Vien Fazza Abadi

## 1. Ringkasan Produk

**Nama produk:** Dashboard Monitoring Keuangan PT Vien Fazza Abadi

**Tujuan:** membangun website internal untuk memonitor: 1. pemasukan
dari penjualan produk Shampo, Sabun, dan Semir; 2. pengeluaran
perusahaan; 3. piutang dan status pembayaran perusahaan pelanggan; 4.
progres pembayaran/cicilan; 5. rekap penjualan berdasarkan produk; 6.
tren pemasukan vs pengeluaran; 7. ekspor data untuk kebutuhan
administrasi.

Dokumen ini menggunakan prototype HTML yang diberikan sebagai baseline
fitur dan UI. Prototype saat ini masih menggunakan data dummy dan
penyimpanan browser melalui `localStorage`.
fileciteturn0file0L193-L206

## 2. Latar Belakang & Masalah

PT Vien Fazza Abadi membutuhkan satu tempat untuk melihat kondisi
keuangan dan pembayaran pelanggan secara cepat. Prototype yang tersedia
sudah memperlihatkan kebutuhan utama: kartu ringkasan pemasukan,
pengeluaran, piutang, net cashflow, grafik arus kas, kontribusi produk,
tabel status pembayaran perusahaan, serta daftar pengeluaran.
fileciteturn0file0L208-L260

Masalah yang hendak diselesaikan: - data pemasukan dan pengeluaran
tersebar atau sulit direkap; - status perusahaan belum bayar, cicilan,
dan lunas perlu terlihat jelas; - nominal piutang perlu dihitung
otomatis; - pengeluaran perlu dapat dicari, difilter, ditambah, diedit,
dan dihapus; - data perlu dapat diekspor; - manajemen membutuhkan
ringkasan kondisi bisnis tanpa membaca seluruh transaksi.

## 3. Tujuan Produk

### Primary Goals

-   Menyediakan dashboard keuangan yang mudah dipahami.
-   Menyediakan monitoring pembayaran pelanggan secara real-time
    berdasarkan data aplikasi.
-   Mengurangi pekerjaan rekap manual.
-   Menyediakan histori transaksi yang dapat difilter.
-   Menyediakan ekspor CSV untuk kebutuhan pelaporan.

### Success Metrics

-   Pengguna dapat mengetahui total pemasukan, pengeluaran, piutang, dan
    net cashflow dalam \< 10 detik setelah membuka dashboard.
-   Pengguna dapat menemukan perusahaan tertentu dengan pencarian nama.
-   Pengguna dapat mengubah status pembayaran tanpa mengedit data secara
    manual.
-   Pengguna dapat menambah pengeluaran dan perusahaan baru.
-   Pengguna dapat mengekspor daftar pembayaran dan pengeluaran ke CSV.

## 4. Ruang Lingkup MVP

### In Scope

-   Dashboard ringkasan keuangan.
-   Monitoring pelanggan/perusahaan.
-   Status pembayaran: Belum Bayar, Cicilan, Lunas.
-   Progress pembayaran.
-   Pengelolaan pengeluaran.
-   Rekap pengeluaran per kategori.
-   Grafik pemasukan vs pengeluaran.
-   Grafik kontribusi produk.
-   Filter dan pencarian.
-   Tambah, edit, hapus data.
-   Tandai pembayaran lunas.
-   Export CSV.
-   Filter periode/bulan.
-   Penyimpanan data persisten pada backend/database untuk versi
    production.

### Out of Scope MVP

-   Integrasi bank/payment gateway.
-   Invoice otomatis dan e-invoice.
-   WhatsApp/SMS gateway.
-   Akuntansi double-entry lengkap.
-   Payroll.
-   Pajak dan PPN otomatis.
-   Multi-cabang kompleks.
-   Forecasting AI.

## 5. Pengguna & Role

### Admin/Owner

-   Melihat seluruh dashboard.
-   Menambah/mengubah/menghapus perusahaan.
-   Mengubah status pembayaran.
-   Mengelola pengeluaran.
-   Melakukan export.

### Staff Keuangan

-   Melihat dashboard.
-   Mengelola pembayaran dan pengeluaran.
-   Export laporan.
-   Tidak wajib memiliki akses ke konfigurasi sistem.

> Role dan autentikasi belum tersedia di prototype dan perlu menjadi
> bagian dari implementasi production.

## 6. Struktur Informasi

### Dashboard

-   Header + periode.
-   4 KPI cards.
-   Grafik pemasukan vs pengeluaran 6 bulan.
-   Donut penjualan per produk.
-   Status pembayaran perusahaan.
-   Daftar pengeluaran.
-   Rekap pengeluaran per kategori.

### Produk

Produk utama: - Shampo. - Sabun Cuci. - Semir Mobil. - Semir Motor. -
Kombinasi Shampo & Sabun.

Daftar produk di atas mengikuti pilihan produk pada prototype.
fileciteturn0file0L423-L465

## 7. Fitur Fungsional

### 7.1 Dashboard KPI

Tampilkan: - **Total Pemasukan** = total tagihan perusahaan dengan
status Lunas. - **Total Pengeluaran** = total seluruh transaksi
pengeluaran. - **Piutang** = total tagihan perusahaan dengan status
Belum Bayar + Cicilan. - **Net Cashflow** = pemasukan - pengeluaran.

Prototype menggunakan formula tersebut untuk kartu ringkasan.
fileciteturn0file0L583-L594

Catatan bisnis: pada production, definisi "pemasukan" sebaiknya
didasarkan pada pembayaran aktual yang diterima, bukan sekadar status
Lunas, jika pembayaran sebagian dapat dicatat sebagai nominal rupiah.

### 7.2 Grafik Arus Kas

Grafik membandingkan: - pemasukan; - pengeluaran; - per bulan; - default
6 bulan terakhir.

Prototype menggunakan grafik bar untuk enam bulan terakhir.
fileciteturn0file0L231-L240

### 7.3 Penjualan per Produk

Tampilkan kontribusi: - Shampo; - Semir Mobil/Motor; - Sabun.

Prototype menggunakan donut chart dan persentase kontribusi produk.
fileciteturn0file0L242-L260

Untuk production, persentase harus dihitung dari data transaksi pada
periode aktif.

### 7.4 Monitoring Pembayaran Perusahaan

Field minimum: - Nama perusahaan. - Keterangan/jenis usaha. - Produk. -
Jumlah tagihan. - Jatuh tempo. - Progress pembayaran. - Status
pembayaran.

Prototype menggunakan field tersebut pada modal tambah perusahaan.
fileciteturn0file0L423-L465

Status: - `Belum Bayar` - `Cicilan` - `Lunas`

Perilaku: - Belum Bayar → progress 0%. - Cicilan → progress 1--99%. -
Lunas → progress 100%.

Prototype sudah menyediakan dropdown status, tombol "Tandai Lunas",
progress bar, dan hapus data. fileciteturn0file0L506-L570

### 7.5 Pencarian & Filter Pembayaran

Fitur: - pencarian nama perusahaan; - filter Semua; - filter Belum
Bayar; - filter Cicilan; - filter Lunas.

Prototype sudah menyediakan seluruh kontrol tersebut.
fileciteturn0file0L264-L297

### 7.6 Pengelolaan Pengeluaran

Field: - Keterangan. - Kategori. - Tanggal. - Jumlah.

Kategori yang tersedia: - Bahan Baku Sabun. - Bahan Baku Shampo. - Bahan
Baku Semir. - Kemasan & Botol. - Operasional. - Lainnya.

Kategori tersebut mengikuti prototype. fileciteturn0file0L300-L345

Aksi: - tambah; - edit; - hapus; - cari; - filter kategori; - filter
bulan; - export.

Prototype telah mengimplementasikan modal tambah/edit, filter, dan
export pengeluaran. fileciteturn0file0L355-L420
fileciteturn0file0L772-L837

### 7.7 Rekap Pengeluaran

Tampilkan total pengeluaran per kategori: - nominal; - persentase
terhadap total; - progress bar.

Prototype menghitung rekap berdasarkan seluruh transaksi pengeluaran.
fileciteturn0file0L741-L759

### 7.8 Export

Export minimal: 1. Status pembayaran perusahaan → CSV. 2. Pengeluaran →
CSV.

Prototype sudah menyediakan kedua export tersebut.
fileciteturn0file0L828-L837 fileciteturn0file0L875-L890

## 8. Business Rules

1.  Perusahaan dengan status Lunas tidak masuk piutang.
2.  Perusahaan Belum Bayar dan Cicilan masuk piutang.
3.  Status Lunas selalu memiliki progress 100%.
4.  Status Belum Bayar memiliki progress 0%.
5.  Status Cicilan harus menyimpan progress pembayaran.
6.  Jumlah tagihan harus \> 0.
7.  Jumlah pengeluaran harus \> 0.
8.  Nama perusahaan wajib diisi.
9.  Keterangan pengeluaran wajib diisi.
10. Penghapusan data harus meminta konfirmasi.
11. Perubahan data harus tersimpan secara persisten.
12. Filter tidak mengubah data sumber, hanya tampilan.
13. Export mengikuti data hasil filter jika pengguna sedang menggunakan
    filter pengeluaran; prototype melakukan export terhadap
    `filteredExpenses()`. fileciteturn0file0L828-L837

## 9. Data Model Awal

### Company

-   id
-   company_name
-   business_description
-   contact_person
-   phone
-   address
-   status
-   created_at
-   updated_at

### Product

-   id
-   name
-   category
-   active

### Invoice / Receivable

-   id
-   company_id
-   invoice_number
-   product_id
-   invoice_date
-   due_date
-   total_amount
-   paid_amount
-   status
-   notes
-   created_at
-   updated_at

### Payment

-   id
-   invoice_id
-   payment_date
-   amount
-   payment_method
-   reference
-   notes
-   created_at

### Expense

-   id
-   description
-   category
-   transaction_date
-   amount
-   notes
-   created_at
-   updated_at

## 10. Perhitungan Utama

### Piutang

`Piutang = Σ(total_amount - paid_amount)` untuk invoice dengan sisa \>
0.

### Pemasukan

`Pemasukan = Σ(payment.amount)` berdasarkan periode pembayaran.

### Pengeluaran

`Pengeluaran = Σ(expense.amount)` berdasarkan periode transaksi.

### Net Cashflow

`Net Cashflow = Pemasukan - Pengeluaran`.

### Progress Pembayaran

`Progress = paid_amount / total_amount × 100%`.

### Kontribusi Produk

`Kontribusi Produk = penjualan produk / total penjualan × 100%`.

## 11. Validasi

### Perusahaan

-   Nama wajib.
-   Nominal tagihan wajib dan \> 0.
-   Produk wajib.
-   Status wajib.
-   Jatuh tempo wajib untuk transaksi piutang.

### Pengeluaran

-   Keterangan wajib.
-   Kategori wajib.
-   Tanggal valid.
-   Nominal \> 0.

### Pembayaran

-   Nominal \> 0.
-   Tidak boleh membuat total pembayaran melebihi tagihan tanpa
    konfirmasi khusus.
-   Jika paid_amount == total_amount, status otomatis Lunas.

## 12. Empty / Loading / Error States

### Empty

-   Tidak ada perusahaan.
-   Tidak ada pengeluaran.
-   Tidak ada hasil pencarian.
-   Tidak ada transaksi pada periode.

Gunakan pesan singkat dan CTA yang relevan.

### Error

-   Gagal menyimpan.
-   Gagal memuat data.
-   Gagal export.
-   Data tidak valid.

Tampilkan toast/error message tanpa menghilangkan input pengguna.

## 13. Non-Functional Requirements

-   Responsive desktop/tablet/mobile.
-   Bahasa utama Bahasa Indonesia.
-   Format mata uang Rupiah.
-   Data finansial harus terlindungi melalui autentikasi dan
    authorization pada production.
-   Semua perubahan data harus tercatat.
-   Database menjadi source of truth; `localStorage` hanya cocok untuk
    prototype.
-   UI tetap usable ketika tabel berisi ratusan/ribuan transaksi.
-   Waktu loading dashboard target \< 2 detik pada kondisi normal.

## 14. Prioritas Fitur

### P0

-   Dashboard KPI.
-   Status pembayaran.
-   Piutang.
-   CRUD perusahaan.
-   CRUD pengeluaran.
-   Filter/search.
-   Progress pembayaran.
-   Export CSV.

### P1

-   Histori pembayaran.
-   Nomor invoice.
-   Contact person.
-   Detail transaksi perusahaan.
-   Audit log.
-   Role-based access.

### P2

-   Reminder jatuh tempo.
-   Export Excel/PDF.
-   WhatsApp notification.
-   Forecast cashflow.
-   Integrasi payment gateway/bank.

## 15. Acceptance Criteria MVP

### Dashboard

-   [ ] KPI menampilkan angka berdasarkan database.
-   [ ] Periode dapat diubah.
-   [ ] Grafik arus kas mengikuti periode.
-   [ ] Grafik produk mengikuti transaksi aktual.

### Pembayaran

-   [ ] User dapat menambah perusahaan/tagihan.
-   [ ] User dapat mencari perusahaan.
-   [ ] User dapat filter status.
-   [ ] User dapat mengubah status.
-   [ ] User dapat mencatat pembayaran cicilan.
-   [ ] Progress otomatis berubah.
-   [ ] User dapat menandai lunas.
-   [ ] User dapat menghapus data dengan konfirmasi.

### Pengeluaran

-   [ ] User dapat tambah pengeluaran.
-   [ ] User dapat edit pengeluaran.
-   [ ] User dapat hapus pengeluaran.
-   [ ] User dapat filter kategori.
-   [ ] User dapat filter bulan.
-   [ ] User dapat mencari pengeluaran.
-   [ ] Rekap kategori otomatis berubah.
-   [ ] User dapat export CSV.

## 16. Catatan dari Prototype

Prototype saat ini secara eksplisit menyatakan bahwa data masih dummy
dan belum tersambung ke data asli. fileciteturn0file0L193-L197

Prototype juga menyimpan data pada browser menggunakan `localStorage`,
sehingga implementasi production perlu mengganti mekanisme ini dengan
backend/database agar data dapat digunakan lintas perangkat dan aman.
fileciteturn0file0L633-L670
