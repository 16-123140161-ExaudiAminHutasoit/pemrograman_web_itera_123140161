// ============================================
// MODUL LATIHAN - JavaScript Dasar
// Exaudi Amin Hutasoit - 123140161
// ============================================

// ============================================
// BAGIAN 1: Variabel dan Output
// ============================================

// Mendeklarasikan variabel dengan var, let, dan const
var nama = "Exaudi Amin Hutasoit";
let usia = 20;
const TAHUN_LAHIR = 2004;

// Menampilkan output ke konsol
console.log("Nama: " + nama);
console.log("Usia: " + usia);
console.log("Tahun Lahir: " + TAHUN_LAHIR);

// Menampilkan output ke halaman HTML
document.getElementById("result").innerHTML = `
  <p>Nama: <strong>${nama}</strong></p>
  <p>Usia: <strong>${usia}</strong></p>
  <p>Tahun Lahir: <strong>${TAHUN_LAHIR}</strong></p>
`;

// ============================================
// BAGIAN 2: Struktur Kondisional
// ============================================

let nilai = 85;
let grade = "";

// If-else if-else
if (nilai >= 90) {
  grade = "A";
} else if (nilai >= 80) {
  grade = "B";
} else if (nilai >= 70) {
  grade = "C";
} else if (nilai >= 60) {
  grade = "D";
} else {
  grade = "E";
}

console.log("Nilai: " + nilai + ", Grade: " + grade);

document.getElementById("result").innerHTML += `
  <hr>
  <p>Nilai: <strong>${nilai}</strong></p>
  <p>Grade: <strong>${grade}</strong></p>
`;

// Ternary operator
let status = nilai >= 60 ? "Lulus" : "Tidak Lulus";
console.log("Status: " + status);

document.getElementById("result").innerHTML += `
  <p>Status: <strong>${status}</strong></p>
`;

// Switch case - Hari
let hari = new Date().getDay();
let namaHari = "";

switch (hari) {
  case 0: namaHari = "Minggu"; break;
  case 1: namaHari = "Senin"; break;
  case 2: namaHari = "Selasa"; break;
  case 3: namaHari = "Rabu"; break;
  case 4: namaHari = "Kamis"; break;
  case 5: namaHari = "Jumat"; break;
  case 6: namaHari = "Sabtu"; break;
  default: namaHari = "Hari tidak valid";
}

console.log("Hari ini adalah: " + namaHari);

document.getElementById("result").innerHTML += `
  <p>Hari ini adalah: <strong>${namaHari}</strong></p>
`;

// ============================================
// BAGIAN 3: Loop
// ============================================

// For loop - Daftar Nilai Siswa
let nilaiSiswa = [85, 92, 78, 90, 88];
let total = 0;

document.getElementById("result").innerHTML += `
  <hr>
  <h3>Daftar Nilai Siswa:</h3>
  <ul id="daftar-nilai"></ul>
  <p id="rata-rata"></p>
`;

for (let i = 0; i < nilaiSiswa.length; i++) {
  total += nilaiSiswa[i];
  document.getElementById("daftar-nilai").innerHTML += `
    <li>Siswa ${i + 1}: ${nilaiSiswa[i]}</li>
  `;
}

let rataRata = total / nilaiSiswa.length;
document.getElementById("rata-rata").innerHTML = `
  Rata-rata nilai: <strong>${rataRata.toFixed(2)}</strong>
`;

// While loop - Countdown
document.getElementById("result").innerHTML += `
  <h3>Countdown:</h3>
  <div id="countdown-area"></div>
`;

let hitungMundur = 5;
while (hitungMundur > 0) {
  document.getElementById("countdown-area").innerHTML += `
    <span class="inline-block bg-blue-100 px-2 py-1 m-1 rounded">${hitungMundur}</span>
  `;
  hitungMundur--;
}

// For...of loop
document.getElementById("result").innerHTML += `
  <h3>Nilai dengan for...of:</h3>
  <div id="nilai-of" class="flex flex-wrap gap-2"></div>
`;

for (let n of nilaiSiswa) {
  let statusNilai = n >= 80 ? "text-green-600" : "text-red-600";
  document.getElementById("nilai-of").innerHTML += `
    <span class="inline-block bg-gray-100 px-3 py-1 rounded ${statusNilai}">${n}</span>
  `;
}

// ============================================
// BAGIAN 4: Fungsi dan Event Handler
// ============================================

function sapaNama(nama) {
  return `Halo, ${nama}! Selamat belajar JavaScript!`;
}

document.getElementById("sapa-button").addEventListener("click", function() {
  const namaInput = document.getElementById("nama-input").value;
  if (namaInput.trim() === "") {
    document.getElementById("sapa-output").innerHTML =
      `<p class="text-red-500">Silakan masukkan nama Anda terlebih dahulu!</p>`;
  } else {
    const pesan = sapaNama(namaInput);
    document.getElementById("sapa-output").innerHTML =
      `<p class="text-green-500">${pesan}</p>`;
  }
});

// Fungsi kalkulator
function hitungKalkulator(angka1, angka2, operasi) {
  let hasil = 0;
  switch (operasi) {
    case "tambah": hasil = angka1 + angka2; break;
    case "kurang": hasil = angka1 - angka2; break;
    case "kali":   hasil = angka1 * angka2; break;
    case "bagi":
      if (angka2 === 0) return "Error: Pembagian dengan nol";
      hasil = angka1 / angka2;
      break;
    default: return "Operasi tidak valid";
  }
  return hasil;
}

function prosesKalkulator(operasi, simbol) {
  const angka1 = parseFloat(document.getElementById("angka1").value);
  const angka2 = parseFloat(document.getElementById("angka2").value);
  if (isNaN(angka1) || isNaN(angka2)) {
    document.getElementById("hasil-kalkulator").innerHTML =
      `<p class="text-red-500">Masukkan angka yang valid!</p>`;
  } else {
    const hasil = hitungKalkulator(angka1, angka2, operasi);
    document.getElementById("hasil-kalkulator").innerHTML =
      `<p>Hasil: ${angka1} ${simbol} ${angka2} = ${hasil}</p>`;
  }
}

document.getElementById("btn-tambah").addEventListener("click", () => prosesKalkulator("tambah", "+"));
document.getElementById("btn-kurang").addEventListener("click", () => prosesKalkulator("kurang", "-"));
document.getElementById("btn-kali").addEventListener("click", () => prosesKalkulator("kali", "×"));
document.getElementById("btn-bagi").addEventListener("click", () => prosesKalkulator("bagi", "÷"));

// ============================================
// BAGIAN 5: Array dan Metode Array
// ============================================

const buah = ["Apel", "Jeruk", "Mangga", "Pisang", "Anggur"];

document.getElementById("result").innerHTML += `
  <hr>
  <h3>Manipulasi Array:</h3>
  <div id="array-demo"></div>
`;

document.getElementById("array-demo").innerHTML += `
  <p><strong>Array buah:</strong> ${buah.join(", ")}</p>
`;

buah.push("Durian");
document.getElementById("array-demo").innerHTML += `
  <p><strong>Setelah push Durian:</strong> ${buah.join(", ")}</p>
`;

const itemDihapus = buah.pop();
document.getElementById("array-demo").innerHTML += `
  <p><strong>Setelah pop:</strong> ${buah.join(", ")} (dihapus: ${itemDihapus})</p>
`;

buah.sort();
document.getElementById("array-demo").innerHTML += `
  <p><strong>Setelah sort:</strong> ${buah.join(", ")}</p>
`;

const hargaBuah = [10000, 8000, 15000, 5000, 20000];
const daftarBuah = buah.map((item, index) => `${item} (Rp${hargaBuah[index].toLocaleString()})`);

document.getElementById("array-demo").innerHTML += `
  <p><strong>Array dengan harga:</strong> ${daftarBuah.join(", ")}</p>
`;

const buahMahal = buah.filter((item, index) => hargaBuah[index] > 10000);
document.getElementById("array-demo").innerHTML += `
  <p><strong>Buah harga > 10.000:</strong> ${buahMahal.join(", ")}</p>
`;

// ============================================
// BAGIAN 6: Objek
// ============================================

const mahasiswa = {
  nama: "Exaudi Amin Hutasoit",
  nim: "123140161",
  jurusan: "Teknik Informatika",
  nilai: { algoritma: 85, basis_data: 90, web: 88 },
  hobi: ["Coding", "Membaca", "Futsal"],
  tampilkanInfo: function() {
    return `${this.nama} (${this.nim}) - ${this.jurusan}`;
  },
  hitungRataRata: function() {
    const nilaiArray = Object.values(this.nilai);
    const total = nilaiArray.reduce((sum, n) => sum + n, 0);
    return (total / nilaiArray.length).toFixed(2);
  }
};

document.getElementById("result").innerHTML += `
  <hr>
  <h3>Manipulasi Objek:</h3>
  <div id="objek-demo"></div>
`;

document.getElementById("objek-demo").innerHTML += `
  <p><strong>Info Mahasiswa:</strong> ${mahasiswa.tampilkanInfo()}</p>
  <p><strong>Rata-rata Nilai:</strong> ${mahasiswa.hitungRataRata()}</p>
  <p><strong>Hobi:</strong> ${mahasiswa.hobi.join(", ")}</p>
`;

mahasiswa.email = "exaudi@example.com";
document.getElementById("objek-demo").innerHTML += `
  <p><strong>Email:</strong> ${mahasiswa.email}</p>
`;

// ============================================
// BAGIAN 7: DOM Manipulation
// ============================================

const domOutput = document.getElementById("dom-output");
let itemCount = 0;

document.getElementById("btn-tambah-item").addEventListener("click", function() {
  itemCount++;
  const newItem = document.createElement("div");
  newItem.className = "p-2 mb-2 bg-gray-100 rounded";
  newItem.innerText = `Item ${itemCount}`;
  domOutput.appendChild(newItem);
});

document.getElementById("btn-hapus-item").addEventListener("click", function() {
  if (domOutput.lastChild) {
    domOutput.removeChild(domOutput.lastChild);
    itemCount--;
  }
});

document.getElementById("btn-ubah-warna").addEventListener("click", function() {
  const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  domOutput.className = `p-4 mb-3 ${randomColor} rounded`;
});

// ============================================
// BAGIAN 8: Fetch API
// ============================================

document.getElementById("btn-fetch").addEventListener("click", async function() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const apiOutput = document.getElementById("api-output");
    apiOutput.innerHTML = "<h3 class='font-bold mb-2'>Daftar Post:</h3>";

    data.slice(0, 5).forEach(post => {
      apiOutput.innerHTML += `
        <div class="p-3 mb-2 bg-gray-100 rounded">
          <h4 class="font-semibold">${post.title}</h4>
          <p class="text-sm">${post.body}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("api-output").innerHTML = `
      <div class="p-3 bg-red-100 text-red-800 rounded">
        Gagal mengambil data: ${error.message}
      </div>
    `;
  }
});
