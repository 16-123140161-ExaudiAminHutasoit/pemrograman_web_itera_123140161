import React from 'react';
import { useBooks } from '../../context/BookContext';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import './Home.css';

/**
 * Halaman Home (Koleksi Buku)
 * Menampilkan Form Input/Edit Buku di sebelah kiri dan Filter + List Buku di sebelah kanan.
 */
export function Home() {
  const { filteredBooks, books, resetToSampleData } = useBooks();

  return (
    <div className="home-container max-w-6xl mx-auto px-4 py-8 w-full">
      {/* Banner Ringkasan Atas */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Katalog Buku Pribadi</h2>
          <p className="text-xs text-gray-500">
            Total koleksi: <span className="font-semibold text-blue-600">{books.length} buku</span>
            {' • '}
            Ditampilkan: <span className="font-semibold text-gray-700">{filteredBooks.length} buku</span>
          </p>
        </div>

        <button
          type="button"
          onClick={resetToSampleData}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto active:scale-95"
          title="Reset koleksi ke data contoh awal"
        >
          Muat Ulang Data Contoh
        </button>
      </div>

      {/* Grid 2 Kolom (Sesuai Gaya Pertemuan 1 & 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Form Tambah/Edit */}
        <div className="lg:col-span-1">
          <BookForm />
        </div>

        {/* Kolom Kanan: Filter Pencarian & List Buku */}
        <div className="lg:col-span-2 space-y-6">
          <BookFilter />
          <BookList books={filteredBooks} />
        </div>
      </div>
    </div>
  );
}

export default Home;

