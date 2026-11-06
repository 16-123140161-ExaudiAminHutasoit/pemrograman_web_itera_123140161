/**
 * Modul Latihan Praktikum Pertemuan 2 — ES6+, OOP & Async
 * Exaudi Amin Hutasoit (123140161)
 */

// 1. Demo ES6 Class
class ProductSample {
  constructor(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  getInfo() {
    return `[Produk] ${this.name} | Harga: Rp ${this.price.toLocaleString('id-ID')} | Stok: ${this.stock}`;
  }
}

document.getElementById('btn-test-class').addEventListener('click', () => {
  const p1 = new ProductSample('Kopi Aren ITERA', 8000, 20);
  const p2 = new ProductSample('Ayam Geprek Kampus', 15000, 15);
  const out = `${p1.getInfo()}\n${p2.getInfo()}`;
  document.getElementById('output-class').textContent = out;
});

// 2. Demo Async/Await Fetch
document.getElementById('btn-test-fetch').addEventListener('click', async () => {
  const outEl = document.getElementById('output-fetch');
  outEl.textContent = 'Memuat data dari REST API publik (https://dummyjson.com/products/1)...';
  try {
    const res = await fetch('https://dummyjson.com/products/1');
    const data = await res.json();
    const { title, price, category, rating } = data;
    outEl.textContent = `Berhasil!\nJudul   : ${title}\nHarga   : $${price}\nKategori: ${category}\nRating  : ${rating}`;
  } catch (err) {
    outEl.textContent = `Error: ${err.message}`;
  }
});

// 3. Demo Destructuring & Spread Operator
document.getElementById('btn-test-syntax').addEventListener('click', () => {
  const defaultItems = ['Es Teh', 'Nasi Goreng'];
  const newItems = ['Ayam Bakar', 'Jus Mangga'];
  
  // Spread operator
  const combined = [...defaultItems, ...newItems];

  // Destructuring
  const [first, second, ...rest] = combined;

  const result = `Spread Combined: ${JSON.stringify(combined)}\nDestructured:\n- Item 1: ${first}\n- Item 2: ${second}\n- Sisa (Rest): ${JSON.stringify(rest)}`;
  document.getElementById('output-syntax').textContent = result;
});

