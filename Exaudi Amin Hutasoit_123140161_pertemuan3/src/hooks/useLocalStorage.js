import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Mengelola state yang tersinkronisasi secara persisten dengan browser localStorage.
 * 
 * @param {string} key - Kunci penyimpanan di localStorage
 * @param {*} initialValue - Nilai default jika data belum ada di localStorage
 * @returns {[any, Function, Function]} - [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  // Lazy state initialization untuk membaca dari localStorage saat pertama kali render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error saat membaca localStorage untuk key "${key}":`, error);
      return initialValue;
    }
  });

  // Sinkronisasi perubahan state ke localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saat menyimpan ke localStorage untuk key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Fungsi helper untuk menghapus key dari localStorage jika diperlukan
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error saat menghapus key "${key}" dari localStorage:`, error);
    }
  };

  return [storedValue, setStoredValue, removeValue];
}

export default useLocalStorage;

