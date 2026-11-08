# Smart Budget Allocation Planner (SBAP)

Aplikasi web interaktif untuk merencanakan pembagian anggaran ke dalam beberapa kategori pengeluaran, mengelola rincian sub-item, dan memantau hasil alokasi secara otomatis.

> **Project UTS – Framework Based Programming**  
> Fokus pembelajaran: Angular Reactive Forms, `FormArray`, Nested FormArray, cross-item validation, component architecture, komunikasi Parent–Child, dan pengelolaan UI state.

---

## Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Tujuan](#tujuan)
- [Fitur Utama](#fitur-utama)
- [Aturan dan Validasi](#aturan-dan-validasi)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Arsitektur Komponen](#arsitektur-komponen)
- [Struktur Data Form](#struktur-data-form)
- [Perhitungan Anggaran](#perhitungan-anggaran)
- [Persiapan dan Menjalankan Aplikasi](#persiapan-dan-menjalankan-aplikasi)
- [Skenario Pengujian](#skenario-pengujian)
- [Batasan Aplikasi](#batasan-aplikasi)
- [Kesesuaian dengan UTS](#kesesuaian-dengan-uts)

---

## Tentang Aplikasi

**Smart Budget Allocation Planner (SBAP)** adalah aplikasi berbasis web yang membantu pengguna menyusun rencana pembagian dana. Pengguna memasukkan total anggaran, membuat kategori pengeluaran, menetapkan persentase untuk setiap kategori, kemudian menambahkan rincian pengeluaran atau sub-item di dalam kategori tersebut.

Aplikasi menghitung nominal alokasi setiap kategori berdasarkan persentase yang dimasukkan. Aplikasi juga menghitung subtotal sub-item, sisa anggaran, dan status validasi secara dinamis. Dengan demikian, pengguna dapat mengetahui apakah pembagian anggaran telah sesuai dengan aturan yang ditetapkan.

Contoh penggunaan aplikasi adalah perencanaan anggaran acara. Total dana dapat dibagi ke kategori seperti **Tempat**, **Sewa Jasa**, dan **Konsumsi**, lalu setiap kategori diuraikan menjadi biaya yang lebih rinci.

## Tujuan

1. Membantu pengguna merencanakan pembagian total anggaran ke beberapa kategori.
2. Mempermudah pengelolaan kategori dan rincian pengeluaran secara dinamis.
3. Menghitung nominal alokasi dan subtotal pengeluaran secara otomatis.
4. Mendeteksi kesalahan input dan ketidaksesuaian anggaran melalui validasi.
5. Menerapkan konsep Framework Based Programming menggunakan Angular.

## Fitur Utama

### 1. Pengelolaan total anggaran

Pengguna dapat memasukkan dan mengubah total dana yang akan dialokasikan. Nilai ini menjadi dasar perhitungan nominal untuk setiap kategori.

### 2. Dynamic category FormArray

Pengguna dapat menambahkan kategori baru dan menghapus kategori pada indeks tertentu. Setiap kategori memiliki nama dan persentase alokasi. Jumlah kategori mengikuti batas minimum dan maksimum yang ditetapkan aplikasi.

### 3. Nested FormArray untuk sub-item

Setiap kategori memiliki daftar sub-item sendiri. Pengguna dapat menambahkan, mengubah, dan menghapus rincian pengeluaran tanpa mengubah daftar sub-item pada kategori lain.

### 4. Perhitungan otomatis

Nominal alokasi kategori dihitung dari total anggaran dikalikan persentase kategori. Aplikasi juga menghitung subtotal semua sub-item pada setiap kategori.

### 5. Cross-item validation

Aplikasi memeriksa hubungan data antarbaris, antara lain nama kategori yang duplikat, jumlah persentase seluruh kategori, nama sub-item yang duplikat dalam kategori yang sama, serta total sub-item yang melebihi alokasi kategori.

### 6. Ringkasan dan monitoring

Bagian ringkasan menampilkan informasi seperti total anggaran, total persentase, total dana teralokasi, total rincian sub-item, dana yang belum dialokasikan, sisa alokasi yang belum dirinci, dan status validasi.

### 7. UI State

Aplikasi membedakan tampilan **Empty State** ketika belum ada nama kategori yang diisi dan **Populated State** ketika data kategori mulai tersedia. Pesan validasi ditampilkan mengikuti kondisi data.

### 8. Perulangan dan identifikasi baris

Daftar kategori dan sub-item ditampilkan menggunakan perulangan bertingkat. Context variable seperti `index`, `first`, dan `last`, serta fungsi `trackBy` kustom digunakan untuk membantu pengelolaan baris dan identitas elemen saat daftar berubah.

---

## Aturan dan Validasi

Aturan berikut merupakan ketentuan desain aplikasi SBAP:

| Data | Aturan |
|---|---|
| Total anggaran | Wajib diisi dan harus lebih besar dari Rp0. |
| Jumlah kategori | Minimum 2 dan maksimum 10 kategori. |
| Nama kategori | Wajib diisi dan tidak boleh duplikat. Pemeriksaan mengabaikan spasi di awal/akhir dan perbedaan huruf besar-kecil. |
| Persentase kategori | Harus lebih besar dari 0% dan tidak lebih dari 100%. |
| Total persentase | Harus tepat 100% agar alokasi dinyatakan valid. |
| Nama sub-item | Wajib diisi dan tidak boleh duplikat dalam kategori yang sama. Nama yang sama masih dapat digunakan pada kategori lain. |
| Nominal sub-item | Wajib lebih besar dari Rp0. |
| Total sub-item per kategori | Tidak boleh melebihi nominal alokasi kategori terkait. |

Validasi dilakukan ketika data berubah dan setelah operasi tambah atau hapus. Data yang belum valid tetap dapat diedit; aplikasi menampilkan pesan agar pengguna mengetahui bagian yang perlu diperbaiki.

## Teknologi yang Digunakan

- **Angular** – framework utama untuk membangun aplikasi web berbasis komponen.
- **TypeScript** – bahasa pemrograman untuk logika komponen, validasi, dan perhitungan.
- **HTML Template** – membentuk tampilan dan interaksi pengguna.
- **CSS** – mengatur tata letak dan tampilan responsif.
- **Angular Reactive Forms** – mengelola input dan status form.
- **FormGroup** – mengelompokkan kontrol untuk data anggaran, kategori, dan sub-item.
- **FormArray** – mengelola kumpulan kategori dan sub-item secara dinamis.

## Arsitektur Komponen

State dan proses bisnis utama dikelola secara terpusat oleh `BudgetComponent`. Komponen lain bertugas menampilkan bagian antarmuka atau meneruskan interaksi pengguna.

```text
AppComponent
└── BudgetComponent
    ├── BudgetHeaderComponent
    ├── BudgetFormComponent
    │   └── CategoryItemComponent
    │       └── SubItemFormComponent
    └── BudgetSummaryComponent
        ├── SummaryCardComponent
        └── ValidationAlertComponent
```

### Tanggung jawab komponen

| Komponen | Tanggung jawab |
|---|---|
| `AppComponent` | Root component yang menampilkan halaman utama aplikasi. |
| `BudgetComponent` | Menjadi pusat state, Reactive Forms, validasi, perhitungan, serta operasi tambah dan hapus. |
| `BudgetHeaderComponent` | Menampilkan nama dan informasi singkat aplikasi. |
| `BudgetFormComponent` | Menampilkan input total anggaran dan daftar kategori. |
| `CategoryItemComponent` | Menampilkan satu kategori beserta informasi alokasi dan sub-item. |
| `SubItemFormComponent` | Menampilkan dan mengelola rincian pengeluaran pada suatu kategori. |
| `BudgetSummaryComponent` | Menampilkan ringkasan dan kondisi anggaran. |
| `SummaryCardComponent` | Menampilkan satu metrik ringkasan. |
| `ValidationAlertComponent` | Menampilkan pesan validasi atau peringatan. |

### Komunikasi antar-komponen

- `@Input()` mengirimkan data dari Parent Component ke Child Component.
- `@Output()` dan `EventEmitter` mengirimkan event atau permintaan tindakan dari Child Component ke Parent Component.
- `BudgetComponent` tetap menjadi **single source of truth** untuk data dan aturan bisnis. Child Component tidak membuat salinan terpisah dari data anggaran.

---

## Struktur Data Form

Struktur form utama secara konseptual adalah sebagai berikut:

```text
budgetForm (FormGroup)
├── totalBudget (FormControl)
└── categories (FormArray)
    ├── Category (FormGroup)
    │   ├── id (FormControl)
    │   ├── name (FormControl)
    │   ├── percentage (FormControl)
    │   └── items (FormArray)
    │       ├── SubItem (FormGroup)
    │       │   ├── id (FormControl)
    │       │   ├── name (FormControl)
    │       │   └── amount (FormControl)
    │       └── ...
    └── ...
```

Setiap kategori mempunyai `items` FormArray tersendiri. Karena itu, penambahan atau penghapusan sub-item pada satu kategori tidak mengubah sub-item milik kategori lain.

ID kategori dan sub-item digunakan sebagai identitas stabil untuk fungsi `trackBy`, sehingga identitas baris tetap terjaga ketika daftar diubah atau diurutkan kembali.

## Perhitungan Anggaran

### Nominal alokasi kategori

```text
Nominal Alokasi = Total Anggaran × Persentase Kategori / 100
```

Contoh: total anggaran Rp100.000.000 dan persentase kategori 50%, maka nominal alokasinya adalah Rp50.000.000.

### Total persentase

```text
Total Persentase = jumlah seluruh persentase kategori
```

Total persentase harus sama dengan 100% agar pembagian anggaran valid.

### Subtotal kategori

```text
Subtotal Kategori = jumlah nominal seluruh sub-item dalam kategori
```

Subtotal suatu kategori tidak boleh melebihi nominal alokasi kategori tersebut.

### Ringkasan keseluruhan

- **Total Teralokasi:** jumlah nominal alokasi seluruh kategori.
- **Total Rincian Sub-item:** jumlah nominal seluruh sub-item dari semua kategori.
- **Sisa Dana Belum Dialokasikan:** total anggaran dikurangi total teralokasi.
- **Sisa Alokasi Belum Dirinci:** total alokasi dikurangi total rincian sub-item.

Sisa alokasi belum dirinci merupakan ringkasan agregat. Pemeriksaan kelebihan anggaran tetap dilakukan pada setiap kategori secara terpisah.

---

## Persiapan dan Menjalankan Aplikasi

### Prasyarat

Pastikan perangkat sudah memiliki:

- Node.js dengan versi yang kompatibel dengan versi Angular pada project.
- npm (biasanya terpasang bersama Node.js).
- Visual Studio Code atau Antigravity IDE.
- Browser modern seperti Google Chrome, Microsoft Edge, atau Firefox.

Periksa instalasi Node.js dan npm:

```bash
node -v
npm -v
```

### Instalasi dependency

Buka terminal pada direktori utama project, lalu jalankan:

```bash
npm install
```

### Menjalankan development server

```bash
npx ng serve -o
```

Setelah proses berhasil, Angular akan menjalankan development server dan membuka aplikasi di browser. Jika browser tidak terbuka otomatis, akses alamat lokal yang ditampilkan pada terminal (umumnya `http://localhost:4200/`).

### Build aplikasi

```bash
npx ng build
```

Perintah tersebut digunakan untuk memeriksa dan membangun aplikasi ke hasil build. Pastikan proses selesai tanpa error.

> Catatan: perintah di atas mengikuti project Angular CLI standar. Jika project memiliki script npm khusus, periksa bagian `scripts` pada `package.json` dan gunakan perintah yang tersedia.

---

## Skenario Pengujian

Gunakan skenario berikut untuk memeriksa fungsi utama aplikasi dan persiapan demonstrasi UTS.

| No. | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Membuka aplikasi pertama kali | Form awal dan Empty State tampil sesuai rancangan. |
| 2 | Menambah kategori | Baris kategori baru muncul. |
| 3 | Menambah kategori sampai batas maksimum | Penambahan berhenti pada 10 kategori. |
| 4 | Menghapus kategori tertentu | Hanya kategori pada indeks yang dipilih yang terhapus. |
| 5 | Menghapus ketika tersisa 2 kategori | Penghapusan ditolak atau tombol hapus dinonaktifkan. |
| 6 | Memasukkan nama kategori duplikat | Pesan duplikasi ditampilkan. |
| 7 | Memasukkan persentase dengan total kurang dari 100% | Status alokasi belum lengkap ditampilkan. |
| 8 | Memasukkan persentase dengan total lebih dari 100% | Status alokasi tidak valid ditampilkan. |
| 9 | Memasukkan persentase dengan total tepat 100% | Validasi persentase dinyatakan lolos. |
| 10 | Menambah dan menghapus sub-item | Hanya sub-item pada kategori terkait yang berubah. |
| 11 | Memasukkan nama sub-item duplikat dalam satu kategori | Pesan duplikasi ditampilkan. |
| 12 | Menggunakan nama sub-item sama pada kategori berbeda | Data tetap dapat diterima karena validasi unik berlaku per kategori. |
| 13 | Memasukkan subtotal melebihi alokasi kategori | Peringatan kelebihan anggaran ditampilkan pada kategori terkait. |
| 14 | Mengubah nilai input | Nominal, subtotal, ringkasan, dan status diperbarui. |
| 15 | Menghapus atau mengurutkan ulang baris | Data tetap berada pada kategori dan sub-item yang benar. |
| 16 | Mengosongkan seluruh nama kategori | Summary kembali menampilkan Empty State. |

---

## Batasan Aplikasi

1. Aplikasi dikembangkan untuk kebutuhan tugas Ujian Tengah Semester Framework Based Programming.
2. Aplikasi hanya memiliki satu aktor, yaitu Pengelola Anggaran.
3. Aplikasi berfokus pada interaksi View dan Controller menggunakan Angular.
4. Tidak terdapat backend API maupun database.
5. Data disimpan sementara di memori aplikasi dan dapat hilang ketika halaman browser dimuat ulang.
6. Aturan jumlah kategori dan validasi mengikuti ketentuan desain yang ditetapkan pada project ini.

## Kesesuaian dengan UTS

Project ini dirancang untuk mendukung komponen penilaian UTS berikut:

| Komponen UTS | Bukti implementasi yang ditargetkan |
|---|---|
| Studi Kasus dan Use Case Diagram | Aktor Pengelola Anggaran dan UC-01 sampai UC-08. |
| Use Case Description | Tiga use case utama dengan alur Action–Reaction dan alternatif validasi. |
| Sequence Diagram | Tiga diagram interaksi User, View, dan Controller tanpa backend/database. |
| Component Architecture & Data Mapping | Component Tree, View–Controller mapping, `@Input`, `@Output`, dan `EventEmitter`. |
| 5.1 FormArray & Cross-Validation | Append, remove-at-index, nested FormArray, dan validator lintas baris. |
| 5.2 `*ngFor` & Optimasi | `index`, `first`, `last`, nested loops, dan custom `trackBy`. |
| 5.3 UI State & `*ngIf` | Empty State, Populated State, `ng-template`, `then`, `else`, dan Getter Controller. |
| Presentasi dan Technical Defense | Demonstrasi skenario normal, edge cases, dan konsistensi kode dengan diagram. |

---

## Pengembang

**Smart Budget Allocation Planner** dikembangkan sebagai project individu untuk memenuhi tugas Ujian Tengah Semester mata kuliah **Framework Based Programming**.

---

*Dokumen ini merupakan README proyek. Perbarui informasi versi, struktur folder, dan perintah yang digunakan apabila konfigurasi aktual project berbeda dari spesifikasi di atas.*
