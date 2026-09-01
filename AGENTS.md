## 0. Vibecoding Router

Dokumen ini adalah entry point utama untuk agent yang mengerjakan project.

Sebelum melakukan pekerjaan, agent harus:

1. Membaca dan mengikuti aturan dalam `AGENTS.md`.
2. Memahami konteks task dan bagian project yang akan diubah.
3. Memeriksa implementasi yang sudah ada sebelum membuat solusi baru.
4. Menggunakan skill yang relevan dengan jenis pekerjaan.
5. Tidak memuat atau menggunakan semua skill sekaligus tanpa kebutuhan.

### Prinsip Routing

Gunakan alur berikut:

Understand
→ Select Relevant Skill
→ Inspect
→ Plan
→ Implement
→ Validate
→ Test
→ Review when needed
→ Complete

Skill hanya digunakan jika relevan dengan task.

---

## Skill Routing

### A. Memulai aplikasi atau feature besar

Trigger:

- membuat aplikasi baru;
- membuat MVP;
- membuat feature besar;
- mengubah requirement menjadi implementation plan.

Gunakan:

- `idea-os`
- `app-builder`

Workflow:

Requirements
→ Scope
→ Plan
→ Architecture
→ Implementation
→ Validation

Jangan langsung membuat kode besar sebelum memahami requirement dan scope.

---

### B. Pekerjaan UI atau frontend

Trigger:

- membuat halaman;
- membuat dashboard;
- membuat komponen;
- memperbaiki UX;
- memperbaiki visual hierarchy;
- membuat responsive layout.

Gunakan:

- `frontend-design`
- `anti-ui-slop`
- `frontend-ui-engineering`

Workflow:

Understand User Goal
→ Design Direction
→ Component Structure
→ Implementation
→ Responsive Check
→ UI State Check

Hindari UI generik.

Jangan menggunakan:

- placeholder tanpa alasan;
- card berlebihan;
- hierarchy visual yang tidak jelas;
- styling yang tidak memiliki tujuan;
- warna sebagai satu-satunya indikator informasi penting.

---

### C. Architecture atau refactor

Trigger:

- struktur project mulai kompleks;
- banyak business logic tercampur dengan UI;
- terdapat duplikasi;
- membuat feature baru yang besar;
- melakukan refactor.

Gunakan:

- `frontend-architecture`

Sebelum mengubah struktur:

1. Pahami struktur existing.
2. Identifikasi dependency dan impact.
3. Hindari refactor yang tidak diperlukan.
4. Pertahankan business rule dan API contract.

Jangan melakukan refactor besar hanya karena struktur alternatif terlihat lebih modern.

---

### D. Implementasi feature

Trigger:

- membuat CRUD;
- membuat API;
- integrasi database;
- authentication;
- business logic;
- integration antar sistem.

Gunakan:

- `development`
- `app-builder` bila task mencakup beberapa layer aplikasi.

Workflow:

Inspect Existing Pattern
→ Identify Business Rules
→ Implement Smallest Safe Change
→ Validate
→ Test

---

### E. Bug atau error

Trigger:

- application error;
- API error;
- build failure;
- data tidak muncul;
- feature tidak bekerja;
- behavior tidak sesuai expectation.

Gunakan:

- `code-showcase-systematic-debugging`

Workflow wajib:

Reproduce
→ Collect Evidence
→ Inspect Logs
→ Identify Root Cause
→ Fix Root Cause
→ Verify Fix

Jangan:

- melakukan random patch;
- mengubah banyak file tanpa bukti;
- menambah dependency sebagai solusi pertama;
- memperbaiki gejala tanpa menemukan penyebab utama.

---

### F. Testing dan QA

Trigger:

- feature selesai;
- bug sudah diperbaiki;
- perubahan business logic;
- perubahan data flow;
- sebelum release.

Gunakan:

- `testing-qa`

Minimal periksa:

- happy path;
- validation;
- error state;
- loading state;
- empty state;
- edge case yang relevan.

Untuk perubahan finansial, prioritaskan testing terhadap business rule.

---

### G. Validation Gate

Trigger:

- setelah perubahan kode;
- sebelum task dinyatakan selesai.

Gunakan:

- `lint-and-validate`

Urutan:

Code Change
→ Type Check
→ Lint
→ Relevant Tests
→ Build Check when appropriate

Jangan menyatakan task selesai jika terdapat error yang diketahui.

---

### H. Code Review

Trigger:

- feature besar selesai;
- refactor besar;
- sebelum merge;
- sebelum release.

Gunakan:

- `code-review-and-quality`

Review:

- correctness;
- maintainability;
- architecture;
- security;
- unnecessary complexity;
- duplication;
- performance when relevant.

---

### I. Deployment dan Automation

Trigger:

- setup CI;
- setup CD;
- deployment;
- build pipeline;
- automation.

Gunakan:

- `ci-cd-and-automation`

Pastikan pipeline tidak melewati validation dan testing yang relevan.

---

## Default Task Routing

Jika user berkata:

"Build aplikasi baru"

→ `idea-os`
→ `app-builder`

Jika user berkata:

"Tambahkan feature"

→ inspect existing code
→ `development`
→ `testing-qa`
→ `lint-and-validate`

Jika user berkata:

"Perbaiki UI"

→ `frontend-design`
→ `anti-ui-slop`
→ `frontend-ui-engineering`

Jika user berkata:

"Project mulai berantakan"

→ `frontend-architecture`

Jika user berkata:

"Ada error"

→ `code-showcase-systematic-debugging`

Jika user berkata:

"Feature sudah selesai"

→ `testing-qa`
→ `lint-and-validate`

Jika user berkata:

"Review sebelum release"

→ `code-review-and-quality`

Jika user berkata:

"Deploy"

→ `ci-cd-and-automation`


---

## Server & 9Router Protection

Development servers and 9Router may be active while the agent is working.

The user manually manages active development servers and 9Router processes.

### Never Automatically

Agent tidak boleh secara otomatis:

- menghentikan existing server;
- me-restart existing server;
- membunuh process;
- mengganti process yang sedang berjalan;
- membersihkan port;
- membunuh process berdasarkan port;
- membunuh `node.exe`, `npm`, atau process Node.js secara massal;
- menggunakan `taskkill`;
- menggunakan `Stop-Process`;
- menggunakan `pkill`;
- menggunakan `kill`;
- membuat atau menjalankan script `.ps1` untuk start/restart/stop server otomatis;
- membuat automation yang menggantikan process development server yang sudah berjalan;
- mengubah konfigurasi 9Router tanpa persetujuan eksplisit dari user.

### Long-Running Commands

Jangan otomatis menjalankan command long-running atau watch mode yang dapat membuat process server baru atau menyebabkan konflik dengan environment yang sudah aktif, termasuk:

- `npm run dev`;
- `npm start`;
- `tsx watch`;
- command watch mode lainnya;
- command server yang berjalan secara persistent.

Perintah tersebut hanya boleh dijalankan jika user secara eksplisit meminta.

### Safe Validation

Utamakan validation yang finite dan tidak persistent, misalnya bila tersedia dan relevan:

- type check;
- lint;
- unit/integration test yang finite;
- production build check.

Sebelum menjalankan command, pastikan command tersebut tidak:

- menghentikan server yang sedang berjalan;
- me-restart process existing;
- membersihkan port;
- mengganti process yang mungkin digunakan oleh 9Router;
- membuat server persistent tanpa persetujuan user.

### Runtime Validation or Restart Required

Jika runtime validation membutuhkan:

- restart server;
- stop server;
- start server;
- kill process;
- penggantian process;
- tindakan terhadap port;

maka:

**STOP. Jangan melakukan tindakan tersebut sendiri.**

Laporkan dengan format:

```text
SERVER ACTION REQUIRED

Server:
Reason:
Manual command:
Expected result:
```

Kemudian tunggu persetujuan eksplisit dari user sebelum melakukan tindakan tersebut.

### Deployment Safety

Saat deployment atau automation:

- jangan mengganggu local development environment;
- jangan menggunakan process cleanup yang berisiko mengenai 9Router;
- jangan membuat temporary `.ps1` restart/start scripts tanpa persetujuan;
- jangan mengasumsikan agent memiliki izin untuk restart server lokal;
- jika ada checkpoint yang membutuhkan account action, credential, payment, domain ownership, atau dashboard action milik user, berhenti dan jelaskan tindakan manual yang diperlukan.

### Secrets

Jangan menampilkan, mencetak, menyimpan ke dokumentasi, atau memasukkan ke frontend:

- API keys;
- database tokens;
- JWT secrets;
- passwords;
- full production connection strings;
- credential sensitif lainnya.

Gunakan nama environment variable dalam laporan dan dokumentasi, bukan nilainya.


---

## Priority Rules

Urutan prioritas:

1. `AGENTS.md` dan aturan project.
2. Business rules.
3. Requirement dan design source.
4. Security dan data integrity.
5. Existing architecture.
6. Relevant skill workflow.
7. User preference.
8. Implementation convenience.

Jika skill bertentangan dengan business rule project:

Business Rule menang.

Jika skill menyarankan arsitektur baru tetapi perubahan tidak diperlukan:

Existing Architecture menang.

Jika requirement tidak jelas:

Jangan mengarang.
Gunakan label:

- Assumption
- Implementation Decision
- Recommendation
- Open Question

---

## Completion Protocol

Sebelum menyatakan pekerjaan selesai:

[ ] Requirement dipahami.
[ ] Existing implementation diperiksa.
[ ] Relevant skill digunakan bila diperlukan.
[ ] Business rules tetap terjaga.
[ ] Tidak ada perubahan out-of-scope yang tidak perlu.
[ ] Validation dijalankan.
[ ] Testing yang relevan dilakukan.
[ ] Error yang diketahui dijelaskan atau diperbaiki.

Default workflow:

UNDERSTAND
→ INSPECT
→ SELECT SKILL
→ PLAN
→ IMPLEMENT
→ VALIDATE
→ TEST
→ REVIEW IF NEEDED
→ COMPLETE