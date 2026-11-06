import React from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen Reusable: Footer
 * Menampilkan footer dengan identitas mahasiswa dan hak cipta.
 */
export function Footer({
  name = 'Exaudi Amin Hutasoit',
  nim = '123140161',
}) {
  return (
    <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-12 text-sm border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <p>
          Aplikasi Manajemen Buku Pribadi &copy; 2026 —{' '}
          <span className="text-white font-semibold">{name}</span> | {nim}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Praktikum Pemrograman Web • Tugas Pertemuan 3 (React.js, Hooks, Context &amp; Router)
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  name: PropTypes.string,
  nim: PropTypes.string,
};

export default Footer;
