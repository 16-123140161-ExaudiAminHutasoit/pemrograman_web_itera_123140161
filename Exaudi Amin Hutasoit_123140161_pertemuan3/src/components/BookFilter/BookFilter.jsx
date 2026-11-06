import React from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import './BookFilter.css';

/**
 * Komponen Reusable: BookFilter
 * Menyediakan filter kategori status buku dan kolom pencarian kata kunci berdasarkan judul atau penulis.
 */
export function BookFilter({ className = '' }) {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    books,
  } = useBooks();

  // Hitung jumlah buku per kategori
  const countAll = books.length;
  const countMilik = books.filter((b) => b.status === 'milik').length;
  const countBaca = books.filter((b) => b.status === 'baca').length;
  const countBeli = books.filter((b) => b.status === 'beli').length;

  const filters = [
    { id: 'semua', label: 'Semua', count: countAll },
    { id: 'milik', label: 'Dimiliki', count: countMilik },
    { id: 'baca', label: 'Sedang Dibaca', count: countBaca },
    { id: 'beli', label: 'Ingin Dibeli', count: countBeli },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <label htmlFor="search-book" className="sr-only">
            Cari Buku
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search-book"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul atau nama penulis..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              title="Hapus pencarian"
              aria-label="Hapus kata kunci pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab / Tombol Filter Status */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter status buku">
          {filters.map((f) => {
            const isActive = selectedStatus === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedStatus(f.id)}
                className={`filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
                aria-pressed={isActive}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/30 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  className: PropTypes.string,
};

export default BookFilter;
