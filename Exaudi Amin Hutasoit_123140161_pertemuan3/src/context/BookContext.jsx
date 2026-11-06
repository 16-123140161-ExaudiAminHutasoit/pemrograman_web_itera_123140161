import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

// Inisialisasi Context
export const BookContext = createContext(null);

// Data awal contoh buku untuk demonstrasi pertama kali aplikasi dijalankan
const INITIAL_BOOKS = [
  {
    id: 'buku-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    status: 'milik',
    notes: 'Buku wajib untuk panduan menulis kode yang rapi dan maintainable.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'buku-2',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'Andrew Hunt & David Thomas',
    status: 'baca',
    notes: 'Sedang membaca Bab 3 tentang filosofi software craftmanship.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'buku-3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'beli',
    notes: 'Masuk wishlist untuk dipelajari saat mengambil mata kuliah sistem terdistribusi.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

/**
 * Provider Component untuk BookContext
 * Menyediakan state dan fungsi manajemen buku secara menyeluruh ke seluruh child components.
 */
export function BookProvider({ children }) {
  // Simpan data buku di localStorage secara persisten
  const [books, setBooks] = useLocalStorage('daftar_buku_exaudi_123140161', INITIAL_BOOKS);

  // State untuk pencarian dan filter status
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('semua');

  // State untuk buku yang sedang dalam proses pengeditan (null jika mode tambah)
  const [editingBook, setEditingBook] = useState(null);

  // Menambah buku baru
  const addBook = (bookData) => {
    const newBook = {
      id: `buku-${Date.now()}`,
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      status: bookData.status || 'milik',
      notes: bookData.notes ? bookData.notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    setBooks((prevBooks) => [newBook, ...prevBooks]);
    return newBook;
  };

  // Mengedit / memperbarui data buku
  const updateBook = (id, updatedData) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? {
              ...book,
              title: updatedData.title.trim(),
              author: updatedData.author.trim(),
              status: updatedData.status,
              notes: updatedData.notes ? updatedData.notes.trim() : '',
              updatedAt: new Date().toISOString(),
            }
          : book
      )
    );

    // Reset status edit setelah selesai update
    setEditingBook(null);
  };

  // Menghapus buku berdasarkan ID
  const deleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    if (editingBook && editingBook.id === id) {
      setEditingBook(null);
    }
  };

  // Memulai proses pengeditan buku
  const startEditing = (book) => {
    setEditingBook(book);
  };

  // Membatalkan proses pengeditan
  const cancelEditing = () => {
    setEditingBook(null);
  };

  // Reset semua buku ke data awal
  const resetToSampleData = () => {
    setBooks(INITIAL_BOOKS);
    setEditingBook(null);
  };

  // Filter buku berdasarkan kata kunci pencarian dan status pilihan
  const filteredBooks = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return books.filter((book) => {
      // Filter status
      const matchesStatus =
        selectedStatus === 'semua' || book.status === selectedStatus;

      // Filter teks (judul atau nama penulis)
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [books, searchTerm, selectedStatus]);

  const value = {
    books,
    filteredBooks,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    editingBook,
    addBook,
    updateBook,
    deleteBook,
    startEditing,
    cancelEditing,
    resetToSampleData,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom Hook: useBooks
 * Mempermudah komponen untuk mengakses value dari BookContext dengan validasi konteks.
 */
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam komponen BookProvider');
  }
  return context;
}

export default BookContext;

