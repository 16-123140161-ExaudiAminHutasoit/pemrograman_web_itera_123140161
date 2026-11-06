import { useMemo } from 'react';

/**
 * Custom Hook: useBookStats
 * Menghitung metrik dan statistik analitik dari daftar buku secara reaktif.
 * 
 * @param {Array<Object>} books - Array daftar objek buku
 * @returns {Object} Objek berisi berbagai metrik statistik buku
 */
export function useBookStats(books = []) {
  const stats = useMemo(() => {
    const totalBooks = books.length;
    
    const ownedCount = books.filter((b) => b.status === 'milik').length;
    const readingCount = books.filter((b) => b.status === 'baca').length;
    const wishlistCount = books.filter((b) => b.status === 'beli').length;

    // Perhitungan persentase
    const calcPercentage = (count) => (totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0);

    // Penulis unik dan frekuensi buku per penulis
    const authorCounts = {};
    books.forEach((b) => {
      const author = b.author?.trim();
      if (author) {
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      }
    });

    const uniqueAuthorsCount = Object.keys(authorCounts).length;
    
    // Top authors diurutkan dari yang terbanyak
    const topAuthors = Object.entries(authorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Buku terbaru (3 buku terakhir yang ditambahkan)
    const latestBooks = [...books]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);

    return {
      totalBooks,
      ownedCount,
      readingCount,
      wishlistCount,
      ownedPercentage: calcPercentage(ownedCount),
      readingPercentage: calcPercentage(readingCount),
      wishlistPercentage: calcPercentage(wishlistCount),
      uniqueAuthorsCount,
      topAuthors,
      latestBooks,
    };
  }, [books]);

  return stats;
}

export default useBookStats;

