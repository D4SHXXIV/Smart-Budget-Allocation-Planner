Tahap 1 — Perancangan Awal Smart Budget Allocation Planner

Konsep proyek ditetapkan
Mengikuti ketentuan UTS

Kita akan membangun aplikasi bernama Smart Budget Allocation Planner (SBAP).

Karena kamu masih pemula dalam Angular, kita akan menggunakan pendekatan bertahap. Kita tidak akan langsung membuat kode yang rumit. Kita pahami dahulu sistemnya, bagaimana pengguna berinteraksi, bagaimana data diolah, baru kemudian menerjemahkannya menjadi kode Angular.

Aku juga akan menyusun rancangan dengan format yang nantinya bisa dimasukkan ke laporan UTS.

1. Identitas dan deskripsi proyek
   Informasi Keterangan
   Nama aplikasi Smart Budget Allocation Planner
   Singkatan SBAP
   Mata kuliah Framework Based Programming
   Framework Angular
   Bahasa pemrograman TypeScript
   Bahasa tampilan HTML dan CSS
   Pendekatan form Angular Reactive Forms
   Pengelolaan data FormGroup dan FormArray
   Penyimpanan data In-memory (memori aplikasi)
   Pengguna Pengelola Anggaran

Deskripsi aplikasi untuk laporan:

Smart Budget Allocation Planner merupakan aplikasi web interaktif berbasis Angular yang dirancang untuk membantu pengguna merencanakan dan membagi anggaran ke dalam beberapa kategori pengeluaran secara dinamis. Pengguna dapat menentukan total anggaran, menambahkan dan menghapus kategori anggaran, menentukan persentase alokasi setiap kategori, serta menambahkan rincian pengeluaran berupa sub-item pada masing-masing kategori.

Aplikasi menyediakan perhitungan nominal alokasi secara otomatis berdasarkan persentase yang dimasukkan pengguna. Selain itu, sistem dilengkapi validasi lintas baris untuk mendeteksi duplikasi kategori, memeriksa kesesuaian total persentase alokasi, dan memastikan jumlah rincian pengeluaran tidak melebihi anggaran kategori.

Melalui aplikasi ini, pengguna dapat melihat ringkasan distribusi anggaran secara langsung tanpa memerlukan backend maupun database. 2. Latar belakang dan permasalahan
Bagian ini penting untuk laporan karena menjelaskan alasan mengapa aplikasi dibuat.

A. Latar belakang

Dalam pengelolaan keuangan, pembagian anggaran merupakan salah satu proses yang membutuhkan ketelitian. Pengguna sering kali harus membagi sejumlah dana ke berbagai kebutuhan, seperti pendidikan, operasional, transportasi, dan kebutuhan lainnya.

Proses pembagian anggaran secara manual dapat menimbulkan beberapa permasalahan, seperti kesalahan perhitungan, ketidaksesuaian total persentase, duplikasi kategori, serta pembagian dana yang melebihi anggaran yang telah ditentukan.

Oleh karena itu, diperlukan aplikasi interaktif yang dapat membantu pengguna mengatur alokasi anggaran secara dinamis, melakukan perhitungan otomatis, dan memberikan informasi validasi secara langsung.

B. Rumusan masalah

1. Bagaimana pengguna dapat menambahkan dan menghapus kategori anggaran secara dinamis?
2. Bagaimana sistem dapat menghitung nominal anggaran berdasarkan persentase setiap kategori?
3. Bagaimana sistem mendeteksi duplikasi kategori dan ketidaksesuaian total persentase?
4. Bagaimana pengguna dapat mengelola rincian pengeluaran dalam setiap kategori?
5. Bagaimana sistem menampilkan ringkasan anggaran dan status validasi secara real-time?
   C. Tujuan aplikasi
6. Mempermudah pengguna dalam merencanakan pembagian anggaran.
7. Mengimplementasikan Dynamic Multi-Input Form menggunakan Angular FormArray.
8. Menerapkan validasi lintas baris dan validasi input bertingkat.
9. Mengimplementasikan perulangan dinamis dan nested loop.
10. Menampilkan perubahan data dan hasil perhitungan secara langsung.
    Bagian ini merupakan rancangan studi kasus yang kita pilih. Soal UTS memang memberikan kebebasan untuk mengusulkan ide aplikasi, tetapi mensyaratkan aplikasi interaktif dan bukan CRUD statis biasa.
    UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf
    UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf

11. Gambaran cara kerja aplikasi
    Sebelum masuk diagram UML, kita pahami dahulu contoh penggunaan aplikasinya.

Misalnya, pengguna mempunyai total anggaran sebesar Rp10.000.000.

Pengguna ingin membagi anggaran ke dalam tiga kategori:
Total anggaranRp10.000.000
Contoh data simulasi

Pendidikan
40%

Nominal alokasi

Rp4.000.000

Rincian sub-itemBuku: Rp1.000.000

Uang kuliah: Rp2.500.000

Perlengkapan: Rp500.000

Operasional
35%

Nominal alokasi

Rp3.500.000

Rincian sub-itemListrik: Rp1.000.000

Internet: Rp500.000

Kebutuhan kantor: Rp2.000.000

Transportasi
25%

Nominal alokasi

Rp2.500.000

Rincian sub-itemBensin: Rp1.500.000

Transportasi umum: Rp1.000.000

Total persentase
100%

Total alokasi
Rp10.000.000

Alokasi valid

Perhitungan nominal dilakukan dengan rumus:
\[
\text{Nominal Kategori} =
\frac{\text{Persentase}}{100}
\times \text{Total Anggaran}
\]

Contoh untuk kategori Pendidikan:
\[
\frac{40}{100}\times 10.000.000
=4.000.000
\]

Jadi, ketika pengguna mengubah persentase dari 40% menjadi 45%, nominal alokasi Pendidikan otomatis berubah menjadi Rp4.500.000.

Inilah yang membuat aplikasi kita interaktif: pengguna tidak perlu menghitung ulang secara manual.

Struktur data yang akan kita kelola:
Budget

Total anggaran: Rp10.000.000

Categories (FormArray)
Category 1 — Pendidikan

percentage: 40%
Items (Nested FormArray)

Buku — Rp1.000.000

Uang kuliah — Rp2.500.000

Perlengkapan — Rp500.000

Category 2 — Operasional

percentage: 35%
Items (Nested FormArray)

Listrik — Rp1.000.000

Internet — Rp500.000

Category 3 — Transportasi

percentage: 25%

Items (Nested FormArray)

Jangan khawatir dengan istilah FormArray dan Nested FormArray. Nanti kita pelajari melalui praktik. Untuk sekarang, cukup pahami bahwa satu anggaran memiliki banyak kategori dan setiap kategori memiliki banyak rincian pengeluaran. 4. Batasan dan aturan bisnis aplikasi
Agar aplikasi tidak terlalu rumit untuk pemula, kita tetapkan aturan sejak awal.

Ini adalah keputusan desain proyek kita, bukan angka atau aturan yang diwajibkan secara eksplisit oleh soal UTS.
No. Aturan Ketentuan
1 Total anggaran Wajib lebih dari Rp0
2 Jumlah kategori minimum 2 kategori
3 Jumlah kategori maksimum 10 kategori
4 Nama kategori Wajib diisi dan tidak boleh duplikat
5 Persentase kategori Lebih dari 0% dan maksimal 100%
6 Total persentase Harus tepat 100% agar valid
7 Sub-item Dapat ditambah dan dihapus pada masing-masing kategori
8 Nama sub-item Wajib diisi dan tidak boleh duplikat dalam kategori yang sama
9 Nominal sub-item Harus lebih dari Rp0
10 Total sub-item Tidak boleh melebihi nominal alokasi kategori

Contoh validasi yang akan diterapkan:
Kasus Input Hasil
Nama kategori duplikat Pendidikan, Pendidikan Tidak valid
Total persentase kurang 40% + 30% + 20% Tidak valid
Total persentase lebih 50% + 35% + 25% Tidak valid
Total tepat 40% + 35% + 25% Valid
Sub-item melebihi alokasi Alokasi Rp4 juta, rincian Rp4,5 juta Tidak valid

Aturan batas minimal 2 dan maksimal 10 kategori akan membantu kita menunjukkan fungsi penambahan, penghapusan, serta penguncian tombol pada baris pertama dan terakhir.

Batasan teknis: proyek ini tidak akan menggunakan API atau database. Data disimpan sementara di memori Angular, sehingga data dapat hilang ketika halaman di-refresh. Ini sesuai dengan ruang lingkup UTS yang memfokuskan pengerjaan pada View dan Controller tanpa mewajibkan backend/database.
UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf

5. Identifikasi aktor dan fungsionalitas sistem
   Dalam Use Case Diagram, kita harus menentukan siapa yang menggunakan sistem dan aktivitas apa yang dapat dilakukan.
   A. Aktor sistem
   Kita cukup menggunakan satu aktor utama:

Pengelola Anggaran (User)

Orang yang menggunakan aplikasi untuk mengatur total anggaran, membuat kategori, mengelola rincian pengeluaran, dan melihat hasil pembagian anggaran.

Kita tidak memerlukan aktor Admin karena proyek ini merupakan aplikasi simulasi untuk satu pengguna dan belum memerlukan sistem login.
B. Daftar use case
Berikut fungsionalitas utama yang akan dimasukkan ke diagram.
ID Nama Use Case Deskripsi
UC-01 Mengelola Alokasi Anggaran Menambah, menghapus, dan mengubah kategori serta persentase anggaran.
UC-02 Mengelola Rincian Sub-item Menambah, menghapus, dan mengubah rincian pengeluaran dalam kategori.
UC-03 Melihat Ringkasan Anggaran Melihat total anggaran, persentase, nominal kategori, dan status validasi.
UC-04 Memvalidasi Kategori dan Persentase Memeriksa nama duplikat dan total persentase.
UC-05 Menghitung Nominal Alokasi Menghitung nominal setiap kategori secara otomatis.
UC-06 Menghitung Total Sub-item Menjumlahkan nominal rincian dalam kategori.
UC-07 Menampilkan Peringatan Kelebihan Anggaran Menampilkan peringatan jika nominal sub-item melebihi alokasi kategori.
UC-08 Menghitung Ringkasan Anggaran Mengolah total dan status anggaran untuk ditampilkan.

UC-04 sampai UC-08 merupakan fungsi pendukung dari use case utama. 6. Use Case Diagram
Sekarang kita susun hubungan antar-use case menggunakan notasi UML.

Kita menggunakan dua jenis relasi:

<<include>>

Artinya, sebuah use case selalu membutuhkan fungsi lain sebagai bagian dari prosesnya.

Contoh: Mengelola Alokasi Anggaran selalu membutuhkan Validasi Kategori dan Persentase.

<<extend>>

Artinya, sebuah use case memberikan perilaku tambahan apabila kondisi tertentu terjadi.

Contoh: Peringatan Kelebihan Anggaran muncul ketika total sub-item melebihi alokasi kategori.
Source diagram UML
Berikut rancangan yang bisa digunakan untuk membuat Use Case Diagram. Kode ini menggunakan PlantUML agar diagram dapat diubah menjadi gambar nantinya.

@startuml

left to right direction

actor "Pengelola Anggaran" as User

rectangle "Smart Budget Allocation Planner" {

    usecase "UC-01\nMengelola Alokasi Anggaran" as UC01

    usecase "UC-02\nMengelola Rincian Sub-item" as UC02

    usecase "UC-03\nMelihat Ringkasan Anggaran" as UC03

    usecase "Memvalidasi Kategori\ndan Persentase" as UC04

    usecase "Menghitung Nominal\nAlokasi Otomatis" as UC05

    usecase "Menghitung Total\nSub-item" as UC06

    usecase "Menampilkan Peringatan\nKelebihan Anggaran" as UC07

    usecase "Menghitung Ringkasan\nAnggaran" as UC08

}

User --> UC01
User --> UC02
User --> UC03

UC01 ..> UC04 : <<include>>
UC01 ..> UC05 : <<include>>

UC02 ..> UC06 : <<include>>

UC07 ..> UC02 : <<extend>>

UC03 ..> UC08 : <<include>>

note right of UC07
Kondisi:
Total sub-item >
nominal alokasi kategori
end note

@enduml

Rancangan awal Use Case Diagram, bukan diagram final yang sudah diekspor.Penjelasan diagram:

- Pengelola Anggaran dapat mengelola kategori anggaran.
- Setiap pengelolaan kategori membutuhkan validasi dan perhitungan nominal.
- Pengelola Anggaran dapat mengelola sub-item pada setiap kategori.
- Sistem menghitung total nominal sub-item.
- Apabila total sub-item melebihi alokasi kategori, sistem menampilkan peringatan.
- Pengelola Anggaran dapat melihat ringkasan keseluruhan anggaran.
  Rancangan ini memenuhi kebutuhan soal nomor 1, yaitu adanya aktor, fungsi utama, serta hubungan include dan extend.
  UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf

7. Use Case Description
   Selanjutnya kita buat tiga deskripsi use case utama.

Ini adalah bagian yang akan menjadi dasar Sequence Diagram dan implementasi kode.
UC-01 — Mengelola Alokasi Anggaran
Elemen Deskripsi
Use Case ID UC-01
Nama Mengelola Alokasi Anggaran
Aktor Pengelola Anggaran
Tujuan Mengatur kategori dan persentase pembagian anggaran.
Precondition Aplikasi sudah dibuka dan pengguna dapat mengakses halaman pengelolaan anggaran.

Main Flow (Action-Reaction)
No. Action (User / View) Reaction (Controller / Sistem)
1 Pengguna memasukkan total anggaran. Controller memvalidasi nominal anggaran harus lebih dari nol.
2 Pengguna menekan tombol Tambah Kategori. View memanggil method addCategory().
3 Pengguna mengisi nama dan persentase kategori. Controller menerima nilai melalui Reactive Forms.
4 Pengguna menambahkan kategori lainnya. Controller menambahkan FormGroup baru ke dalam FormArray.
5 Pengguna mengubah persentase kategori. Controller menghitung ulang nominal alokasi dan total persentase.
6 Pengguna menghapus kategori tertentu. Controller memanggil removeCategory(index) dan menghapus baris berdasarkan indeks.
7 View memperbarui data. Angular menampilkan kondisi terbaru melalui template.

Alternative Flow (Validasi Gagal)
Kondisi Respons sistem
Total anggaran kosong atau nol Menampilkan pesan bahwa anggaran wajib lebih dari nol.
Nama kategori kosong Menampilkan pesan bahwa nama kategori wajib diisi.
Nama kategori duplikat Menampilkan peringatan duplikasi.
Persentase kurang dari atau sama dengan nol Menampilkan pesan persentase harus lebih dari nol.
Total persentase lebih dari 100% Menampilkan peringatan alokasi melebihi 100%.
Jumlah kategori sudah mencapai 10 Tombol tambah kategori dinonaktifkan.
Jumlah kategori tinggal 2 Tombol hapus kategori dinonaktifkan.

Postcondition:

Data kategori dan persentase tersimpan sementara dalam FormArray. Nominal alokasi setiap kategori dihitung otomatis dan status validasi diperbarui sesuai kondisi terbaru.
UC-02 — Mengelola Rincian Sub-item
Elemen Deskripsi
Use Case ID UC-02
Nama Mengelola Rincian Sub-item
Aktor Pengelola Anggaran
Tujuan Menambahkan serta mengatur rincian pengeluaran pada masing-masing kategori.
Precondition Pengguna sudah memiliki kategori anggaran.

Main Flow (Action-Reaction)
No. Action (User / View) Reaction (Controller / Sistem)
1 Pengguna memilih kategori. View mengidentifikasi kategori berdasarkan indeks.
2 Pengguna menekan tombol Tambah Sub-item. View memanggil method addSubItem(categoryIndex).
3 Pengguna mengisi nama dan nominal sub-item. Controller menerima nilai dari Reactive Forms.
4 Pengguna menambah sub-item lainnya. Controller menambahkan FormGroup ke Nested FormArray milik kategori tersebut.
5 Pengguna menghapus sub-item tertentu. Controller memanggil removeSubItem(categoryIndex, itemIndex).
6 Pengguna mengubah nominal sub-item. Controller menghitung ulang total rincian kategori.
7 Sistem memperbarui tampilan. View menampilkan subtotal dan sisa anggaran kategori.

Alternative Flow (Validasi Gagal)
Kondisi Respons sistem
Nama sub-item kosong Menampilkan pesan bahwa nama wajib diisi.
Nama sub-item duplikat dalam satu kategori Menampilkan peringatan duplikasi.
Nominal kosong atau kurang dari/sama dengan nol Menampilkan pesan nominal tidak valid.
Total sub-item melebihi alokasi kategori Menampilkan peringatan kelebihan anggaran.

Postcondition:

Data sub-item tersimpan dalam Nested FormArray sesuai kategori masing-masing. Sistem menampilkan total rincian pengeluaran dan sisa anggaran kategori.
UC-03 — Melihat Ringkasan Anggaran
Elemen Deskripsi
Use Case ID UC-03
Nama Melihat Ringkasan Anggaran
Aktor Pengelola Anggaran
Tujuan Mengetahui hasil pembagian anggaran dan status validasi.
Precondition Aplikasi telah dibuka.

Main Flow (Action-Reaction)
No. Action (User / View) Reaction (Controller / Sistem)
1 Pengguna membuka bagian Ringkasan. View mengakses data anggaran.
2 Sistem memeriksa keberadaan kategori. Controller mengevaluasi getter hasCategories.
3 Sistem membaca persentase kategori. Controller menghitung totalPercentage.
4 Sistem menghitung nominal seluruh kategori. Controller mengolah totalAllocated.
5 Sistem menghitung subtotal sub-item. Controller menghitung total rincian setiap kategori.
6 View menampilkan hasil pengolahan. Angular memperbarui tampilan ringkasan.
7 Pengguna mengubah input anggaran. Controller menghitung ulang dan View menampilkan data terbaru.

Alternative Flow (Validasi Gagal)
Kondisi Respons sistem
Belum ada kategori Menampilkan Empty State.
Total persentase belum mencapai 100% Menampilkan status alokasi belum lengkap.
Total persentase lebih dari 100% Menampilkan status alokasi tidak valid.
Total sub-item melebihi alokasi kategori Menampilkan status kelebihan anggaran.

Postcondition:

Ringkasan anggaran ditampilkan berdasarkan kondisi data terakhir. Status validasi menunjukkan apakah pembagian anggaran sudah memenuhi aturan yang ditentukan.

8. Hubungan rancangan dengan persyaratan implementasi UTS
   Agar nanti tidak ada persyaratan yang terlupakan, kita petakan dari sekarang.
   Ketentuan soal Rancangan Smart Budget
   FormArray dinamis Kategori anggaran
   Append addCategory() dan addSubItem()
   Remove at index removeCategory(index) dan removeSubItem(categoryIndex, itemIndex)
   Nested items Sub-item dalam setiap kategori
   Cross-item validation Duplikasi dan total persentase 100%
   Context variable index Nomor setiap kategori dan sub-item
   Context variable first/last Tombol pindah posisi dinonaktifkan di batas atas/bawah
   Custom trackBy trackByCategory() dan trackBySubItem()
   Nested loops Perulangan kategori dan sub-item
   Empty State Belum ada kategori
   Populated State Kategori telah tersedia
   Getter Controller hasCategories, isBudgetValid, dan lainnya

Semua ini langsung mengacu pada kriteria implementasi nomor 5.1, 5.2, dan 5.3 dalam soal UTS.
UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf

9. Nama method dan property yang akan kita gunakan
   Mulai sekarang, kita tetapkan nama-nama berikut agar konsisten antara Use Case Description, Sequence Diagram, dan kode TypeScript.
   Jenis Nama
   Form utama budgetForm
   FormArray kategori categories
   FormArray sub-item items
   Menambah kategori addCategory()
   Menghapus kategori removeCategory(index)
   Membuat FormGroup kategori createCategory()
   Mengambil sub-item kategori getSubItems(categoryIndex)
   Menambah sub-item addSubItem(categoryIndex)
   Menghapus sub-item removeSubItem(categoryIndex, itemIndex)
   Total persentase totalPercentage
   Total anggaran kategori totalAllocated
   Total rincian calculateSubTotal(categoryIndex)
   Kondisi data tersedia hasCategories
   Status validasi isBudgetValid
   Track kategori trackByCategory()
   Track sub-item trackBySubItem()

Nama di atas adalah kontrak awal penamaan proyek. Kita akan mempertahankannya kecuali ada kebutuhan teknis yang mengharuskan perubahan, dan apabila berubah, diagram juga harus diperbarui.

10. Apa yang sudah selesai dan berikutnya?
    Progress perancangan UTS
    Identitas dan ide aplikasi
    Selesai

Latar belakang dan tujuan
Selesai

Aturan bisnis
Selesai

Rancangan Use Case
Draft selesai

3 Use Case Description
Draft selesai

Tahap selanjutnya
Belum dikerjakan

1. Finalisasi Use Case Diagram dalam bentuk gambar.
2. Membuat Sequence Diagram View–Controller untuk ketiga use case.
3. Membuat Component Tree dan Data Mapping Angular.
4. Persiapan lingkungan Angular untuk pemula.
5. Implementasi aplikasi dan pengujian.

Satu hal yang perlu kamu pahami sebelum kita lanjut: Sequence Diagram adalah penghubung antara rancangan dan kode program. Karena dosen meminta konsistensi 100%, kita harus merancang urutan interaksi View dan Controller secara teliti sebelum mulai coding.
UTS FBP HALIMATUZ Z TI Ganjil 2026.pdf

Langkah berikutnya adalah menyusun Sequence Diagram UC-01, UC-02, dan UC-03, lengkap dengan event binding, pemanggilan method TypeScript, perubahan FormArray di memori, kalkulasi real-time, validasi, dan pembaruan tampilan.
