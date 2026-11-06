// ============================================
// Mini POS - Kasir Kantin Kampus (Pertemuan 2)
// Arsitektur ES6+, OOP Class & Asynchronous
// Exaudi Amin Hutasoit - 123140161
// Pemrograman Web RB - ITERA
// ============================================

/**
 * Class CartItem
 * Merepresentasikan satu entitas item belanja dalam keranjang.
 * Menerapkan enkapsulasi data dan kalkulasi subtotal.
 */
class CartItem {
  /**
   * @param {Object} itemData - Destructuring parameter
   */
  constructor({ id, nama, harga, qty = 1 }) {
    this.id = Number(id);
    this.nama = nama.trim();
    this.harga = Number(harga);
    this.qty = Number(qty);
  }

  /**
   * Getter untuk menghitung subtotal belanja item
   * @returns {number}
   */
  get subtotal() {
    return this.harga * this.qty;
  }

  /**
   * Method untuk mengubah kuantitas
   * @param {number} newQty 
   */
  updateQty(newQty) {
    if (newQty >= 1) {
      this.qty = Number(newQty);
    }
  }

  /**
   * Helper format angka ke mata uang Rupiah
   * @param {number} angka 
   * @returns {string}
   */
  static formatRupiah(angka) {
    return `Rp ${Number(angka).toLocaleString('id-ID')}`;
  }
}

/**
 * Class POSApp
 * Controller utama pengelola aplikasi kasir:
 * manajemen state, event handling, manipulasi DOM,
 * operasi asinkron (async/await), dan LocalStorage.
 */
class POSApp {
  constructor() {
    // State Aplikasi
    this.keranjang = [];
    this.promoAktif = false;
    this.nextId = 1;

    // Kunci LocalStorage
    this.STORAGE_KEY_KERANJANG = 'pos_keranjang_v2';
    this.STORAGE_KEY_PROMO = 'pos_promo_v2';
    this.STORAGE_KEY_ID = 'pos_next_id_v2';

    // Caching Elemen DOM
    this.cacheDOM();

    // Registrasi Event Listener
    this.bindEvents();
  }

  /**
   * Caching referensi elemen HTML DOM
   */
  cacheDOM() {
    // Form Input
    this.formBarang = document.getElementById('form-barang');
    this.inputNama = document.getElementById('nama-barang');
    this.inputHarga = document.getElementById('harga-barang');
    this.inputQty = document.getElementById('qty-barang');
    this.errorNama = document.getElementById('error-nama');
    this.errorHarga = document.getElementById('error-harga');
    this.errorQty = document.getElementById('error-qty');
    this.btnTambah = document.getElementById('btn-tambah');

    // Kode Promo
    this.inputPromo = document.getElementById('kode-promo');
    this.btnPromo = document.getElementById('btn-promo');
    this.promoStatus = document.getElementById('promo-status');

    // Tabel Keranjang
    this.tbodyKeranjang = document.getElementById('tbody-keranjang');
    this.keranjangKosong = document.getElementById('keranjang-kosong');
    this.btnReset = document.getElementById('btn-reset');

    // Ringkasan Pembayaran
    this.elTotalBelanja = document.getElementById('total-belanja');
    this.barisDiskon = document.getElementById('baris-diskon');
    this.labelDiskon = document.getElementById('label-diskon');
    this.nominalDiskon = document.getElementById('nominal-diskon');
    this.elTotalAkhir = document.getElementById('total-akhir');

    // Kalkulator Kembalian
    this.inputUangBayar = document.getElementById('uang-bayar');
    this.btnBayar = document.getElementById('btn-bayar');
    this.hasilBayar = document.getElementById('hasil-bayar');

    // API Asinkron
    this.btnFetchAPI = document.getElementById('btn-fetch-api');
    this.apiStatusBox = document.getElementById('api-status-box');
  }

  /**
   * Menghubungkan seluruh event handler antarmuka
   */
  bindEvents() {
    // 1. Submit Form Tambah Barang
    this.formBarang.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTambahBarang();
    });

    // 2. Real-time Clear Input Error
    this.inputNama.addEventListener('input', () => this.clearInputError(this.inputNama, this.errorNama));
    this.inputHarga.addEventListener('input', () => this.clearInputError(this.inputHarga, this.errorHarga));
    this.inputQty.addEventListener('input', () => this.clearInputError(this.inputQty, this.errorQty));

    // 3. Tombol Hapus Item Keranjang (Event Delegation)
    this.tbodyKeranjang.addEventListener('click', (e) => {
      const btnHapus = e.target.closest('.btn-hapus-item');
      if (btnHapus) {
        const id = Number(btnHapus.dataset.id);
        this.hapusItem(id);
      }
    });

    // 4. Tombol Transaksi Baru (Reset)
    this.btnReset.addEventListener('click', () => {
      if (this.keranjang.length === 0) return;
      if (confirm('Apakah Anda yakin ingin memulai transaksi baru? Keranjang akan dikosongkan.')) {
        this.resetTransaksi();
      }
    });

    // 5. Klaim Kode Promo
    this.btnPromo.addEventListener('click', () => this.terapkanPromo());
    this.inputPromo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.terapkanPromo();
      }
    });

    // 6. Proses Pembayaran & Hitung Kembalian
    this.btnBayar.addEventListener('click', () => this.prosesPembayaran());
    this.inputUangBayar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.prosesPembayaran();
      }
    });

    // 7. Ambil Data Menu dari REST API Publik (Operasi Asinkron)
    this.btnFetchAPI.addEventListener('click', async () => {
      await this.fetchMenuDariAPI();
    });
  }

  // ============================================
  // OPERASI ASINKRON: FETCH API EKSTERNAL (ASYNC / AWAIT)
  // ============================================

  /**
   * Mengambil data menu dari REST API publik (DummyJSON Groceries)
   * Menggunakan sintaks async/await dan penanganan error try...catch
   */
  async fetchMenuDariAPI() {
    try {
      this.btnFetchAPI.disabled = true;
      this.btnFetchAPI.innerHTML = '<span>⏳</span> <span>Memuat...</span>';
      
      this.apiStatusBox.classList.remove('hidden');
      this.apiStatusBox.textContent = '⚡ Menghubungi REST API publik (DummyJSON)...';

      // Memanggil endpoint API
      const response = await fetch('https://dummyjson.com/products/category/groceries?limit=5');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari API (Status: ${response.status})`);
      }

      const data = await response.json();
      const products = data.products || [];

      if (products.length === 0) {
        throw new Error('Data produk dari API kosong');
      }

      // Ambil 1 produk secara acak dari API untuk diisikan ke form
      const randomIndex = Math.floor(Math.random() * products.length);
      const selectedItem = products[randomIndex];

      // Destructuring properti objek
      const { title, price } = selectedItem;

      // Konversi kurs sederhana USD ke IDR dibulatkan ke kelipatan 500
      const hargaIDR = Math.max(5000, Math.round((price * 15500) / 500) * 500);

      // Otomatis isikan ke form input
      this.inputNama.value = title;
      this.inputHarga.value = hargaIDR;
      this.inputQty.value = 1;

      this.apiStatusBox.textContent = `✅ Menu berhasil dimuat dari API: "${title}" (Rp ${hargaIDR.toLocaleString('id-ID')}). Klik "Tambah ke Keranjang" untuk menyimpan.`;

    } catch (error) {
      console.error('Galat Fetch API:', error);
      this.apiStatusBox.textContent = `⚠️ Galat saat memuat data dari REST API: ${error.message}`;
    } finally {
      this.btnFetchAPI.disabled = false;
      this.btnFetchAPI.innerHTML = '<span>🌐</span> <span>Impor Menu API</span>';
    }
  }

  // ============================================
  // LOGIKA MANAJEMEN KERANJANG & VALIDASI
  // ============================================

  /**
   * Validasi form input tambah barang
   * @returns {boolean}
   */
  validasiForm() {
    let isValid = true;
    const nama = this.inputNama.value.trim();
    const harga = Number(this.inputHarga.value);
    const qty = Number(this.inputQty.value);

    // 1. Validasi Nama Barang (minimal 3 karakter)
    if (!nama || nama.length < 3) {
      this.showInputError(this.inputNama, this.errorNama, 'Nama barang wajib diisi minimal 3 karakter!');
      isValid = false;
    } else {
      this.clearInputError(this.inputNama, this.errorNama);
    }

    // 2. Validasi Harga (angka positif minimal 500)
    if (isNaN(harga) || harga < 500) {
      this.showInputError(this.inputHarga, this.errorHarga, 'Harga satuan wajib berupa angka minimal Rp 500!');
      isValid = false;
    } else {
      this.clearInputError(this.inputHarga, this.errorHarga);
    }

    // 3. Validasi Qty (bilangan bulat minimal 1)
    if (isNaN(qty) || qty < 1 || !Number.isInteger(qty)) {
      this.showInputError(this.inputQty, this.errorQty, 'Jumlah (Qty) wajib berupa bilangan bulat minimal 1!');
      isValid = false;
    } else {
      this.clearInputError(this.inputQty, this.errorQty);
    }

    return isValid;
  }

  /**
   * Menampilkan pesan error validasi input
   */
  showInputError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  /**
   * Membersihkan pesan error validasi input
   */
  clearInputError(inputEl, errorEl) {
    inputEl.classList.remove('input-error');
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  /**
   * Handler penambahan barang ke keranjang
   */
  handleTambahBarang() {
    if (!this.validasiForm()) return;

    const nama = this.inputNama.value.trim().toUpperCase();
    const harga = Number(this.inputHarga.value);
    const qty = Number(this.inputQty.value);

    // Cek apakah barang dengan nama dan harga sama sudah ada di keranjang
    const existingIndex = this.keranjang.findIndex((item) => item.nama === nama && item.harga === harga);

    if (existingIndex !== -1) {
      // Tambah kuantitas pada item yang sudah ada
      this.keranjang[existingIndex].qty += qty;
    } else {
      // Buat instance baru dari class CartItem
      const newItem = new CartItem({
        id: this.nextId++,
        nama,
        harga,
        qty
      });

      // Menggunakan Spread Operator (...) untuk memperbarui array secara immutable
      this.keranjang = [...this.keranjang, newItem];
    }

    // Reset Form & Input State
    this.formBarang.reset();
    this.inputNama.focus();
    this.apiStatusBox.classList.add('hidden');

    // Simpan ke LocalStorage dan Render Ulang
    this.simpanKeLocalStorage();
    this.render();
  }

  /**
   * Menghapus 1 baris item dari keranjang berdasarkan ID
   * @param {number} id 
   */
  hapusItem(id) {
    // Array.prototype.filter menggunakan Arrow Function
    this.keranjang = this.keranjang.filter((item) => item.id !== id);
    this.simpanKeLocalStorage();
    this.render();
  }

  /**
   * Mengosongkan keranjang dan mereset transaksi baru
   */
  resetTransaksi() {
    this.keranjang = [];
    this.promoAktif = false;
    this.nextId = 1;
    this.inputPromo.value = '';
    this.promoStatus.classList.add('hidden');
    this.inputUangBayar.value = '';
    this.hasilBayar.classList.add('hidden');

    this.simpanKeLocalStorage();
    this.render();
  }

  /**
   * Menerapkan kode promo diskon
   */
  terapkanPromo() {
    const kode = this.inputPromo.value.trim().toUpperCase();

    if (!kode) {
      this.promoStatus.textContent = 'Silakan masukkan kode promo terlebih dahulu.';
      this.promoStatus.className = 'text-sm mt-2 text-red-500 block';
      return;
    }

    if (kode === 'HEMAT10' || kode === 'ITERAJUARA') {
      this.promoAktif = true;
      this.promoStatus.textContent = `Promo "${kode}" aktif! Anda mendapat potongan diskon 10%.`;
      this.promoStatus.className = 'text-sm mt-2 text-green-600 font-semibold block';
    } else {
      this.promoAktif = false;
      this.promoStatus.textContent = 'Kode promo tidak valid atau telah kedaluwarsa.';
      this.promoStatus.className = 'text-sm mt-2 text-red-500 block';
    }

    this.simpanKeLocalStorage();
    this.render();
  }

  // ============================================
  // KALKULASI KEUANGAN & PEMBAYARAN
  // ============================================

  /**
   * Menghitung total belanja, diskon, dan total akhir
   * Menggunakan higher-order array reduce
   * @returns {Object}
   */
  hitungTotal() {
    // Menghitung total belanja dengan Array.reduce & Arrow Function
    const totalBelanja = this.keranjang.reduce((sum, item) => sum + item.subtotal, 0);

    // Cek diskon: otomatis 10% jika belanja >= 50.000 ATAU jika promo aktif
    let diskon = 0;
    let labelDiskon = 'Diskon (10%)';

    if (totalBelanja >= 50000 || this.promoAktif) {
      diskon = Math.round(totalBelanja * 0.1);
      if (totalBelanja >= 50000 && this.promoAktif) {
        labelDiskon = 'Diskon (10% - Promo & Belanja ≥ 50rb)';
      } else if (totalBelanja >= 50000) {
        labelDiskon = 'Diskon (10% - Otomatis Belanja ≥ 50rb)';
      } else {
        labelDiskon = 'Diskon (10% - Kode Promo)';
      }
    }

    const totalAkhir = Math.max(0, totalBelanja - diskon);

    return {
      totalBelanja,
      diskon,
      labelDiskon,
      totalAkhir
    };
  }

  /**
   * Memproses pembayaran dan menampilkan hasil kembalian
   */
  prosesPembayaran() {
    const { totalAkhir } = this.hitungTotal();
    const uangBayar = Number(this.inputUangBayar.value);

    // Validasi keranjang belanja kosong
    if (this.keranjang.length === 0) {
      this.hasilBayar.className = 'mt-3 kembalian-gagal block';
      this.hasilBayar.innerHTML = '<strong>Gagal:</strong> Keranjang belanja masih kosong! Silakan tambahkan barang terlebih dahulu.';
      return;
    }

    // Validasi input uang bayar kosong / tidak valid
    if (isNaN(uangBayar) || uangBayar <= 0) {
      this.hasilBayar.className = 'mt-3 kembalian-gagal block';
      this.hasilBayar.innerHTML = '<strong>Gagal:</strong> Masukkan nominal uang bayar yang valid.';
      return;
    }

    // Cek kecukupan uang pembayaran
    if (uangBayar < totalAkhir) {
      const selisih = totalAkhir - uangBayar;
      this.hasilBayar.className = 'mt-3 kembalian-gagal block';
      this.hasilBayar.innerHTML = `
        <strong>Pembayaran Kurang!</strong><br>
        Uang bayar masih kurang <strong>${CartItem.formatRupiah(selisih)}</strong> untuk melunasi total belanja sebesar <strong>${CartItem.formatRupiah(totalAkhir)}</strong>.
      `;
    } else {
      const kembalian = uangBayar - totalAkhir;
      this.hasilBayar.className = 'mt-3 kembalian-sukses block';
      this.hasilBayar.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xl">✅</span>
          <strong>Pembayaran Berhasil!</strong>
        </div>
        <p class="text-sm">Total Belanja : <strong>${CartItem.formatRupiah(totalAkhir)}</strong></p>
        <p class="text-sm">Uang Diterima  : <strong>${CartItem.formatRupiah(uangBayar)}</strong></p>
        <p class="text-base font-bold mt-1 text-emerald-800">
          Uang Kembalian : ${CartItem.formatRupiah(kembalian)}
        </p>
      `;
    }
  }

  // ============================================
  // RENDERING ANTARMUKA (DOM & TEMPLATE LITERALS)
  // ============================================

  /**
   * Render seluruh tampilan tabel dan ringkasan pembayaran
   */
  render() {
    // 1. Render Baris Tabel Keranjang
    if (this.keranjang.length === 0) {
      this.tbodyKeranjang.innerHTML = '';
      this.keranjangKosong.classList.remove('hidden');
    } else {
      this.keranjangKosong.classList.add('hidden');

      // Menggunakan Array.map, Destructuring, dan Template Literals
      this.tbodyKeranjang.innerHTML = this.keranjang.map((item, index) => {
        const { id, nama, harga, qty, subtotal } = item;
        return `
          <tr class="border-b border-gray-100 row-animate hover:bg-blue-50/50 transition-colors">
            <td class="py-3 px-4 text-left font-medium text-gray-500">${index + 1}</td>
            <td class="py-3 px-4 text-left font-bold text-gray-800">${nama}</td>
            <td class="py-3 px-4 text-right font-mono text-gray-700">${CartItem.formatRupiah(harga)}</td>
            <td class="py-3 px-4 text-center font-bold text-gray-800">${qty}</td>
            <td class="py-3 px-4 text-right font-mono font-bold text-gray-900">${CartItem.formatRupiah(subtotal)}</td>
            <td class="py-3 px-4 text-center">
              <button 
                class="btn-hapus-item text-red-500 hover:text-red-700 hover:bg-red-50 font-medium px-2 py-1 rounded transition-colors text-xs cursor-pointer"
                data-id="${id}"
                title="Hapus baris ini"
              >
                Hapus
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 2. Render Ringkasan Pembayaran
    const { totalBelanja, diskon, labelDiskon, totalAkhir } = this.hitungTotal();

    this.elTotalBelanja.textContent = CartItem.formatRupiah(totalBelanja);

    if (diskon > 0) {
      this.barisDiskon.classList.remove('hidden');
      this.labelDiskon.textContent = labelDiskon;
      this.nominalDiskon.textContent = `- ${CartItem.formatRupiah(diskon)}`;
    } else {
      this.barisDiskon.classList.add('hidden');
    }

    this.elTotalAkhir.textContent = CartItem.formatRupiah(totalAkhir);
  }

  // ============================================
  // PERSISTENSI DATA LOCALSTORAGE
  // ============================================

  /**
   * Menyimpan state keranjang ke LocalStorage
   */
  simpanKeLocalStorage() {
    // Serialisasi array keranjang
    const rawData = this.keranjang.map((item) => ({
      id: item.id,
      nama: item.nama,
      harga: item.harga,
      qty: item.qty
    }));

    localStorage.setItem(this.STORAGE_KEY_KERANJANG, JSON.stringify(rawData));
    localStorage.setItem(this.STORAGE_KEY_PROMO, JSON.stringify(this.promoAktif));
    localStorage.setItem(this.STORAGE_KEY_ID, JSON.stringify(this.nextId));
  }

  /**
   * Memuat data tersimpan dari LocalStorage
   */
  muatDariLocalStorage() {
    const dataKeranjang = localStorage.getItem(this.STORAGE_KEY_KERANJANG);
    const dataPromo = localStorage.getItem(this.STORAGE_KEY_PROMO);
    const dataId = localStorage.getItem(this.STORAGE_KEY_ID);

    if (dataKeranjang) {
      try {
        const parsed = JSON.parse(dataKeranjang);
        // Instansiasi ulang ke dalam objek CartItem
        this.keranjang = parsed.map((item) => new CartItem(item));
      } catch (e) {
        console.error('Galat parsing data keranjang:', e);
        this.keranjang = [];
      }
    }

    if (dataPromo) {
      this.promoAktif = JSON.parse(dataPromo) === true;
      if (this.promoAktif) {
        this.inputPromo.value = 'HEMAT10';
        this.promoStatus.textContent = 'Promo tersimpan aktif! Anda mendapat potongan diskon 10%.';
        this.promoStatus.className = 'text-sm mt-2 text-green-600 font-semibold block';
      }
    }

    if (dataId) {
      this.nextId = Number(JSON.parse(dataId)) || 1;
    }
  }

  /**
   * Inisialisasi awal aplikasi saat DOM selesai dimuat
   */
  init() {
    this.muatDariLocalStorage();
    this.render();
  }
}

// Inisialisasi Aplikasi Saat Halaman Selesai Dimuat
document.addEventListener('DOMContentLoaded', () => {
  const app = new POSApp();
  app.init();
});
