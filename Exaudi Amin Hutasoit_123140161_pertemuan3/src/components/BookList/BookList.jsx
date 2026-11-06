import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import './BookList.css';

/**
 * Komponen Reusable: BookList
 * Menampilkan daftar buku yang telah difilter beserta opsi edit dan hapus.
 */
export function BookList({ books, className = '' }) {
  const { deleteBook, startEditing, setSearchTerm, setSelectedStatus } = useBooks();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Helper untuk styling badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'milik':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Dimiliki
          </span>
        );
      case 'baca':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Sedang Dibaca
          </span>
        );
      case 'beli':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Ingin Dibeli
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Helper format tanggal
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const handleDelete = (id) => {
    deleteBook(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Jika daftar buku kosong */}
      {(!books || books.length === 0) && (
        <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-500">
          <h3 className="text-lg font-bold text-gray-800">Belum Ada Buku Ditemukan</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Tidak ada buku yang sesuai dengan pencarian atau filter status yang dipilih.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('semua');
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filter &amp; Pencarian
          </button>
        </div>
      )}

      {/* Render list buku */}
      {books && books.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {books.map((book) => {
            const isConfirmingDelete = deleteConfirmId === book.id;

            return (
              <div
                key={book.id}
                className="book-card bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Informasi Buku */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {book.title}
                    </h3>
                    {getStatusBadge(book.status)}
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                    <span className="text-gray-400">Penulis:</span>
                    <span className="text-gray-800">{book.author}</span>
                  </p>

                  {book.notes && (
                    <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      &ldquo;{book.notes}&rdquo;
                    </p>
                  )}

                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span>Ditambahkan: {formatDate(book.createdAt)}</span>
                    {book.updatedAt && (
                      <span>• Diedit: {formatDate(book.updatedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Tombol Aksi (Edit & Hapus) */}
                <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200">
                      <span className="text-xs text-red-700 font-semibold px-1">
                        Hapus buku ini?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(book.id)}
                        className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors cursor-pointer"
                        title="Konfirmasi hapus"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-300 transition-colors cursor-pointer"
                        title="Batal hapus"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(book)}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer active:scale-95"
                        title="Edit buku ini"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(book.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer active:scale-95"
                        title="Hapus buku ini"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
      notes: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default BookList;
