import { db } from "./index";
import { pengasis, jadwalAsis } from "./schema";

// ─── PENGASIS (dari sheet Pengasis) ──────────────────────────────────────────

const pengasisData = [
  // Semester 2
  { nama: "Rafael Danish Attari", kode: "AL", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital"]) },
  { nama: "Muhammad Ghozi Ghaisan Wahyudi", kode: "GG", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1", "Fisika Mekanika"]) },
  { nama: "Delviera Febranizza Adzatir", kode: "VR", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital", "Rangkaian Listrik 1"]) },
  { nama: "Razi Aditya Rahmanto", kode: "RA", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1"]) },
  { nama: "Zaskia Mehrunisha Arizani", kode: "ZA", semester: 2, matkul: JSON.stringify(["Matematika Lanjut 1", "Dasar Sistem Digital", "Aljabar Linear"]) },
  { nama: "Kanissa Phoebe Prameswari", kode: "PB", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital"]) },
  { nama: "Vinson Utama", kode: "VU", semester: 2, matkul: JSON.stringify(["Aljabar Linear", "Rangkaian Listrik 1", "Fisika Mekanika", "Dasar Sistem Digital"]) },
  { nama: "Rafael Maximiliano", kode: "RM", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1", "Fisika Mekanika"]) },
  { nama: "Ananda Badzlina", kode: "BZ", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1"]) },
  { nama: "Bimo Rasyad Alfiansyah", kode: "AS", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital", "Algoritma Pemrograman", "Aljabar Linear", "Matematika Lanjut 1"]) },
  { nama: "Farrell Al Azri Syawaldy Yanuar", kode: "FR", semester: 2, matkul: JSON.stringify(["Aljabar Linear", "Rangkaian Listrik 1"]) },
  { nama: "Abdiel Deandra El Dzaky", kode: "BD", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital", "Pemrograman Dasar"]) },
  { nama: "Kemal Farhan Islami", kode: "KF", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1", "Aljabar Linear", "Algoritma Pemrograman"]) },
  { nama: "Arnold Grant", kode: "AG", semester: 2, matkul: JSON.stringify(["Pemrograman Dasar", "Dasar Sistem Digital"]) },
  { nama: "Marvin Tan", kode: "MT", semester: 2, matkul: JSON.stringify(["Matematika Lanjut 1", "Fisika Mekanika", "Rangkaian Listrik 1", "Aljabar Linear", "Algoritma Pemrograman"]) },
  { nama: "Benianaus Kenneth Indarwan", kode: "BK", semester: 2, matkul: JSON.stringify(["Dasar Sistem Digital", "Aljabar Linear", "Pemrograman Dasar"]) },
  { nama: "Khodijah Sofia", kode: "SF", semester: 2, matkul: JSON.stringify(["Matematika Lanjut 1", "Aljabar Linear"]) },
  { nama: "Muhammad Faqih Mahardhika Digdaya", kode: "FM", semester: 2, matkul: JSON.stringify(["Rangkaian Listrik 1", "Fisika Mekanika"]) },
  // Semester 4
  { nama: "Abdul Jafor Magandhi Sumby", kode: "AJ", semester: 4, matkul: JSON.stringify(["Teknik Tenaga Listrik", "Komputasi Numerik", "Elektromagnetika"]) },
  { nama: "Yu Kai Lun", kode: "YK", semester: 4, matkul: JSON.stringify(["Elektromagnetika", "Rangkaian Elektronika 1"]) },
  { nama: "Alief Rizki Faturrahman", kode: "AR", semester: 4, matkul: JSON.stringify(["Sinyal dan Sistem", "Teknik Tenaga Listrik", "Rangkaian Elektronika 1"]) },
  { nama: "Dwidra Audric Farras", kode: "AF", semester: 4, matkul: JSON.stringify(["Sinyal dan Sistem", "Komputasi Numerik"]) },
  { nama: "Hafidz Dwi Febrian", kode: "HD", semester: 4, matkul: JSON.stringify(["Sinyal dan Sistem", "Komputasi Numerik"]) },
  { nama: "Joyceline Salim", kode: "JS", semester: 4, matkul: JSON.stringify(["Matematika Lanjut 2", "Sinyal dan Sistem"]) },
  { nama: "Vincenzo Fabian Tisila", kode: "VN", semester: 4, matkul: JSON.stringify(["Matematika Lanjut 2", "Komputasi Numerik"]) },
];

// ─── JADWAL ASIS (dari sheet Jadwal ASIS) ────────────────────────────────────
// Slot 17:00 – 23:00 tiap hari

const jadwalData = [
  // Semester 2 — Senin
  { hari: "Senin", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Dasar Sistem Digital", semester: 2, jurusan: null },
  { hari: "Senin", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Aljabar Linear", semester: 2, jurusan: null },
  { hari: "Senin", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Pemrograman Dasar", semester: 2, jurusan: null },
  // Selasa
  { hari: "Selasa", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Dasar Sistem Digital", semester: 2, jurusan: null },
  // Rabu
  { hari: "Rabu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 1", semester: 2, jurusan: null },
  { hari: "Rabu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Fisika Mekanika", semester: 2, jurusan: null },
  { hari: "Rabu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Rangkaian Listrik 1", semester: 2, jurusan: null },
  { hari: "Rabu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Aljabar Linear", semester: 2, jurusan: null },
  { hari: "Rabu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Algoritma Pemrograman", semester: 2, jurusan: null },
  // Kamis
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 1", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Fisika Mekanika", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Rangkaian Listrik 1", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Aljabar Linear", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Dasar Sistem Digital", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Algoritma Pemrograman", semester: 2, jurusan: null },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Pemrograman Dasar", semester: 2, jurusan: null },
  // Jumat
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 1", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Fisika Mekanika", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Rangkaian Listrik 1", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Aljabar Linear", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Dasar Sistem Digital", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Algoritma Pemrograman", semester: 2, jurusan: null },
  { hari: "Jumat", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Pemrograman Dasar", semester: 2, jurusan: null },
  // Sabtu
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Dasar Sistem Digital", semester: 2, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Algoritma Pemrograman", semester: 2, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Aljabar Linear", semester: 2, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 1", semester: 2, jurusan: null },
  // Semester 4 — Kamis
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 2", semester: 4, jurusan: "Biom" },
  { hari: "Kamis", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Sinyal dan Sistem", semester: 4, jurusan: "Biom" },
  // Sabtu semester 4
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Elektromagnetika", semester: 4, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Rangkaian Elektronika 1", semester: 4, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Teknik Tenaga Listrik", semester: 4, jurusan: null },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Sinyal dan Sistem", semester: 4, jurusan: "Elektro" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Elektro" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Sinyal dan Sistem", semester: 4, jurusan: "Biom" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 2", semester: 4, jurusan: "Biom" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Biom" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 2", semester: 4, jurusan: "Tekkom" },
  { hari: "Sabtu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Tekkom" },
  // Minggu semester 4 (sama dengan Sabtu)
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Elektromagnetika", semester: 4, jurusan: null },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Rangkaian Elektronika 1", semester: 4, jurusan: null },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Teknik Tenaga Listrik", semester: 4, jurusan: null },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Sinyal dan Sistem", semester: 4, jurusan: "Elektro" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Elektro" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Sinyal dan Sistem", semester: 4, jurusan: "Biom" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 2", semester: 4, jurusan: "Biom" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Biom" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Matematika Lanjut 2", semester: 4, jurusan: "Tekkom" },
  { hari: "Minggu", jamMulai: "17:00", jamSelesai: "23:00", matkul: "Komputasi Numerik", semester: 4, jurusan: "Tekkom" },
];

async function seed() {
  console.log("Seeding pengasis...");
  await db.insert(pengasis).values(pengasisData).onConflictDoNothing();

  console.log("Seeding jadwal asis...");
  await db.insert(jadwalAsis).values(jadwalData);

  console.log("Done!");
}

seed().catch(console.error);
