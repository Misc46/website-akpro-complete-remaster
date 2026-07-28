CREATE TABLE `jadwal_asis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hari` text NOT NULL,
	`jam_mulai` text NOT NULL,
	`jam_selesai` text NOT NULL,
	`matkul` text NOT NULL,
	`semester` integer NOT NULL,
	`jurusan` text
);
--> statement-breakpoint
CREATE TABLE `pengasis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`kode` text NOT NULL,
	`semester` integer NOT NULL,
	`matkul` text NOT NULL,
	`aktif` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pengasis_kode_unique` ON `pengasis` (`kode`);--> statement-breakpoint
CREATE TABLE `requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_lengkap` text NOT NULL,
	`angkatan` integer NOT NULL,
	`jurusan` text NOT NULL,
	`matkul` text NOT NULL,
	`tanggal` text NOT NULL,
	`jam` text NOT NULL,
	`sudah_hubungi_joy` integer DEFAULT false NOT NULL,
	`sudah_bayar` integer DEFAULT false NOT NULL,
	`bukti_bayar_url` text,
	`pengasis_id` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`catatan` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`pengasis_id`) REFERENCES `pengasis`(`id`) ON UPDATE no action ON DELETE no action
);
