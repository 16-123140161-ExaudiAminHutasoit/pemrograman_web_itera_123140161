# ==============================================================================
# Tugas Praktikum Pemrograman Web - Pertemuan 4
# Berkas      : tugas2_nilai_mahasiswa.py
# Nama        : Exaudi Amin Hutasoit
# NIM         : 123140161
# Deskripsi   : Program Pengelolaan Data Nilai Mahasiswa, perhitungan Nilai
#               Akhir berbobot, penentuan grade (A-E), penampilan tabel rapi,
#               serta pencarian nilai tertinggi dan terendah.
# ==============================================================================

def hitung_nilai_akhir(uts: float, uas: float, tugas: float) -> float:
    """Menghitung nilai akhir mahasiswa berdasarkan bobot persentase.
    
    Formula Bobot:
        Nilai Akhir = (30% * UTS) + (40% * UAS) + (30% * Tugas)
        
    Parameter:
        uts (float)   : Nilai Ujian Tengah Semester.
        uas (float)   : Nilai Ujian Akhir Semester.
        tugas (float) : Nilai Tugas.
        
    Returns:
        float: Nilai akhir terbobot.
    """
    return (0.30 * uts) + (0.40 * uas) + (0.30 * tugas)


def tentukan_grade(nilai_akhir: float) -> tuple[str, str]:
    """Menentukan huruf mutu (grade) dan keterangan berdasarkan nilai akhir.
    
    Kriteria Grade:
        - A : Nilai akhir >= 80
        - B : 70 <= Nilai akhir < 80
        - C : 60 <= Nilai akhir < 70
        - D : 50 <= Nilai akhir < 60
        - E : Nilai akhir < 50
        
    Parameter:
        nilai_akhir (float): Nilai akhir mahasiswa.
        
    Returns:
        tuple[str, str]: Pasangan string (grade, keterangan_kelulusan).
    """
    if nilai_akhir >= 80.0:
        return "A", "Sangat Baik (Lulus)"
    elif nilai_akhir >= 70.0:
        return "B", "Baik (Lulus)"
    elif nilai_akhir >= 60.0:
        return "C", "Cukup (Lulus)"
    elif nilai_akhir >= 50.0:
        return "D", "Kurang (Tidak Lulus)"
    else:
        return "E", "Sangat Kurang (Tidak Lulus)"


def proses_data_mahasiswa(daftar_mahasiswa: list[dict]) -> list[dict]:
    """Menghitung nilai akhir dan grade untuk setiap data mahasiswa.
    
    Parameter:
        daftar_mahasiswa (list[dict]): List dictionary data mentah mahasiswa.
        
    Returns:
        list[dict]: List dictionary mahasiswa dengan tambahan nilai_akhir dan grade.
    """
    hasil_proses = []
    for mhs in daftar_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(
            mhs["nilai_uts"],
            mhs["nilai_uas"],
            mhs["nilai_tugas"]
        )
        grade, status = tentukan_grade(nilai_akhir)
        
        # Buat dictionary baru dengan data terproses
        data_lengkap = {
            **mhs,
            "nilai_akhir": nilai_akhir,
            "grade": grade,
            "status": status
        }
        hasil_proses.append(data_lengkap)
    return hasil_proses


def tampilkan_tabel(daftar_mahasiswa: list[dict]) -> None:
    """Mencetak daftar mahasiswa dalam format tabel konsol yang rapi.
    
    Parameter:
        daftar_mahasiswa (list[dict]): List data mahasiswa yang sudah diproses.
    """
    garis_pembatas = "+" + "-" * 6 + "+" + "-" * 26 + "+" + "-" * 13 + "+" + "-" * 7 + "+" + "-" * 7 + "+" + "-" * 8 + "+" + "-" * 13 + "+" + "-" * 7 + "+"
    
    print(garis_pembatas)
    print(f"| {'No':^4} | {'Nama Mahasiswa':<24} | {'NIM':^11} | {'UTS':^5} | {'UAS':^5} | {'Tugas':^6} | {'Nilai Akhir':^11} | {'Grade':^5} |")
    print(garis_pembatas)
    
    for i, mhs in enumerate(daftar_mahasiswa, start=1):
        print(
            f"| {i:^4} | {mhs['nama']:<24} | {mhs['nim']:^11} | "
            f"{mhs['nilai_uts']:>5.1f} | {mhs['nilai_uas']:>5.1f} | {mhs['nilai_tugas']:>6.1f} | "
            f"{mhs['nilai_akhir']:>11.2f} | {mhs['grade']:^5} |"
        )
        
    print(garis_pembatas)


def main():
    """Fungsi utama program pengelolaan nilai mahasiswa."""
    print("=" * 90)
    print("           SISTEM PENGELOLAAN DATA NILAI MAHASISWA PEMROGRAMAN WEB")
    print("                           INSTITUT TEKNOLOGI SUMATERA")
    print("=" * 90)
    print("Praktikan : Exaudi Amin Hutasoit (NIM: 123140161)")
    print("-" * 90)

    # 1. Dataset inisialisasi minimal 5 data mahasiswa
    data_mentah = [
        {
            "nama": "Exaudi Amin Hutasoit",
            "nim": "123140161",
            "nilai_uts": 88.0,
            "nilai_uas": 92.0,
            "nilai_tugas": 90.0,
        },
        {
            "nama": "Ahmad Fadhilah",
            "nim": "121140001",
            "nilai_uts": 82.0,
            "nilai_uas": 78.0,
            "nilai_tugas": 85.0,
        },
        {
            "nama": "Budi Santoso",
            "nim": "122140045",
            "nilai_uts": 68.0,
            "nilai_uas": 72.0,
            "nilai_tugas": 75.0,
        },
        {
            "nama": "Siti Nurhaliza",
            "nim": "123140023",
            "nilai_uts": 95.0,
            "nilai_uas": 96.0,
            "nilai_tugas": 92.0,
        },
        {
            "nama": "Rian Pratama",
            "nim": "122140102",
            "nilai_uts": 55.0,
            "nilai_uas": 62.0,
            "nilai_tugas": 58.0,
        },
        {
            "nama": "Dewi Lestari",
            "nim": "123140078",
            "nilai_uts": 45.0,
            "nilai_uas": 48.0,
            "nilai_tugas": 40.0,
        },
    ]

    # 2. Proses perhitungan nilai akhir & grade
    mahasiswa_terproses = proses_data_mahasiswa(data_mentah)

    # 3. Tampilkan tabel hasil evaluasi
    print("\nDAFTAR REKAPITULASI HASIL NILAI MAHASISWA:")
    tampilkan_tabel(mahasiswa_terproses)

    # 4. Cari mahasiswa dengan nilai akhir tertinggi dan terendah
    mahasiswa_tertinggi = max(mahasiswa_terproses, key=lambda m: m["nilai_akhir"])
    mahasiswa_terendah = min(mahasiswa_terproses, key=lambda m: m["nilai_akhir"])

    # Hitung rata-rata kelas
    rata_rata_kelas = sum(m["nilai_akhir"] for m in mahasiswa_terproses) / len(mahasiswa_terproses)

    # 5. Tampilkan ringkasan statistik
    print("\n" + "=" * 90)
    print("                            RINGKASAN STATISTIK KELAS")
    print("=" * 90)
    print(f"Jumlah Mahasiswa Terdaftar : {len(mahasiswa_terproses)} orang")
    print(f"Rata-rata Nilai Akhir Kelas: {rata_rata_kelas:.2f}")
    print("-" * 90)
    print(f"Mahasiswa Nilai TERTINGGI  : {mahasiswa_tertinggi['nama']} (NIM: {mahasiswa_tertinggi['nim']})")
    print(f"   -> Nilai Akhir          : {mahasiswa_tertinggi['nilai_akhir']:.2f} (Grade {mahasiswa_tertinggi['grade']})")
    print("-" * 90)
    print(f"Mahasiswa Nilai TERENDAH   : {mahasiswa_terendah['nama']} (NIM: {mahasiswa_terendah['nim']})")
    print(f"   -> Nilai Akhir          : {mahasiswa_terendah['nilai_akhir']:.2f} (Grade {mahasiswa_terendah['grade']})")
    print("=" * 90)


if __name__ == "__main__":
    main()

