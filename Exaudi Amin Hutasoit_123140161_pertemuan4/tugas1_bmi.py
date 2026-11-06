# ==============================================================================
# Tugas Praktikum Pemrograman Web - Pertemuan 4
# Berkas      : tugas1_bmi.py
# Nama        : Exaudi Amin Hutasoit
# NIM         : 123140161
# Deskripsi   : Program Penghitung Body Mass Index (BMI) Sederhana dengan
#               kategori berat badan menggunakan percabangan if-elif-else.
# ==============================================================================

def hitung_bmi(berat: float, tinggi: float) -> float:
    """Menghitung nilai Body Mass Index (BMI).
    
    Parameter:
        berat (float): Berat badan dalam satuan kilogram (kg).
        tinggi (float): Tinggi badan dalam satuan meter (m).
        
    Returns:
        float: Nilai kalkulasi BMI.
    """
    return berat / (tinggi ** 2)


def tentukan_kategori_bmi(bmi: float) -> tuple[str, str]:
    """Menentukan kategori status berat badan dan rekomendasi berdasarkan nilai BMI.
    
    Kriteria:
        - BMI < 18.5           : Berat badan kurang
        - 18.5 <= BMI < 25.0   : Berat badan normal
        - 25.0 <= BMI < 30.0   : Berat badan berlebih
        - BMI >= 30.0          : Obesitas
        
    Parameter:
        bmi (float): Nilai BMI hasil kalkulasi.
        
    Returns:
        tuple[str, str]: Pasangan string (kategori, deskripsi_saran).
    """
    if bmi < 18.5:
        kategori = "Berat badan kurang"
        saran = "Pertimbangkan peningkatan asupan nutrisi seimbang dan konsultasi ahli gizi."
    elif 18.5 <= bmi < 25.0:
        kategori = "Berat badan normal"
        saran = "Pertahankan pola makan bergizi dan gaya hidup aktif secara konsisten."
    elif 25.0 <= bmi < 30.0:
        kategori = "Berat badan berlebih"
        saran = "Disarankan mengatur porsi makan dan memperbanyak aktivitas fisik harian."
    else:
        kategori = "Obesitas"
        saran = "Sangat dianjurkan untuk berkonsultasi dengan tenaga medis demi kesehatan."
        
    return kategori, saran


def main():
    """Fungsi utama program penghitung BMI."""
    print("=" * 60)
    print("      PROGRAM KALKULATOR BODY MASS INDEX (BMI) ITERA")
    print("=" * 60)
    print("Nama Praktikan : Exaudi Amin Hutasoit")
    print("NIM            : 123140161")
    print("-" * 60)

    try:
        # Menerima input berat badan dan tinggi badan
        berat_input = float(input("Masukkan berat badan Anda (kg) : "))
        tinggi_input = float(input("Masukkan tinggi badan Anda (m)  : "))

        if berat_input <= 0 or tinggi_input <= 0:
            print("\n[PERINGATAN] Nilai berat dan tinggi badan harus lebih besar dari 0!")
            return

        # Kalkulasi nilai BMI
        nilai_bmi = hitung_bmi(berat_input, tinggi_input)
        kategori_bmi, saran = tentukan_kategori_bmi(nilai_bmi)

        # Menampilkan hasil perhitungan dengan format yang rapi
        print("\n" + "=" * 60)
        print("                  HASIL EVALUASI BMI")
        print("=" * 60)
        print(f"Berat Badan      : {berat_input:.1f} kg")
        print(f"Tinggi Badan     : {tinggi_input:.2f} m")
        print(f"Nilai BMI        : {nilai_bmi:.2f}")
        print(f"Kategori Status  : {kategori_bmi}")
        print(f"Rekomendasi      : {saran}")
        print("=" * 60)

    except ValueError:
        print("\n[ERROR] Input tidak valid! Harap masukkan angka yang valid (contoh: 65 atau 1.70).")


if __name__ == "__main__":
    main()

