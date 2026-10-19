# SITTA UT — Sistem Informasi Tiras dan Transaksi Bahan Ajar
### Tugas Praktik 1 — STSI4209 Pemrograman Berbasis Web
Universitas Terbuka (UT)

---

## Identitas Mahasiswa
- Nama: Dewi Nur Afifah
- NIM: 048336327
- Program Studi: Sistem Informasi
- UPBJJ-UT: Surabaya
- Mata Kuliah: STSI4209 Pemrograman Berbasis Web

---

## Deskripsi Proyek
Proyek ini adalah implementasi Tugas Praktik 1 mata kuliah STSI4209 Pemrograman Berbasis Web, yaitu membangun antarmuka dan alur interaktif aplikasi pemesanan bahan ajar SITTA menggunakan HTML, CSS, dan JavaScript DOM.

Aplikasi berfokus pada sisi **front-end** tanpa back-end atau database. Seluruh data (pengguna, bahan ajar, dan tracking pengiriman) dibaca dari file dummy `js/data.js` yang disediakan dosen.

---

## Referensi Akademik
1. Sufandi, U. U., Aprijani, D. A., & Pandiangan, P. (2021). Evaluasi dan hasil review desain user interface prototype aplikasi mobile SITTA Universitas Terbuka. *Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI, 10*(3), 147–156. https://doi.org/10.23887/janapati.v10i3.40281
2. Sufandi, U. U. (2022). Analisis kebutuhan dan dokumentasi sistem informasi tiras dan transaksi bahan ajar Universitas Terbuka. *Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI, 11*(2), 112–122. https://doi.org/10.23887/janapati.v11i2.42966

---

## Fitur Aplikasi
1. **Empat halaman**
   - `index.html` / `login.html` — halaman login (index.html otomatis mengarah ke login.html)
   - `dashboard.html` — menu utama
   - `tracking.html` — tracking pengiriman berdasarkan nomor Delivery Order
   - `stok.html` — informasi stok bahan ajar

2. **HTML semantik dan valid**
   - Elemen `header`, `nav`, `main`, `section`, `aside`, `footer`, `table` (`caption`, `scope`), `dl`, `ol`
   - Setiap input memiliki `label`, gambar memiliki `alt`, atribut `lang` dan `aria-*`

3. **CSS: inline, internal, dan eksternal**
   - Eksternal: `css/style.css` (Flexbox, Grid, media query)
   - Internal: tag `<style>` pada `login.html`
   - Inline: atribut `style` pada beberapa elemen

4. **JavaScript DOM**
   - Tabel stok dan tabel DO dibuat dinamis dengan `createElement` dan `appendChild`
   - Tambah, edit, dan hapus baris stok
   - Pencarian stok, progress bar, dan timeline perjalanan paket
   - Session login menggunakan `localStorage`

5. **Validasi form dan alert**
   - Pesan error per kolom, `alert()` dan `confirm()`
   - Login salah → alert "Email/password yang anda masukkan salah"

6. **Fitur tambahan**
   - Greeting otomatis sesuai jam lokal (pagi/siang/sore/malam)
   - Modal box: Lupa Password, Daftar, Laporan, dan Histori Transaksi
   - Badge status stok (Aman/Cukup/Menipis) dan ringkasan status pengiriman
   - Tombol lihat/sembunyikan password

---

## Struktur Folder
```
sitta-praktik/
├── index.html          (pintu masuk, mengarah ke login)
├── login.html          (halaman login)
├── dashboard.html
├── tracking.html
├── stok.html
├── css/
│   └── style.css
├── js/
│   ├── data.js         (data dummy dari dosen)
│   ├── script.js       (fungsi bersama: session, greeting, modal, validasi)
│   ├── auth.js         (logika login)
│   ├── dashboard.js
│   ├── tracking.js
│   └── stok.js
├── img/                (cover bahan ajar)
│   └── ...
├── assets/
│   └── logo-ut.png
└── README.md
```

---

## Cara Menjalankan Aplikasi
1. Unduh atau clone repository ini ke satu folder (`sitta-praktik/`).
2. Buka `index.html` di browser (disarankan Google Chrome), atau gunakan ekstensi *Live Server* di VS Code.
3. Login menggunakan salah satu akun demo berikut:

| Email | Password | Peran |
|-------|----------|-------|
| rina@ut.ac.id | rina123 | UPBJJ-UT (UPBJJ Jakarta) |
| agus@ut.ac.id | agus123 | UPBJJ-UT (UPBJJ Makassar) |
| siti@ut.ac.id | siti123 | Puslaba |
| doni@ut.ac.id | doni123 | Fakultas |
| admin@ut.ac.id | admin123 | Administrator |

   Akun baru juga dapat dibuat melalui tombol **Daftar** pada halaman login.

4. Gunakan menu pada dashboard:
   - **Informasi Bahan Ajar**: lihat, cari, tambah, edit, dan hapus stok
   - **Tracking Pengiriman**: cari nomor DO `2023001234` atau `2023005678`
   - **Laporan**: Monitoring Progress DO dan Rekap Bahan Ajar
   - **Histori Transaksi Bahan Ajar**

---

## Teknologi yang Digunakan
- HTML5 — struktur semantik
- CSS3 — Flexbox, Grid, media query
- JavaScript (ES6) — manipulasi DOM, Local Storage API
- Browser: Chrome, Edge, Firefox, Safari

## Catatan
- Aplikasi ini front-end only, tanpa back-end atau database.
- Data stok yang ditambah atau diubah hanya tersimpan di memori dan kembali ke data awal saat halaman dimuat ulang.
- Akun hasil pendaftaran disimpan di `localStorage` browser.

---

### © 2026 — Universitas Terbuka
Tugas Praktik 1 STSI4209 — Pemrograman Berbasis Web
