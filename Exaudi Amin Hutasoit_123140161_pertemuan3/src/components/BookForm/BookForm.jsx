import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import './BookForm.css';

/**
 * Komponen Reusable: BookForm
 * Menangani penambahan dan pengeditan buku dengan validasi form serta visual feedback error.
 */
export function BookForm({ onSubmitSuccess = undefined, className = '' }) {
  const { addBook, updateBook, editingBook, cancelEditing } = useBooks();

  // State nilai form
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'milik',
    notes: '',
  });

  // State error validasi per field
  const [errors, setErrors] = useState({});
  // State notifikasi sukses sementara
  const [successMsg, setSuccessMsg] = useState('');

  // Sinkronisasi data form saat mode edit berubah
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        status: editingBook.status || 'milik',
        notes: editingBook.notes || '',
      });
      setErrors({});
      setSuccessMsg('');
    } else {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
        notes: '',
      });
      setErrors({});
    }
  }, [editingBook]);

  // Fungsi validasi form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi.';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Judul buku minimal harus 2 karakter.';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi.';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = 'Nama penulis minimal harus 2 karakter.';
    }

    if (!['milik', 'baca', 'beli'].includes(formData.status)) {
      newErrors.status = 'Status buku harus dipilih.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Bersihkan error field terkait saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handler submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingBook) {
      updateBook(editingBook.id, formData);
      setSuccessMsg('Buku berhasil diperbarui!');
    } else {
      addBook(formData);
      setSuccessMsg('Buku baru berhasil ditambahkan!');
      // Reset form setelah tambah
      setFormData({
        title: '',
        author: '',
        status: 'milik',
        notes: '',
      });
    }

    // Hilangkan notifikasi sukses setelah 3 detik
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);

    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  // Handler batal edit
  const handleCancel = () => {
    cancelEditing();
    setFormData({
      title: '',
      author: '',
      status: 'milik',
      notes: '',
    });
    setErrors({});
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {/* Header Form */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {editingBook
              ? 'Perbarui informasi buku yang dipilih'
              : 'Catat buku ke dalam koleksi pribadi Anda'}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            editingBook
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {editingBook ? 'Mode Edit' : 'Form Input'}
        </span>
      </div>

      {/* Banner Sukses */}
      {successMsg && (
        <div
          role="status"
          className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center animate-fade-in"
        >
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Input Judul Buku */}
        <div className="mb-4">
          <label htmlFor="book-title" className="block text-sm font-semibold text-gray-700 mb-1">
            Judul Buku <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="book-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Clean Code"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'error-title' : undefined}
            className={`w-full border rounded-lg px-3 py-2 text-sm book-form-input focus:ring-2 ${
              errors.title
                ? 'border-red-500 bg-red-50/50 focus:ring-red-400 text-red-900'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.title && (
            <p id="error-title" className="text-red-500 text-xs mt-1 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Input Penulis */}
        <div className="mb-4">
          <label htmlFor="book-author" className="block text-sm font-semibold text-gray-700 mb-1">
            Nama Penulis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="book-author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Contoh: Robert C. Martin"
            aria-invalid={!!errors.author}
            aria-describedby={errors.author ? 'error-author' : undefined}
            className={`w-full border rounded-lg px-3 py-2 text-sm book-form-input focus:ring-2 ${
              errors.author
                ? 'border-red-500 bg-red-50/50 focus:ring-red-400 text-red-900'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.author && (
            <p id="error-author" className="text-red-500 text-xs mt-1 font-medium">
              {errors.author}
            </p>
          )}
        </div>

        {/* Status Buku */}
        <div className="mb-4">
          <label htmlFor="book-status" className="block text-sm font-semibold text-gray-700 mb-1">
            Status Buku <span className="text-red-500">*</span>
          </label>
          <select
            id="book-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="milik">Dimiliki (Sudah Punya)</option>
            <option value="baca">Sedang Dibaca</option>
            <option value="beli">Ingin Dibeli (Wishlist)</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.status}
            </p>
          )}
        </div>

        {/* Catatan / Keterangan Opsional */}
        <div className="mb-5">
          <label htmlFor="book-notes" className="block text-sm font-semibold text-gray-700 mb-1">
            Catatan Tambahan <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
          </label>
          <textarea
            id="book-notes"
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tulis catatan, ringkasan, atau bab yang sedang dibaca..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 text-white font-semibold py-2.5 rounded-lg transition-all cursor-pointer active:scale-95 text-sm shadow-sm ${
              editingBook
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editingBook ? 'Simpan Perubahan' : 'Tambah ke Koleksi'}
          </button>

          {editingBook && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer active:scale-95 text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

BookForm.propTypes = {
  onSubmitSuccess: PropTypes.func,
  className: PropTypes.string,
};

export default BookForm;
