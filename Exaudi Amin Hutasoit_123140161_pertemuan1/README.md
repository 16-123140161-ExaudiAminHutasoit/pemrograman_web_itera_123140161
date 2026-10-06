# Mini POS — Kasir & Keranjang Belanja Sederhana

## Identitas

| Data               | Keterangan                   |
| ------------------ | ---------------------------- |
| **Nama Lengkap**   | Exaudi Amin Hutasoit         |
| **NIM**            | 123140161                    |
| **Kelas Praktikum**| Pemrograman Web — ITERA      |

---

## Deskripsi Aplikasi

**Mini POS** (Point of Sale) adalah aplikasi web kasir sederhana untuk transaksi jual beli di kantin/toko kampus. Dibangun dengan **HTML**, **CSS (Tailwind CSS)**, dan **JavaScript murni** (tanpa framework).

### Tujuan Pembuatan

- Mengimplementasikan konsep dasar JavaScript dalam studi kasus nyata
- Menerapkan **validasi form**, **kalkulasi otomatis**, dan **manajemen data** dengan `localStorage`
- Menyatukan 3 kompetensi: validasi input, perhitungan kalkulator, dan manajemen keranjang belanja

### Studi Kasus

Kasir kantin kampus yang dapat:

1. Menambahkan barang belanja ke keranjang
2. Melihat total belanja dengan perhitungan otomatis
3. Mendapatkan diskon otomatis atau menggunakan kode promo
4. Memproses pembayaran dan menghitung kembalian

---

## Panduan Menjalankan Aplikasi

### Cara 1 — Buka Langsung di Browser

1. Buka folder `Exaudi Amin Hutasoit_123140161_pertemuan1`
2. **Klik dua kali** file `index.html`
3. Aplikasi akan terbuka di browser default

### Cara 2 — Menggunakan Live Server (VS Code)

1. Buka folder proyek di **VS Code**
2. Install ekstensi **Live Server** (Ritwick Dey)
3. Klik kanan pada `index.html` → **Open with Live Server**
4. Browser otomatis terbuka di `http://127.0.0.1:5500`

---

## Daftar Fitur

### 1. Validasi Form Input Barang

- [x] Nama Barang wajib diisi, **minimal 3 karakter**
- [x] Harga Satuan wajib angka positif, **minimal Rp 500**
- [x] Jumlah (Qty) wajib **bilangan bulat minimal 1**
- [x] Pesan error **berwarna merah** di bawah input yang salah
- [x] Form otomatis **di-reset** setelah berhasil tambah barang

### 2. Modul Kalkulator & Perhitungan Otomatis

- [x] Subtotal per baris = `Harga Satuan × Qty`
- [x] Total belanja = jumlah seluruh subtotal
- [x] **Diskon otomatis 10%** jika total ≥ Rp 50.000
- [x] **Kode promo `HEMAT10`** untuk diskon 10%
- [x] Kalkulator **uang kembalian** otomatis
- [x] Validasi jika uang bayar kurang dari total

### 3. Manajemen Keranjang & LocalStorage

- [x] Tabel keranjang interaktif (No, Nama, Harga, Qty, Subtotal, Aksi)
- [x] Tombol **Hapus** di setiap baris barang
- [x] Data tersimpan **persisten** di `localStorage` (`JSON.stringify` / `JSON.parse`)
- [x] Tombol **Transaksi Baru** untuk reset seluruh data
- [x] Keranjang **tidak hilang** saat halaman di-refresh

---

## Tangkapan Layar

### 1. Tampilan Form Input Utama

> Form input barang di sisi kiri, tabel keranjang belanja di sisi kanan.

### 2. Tampilan Validasi Error

> Pesan error merah muncul di bawah input yang tidak valid saat form di-submit.

### 3. Tampilan Perhitungan & Keranjang Terisi

> Daftar belanja lengkap: subtotal per baris, diskon, total akhir, dan kalkulasi kembalian.

*(Screenshot ditambahkan setelah aplikasi dijalankan)*

---

## Penjelasan Teknis

### Alur 1 — Validasi Input

```
User isi form → Klik "Tambah ke Keranjang" → validasiForm()
  → Cek nama (min 3 karakter)
  → Cek harga (≥ 500, angka positif)
  → Cek qty (≥ 1, bilangan bulat)
  → GAGAL → Tampilkan pesan merah + class input-error
  → BERHASIL → Tambah ke array keranjang → Simpan localStorage → Reset form
```

### Alur 2 — Kalkulator Keuangan

```
Setiap tambah/hapus item → hitungTotal()
  → Loop keranjang → subtotal = harga × qty
  → Jumlahkan semua subtotal → totalBelanja
  → Cek diskon (total ≥ 50.000 ATAU promo aktif) → diskon 10%
  → totalAkhir = totalBelanja − diskon
  → Update tampilan ringkasan
```

### Alur 3 — Serialisasi LocalStorage

```
Tambah/Hapus item → Update array keranjang
  → JSON.stringify(keranjang) → localStorage.setItem()

Halaman dimuat → localStorage.getItem()
  → JSON.parse() → Rebuild array → Render ulang tabel
```

---

## ️ Teknologi

| Teknologi          | Kegunaan                                    |
| ------------------ | ------------------------------------------- |
| HTML5              | Struktur halaman web                        |
| CSS3               | Styling kustom & animasi                    |
| Tailwind CSS (CDN) | Utility-first CSS framework                 |
| JavaScript (ES6+)  | Logika aplikasi, DOM manipulation, localStorage |

---

## Struktur File

```
Exaudi Amin Hutasoit_123140161_pertemuan1/
├── index.html       ← Struktur HTML aplikasi Mini POS
├── style.css        ← Styling CSS antarmuka
├── script.js        ← Logika pemrograman JavaScript
├── README.md        ← Dokumentasi lengkap (file ini)
└── modul/           ← File latihan selama materi praktikum
    ├── index.html
    └── script.js
```
