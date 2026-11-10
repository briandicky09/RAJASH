# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH

**Program:** Asah 2026 – Dicoding x GoTo  
**ID Tim:** A26-CS148  
**Nama UMKM:** RAJASH  
**Bidang Usaha:** Depot Air Minum Isi Ulang  
**PIC UMKM:** Dedy Darmansyah (Owner)  
**Tanggal Penyusunan:** 10 November 2026  
**Status Dokumen:** Draft – Acuan Pengembangan MVP

---

## 1. Ringkasan Produk

Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH merupakan aplikasi berbasis web yang dirancang untuk membantu pemilik depot air minum isi ulang RAJASH dalam mengelola pencatatan pemasukan, pengeluaran operasional, piutang pelanggan, serta rekapitulasi keuangan usaha.

Saat ini, pencatatan transaksi masih dilakukan secara manual menggunakan buku besar. Proses tersebut berisiko menyebabkan transaksi terlewat atau tercatat lebih dari satu kali. Pemilik juga membutuhkan waktu untuk menghitung pemasukan, pengeluaran, keuntungan bersih, dan memeriksa tagihan pelanggan yang belum lunas.

Melalui aplikasi ini, proses pencatatan diharapkan menjadi lebih terstruktur, mudah dipantau, dan mampu menyajikan informasi keuangan secara otomatis.

Produk dikembangkan sebagai Minimum Viable Product (MVP) dalam kegiatan capstone Asah 2026 dengan fokus utama pada pengelolaan keuangan dan piutang.

## 2. Latar Belakang dan Permasalahan

### 2.1 Profil Bisnis

RAJASH merupakan usaha depot air minum isi ulang yang beroperasi sejak tahun 2016 dan berlokasi di wilayah Ulee Kareng, Banda Aceh.

Layanan utama RAJASH meliputi pengisian air minum galon dan pengantaran kepada pelanggan. Pemesanan dilakukan secara langsung di depot maupun melalui WhatsApp. Pembayaran umumnya dilakukan secara tunai, tetapi terdapat pelanggan tertentu yang diperbolehkan melakukan pembayaran secara utang.

### 2.2 Kondisi Saat Ini

Proses pencatatan keuangan masih menggunakan buku besar secara manual. Pencatatan mencakup pemasukan penjualan, pengeluaran operasional, dan piutang pelanggan.

Beberapa jenis biaya operasional yang dicatat antara lain:
- BBM becak pengantar.
- Servis kendaraan.
- Penggantian oli.
- Perbaikan ban.
- Pembelian pasokan air untuk tangki utama.
- Biaya operasional lainnya.

### 2.3 Permasalahan Utama

Permasalahan yang menjadi prioritas adalah belum tersedianya sistem pencatatan dan rekapitulasi keuangan yang terstruktur serta otomatis.

Dampak yang ditemukan:
1. Transaksi berisiko terlewat ketika aktivitas usaha sedang ramai.
2. Transaksi berpotensi tercatat lebih dari satu kali.
3. Rekapitulasi pemasukan dan pengeluaran membutuhkan waktu.
4. Pemilik kesulitan mengetahui keuntungan bersih secara akurat.
5. Pemantauan piutang dan pembayaran pelanggan masih dilakukan secara manual.

### 2.4 Tujuan Produk

- Mempermudah pencatatan pemasukan dan pengeluaran harian.
- Membantu mengurangi risiko transaksi ganda.
- Mempermudah pemantauan piutang pelanggan.
- Menghitung keuntungan bersih secara otomatis.
- Menyediakan rekapitulasi keuangan berdasarkan periode.
- Menyediakan pengingat untuk membantu pemilik memantau piutang yang belum lunas.

## 3. Target Pengguna

### Pengguna Utama: Owner RAJASH

Owner merupakan pengguna utama yang memiliki akses untuk mengelola seluruh aktivitas pencatatan keuangan melalui aplikasi.

Kebutuhan pengguna:
- Melihat ringkasan kondisi keuangan usaha.
- Mencatat pemasukan penjualan.
- Mencatat pengeluaran operasional.
- Mengelola piutang pelanggan.
- Memantau pembayaran yang belum lunas.
- Melihat rekapitulasi keuangan harian dan bulanan.

**Batasan pengguna:** MVP difokuskan pada satu jenis pengguna utama, yaitu pemilik usaha. Pengelolaan akun karyawan dan hak akses bertingkat tidak termasuk dalam kebutuhan inti.

## 4. Ruang Lingkup Produk

### 4.1 Fitur yang Termasuk dalam MVP

| Modul | Deskripsi |
|---|---|
| Autentikasi | Login pemilik untuk mengakses aplikasi |
| Dashboard | Ringkasan pemasukan, pengeluaran, laba bersih, dan piutang |
| Pemasukan | Pencatatan transaksi penjualan tunai dan kredit |
| Pengeluaran | Pencatatan biaya operasional berdasarkan kategori |
| Piutang | Pengelolaan tagihan dan status pembayaran pelanggan |
| Validasi Transaksi | Pemeriksaan potensi transaksi ganda |
| Rekapitulasi | Ringkasan keuangan harian dan bulanan |
| Pengingat | Informasi pengingat pembayaran piutang di dalam aplikasi |

### 4.2 Fitur di Luar Ruang Lingkup MVP

Fitur berikut tidak menjadi fokus implementasi MVP:
- Manajemen stok galon dan persediaan.
- Pengelolaan rute pengiriman dan penjadwalan kurir.
- Integrasi WhatsApp Gateway atau notifikasi eksternal.
- Integrasi QRIS, payment gateway, dan perbankan.
- Penggajian dan absensi karyawan.
- Laporan akuntansi komprehensif dan perpajakan.
- Pengelolaan alamat pribadi pelanggan.
- Integrasi perangkat keras mesin depot.
- Fitur pemesanan pelanggan secara mandiri.

Fitur prediksi dan Generative AI yang tercantum dalam project plan tim merupakan kebutuhan pengembangan tambahan capstone. Fitur tersebut perlu dipisahkan dari kebutuhan inti owner dan tidak boleh menghambat penyelesaian alur utama MVP.

## 5. Kebutuhan Fungsional

### FR-01 – Autentikasi Pengguna

**Deskripsi:** Sistem menyediakan mekanisme login untuk pemilik usaha.

Kebutuhan:
- Pengguna dapat memasukkan username/email dan password sesuai mekanisme autentikasi yang disepakati.
- Sistem memvalidasi kredensial.
- Pengguna dengan kredensial valid diarahkan ke dashboard.
- Pengguna dengan kredensial tidak valid mendapatkan pesan kesalahan.
- Halaman aplikasi yang memerlukan autentikasi tidak dapat diakses tanpa sesi login yang valid.

**Kriteria penerimaan:**
- Login berhasil dengan akun yang valid.
- Login ditolak apabila kredensial salah.
- Pengguna dapat keluar dari aplikasi.

### FR-02 – Dashboard Keuangan

**Deskripsi:** Sistem menampilkan ringkasan kondisi keuangan usaha.

Informasi yang ditampilkan:
- Total pemasukan.
- Total pengeluaran.
- Laba bersih.
- Total piutang yang belum lunas.
- Ringkasan pemasukan dan pengeluaran berdasarkan periode.
- Daftar transaksi terbaru.
- Ringkasan piutang aktif.

**Kriteria penerimaan:**
- Data dashboard berasal dari transaksi yang tersimpan.
- Pengguna dapat melihat ringkasan berdasarkan periode yang tersedia.
- Nilai ringkasan diperbarui setelah transaksi berhasil disimpan atau diperbarui.

### FR-03 – Pencatatan Pemasukan

**Deskripsi:** Sistem memungkinkan pemilik mencatat pemasukan dari penjualan air galon.

Data yang diperlukan:
- Tanggal transaksi.
- Nama pelanggan (jika diperlukan).
- Nominal transaksi.
- Status pembayaran: tunai atau kredit.
- Keterangan tambahan (opsional).

Aturan bisnis:
- Transaksi tunai langsung dihitung sebagai pemasukan yang telah diterima.
- Transaksi kredit dicatat sebagai piutang pelanggan.
- Nominal transaksi harus bernilai positif.
- Data wajib harus divalidasi sebelum disimpan.

**Kriteria penerimaan:**
- Pengguna dapat menyimpan transaksi pemasukan yang valid.
- Data transaksi muncul pada riwayat.
- Transaksi tunai dan kredit dibedakan dengan benar.
- Ringkasan keuangan diperbarui berdasarkan transaksi yang tersimpan.

### FR-04 – Pencatatan Pengeluaran

**Deskripsi:** Sistem memungkinkan pemilik mencatat biaya operasional usaha.

Data yang diperlukan:
- Tanggal pengeluaran.
- Kategori biaya.
- Nominal pengeluaran.
- Keterangan tambahan (opsional).

Kategori awal:
1. BBM Becak.
2. Servis Kendaraan.
3. Penggantian Oli.
4. Perbaikan Ban.
5. Pembelian Pasokan Air.
6. Lainnya.

Aturan bisnis:
- Nominal pengeluaran harus bernilai positif.
- Kategori wajib dipilih.
- Pengeluaran yang valid akan diperhitungkan dalam total pengeluaran dan laba bersih.

**Kriteria penerimaan:**
- Pengguna dapat mencatat pengeluaran.
- Pengeluaran tersimpan dan tampil pada riwayat.
- Total pengeluaran diperbarui setelah penyimpanan berhasil.

### FR-05 – Pengelolaan Piutang

**Deskripsi:** Sistem membantu pemilik mencatat dan memantau transaksi penjualan yang belum dibayar.

Informasi piutang:
- Nama pelanggan.
- Tanggal transaksi.
- Nominal tagihan.
- Jumlah pembayaran.
- Sisa piutang.
- Status pembayaran.

Status pembayaran:
- Belum lunas.
- Lunas.

Aturan bisnis:
- Penjualan kredit menghasilkan catatan piutang.
- Pembayaran pelanggan mengurangi sisa piutang.
- Status berubah menjadi lunas apabila sisa piutang telah mencapai nol.
- Sistem tidak boleh mengizinkan pembayaran melebihi sisa tagihan.

**Kriteria penerimaan:**
- Pengguna dapat melihat daftar piutang.
- Pengguna dapat mencatat pembayaran piutang.
- Sisa tagihan diperbarui setelah pembayaran.
- Status pembayaran berubah sesuai kondisi tagihan.

### FR-06 – Validasi Potensi Duplikasi Transaksi

**Deskripsi:** Sistem melakukan pemeriksaan terhadap kemungkinan transaksi yang tercatat lebih dari satu kali.

Parameter pemeriksaan yang dapat digunakan:
- Tanggal dan waktu transaksi.
- Nominal transaksi.
- Jenis transaksi.
- Informasi terkait transaksi.

Aturan bisnis:
- Sistem memberikan peringatan apabila ditemukan transaksi dengan karakteristik yang mirip dalam rentang waktu tertentu.
- Peringatan merupakan indikasi potensi duplikasi, bukan bukti pasti bahwa transaksi merupakan duplikat.
- Pengguna tetap dapat melakukan konfirmasi sebelum melanjutkan pencatatan.

**Kriteria penerimaan:**
- Sistem dapat mengenali transaksi yang memenuhi kondisi pemeriksaan duplikasi.
- Peringatan ditampilkan sebelum transaksi disimpan.
- Sistem tidak otomatis menghapus transaksi yang dianggap mirip.

### FR-07 – Rekapitulasi Keuangan

**Deskripsi:** Sistem menyediakan ringkasan keuangan berdasarkan periode.

Informasi:
- Total pemasukan.
- Total pengeluaran.
- Laba bersih.
- Ringkasan transaksi.
- Periode harian dan bulanan.

Rumus dasar:

**Laba Bersih = Total Pemasukan - Total Pengeluaran**

Aturan bisnis:
- Perhitungan menggunakan data transaksi yang tersimpan dan valid.
- Transaksi kredit harus dibedakan dari uang yang benar-benar sudah diterima agar laporan arus kas tidak keliru.
- Penghitungan laba dan ringkasan penjualan harus menggunakan definisi yang konsisten.

**Kriteria penerimaan:**
- Pengguna dapat melihat rekap harian dan bulanan.
- Nilai rekap sesuai dengan transaksi pada periode yang dipilih.
- Perubahan transaksi tercermin pada hasil rekap.

### FR-08 – Pengingat Piutang

**Deskripsi:** Sistem menampilkan informasi pengingat terkait tagihan pelanggan yang belum lunas.

Kebutuhan:
- Menampilkan daftar piutang yang masih aktif.
- Menampilkan informasi pelanggan dan sisa tagihan.
- Menampilkan pengingat di dalam aplikasi sesuai mekanisme dan jadwal yang disepakati.
- Pengingat membantu pemilik memeriksa tagihan sebelum operasional berakhir.

**Kriteria penerimaan:**
- Piutang yang belum lunas dapat ditampilkan sebagai pengingat.
- Piutang yang sudah lunas tidak lagi ditampilkan sebagai tagihan aktif.
- Pengingat dapat diakses dari dashboard atau halaman piutang.

Catatan: Waktu dan mekanisme pengingat secara spesifik masih perlu disepakati dalam implementasi.

## 6. Alur Penggunaan Utama

### 6.1 Alur Login
1. Pemilik membuka aplikasi.
2. Pemilik memasukkan kredensial.
3. Sistem memvalidasi kredensial.
4. Jika valid, pengguna diarahkan ke dashboard.
5. Jika tidak valid, sistem menampilkan pesan kesalahan.

### 6.2 Alur Pencatatan Penjualan Tunai
1. Pemilik membuka menu pemasukan.
2. Pemilik mengisi informasi transaksi.
3. Pemilik memilih status pembayaran tunai.
4. Sistem melakukan validasi data dan pemeriksaan potensi duplikasi.
5. Pemilik mengonfirmasi penyimpanan.
6. Sistem menyimpan transaksi.
7. Dashboard dan rekapitulasi diperbarui.

### 6.3 Alur Pencatatan Penjualan Kredit
1. Pemilik membuka menu pemasukan.
2. Pemilik memasukkan informasi pelanggan dan transaksi.
3. Pemilik memilih status pembayaran kredit.
4. Sistem memvalidasi data.
5. Sistem menyimpan transaksi dan membuat catatan piutang.
6. Piutang muncul pada daftar tagihan aktif.

### 6.4 Alur Pembayaran Piutang
1. Pemilik membuka halaman piutang.
2. Pemilik memilih tagihan pelanggan.
3. Pemilik memasukkan nominal pembayaran.
4. Sistem memvalidasi nominal pembayaran.
5. Sistem memperbarui jumlah pembayaran dan sisa tagihan.
6. Jika sisa tagihan nol, status berubah menjadi lunas.

### 6.5 Alur Pencatatan Pengeluaran
1. Pemilik membuka menu pengeluaran.
2. Pemilik memilih kategori biaya.
3. Pemilik memasukkan nominal dan keterangan.
4. Sistem memvalidasi data.
5. Sistem menyimpan transaksi.
6. Total pengeluaran dan rekapitulasi diperbarui.

## 7. Kebutuhan Non-Fungsional

### NFR-01 – Kemudahan Penggunaan
Antarmuka harus sederhana, mudah dipahami, dan tidak memerlukan pengetahuan teknis khusus.

### NFR-02 – Responsivitas
Aplikasi dapat digunakan melalui desktop, tablet, dan smartphone.

### NFR-03 – Performa
Halaman utama dan data transaksi harus dapat ditampilkan secara wajar tanpa proses pemuatan yang mengganggu penggunaan.

### NFR-04 – Keamanan
- Akses aplikasi dilindungi autentikasi.
- Password tidak disimpan dalam bentuk teks biasa.
- Validasi dilakukan pada frontend dan backend.
- Data keuangan dan pelanggan hanya dapat diakses oleh pengguna yang berwenang.

### NFR-05 – Konsistensi Data
Perhitungan pemasukan, pengeluaran, piutang, dan laba bersih harus konsisten dengan data transaksi yang tersimpan.

### NFR-06 – Kompatibilitas
Aplikasi dapat digunakan melalui browser modern pada perangkat desktop dan mobile.

### NFR-07 – Kemudahan Pemeliharaan
Kode aplikasi disusun secara terstruktur dan mudah dikembangkan oleh tim.

## 8. Kebutuhan Data

Data utama yang diperlukan meliputi:

| Entitas | Informasi Utama |
|---|---|
| Pengguna | Identitas akun dan kredensial |
| Pemasukan | Tanggal, nominal, jenis pembayaran, keterangan |
| Pengeluaran | Tanggal, kategori, nominal, keterangan |
| Pelanggan | Identitas pelanggan yang diperlukan untuk piutang |
| Piutang | Referensi transaksi, total tagihan, pembayaran, sisa tagihan, status |
| Pembayaran Piutang | Tanggal pembayaran dan nominal pembayaran |

Data transaksi historis yang tersedia berasal dari buku besar RAJASH untuk periode 23 Agustus 2026 sampai 23 Oktober 2026 dan telah memperoleh izin penggunaan untuk keperluan capstone.

Kualitas dan kelengkapan data perlu diperiksa sebelum digunakan dalam proses pengolahan. Data yang tidak terbaca atau tidak konsisten harus dikonfirmasi atau diberi penanda, bukan diisi dengan angka yang dianggap benar tanpa dasar.

## 9. Indikator Keberhasilan Produk

Keberhasilan MVP dievaluasi berdasarkan kemampuan sistem dalam:

1. Menyimpan transaksi pemasukan dan pengeluaran secara terstruktur.
2. Mengurangi risiko pencatatan transaksi ganda melalui mekanisme peringatan.
3. Menampilkan daftar piutang beserta status pembayarannya.
4. Memperbarui sisa piutang setelah pembayaran dicatat.
5. Menghasilkan perhitungan pemasukan, pengeluaran, dan laba bersih secara otomatis.
6. Menampilkan rekapitulasi harian dan bulanan.
7. Menyediakan tampilan yang dapat digunakan melalui desktop maupun smartphone.
8. Mempermudah pemilik memahami kondisi keuangan usaha melalui dashboard.

Pengujian dilakukan melalui skenario fungsional, pemeriksaan perhitungan, dan demonstrasi kepada pemilik UMKM.

## 10. Teknologi dan Lingkungan Pengembangan

Berdasarkan project plan tim, teknologi yang direncanakan adalah:

| Bagian | Teknologi |
|---|---|
| Frontend | React.js |
| UI Framework | Bootstrap 5 |
| Backend | Laravel |
| Runtime | PHP |
| Database | MySQL |
| API | RESTful API berbasis JSON |
| Version Control | Git dan GitHub |
| Deployment/Demo | Vercel dan/atau lingkungan lokal sesuai kebutuhan integrasi |

Frontend bertanggung jawab terhadap antarmuka, validasi interaksi pengguna, responsivitas, dan integrasi API.

Backend bertanggung jawab terhadap autentikasi, pengelolaan data, validasi bisnis, serta penyediaan API.

Detail endpoint, struktur respons API, dan skema database ditetapkan melalui koordinasi frontend dan backend.

## 11. Pembagian Tanggung Jawab Tim

| Anggota/Peran | Tanggung Jawab Utama |
|---|---|
| Brian Dicky Vanka Andaraneva | Pengembangan frontend, UI responsif, validasi antarmuka, dan integrasi API |
| Reinald Oryza Apriancahya | Backend, autentikasi, database, logika transaksi, dan API |
| Meutia Shafira Ramadhani | Analisis data dan pengembangan data science |
| Aqilla Resya Luthfiya | Pengolahan data dan pengembangan data science |
| Putri Hanin Tsabitah | Pengembangan kebutuhan Next-Gen AI Engineer |
| Rayyan Rabbani Basith | Pengembangan kebutuhan Next-Gen AI Engineer |

Pembagian ini merupakan pembagian tanggung jawab utama dan tetap dapat disesuaikan berdasarkan koordinasi serta kebutuhan implementasi tim.

## 12. Prioritas Pengembangan

### Prioritas 1 – Core MVP
- Login.
- Dashboard ringkasan keuangan.
- Pencatatan pemasukan tunai dan kredit.
- Pencatatan pengeluaran.
- Pengelolaan piutang.
- Validasi potensi duplikasi.
- Rekapitulasi harian dan bulanan.
- Penghitungan laba bersih.

### Prioritas 2 – Pendukung MVP
- Pengingat piutang dalam aplikasi.
- Penyempurnaan responsivitas.
- Riwayat dan perbaikan pengalaman pengguna.
- Dokumentasi dan pengujian.

### Prioritas 3 – Tambahan Capstone
- Pengolahan data historis.
- Model prediksi.
- Generative AI untuk insight operasional.

Prioritas tambahan capstone harus dikerjakan setelah alur inti MVP berjalan dan sesuai pembagian Main Quest tim. Fitur tambahan tidak boleh mengorbankan penyelesaian kebutuhan inti UMKM.

## 13. Risiko dan Batasan

| Risiko | Mitigasi |
|---|---|
| Data historis tidak lengkap atau sulit dibaca | Verifikasi data dan dokumentasikan asumsi |
| Transaksi berpotensi tercatat ganda | Pemeriksaan kesamaan transaksi dan konfirmasi pengguna |
| Kesalahan perhitungan keuangan | Pengujian rumus dan rekonsiliasi dengan data referensi |
| Integrasi frontend dan backend terlambat | Menyepakati kontrak API sejak awal |
| Waktu pengembangan terbatas | Mengutamakan penyelesaian core MVP |
| Perubahan kebutuhan saat demonstrasi | Memprioritaskan perbaikan yang tidak mengubah fondasi sistem |

## 14. Asumsi dan Hal yang Perlu Dikonfirmasi

Bagian ini harus diperjelas bersama tim atau pemilik sebelum implementasi final:

1. Apakah transaksi kredit akan dicatat sebagai pemasukan penjualan sekaligus piutang, sementara laporan arus kas hanya menghitung pembayaran yang sudah diterima?
2. Apakah pembayaran piutang dapat dilakukan secara bertahap?
3. Apakah transaksi yang sudah tersimpan dapat diedit atau dibatalkan?
4. Bagaimana sistem menentukan transaksi yang berpotensi duplikat?
5. Apakah tanggal transaksi dapat diinput mundur untuk pencatatan transaksi sebelumnya?
6. Jam operasional yang menjadi acuan pengingat piutang adalah pukul 22.00 atau 23.00 WIB?
7. Apakah data pelanggan cukup berupa nama atau diperlukan informasi tambahan?
8. Bagaimana mekanisme pencatatan data historis yang akan digunakan untuk pengujian?
9. Bagaimana pembagian fitur tambahan AI dan prediksi terhadap alur utama MVP?

Keputusan yang belum dikonfirmasi tidak boleh dianggap sebagai kebutuhan final.

## 15. Definisi Selesai (Definition of Done)

MVP dapat dinyatakan siap untuk demonstrasi apabila:

- Pengguna dapat login dan logout.
- Pengguna dapat mencatat pemasukan tunai dan kredit.
- Pengguna dapat mencatat pengeluaran operasional.
- Sistem dapat menampilkan dan memperbarui data piutang.
- Sistem dapat mencatat pembayaran piutang.
- Sistem dapat memberikan peringatan potensi transaksi ganda.
- Dashboard menampilkan ringkasan berdasarkan data yang tersimpan.
- Rekapitulasi harian dan bulanan menghasilkan perhitungan yang sesuai.
- Antarmuka dapat digunakan pada desktop dan smartphone.
- Alur utama telah melalui pengujian.
- Dokumentasi penggunaan dan hasil pengujian tersedia.

---

**Akhir Dokumen PRD**

Dokumen ini menjadi acuan awal pengembangan Sistem Pengelolaan Keuangan dan Piutang UMKM RAJASH. Perubahan kebutuhan, penambahan fitur, dan keputusan implementasi harus diselaraskan dengan hasil wawancara, project plan, kapasitas tim, serta validasi dari pemilik UMKM.