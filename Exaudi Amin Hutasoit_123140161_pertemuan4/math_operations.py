# ==============================================================================
# Tugas Praktikum Pemrograman Web - Pertemuan 4
# Berkas      : math_operations.py
# Nama        : Exaudi Amin Hutasoit
# NIM         : 123140161
# Deskripsi   : Modul kustom untuk operasi geometri (luas & keliling persegi,
#               persegi panjang, lingkaran) dan konversi suhu termal.
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. KONSTANTA MATEMATIKA
# ------------------------------------------------------------------------------
PI: float = 3.141592653589793
NOL_MUTLAK_KELVIN: float = 273.15


# ------------------------------------------------------------------------------
# 2. OPERASI GEOMETRI: PERSEGI
# ------------------------------------------------------------------------------
def luas_persegi(sisi: float) -> float:
    """Menghitung luas bangun datar persegi (sisi * sisi).

    Parameter:
        sisi (float): Panjang sisi persegi (harus > 0).

    Returns:
        float: Luas persegi.
    """
    if sisi <= 0:
        raise ValueError("Panjang sisi persegi harus berupa bilangan positif.")
    return sisi ** 2


def keliling_persegi(sisi: float) -> float:
    """Menghitung keliling bangun datar persegi (4 * sisi).

    Parameter:
        sisi (float): Panjang sisi persegi (harus > 0).

    Returns:
        float: Keliling persegi.
    """
    if sisi <= 0:
        raise ValueError("Panjang sisi persegi harus berupa bilangan positif.")
    return 4.0 * sisi


# ------------------------------------------------------------------------------
# 3. OPERASI GEOMETRI: PERSEGI PANJANG
# ------------------------------------------------------------------------------
def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung luas persegi panjang (panjang * lebar).

    Parameter:
        panjang (float): Nilai panjang persegi panjang (harus > 0).
        lebar (float)  : Nilai lebar persegi panjang (harus > 0).

    Returns:
        float: Luas persegi panjang.
    """
    if panjang <= 0 or lebar <= 0:
        raise ValueError("Panjang dan lebar harus berupa bilangan positif.")
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung keliling persegi panjang (2 * (panjang + lebar)).

    Parameter:
        panjang (float): Nilai panjang persegi panjang (harus > 0).
        lebar (float)  : Nilai lebar persegi panjang (harus > 0).

    Returns:
        float: Keliling persegi panjang.
    """
    if panjang <= 0 or lebar <= 0:
        raise ValueError("Panjang dan lebar harus berupa bilangan positif.")
    return 2.0 * (panjang + lebar)


# ------------------------------------------------------------------------------
# 4. OPERASI GEOMETRI: LINGKARAN
# ------------------------------------------------------------------------------
def luas_lingkaran(jari_jari: float) -> float:
    """Menghitung luas lingkaran (PI * r^2).

    Parameter:
        jari_jari (float): Jari-jari lingkaran (harus > 0).

    Returns:
        float: Luas lingkaran.
    """
    if jari_jari <= 0:
        raise ValueError("Jari-jari lingkaran harus berupa bilangan positif.")
    return PI * (jari_jari ** 2)


def keliling_lingkaran(jari_jari: float) -> float:
    """Menghitung keliling lingkaran (2 * PI * r).

    Parameter:
        jari_jari (float): Jari-jari lingkaran (harus > 0).

    Returns:
        float: Keliling lingkaran.
    """
    if jari_jari <= 0:
        raise ValueError("Jari-jari lingkaran harus berupa bilangan positif.")
    return 2.0 * PI * jari_jari


# ------------------------------------------------------------------------------
# 5. OPERASI KONVERSI SUHU
# ------------------------------------------------------------------------------
def celsius_ke_fahrenheit(celsius: float) -> float:
    """Mengonversi nilai temperatur suhu dari Celsius ke Fahrenheit.
    
    Rumus: F = (C * 9/5) + 32

    Parameter:
        celsius (float): Suhu dalam skala derajat Celsius.

    Returns:
        float: Suhu dalam skala derajat Fahrenheit.
    """
    return (celsius * 9.0 / 5.0) + 32.0


def celsius_ke_kelvin(celsius: float) -> float:
    """Mengonversi nilai temperatur suhu dari Celsius ke Kelvin.
    
    Rumus: K = C + 273.15

    Parameter:
        celsius (float): Suhu dalam skala derajat Celsius.

    Returns:
        float: Suhu dalam skala Kelvin.
    """
    return celsius + NOL_MUTLAK_KELVIN


def fahrenheit_ke_celsius(fahrenheit: float) -> float:
    """Mengonversi nilai temperatur suhu dari Fahrenheit ke Celsius.
    
    Rumus: C = (F - 32) * 5/9

    Parameter:
        fahrenheit (float): Suhu dalam skala derajat Fahrenheit.

    Returns:
        float: Suhu dalam skala derajat Celsius.
    """
    return (fahrenheit - 32.0) * 5.0 / 9.0


# ------------------------------------------------------------------------------
# 6. PENGUJIAN MANDIRI MODUL
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("      [TEST INTERNAL] MODUL math_operations.py")
    print("=" * 60)
    print(f"Konstanta PI             : {PI}")
    print(f"Luas Persegi (s=5)       : {luas_persegi(5)}")
    print(f"Keliling Persegi (s=5)   : {keliling_persegi(5)}")
    print(f"Luas Persegi Pjg (p=6,l=4): {luas_persegi_panjang(6, 4)}")
    print(f"Luas Lingkaran (r=7)     : {luas_lingkaran(7):.2f}")
    print(f"100 C -> Fahrenheit      : {celsius_ke_fahrenheit(100):.2f} F")
    print(f"100 C -> Kelvin          : {celsius_ke_kelvin(100):.2f} K")
    print("=" * 60)

