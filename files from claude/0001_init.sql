-- migrations/0001_init.sql
-- Jalankan via: turso db shell <db-name> < migrations/0001_init.sql
-- atau via drizzle-kit push

CREATE TABLE IF NOT EXISTS pengasis (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nama        TEXT NOT NULL,
  kode        TEXT NOT NULL UNIQUE,
  semester    INTEGER NOT NULL CHECK (semester IN (2, 4)),
  matkul      TEXT NOT NULL,  -- JSON array string
  aktif       INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jadwal_asis (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  hari        TEXT NOT NULL CHECK (hari IN ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  jam_mulai   TEXT NOT NULL,
  jam_selesai TEXT NOT NULL,
  matkul      TEXT NOT NULL,
  semester    INTEGER NOT NULL CHECK (semester IN (2, 4)),
  jurusan     TEXT  -- NULL = semua jurusan
);

CREATE TABLE IF NOT EXISTS requests (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Data diri
  nama_lengkap        TEXT NOT NULL,
  angkatan            INTEGER NOT NULL,
  jurusan             TEXT NOT NULL CHECK (jurusan IN ('Elektro', 'Biomedik', 'Tekkom')),

  -- Detail sesi
  matkul              TEXT NOT NULL,
  tanggal             TEXT NOT NULL,  -- ISO date YYYY-MM-DD
  jam                 TEXT NOT NULL,  -- HH:MM

  -- Gate checks
  sudah_hubungi_joy   INTEGER NOT NULL DEFAULT 0,
  sudah_bayar         INTEGER NOT NULL DEFAULT 0,

  -- Bukti bayar (Google Drive link)
  bukti_bayar_url     TEXT,

  -- Assigned pengasis
  pengasis_id         INTEGER REFERENCES pengasis(id),

  -- Status
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','verified','assigned','done','cancelled')),
  catatan             TEXT,

  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index untuk query umum
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_matkul ON requests(matkul);
CREATE INDEX IF NOT EXISTS idx_requests_tanggal ON requests(tanggal);
CREATE INDEX IF NOT EXISTS idx_jadwal_hari_matkul ON jadwal_asis(hari, matkul);
