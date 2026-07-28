// schema.ts — Drizzle ORM schema untuk Turso (LibSQL)
// Stack: Next.js + Turso + Drizzle ORM
// Sumber data: MASTERSHEET_AKTOR.xlsx

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── ENUM VALUES ──────────────────────────────────────────────────────────────

export const JURUSAN = ["Elektro", "Biomedik", "Tekkom"] as const;
export type Jurusan = (typeof JURUSAN)[number];

// Semua matkul yang ada di Jadwal ASIS sheet
export const MATKUL_SEMESTER_2 = [
  "Dasar Sistem Digital",
  "Matematika Lanjut 1",
  "Aljabar Linear",
  "Fisika Mekanika",
  "Rangkaian Listrik 1",
  "Algoritma Pemrograman",
  "Pemrograman Dasar",
] as const;

export const MATKUL_SEMESTER_4 = [
  "Sinyal dan Sistem",
  "Elektromagnetika",
  "Rangkaian Elektronika 1",
  "Teknik Tenaga Listrik",
  "Komputasi Numerik",
  "Matematika Lanjut 2",
] as const;

export const ALL_MATKUL = [...MATKUL_SEMESTER_2, ...MATKUL_SEMESTER_4] as const;
export type Matkul = (typeof ALL_MATKUL)[number];

// ─── TABLE: pengasis ──────────────────────────────────────────────────────────
// Diisi manual / sync dari sheet Pengasis

export const pengasis = sqliteTable("pengasis", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nama: text("nama").notNull(),
  kode: text("kode").notNull().unique(), // e.g. "AL", "GG", "VR"
  semester: integer("semester").notNull(), // 2 atau 4
  matkul: text("matkul").notNull(), // JSON array: ["Dasar Sistem Digital","Rangkaian Listrik 1"]
  aktif: integer("aktif", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── TABLE: jadwal_asis ───────────────────────────────────────────────────────
// Ketersediaan slot per hari per matkul (dari sheet Jadwal ASIS)

export const jadwalAsis = sqliteTable("jadwal_asis", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hari: text("hari").notNull(), // "Senin" | "Selasa" | ... | "Minggu"
  jamMulai: text("jam_mulai").notNull(), // "17:00"
  jamSelesai: text("jam_selesai").notNull(), // "23:00"
  matkul: text("matkul").notNull(),
  semester: integer("semester").notNull(),
  jurusan: text("jurusan"), // null = semua jurusan; "Biom" | "Elektro" | "Tekkom"
});

// ─── TABLE: requests ─────────────────────────────────────────────────────────
// Form request aktor — satu row per submission

export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Data diri pemohon
  namaLengkap: text("nama_lengkap").notNull(),
  angkatan: integer("angkatan").notNull(), // e.g. 2024
  jurusan: text("jurusan").notNull(), // Jurusan enum

  // Detail sesi
  matkul: text("matkul").notNull(),
  tanggal: text("tanggal").notNull(), // ISO date: "2025-04-21"
  jam: text("jam").notNull(), // "17:00"

  // Gate checks — harus true sebelum submit bisa diproses
  sudahHubungiJoy: integer("sudah_hubungi_joy", { mode: "boolean" })
    .notNull()
    .default(false),
  sudahBayar: integer("sudah_bayar", { mode: "boolean" })
    .notNull()
    .default(false),

  // Bukti bayar — link Google Drive yang diupload user
  buktiBayarUrl: text("bukti_bayar_url"), // nullable sampai bayar

  // Assigned oleh admin (bukan diisi user)
  pengasisId: integer("pengasis_id").references(() => pengasis.id),

  // Status alur
  status: text("status").notNull().default("pending"),
  // "pending" → "verified" → "assigned" → "done" | "cancelled"

  catatan: text("catatan"), // notes dari admin

  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Pengasis = typeof pengasis.$inferSelect;
export type NewPengasis = typeof pengasis.$inferInsert;

export type JadwalAsis = typeof jadwalAsis.$inferSelect;
export type NewJadwalAsis = typeof jadwalAsis.$inferInsert;

export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;

export type RequestStatus = "pending" | "verified" | "assigned" | "done" | "cancelled";
