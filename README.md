# Smart Budget Allocation Planner (SBAP)

Aplikasi web interaktif berbasis **Angular** untuk merencanakan dan mengalokasikan anggaran keuangan ke berbagai kategori secara dinamis dan real-time.

Proyek ini dikembangkan untuk memenuhi tugas **Ujian Tengah Semester (UTS)** mata kuliah **Framework Based Programming (FBP)** — Program Studi Teknik Informatika, Jakarta Global University.

---

## 🌟 Fitur Utama & Kepatuhan Rubrik UTS

1. **Dynamic Multi-Input FormArray & Nested FormArray (UTS 5.1 - Bobot 15%):**
   - Penambahan baris dinamis (*append*) untuk kategori anggaran (`addCategory()`) dan sub-item (`addSubItem()`).
   - Penghapusan baris pada indeks spesifik (*remove at index*) untuk kategori (`removeCategory(index)`) dan sub-item (`removeSubItem(categoryIndex, itemIndex)`).
   - Struktur data bertingkat (*nested array*): Setiap kategori memiliki `FormArray` sub-item tersendiri.
   - **Cross-Item Validation (Validasi Lintas-Baris):**
     - Deteksi duplikasi nama kategori (*case-insensitive & trimmed*).
     - Deteksi duplikasi nama sub-item dalam satu kategori yang sama.
     - Validasi akumulasi persentase kategori harus tepat 100%.
     - Batasan minimal 2 kategori dan maksimal 10 kategori (dengan proteksi ganda: tombol dinonaktifkan + validasi di Controller).
     - Deteksi *over-allocation* saat total nominal sub-item melebihi pagu alokasi kategori.

2. **Direktif `*ngFor` Tingkat Lanjut (UTS 5.2 - Bobot 15%):**
   - Memanfaatkan **Context Variables**:
     - `index`: Penomoran baris dan pengalamatan indeks aksi.
     - `first`: Penguncian tombol pindah posisi baris ke atas (*Move Up* dinonaktifkan pada baris pertama).
     - `last`: Penguncian tombol pindah posisi baris ke bawah (*Move Down* dinonaktifkan pada baris terakhir).
   - Mengimplementasikan **fungsi `trackBy` kustom** (`trackByCategory` & `trackBySubItem`) menggunakan ID unik stabil berbasis Controller untuk optimasi rendering DOM.
   - **Nested Loops (Perulangan Bertingkat):** Loop kategori di luar dan loop sub-item di dalam masing-masing kartu kategori.

3. **Direktif `*ngIf` & UI State Management (UTS 5.3 - Bobot 10%):**
   - Pola **Template Branching** menggunakan `*ngIf` dan `ng-template` dengan selektor `#then` dan `#else`:
     - `#emptyState`: Tampilan panduan saat belum ada nama kategori yang diisi.
     - `#populatedState`: Tampilan metrik kalkulasi lengkap saat kategori telah diisi.
   - **Clean Code:** Seluruh evaluasi logika boolean dan kalkulasi kompleks dipusatkan pada **Getter Methods** di Controller (`hasCategories`, `totalPercentage`, `totalAllocated`, `isBudgetValid`, `hasOverAllocatedCategory`, `budgetStatus`).

4. **Arsitektur Komponen Modular (UTS 4 - Bobot 10%):**
   - Komunikasi data satu arah melalui `@Input()` dan komunikasi event ke atas melalui `@Output()` dengan `EventEmitter`.
   - Controller tunggal (*Single Source of Truth*): Seluruh data bisnis dan form disimpan dalam memori di `BudgetComponent`.

---

## 🏗️ Pohon Hierarki Komponen (Component Tree)

```text
App (AppComponent)
└── BudgetComponent (Controller Utama & In-Memory State)
    ├── BudgetHeaderComponent
    ├── BudgetFormComponent
    │   └── CategoryItemComponent
    │       └── SubItemFormComponent
    └── BudgetSummaryComponent
        ├── SummaryCardComponent
        └── ValidationAlertComponent
```

---

## 🚀 Panduan Menjalankan Aplikasi

### Prasyarat
- **Node.js**: v18+ (Disarankan v20 atau v24)
- **npm**: v9+
- **Angular CLI**: v19 atau v22 (`npm install -g @angular/cli`)

### Langkah Menjalankan
1. Masuk ke direktori aplikasi Angular:
   ```bash
   cd Smart-Budget-Allocation-Planner
   ```

2. Pasang dependensi (jika belum terpasang):
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm start
   # atau: ng serve
   ```

4. Buka peramban (browser) dan akses:
   ```text
   http://localhost:4200/
   ```

---

## 🧪 Skenario Pengujian Mandiri (Live Demo & Defense)

| ID | Skenario Uji | Tindakan Pengguna | Hasil yang Diharapkan |
|---|---|---|---|
| **T-01** | State Awal | Buka aplikasi pertama kali | Form terisi 2 kategori awal (Pendidikan 40%, Operasional 35%). Total persentase 75% (Status Belum Lengkap). |
| **T-02** | Tambah Kategori | Klik tombol "+ Tambah Kategori" | Baris kategori baru muncul. Tombol dinonaktifkan saat kategori mencapai 10. |
| **T-03** | Batas Min. Kategori | Klik tombol hapus hingga tersisa 2 | Tombol hapus dinonaktifkan pada 2 kategori terakhir. |
| **T-04** | Validasi Duplikasi | Masukkan nama "Pendidikan" dan "pendidikan" | Muncul pesan error duplikasi nama kategori. |
| **T-05** | Validasi Persentase 100% | Ubah persentase hingga total 100% | Pesan peringatan hilang, status menjadi hijau / VALID. |
| **T-06** | Sub-item & Over-allocation | Tambah nominal sub-item melebihi nominal kategori | Muncul peringatan merah: Total sub-item melebihi alokasi kategori (UC-07). |
| **T-07** | Pindah Posisi (Move Up/Down) | Klik tombol ▲ pada baris pertama | Tombol ▲ dinonaktifkan pada baris pertama (`first`), tombol ▼ dinonaktifkan pada baris terakhir (`last`). |
| **T-08** | Template Branching | Kosongkan seluruh nama kategori | Panel ringkasan otomatis beralih menampilkan `#emptyState`. |
