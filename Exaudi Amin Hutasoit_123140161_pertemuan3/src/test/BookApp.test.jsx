import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BookProvider, BookContext } from '../context/BookContext';
import BookForm from '../components/BookForm/BookForm';
import BookList from '../components/BookList/BookList';
import BookFilter from '../components/BookFilter/BookFilter';
import Home from '../pages/Home/Home';
import Stats from '../pages/Stats/Stats';
import { useBookStats } from '../hooks/useBookStats';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Mock localStorage untuk isolasi testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Unit Tests: Aplikasi Manajemen Buku Pribadi', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test 1: Validasi Input dan Feedback Visual Error pada BookForm
  it('1. Menampilkan pesan error validasi ketika form disubmit dalam keadaan kosong', () => {
    render(
      <BookProvider>
        <BookForm />
      </BookProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /tambah ke koleksi/i });
    fireEvent.click(submitBtn);

    // Memverifikasi pesan error muncul
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();

    // Memverifikasi input memiliki penanda visual / aria-invalid
    const titleInput = screen.getByLabelText(/judul buku/i);
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  });

  // Test 2: Menambah Buku Baru dengan Data Valid
  it('2. Berhasil menambahkan buku baru dan menampilkan pesan sukses', () => {
    render(
      <BookProvider>
        <BookForm />
      </BookProvider>
    );

    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/nama penulis/i);
    const statusSelect = screen.getByLabelText(/status buku/i);
    const submitBtn = screen.getByRole('button', { name: /tambah ke koleksi/i });

    fireEvent.change(titleInput, { target: { value: 'Refactoring: Improving the Design of Existing Code' } });
    fireEvent.change(authorInput, { target: { value: 'Martin Fowler' } });
    fireEvent.change(statusSelect, { target: { value: 'baca' } });

    fireEvent.click(submitBtn);

    // Memverifikasi pesan feedback sukses
    expect(screen.getByText(/buku baru berhasil ditambahkan/i)).toBeInTheDocument();
  });

  // Test 3: Menampilkan Daftar Buku dengan Status Badge yang Sesuai
  it('3. Menampilkan daftar buku beserta badge status dan informasi penulis', () => {
    const dummyBooks = [
      {
        id: 'test-1',
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        status: 'milik',
        notes: 'Buku klasik JavaScript',
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <BookProvider>
        <BookList books={dummyBooks} />
      </BookProvider>
    );

    expect(screen.getByText('JavaScript: The Good Parts')).toBeInTheDocument();
    expect(screen.getByText('Douglas Crockford')).toBeInTheDocument();
    expect(screen.getByText('Dimiliki')).toBeInTheDocument();
  });

  // Test 4: Pencarian Buku Berdasarkan Judul atau Nama Penulis
  it('4. Memfilter daftar buku berdasarkan kata kunci pencarian judul atau penulis', () => {
    render(
      <MemoryRouter>
        <BookProvider>
          <Home />
        </BookProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/cari berdasarkan judul atau nama penulis/i);

    // Cari dengan nama penulis 'Robert'
    fireEvent.change(searchInput, { target: { value: 'Robert' } });

    // Buku Clean Code karya Robert C. Martin harus tetap ada
    expect(screen.getByText(/Clean Code/i)).toBeInTheDocument();

    // Buku lain yang bukan karya Robert seharusnya tidak ditampilkan
    expect(screen.queryByText(/Designing Data-Intensive Applications/i)).not.toBeInTheDocument();
  });

  // Test 5: Filter Buku Berdasarkan Status
  it('5. Memfilter buku berdasarkan kategori status (Dimiliki, Sedang Dibaca, Ingin Dibeli)', () => {
    render(
      <MemoryRouter>
        <BookProvider>
          <Home />
        </BookProvider>
      </MemoryRouter>
    );

    // Klik tombol filter 'Ingin Dibeli'
    const wishlistFilterBtn = screen.getByRole('button', { name: /Ingin Dibeli/i });
    fireEvent.click(wishlistFilterBtn);

    // Buku dengan status 'beli' (Designing Data-Intensive Applications) harus ada
    expect(screen.getByText(/Designing Data-Intensive Applications/i)).toBeInTheDocument();

    // Buku dengan status 'milik' atau 'baca' seharusnya tidak ada
    expect(screen.queryByText(/Clean Code/i)).not.toBeInTheDocument();
  });

  // Test 6: Menghapus Buku dari Daftar
  it('6. Menghapus buku setelah mengonfirmasi aksi hapus', () => {
    render(
      <MemoryRouter>
        <BookProvider>
          <Home />
        </BookProvider>
      </MemoryRouter>
    );

    // Pastikan salah satu buku awal ada
    expect(screen.getByText(/Clean Code/i)).toBeInTheDocument();

    // Temukan tombol Hapus untuk buku pertama
    const deleteButtons = screen.getAllByRole('button', { name: /hapus/i });
    fireEvent.click(deleteButtons[0]);

    // Konfirmasi penghapusan (tombol 'Ya')
    const confirmBtn = screen.getByRole('button', { name: /^ya$/i });
    fireEvent.click(confirmBtn);

    // Buku tersebut telah terhapus dari tampilan
    expect(screen.queryByText(/Clean Code/i)).not.toBeInTheDocument();
  });

  // Test 7: Pengujian Custom Hook useBookStats
  it('7. useBookStats menghitung jumlah total, status kategori, dan persentase secara akurat', () => {
    const sampleBooks = [
      { id: '1', title: 'Buku A', author: 'Penulis 1', status: 'milik' },
      { id: '2', title: 'Buku B', author: 'Penulis 1', status: 'baca' },
      { id: '3', title: 'Buku C', author: 'Penulis 2', status: 'beli' },
      { id: '4', title: 'Buku D', author: 'Penulis 3', status: 'milik' },
    ];

    const { result } = renderHook(() => useBookStats(sampleBooks));

    expect(result.current.totalBooks).toBe(4);
    expect(result.current.ownedCount).toBe(2);
    expect(result.current.readingCount).toBe(1);
    expect(result.current.wishlistCount).toBe(1);
    expect(result.current.ownedPercentage).toBe(50);
    expect(result.current.uniqueAuthorsCount).toBe(3);
    expect(result.current.topAuthors[0].name).toBe('Penulis 1');
    expect(result.current.topAuthors[0].count).toBe(2);
  });

  // Test 8: Pengujian Custom Hook useLocalStorage
  it('8. useLocalStorage menginisialisasi dan memperbarui nilai pada storage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));

    expect(result.current[0]).toBe('initial');

    act(() => {
      result.current[1]('updated_value');
    });

    expect(result.current[0]).toBe('updated_value');
    expect(JSON.parse(window.localStorage.getItem('test_key'))).toBe('updated_value');
  });
});

