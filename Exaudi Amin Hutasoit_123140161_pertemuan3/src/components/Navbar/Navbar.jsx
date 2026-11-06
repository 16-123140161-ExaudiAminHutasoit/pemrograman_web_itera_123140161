import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

/**
 * Komponen Navbar Reusable
 * Menampilkan header aplikasi dengan gradien khas dan link navigasi multi-halaman.
 */
export function Navbar({
  title = 'Manajemen Buku Pribadi',
  subtitle = 'Pengolahan Koleksi Buku',
}) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-blue-100 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Menu Navigasi React Router */}
        <nav className="flex items-center gap-2 self-start md:self-auto bg-black/15 p-1 rounded-xl backdrop-blur-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer ${
                isActive
                  ? 'active text-white bg-white/25 shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <span>Koleksi Buku</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `nav-link px-4 py-2 rounded-lg text-sm font-medium flex items-center cursor-pointer ${
                isActive
                  ? 'active text-white bg-white/25 shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <span>Statistik</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Navbar;
