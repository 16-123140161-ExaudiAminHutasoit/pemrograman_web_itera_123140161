# ==============================================================================
# Tugas Praktikum Pemrograman Web - Pertemuan 4
# Berkas      : main.py
# Nama        : Exaudi Amin Hutasoit
# NIM         : 123140161
# Deskripsi   : Program utama pengujian seluruh fungsionalitas modul
#               math_operations dengan berbagai skenario input geometri & suhu,
#               serta demonstrasi multivariasi teknik impor Python.
# ==============================================================================

# ------------------------------------------------------------------------------
# DEMONSTRASI MINIMAL 2 CARA IMPOR BERBEDA (Sesuai Ketentuan Tugas):
# ------------------------------------------------------------------------------
# Cara 1: Mengimpor seluruh modul dengan alias (namespace alias)
import math_operations as mo

# Cara 2: Mengimpor fungsi dan konstanta spesifik secara selektif ke namespace lokal
from math_operations import (
    PI,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
    fahrenheit_ke_celsius,
)


def uji_geometri():
    """Menguji fungsi-fungsi perhitungan bangun datar geometri."""
    print("\n" + "=" * 70)
    print("                1. PENGUJIAN FUNGSI GEOMETRI")
    print("           (Menggunakan Cara Impor 1: import ... as mo)")
    print("=" * 70)

    # 1. Persegi
    sisi = 7.5
    luas_sq = mo.luas_persegi(sisi)
    keliling_sq = mo.keliling_persegi(sisi)
    print(f"[A] Bangun Datar: Persegi")
    print(f"    - Panjang Sisi     : {sisi} cm")
    print(f"    - Luas (s^2)       : {luas_sq:.2f} cm^2")
    print(f"    - Keliling (4*s)   : {keliling_sq:.2f} cm")
    print("-" * 70)

    # 2. Persegi Panjang
    panjang, lebar = 12.0, 5.5
    luas_rec = mo.luas_persegi_panjang(panjang, lebar)
    keliling_rec = mo.keliling_persegi_panjang(panjang, lebar)
    print(f"[B] Bangun Datar: Persegi Panjang")
    print(f"    - Panjang          : {panjang} cm")
    print(f"    - Lebar            : {lebar} cm")
    print(f"    - Luas (p * l)     : {luas_rec:.2f} cm^2")
    print(f"    - Keliling 2*(p+l) : {keliling_rec:.2f} cm")
    print("-" * 70)

    # 3. Lingkaran
    radius = 10.0
    luas_cir = mo.luas_lingkaran(radius)
    keliling_cir = mo.keliling_lingkaran(radius)
    print(f"[C] Bangun Datar: Lingkaran")
    print(f"    - Nilai Konstanta PI: {mo.PI:.7f}")
    print(f"    - Jari-jari (r)    : {radius} cm")
    print(f"    - Luas (PI * r^2)  : {luas_cir:.2f} cm^2")
    print(f"    - Keliling (2*PI*r): {keliling_cir:.2f} cm")


def uji_konversi_suhu():
    """Menguji fungsi-fungsi konversi suhu."""
    print("\n" + "=" * 70)
    print("             2. PENGUJIAN FUNGSI KONVERSI SUHU")
    print("      (Menggunakan Cara Impor 2: from math_operations import ...)")
    print("=" * 70)

    daftar_suhu_celsius = [0.0, 25.0, 37.0, 100.0]

    print(f"{'Suhu Celsius':^16} | {'Fahrenheit':^18} | {'Kelvin':^18}")
    print("-" * 70)

    for c in daftar_suhu_celsius:
        f = celsius_ke_fahrenheit(c)
        k = celsius_ke_kelvin(c)
        print(f"{c:>12.2f} °C   | {f:>14.2f} °F   | {k:>14.2f} K")

    print("-" * 70)
    # Uji coba konversi balik Fahrenheit ke Celsius
    f_uji = 98.6
    c_balik = fahrenheit_ke_celsius(f_uji)
    print(f"Konversi Balik: {f_uji:.1f} °F (Suhu tubuh normal) = {c_balik:.2f} °C")
    print(f"Akses langsung konstanta PI yang diimpor selektif: {PI}")


def main():
    """Fungsi utama pengendali alur eksekusi program."""
    print("=" * 70)
    print("       DEMO MODUL MATEMATIKA DAN KONVERSI SUHU (main.py)")
    print("                 INSTITUT TEKNOLOGI SUMATERA")
    print("=" * 70)
    print("Praktikan : Exaudi Amin Hutasoit")
    print("NIM       : 123140161")
    print("Modul     : math_operations.py")

    # Jalankan kedua pengujian
    uji_geometri()
    uji_konversi_suhu()

    print("\n" + "=" * 70)
    print("   SELURUH FUNGSI MODUL BERHASIL DIUJI DENGAN TEPAT DAN VALID!")
    print("=" * 70)


if __name__ == "__main__":
    main()

