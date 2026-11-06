import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';

/**
 * Komponen Utama Aplikasi (App)
 * Mengintegrasikan BookProvider (Context API) dan React Router untuk navigasi multi-halaman.
 */
export function App() {
  return (
    <BookProvider>
      <div className="bg-gray-100 min-h-screen flex flex-col font-sans text-gray-800">
        {/* Header & Navigasi */}
        <Navbar
          title="Manajemen Buku Pribadi"
          subtitle="Pengolahan Koleksi Buku"
        />

        {/* Konten Halaman Dinamis dengan React Router */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer Identitas Mahasiswa */}
        <Footer name="Exaudi Amin Hutasoit" nim="123140161" />
      </div>
    </BookProvider>
  );
}

export default App;

