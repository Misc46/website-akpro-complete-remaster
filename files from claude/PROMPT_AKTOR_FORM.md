# Form Request Aktor — Prompt untuk Coding Agent

## Konteks

Ini adalah fitur form request asistensi untuk program **Aktor** di bawah **Akpro IME BEM FTUI**. User (mahasiswa DTE UI) mengisi form untuk memesan sesi asistensi dengan pengasisten (aktor). Admin kemudian verifikasi pembayaran dan assign pengasisten.

Stack: **Next.js (App Router) + Turso (LibSQL) + Drizzle ORM + Zod**

File yang sudah tersedia di repo:
- `src/db/schema.ts` — Drizzle schema (3 tabel: `pengasis`, `jadwal_asis`, `requests`)
- `src/db/seed.ts` — data awal 25 pengasisten + jadwal dari mastersheet
- `migrations/0001_init.sql` — SQL migration untuk Turso
- `src/actions/request.ts` — Server Action `submitRequest()` dengan validasi Zod

---

## Database Schema (ringkasan)

### Tabel `pengasis`
```
id, nama, kode (e.g. "AL"), semester (2|4),
matkul (JSON array string), aktif (bool), created_at
```

### Tabel `jadwal_asis`
```
id, hari ("Senin"…"Minggu"), jam_mulai, jam_selesai,
matkul, semester (2|4), jurusan (nullable: "Biom"|"Elektro"|"Tekkom")
```

### Tabel `requests`
```
id, nama_lengkap, angkatan (int), jurusan ("Elektro"|"Biomedik"|"Tekkom"),
matkul, tanggal (YYYY-MM-DD), jam (HH:MM),
sudah_hubungi_joy (bool), sudah_bayar (bool),
bukti_bayar_url (Google Drive link),
pengasis_id (FK → pengasis.id, nullable, diisi admin),
status ("pending"|"verified"|"assigned"|"done"|"cancelled"),
catatan, created_at, updated_at
```

### Data referensi penting
**Matkul semester 2:** Dasar Sistem Digital, Matematika Lanjut 1, Aljabar Linear, Fisika Mekanika, Rangkaian Listrik 1, Algoritma Pemrograman, Pemrograman Dasar

**Matkul semester 4:** Sinyal dan Sistem, Elektromagnetika, Rangkaian Elektronika 1, Teknik Tenaga Listrik, Komputasi Numerik, Matematika Lanjut 2

**Slot jadwal:** 17:00–23:00. Semester 2 tersedia Senin–Sabtu. Semester 4 tersedia Kamis–Minggu.

---

## Fitur yang Perlu Dibangun

### 1. Form publik — `/request` (atau `/form`)

Halaman form multi-step untuk mahasiswa. Tidak perlu login.

**Step 1 — Data diri:**
- Nama lengkap (text input)
- Angkatan (number input, 4 digit)
- Jurusan (select: Elektro / Biomedik / Tekkom)

**Step 2 — Detail request:**
- Matkul (select, opsi berdasarkan semester yang di-infer dari angkatan)
- Tanggal (date picker, hanya hari yang tersedia di `jadwal_asis` untuk matkul tersebut)
- Jam (select: 17:00–23:00 dalam slot 30 menit atau 1 jam, sesuai jadwal)

**Step 3 — Konfirmasi & pembayaran:**
- Checkbox: "Sudah menghubungi Joy sebelum submit" (wajib `true`)
- Checkbox: "Sudah melakukan pembayaran" (wajib `true`)
- Input URL: link bukti bayar Google Drive (validasi `drive.google.com`)
- Tombol Submit

**Gate logic:** Step 3 tidak bisa disubmit kalau dua checkbox belum dicentang.

**On submit:** panggil Server Action `submitRequest(formData)` dari `src/actions/request.ts`. Tampilkan halaman sukses dengan ID request.

---

### 2. API route untuk kebutuhan form — `src/app/api/`

```
GET /api/matkul?semester=2
→ return array matkul yang tersedia untuk semester tersebut

GET /api/jadwal?matkul=Sinyal+dan+Sistem&jurusan=Elektro
→ return array hari yang tersedia { hari, jam_mulai, jam_selesai }
```

Gunakan Drizzle query ke Turso. Untuk `matkul` semester 2 vs 4, gunakan konstanta `MATKUL_SEMESTER_2` dan `MATKUL_SEMESTER_4` dari `schema.ts`.

---

### 3. Halaman admin — `/admin/requests`

Sederhana saja, tidak perlu UI yang mewah. Tabel dengan semua request, filter by status.

**Kolom tabel:** ID, Nama, Angkatan, Jurusan, Matkul, Tanggal, Jam, Status, Bukti Bayar (link), Pengasis, Aksi

**Aksi per row:**
- Tombol "Verifikasi Bayar" → update status ke `verified` (panggil `verifyPayment(id)` dari actions)
- Dropdown assign pengasisten → pilih dari daftar pengasis yang bisa mengajar matkul tersebut, lalu simpan (`assignPengasis(requestId, pengasisId)`)

Filter by status: semua / pending / verified / assigned / done

---

## Catatan Implementasi

**Turso connection** — setup via `@libsql/client` + `drizzle-orm/libsql`. Env vars yang dibutuhkan:
```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

**`bukti_bayar_url`** — user upload bukti bayar sendiri ke Google Drive, lalu paste link-nya di form. Tidak ada upload file langsung dari app. Validasi cukup: harus URL dan mengandung `drive.google.com`.

**Infer semester dari angkatan:** angkatan 2023 ke atas = semester 2 (matkul dasar). Angkatan 2021–2022 = semester 4. Ini heuristik untuk prefill dropdown matkul; user tetap bisa ganti manual.

**Jadwal tersedia:** query `jadwal_asis` berdasarkan `matkul` yang dipilih dan (opsional) `jurusan`. Return hari-hari yang tersedia. Date picker harus disable hari yang tidak tersedia.

**Admin auth:** cukup pakai environment variable `ADMIN_PASSWORD` + simple cookie session untuk sekarang, tidak perlu NextAuth.

---

## Urutan Pengerjaan yang Disarankan

1. Setup koneksi Turso (`src/db/index.ts`) + jalankan migration + seed
2. API routes (`/api/matkul`, `/api/jadwal`)
3. Form publik `/request` (3 step, dengan dynamic dropdown)
4. Halaman sukses setelah submit
5. Halaman admin `/admin/requests`

---

## Yang Tidak Perlu Dibuat

- Auth untuk user publik (form terbuka, no login)
- Upload file langsung (pakai link Drive)
- Notifikasi email/WhatsApp (di luar scope)
- Dashboard analytics
