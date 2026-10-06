// ============================================
// Mini POS - Kasir & Keranjang Belanja Sederhana
// Exaudi Amin Hutasoit - 123140161
// ============================================

// ============================================
// 1. DATA & STATE
// ============================================

/**
 * Array keranjang belanja.
 * Setiap item: { id, nama, harga, qty, subtotal }
 * Data dimuat dari localStorage saat halaman dibuka.
 */
let keranjang = [];

/** Menyimpan status apakah kode promo sudah diaktifkan */
let promoAktif = false;

/** ID auto-increment untuk item keranjang */
let nextId = 1;

// ============================================
// 2. HELPER — FORMAT RUPIAH
// ============================================

/**
 * Memformat angka menjadi format Rupiah Indonesia.
 * @param {number} angka - Angka yang akan diformat.
 * @returns {string} String dalam format "Rp X.XXX"
 */
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// ============================================
// 3. LOCALSTORAGE — SIMPAN & MUAT
// ============================================

/**
 * Menyimpan array keranjang ke localStorage
 * menggunakan JSON.stringify() agar data persisten.
 */
function simpanKeLocalStorage() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  localStorage.setItem("promoAktif", JSON.stringify(promoAktif));
}

/**
 * Memuat data keranjang dari localStorage
 * menggunakan JSON.parse() saat halaman dimuat.
 */
function muatDariLocalStorage() {
  const data = localStorage.getItem("keranjang");
  const savedId = localStorage.getItem("nextId");
  const savedPromo = localStorage.getItem("promoAktif");

  if (data) {
    keranjang = JSON.parse(data);
  }
  if (savedId) {
    nextId = JSON.parse(savedId);
  }
  if (savedPromo) {
    promoAktif = JSON.parse(savedPromo);
  }
}

// ============================================
// 4. VALIDASI FORM INPUT BARANG
// ============================================

/**
 * Menampilkan pesan error pada elemen tertentu
 * dan menambahkan class input-error pada input.
 * @param {string} inputId - ID elemen input
 * @param {string} errorId - ID elemen pesan error
 * @param {string} pesan  - Teks pesan error
 */
function tampilkanError(inputId, errorId, pesan) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  inputEl.classList.add("input-error");
  errorEl.textContent = pesan;
  errorEl.classList.remove("hidden");
}

/**
 * Menghapus pesan error pada elemen tertentu
 * dan menghilangkan class input-error.
 * @param {string} inputId - ID elemen input
 * @param {string} errorId - ID elemen pesan error
 */
function hapusError(inputId, errorId) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  inputEl.classList.remove("input-error");
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

/**
 * Melakukan validasi seluruh form input barang.
 * Mengembalikan objek data jika valid, atau null jika tidak valid.
 * @returns {{ nama: string, harga: number, qty: number } | null}
 */
function validasiForm() {
  let valid = true;

  // Ambil nilai input
  const nama = document.getElementById("nama-barang").value.trim();
  const harga = document.getElementById("harga-barang").value;
  const qty = document.getElementById("qty-barang").value;

  // --- Validasi Nama Barang ---
  if (nama === "") {
    tampilkanError("nama-barang", "error-nama", "Nama barang wajib diisi!");
    valid = false;
  } else if (nama.length < 3) {
    tampilkanError("nama-barang", "error-nama", "Nama barang minimal 3 karakter!");
    valid = false;
  } else {
    hapusError("nama-barang", "error-nama");
  }

  // --- Validasi Harga Satuan ---
  if (harga === "" || harga === null) {
    tampilkanError("harga-barang", "error-harga", "Harga satuan wajib diisi!");
    valid = false;
  } else if (isNaN(Number(harga)) || Number(harga) <= 0) {
    tampilkanError("harga-barang", "error-harga", "Harga harus berupa angka positif!");
    valid = false;
  } else if (Number(harga) < 500) {
    tampilkanError("harga-barang", "error-harga", "Harga minimal Rp 500!");
    valid = false;
  } else {
    hapusError("harga-barang", "error-harga");
  }

  // --- Validasi Qty ---
  if (qty === "" || qty === null) {
    tampilkanError("qty-barang", "error-qty", "Jumlah barang wajib diisi!");
    valid = false;
  } else if (!Number.isInteger(Number(qty)) || Number(qty) < 1) {
    tampilkanError("qty-barang", "error-qty", "Jumlah harus bilangan bulat minimal 1!");
    valid = false;
  } else {
    hapusError("qty-barang", "error-qty");
  }

  if (!valid) return null;

  return {
    nama: nama,
    harga: Number(harga),
    qty: Number(qty),
  };
}

// ============================================
// 5. MANAJEMEN KERANJANG (CRUD)
// ============================================

/**
 * Menambahkan item baru ke array keranjang,
 * menyimpan ke localStorage, dan merender ulang tabel.
 * @param {{ nama: string, harga: number, qty: number }} data
 */
function tambahKeKeranjang(data) {
  const item = {
    id: nextId++,
    nama: data.nama,
    harga: data.harga,
    qty: data.qty,
    subtotal: data.harga * data.qty,
  };
  keranjang.push(item);
  simpanKeLocalStorage();
  renderKeranjang();
  hitungTotal();
}

/**
 * Menghapus item dari keranjang berdasarkan ID,
 * menyimpan perubahan ke localStorage, lalu render ulang.
 * @param {number} id - ID item yang akan dihapus.
 */
function hapusDariKeranjang(id) {
  keranjang = keranjang.filter(function (item) {
    return item.id !== id;
  });
  simpanKeLocalStorage();
  renderKeranjang();
  hitungTotal();
}

/**
 * Mengosongkan seluruh keranjang belanja,
 * membersihkan localStorage, dan mereset state.
 */
function resetKeranjang() {
  keranjang = [];
  nextId = 1;
  promoAktif = false;
  localStorage.removeItem("keranjang");
  localStorage.removeItem("nextId");
  localStorage.removeItem("promoAktif");
  renderKeranjang();
  hitungTotal();

  // Reset pembayaran
  document.getElementById("uang-bayar").value = "";
  document.getElementById("hasil-bayar").classList.add("hidden");
  document.getElementById("hasil-bayar").innerHTML = "";

  // Reset promo
  document.getElementById("kode-promo").value = "";
  const promoStatus = document.getElementById("promo-status");
  promoStatus.classList.add("hidden");
  promoStatus.textContent = "";
}

// ============================================
// 6. RENDER TABEL KERANJANG
// ============================================

/**
 * Merender ulang seluruh isi tabel keranjang belanja
 * berdasarkan data dalam array keranjang.
 */
function renderKeranjang() {
  const tbody = document.getElementById("tbody-keranjang");
  const emptyMessage = document.getElementById("keranjang-kosong");

  // Kosongkan tabel
  tbody.innerHTML = "";

  if (keranjang.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  keranjang.forEach(function (item, index) {
    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-100 row-animate";
    tr.innerHTML = `
      <td class="py-3 px-4 text-gray-600">${index + 1}</td>
      <td class="py-3 px-4 font-medium text-gray-800">${item.nama}</td>
      <td class="py-3 px-4 text-right text-gray-600">${formatRupiah(item.harga)}</td>
      <td class="py-3 px-4 text-center text-gray-600">${item.qty}</td>
      <td class="py-3 px-4 text-right font-semibold text-gray-800">${formatRupiah(item.subtotal)}</td>
      <td class="py-3 px-4 text-center">
        <button onclick="hapusDariKeranjang(${item.id})"
          class="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors cursor-pointer">
          Hapus
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================
// 7. KALKULASI TOTAL, DISKON & PEMBAYARAN
// ============================================

/**
 * Menghitung total belanja, menerapkan diskon jika memenuhi syarat,
 * dan memperbarui tampilan ringkasan pembayaran.
 */
function hitungTotal() {
  // Hitung total dari seluruh subtotal
  let totalBelanja = 0;
  for (let i = 0; i < keranjang.length; i++) {
    totalBelanja += keranjang[i].subtotal;
  }

  // Tentukan diskon
  let persenDiskon = 0;
  let nominalDiskon = 0;

  // Diskon otomatis 10% jika total >= 50.000 ATAU promo aktif
  if (totalBelanja >= 50000 || promoAktif) {
    persenDiskon = 10;
    nominalDiskon = Math.round(totalBelanja * persenDiskon / 100);
  }

  let totalAkhir = totalBelanja - nominalDiskon;

  // Update tampilan
  document.getElementById("total-belanja").textContent = formatRupiah(totalBelanja);

  const barisDiskon = document.getElementById("baris-diskon");
  if (nominalDiskon > 0) {
    barisDiskon.classList.remove("hidden");
    document.getElementById("label-diskon").textContent =
      promoAktif ? "Diskon Promo HEMAT10 (10%)" : "Diskon (10%)";
    document.getElementById("nominal-diskon").textContent = "- " + formatRupiah(nominalDiskon);
  } else {
    barisDiskon.classList.add("hidden");
  }

  const totalAkhirEl = document.getElementById("total-akhir");
  totalAkhirEl.textContent = formatRupiah(totalAkhir);

  // Animasi pulse saat total berubah
  totalAkhirEl.classList.add("pulse-total");
  setTimeout(function () {
    totalAkhirEl.classList.remove("pulse-total");
  }, 500);
}

/**
 * Memproses pembayaran: menghitung kembalian
 * berdasarkan uang bayar yang diinputkan kasir.
 */
function prosesPembayaran() {
  const uangBayarInput = document.getElementById("uang-bayar").value;
  const hasilBayar = document.getElementById("hasil-bayar");

  if (keranjang.length === 0) {
    hasilBayar.classList.remove("hidden");
    hasilBayar.innerHTML = `
      <div class="kembalian-gagal">
        <p class="font-semibold">Keranjang masih kosong!</p>
        <p class="text-sm mt-1">Tambahkan barang terlebih dahulu sebelum membayar.</p>
      </div>
    `;
    return;
  }

  if (uangBayarInput === "" || isNaN(Number(uangBayarInput))) {
    hasilBayar.classList.remove("hidden");
    hasilBayar.innerHTML = `
      <div class="kembalian-gagal">
        <p class="font-semibold">Masukkan nominal uang bayar yang valid!</p>
      </div>
    `;
    return;
  }

  const uangBayar = Number(uangBayarInput);

  // Hitung ulang total akhir
  let totalBelanja = 0;
  for (let i = 0; i < keranjang.length; i++) {
    totalBelanja += keranjang[i].subtotal;
  }

  let nominalDiskon = 0;
  if (totalBelanja >= 50000 || promoAktif) {
    nominalDiskon = Math.round(totalBelanja * 10 / 100);
  }
  const totalAkhir = totalBelanja - nominalDiskon;

  const kembalian = uangBayar - totalAkhir;

  hasilBayar.classList.remove("hidden");

  if (kembalian < 0) {
    hasilBayar.innerHTML = `
      <div class="kembalian-gagal">
        <p class="font-semibold">Uang tidak mencukupi!</p>
        <p class="text-sm mt-1">Kekurangan: <strong>${formatRupiah(Math.abs(kembalian))}</strong></p>
        <p class="text-sm">Total yang harus dibayar: <strong>${formatRupiah(totalAkhir)}</strong></p>
      </div>
    `;
  } else {
    hasilBayar.innerHTML = `
      <div class="kembalian-sukses">
        <p class="font-semibold text-lg">Pembayaran Berhasil!</p>
        <div class="mt-2 space-y-1 text-sm">
          <p>Total Belanja: <strong>${formatRupiah(totalBelanja)}</strong></p>
          ${nominalDiskon > 0 ? `<p>Diskon: <strong>- ${formatRupiah(nominalDiskon)}</strong></p>` : ""}
          <p>Total Akhir: <strong>${formatRupiah(totalAkhir)}</strong></p>
          <p>Uang Bayar: <strong>${formatRupiah(uangBayar)}</strong></p>
          <hr class="my-2 border-green-300">
          <p class="text-base">Kembalian: <strong class="text-lg">${formatRupiah(kembalian)}</strong></p>
        </div>
      </div>
    `;
  }
}

// ============================================
// 8. KODE PROMO
// ============================================

/**
 * Memproses input kode promo.
 * Kode yang valid: "HEMAT10" → diskon 10%.
 */
function prosesPromo() {
  const kode = document.getElementById("kode-promo").value.trim().toUpperCase();
  const promoStatus = document.getElementById("promo-status");

  promoStatus.classList.remove("hidden");

  if (kode === "HEMAT10") {
    promoAktif = true;
    promoStatus.textContent = "Kode promo HEMAT10 berhasil digunakan! Diskon 10% aktif.";
    promoStatus.className = "text-sm mt-2 text-green-600 font-semibold";
    simpanKeLocalStorage();
    hitungTotal();
  } else if (kode === "") {
    promoStatus.textContent = "Masukkan kode promo terlebih dahulu!";
    promoStatus.className = "text-sm mt-2 text-yellow-600";
  } else {
    promoStatus.textContent = "Kode promo tidak valid. Coba kode: HEMAT10";
    promoStatus.className = "text-sm mt-2 text-red-500";
  }
}

// ============================================
// 9. EVENT LISTENERS
// ============================================

// --- Form Submit: Tambah Barang ---
document.getElementById("form-barang").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = validasiForm();
  if (data) {
    tambahKeKeranjang(data);

    // Reset form setelah berhasil
    document.getElementById("form-barang").reset();

    // Hapus semua error
    hapusError("nama-barang", "error-nama");
    hapusError("harga-barang", "error-harga");
    hapusError("qty-barang", "error-qty");
  }
});

// --- Tombol Promo ---
document.getElementById("btn-promo").addEventListener("click", function () {
  prosesPromo();
});

// --- Enter pada input promo ---
document.getElementById("kode-promo").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    prosesPromo();
  }
});

// --- Tombol Bayar ---
document.getElementById("btn-bayar").addEventListener("click", function () {
  prosesPembayaran();
});

// --- Enter pada input uang bayar ---
document.getElementById("uang-bayar").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    prosesPembayaran();
  }
});

// --- Tombol Reset / Transaksi Baru ---
document.getElementById("btn-reset").addEventListener("click", function () {
  if (keranjang.length === 0) {
    resetKeranjang();
    return;
  }

  const konfirmasi = confirm("Apakah Anda yakin ingin memulai transaksi baru?\nSemua data keranjang akan dihapus.");
  if (konfirmasi) {
    resetKeranjang();
  }
});

// ============================================
// 10. INISIALISASI — MUAT DATA SAAT HALAMAN DIBUKA
// ============================================

/**
 * Fungsi inisialisasi: memuat data dari localStorage
 * dan merender tampilan awal.
 */
function init() {
  muatDariLocalStorage();
  renderKeranjang();
  hitungTotal();

  // Jika promo sudah aktif, tampilkan statusnya
  if (promoAktif) {
    const promoStatus = document.getElementById("promo-status");
    promoStatus.classList.remove("hidden");
    promoStatus.textContent = "Kode promo HEMAT10 aktif. Diskon 10% diterapkan.";
    promoStatus.className = "text-sm mt-2 text-green-600 font-semibold";
  }
}

// Jalankan inisialisasi
init();
