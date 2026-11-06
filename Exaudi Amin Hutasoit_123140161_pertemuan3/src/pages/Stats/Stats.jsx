import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import { useBookStats } from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Sub-komponen Reusable: StatCard
 * Menampilkan kartu metrik statistik dengan ikon dan persentase
 */
function StatCard({
  title,
  count,
  total = undefined,
  percentage = undefined,
  color = 'blue',
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`stat-card bg-white p-5 rounded-xl shadow-sm border ${scheme.border} flex items-center justify-between`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold ${scheme.text}`}>{count}</span>
          {total !== undefined && (
            <span className="text-xs text-gray-400">/ {total} total</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {percentage !== undefined && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${scheme.badge}`}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number,
  percentage: PropTypes.number,
  color: PropTypes.oneOf(['blue', 'emerald', 'amber', 'purple']),
};

/**
 * Halaman Stats (Statistik & Metrik Koleksi)
 * Menampilkan ringkasan data, grafik persentase status, dan daftar penulis terpopuler.
 */
export function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Statistik &amp; Metrik Koleksi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Analisis data buku pribadi yang dihitung menggunakan custom hook{' '}
            <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">
              useBookStats
            </code>
          </p>
        </div>
        <Link
          to="/"
          className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm active:scale-95"
        >
          Kembali ke Koleksi
        </Link>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Koleksi"
          count={stats.totalBooks}
          color="purple"
        />
        <StatCard
          title="Dimiliki"
          count={stats.ownedCount}
          total={stats.totalBooks}
          percentage={stats.ownedPercentage}
          color="emerald"
        />
        <StatCard
          title="Sedang Dibaca"
          count={stats.readingCount}
          total={stats.totalBooks}
          percentage={stats.readingPercentage}
          color="blue"
        />
        <StatCard
          title="Ingin Dibeli"
          count={stats.wishlistCount}
          total={stats.totalBooks}
          percentage={stats.wishlistPercentage}
          color="amber"
        />
      </div>

      {/* Baris Detail: Distribusi Status & Penulis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Status Buku (Visual Progress Bars) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Distribusi Status Buku</h3>
          <p className="text-xs text-gray-500">
            Perbandingan persentase buku berdasarkan kategori kepemilikan dan bacaan.
          </p>

          <div className="space-y-4 pt-2">
            {/* Dimiliki */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                <span className="flex items-center gap-1">
                  <span>Dimiliki</span>
                </span>
                <span>
                  {stats.ownedCount} buku ({stats.ownedPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.ownedPercentage}%` }}
                />
              </div>
            </div>

            {/* Sedang Dibaca */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                <span className="flex items-center gap-1">
                  <span>Sedang Dibaca</span>
                </span>
                <span>
                  {stats.readingCount} buku ({stats.readingPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.readingPercentage}%` }}
                />
              </div>
            </div>

            {/* Ingin Dibeli */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                <span className="flex items-center gap-1">
                  <span>Ingin Dibeli (Wishlist)</span>
                </span>
                <span>
                  {stats.wishlistCount} buku ({stats.wishlistPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.wishlistPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analisis Penulis & Buku Terbaru */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Penulis Terbanyak</h3>
            <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-full">
              {stats.uniqueAuthorsCount} Penulis Unik
            </span>
          </div>

          {stats.topAuthors.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada data penulis.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.topAuthors.map((author, index) => (
                <li
                  key={author.name}
                  className="py-2.5 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{author.name}</span>
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                    {author.count} buku
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;
