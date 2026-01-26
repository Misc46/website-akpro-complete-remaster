import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '../app/lib/db';
import { parseCsv, convertMajorCode } from '../app/lib/dataUtils';

async function sync() {
    console.log('Starting sync to Turso...');

    // 1. Create Tables
    await db.execute(`
        CREATE TABLE IF NOT EXISTS master_sync (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS diktats (
            id TEXT PRIMARY KEY,
            year INTEGER,
            uts_uas TEXT,
            ganjil_genap TEXT
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS diktat_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            diktat_id TEXT,
            name TEXT,
            major TEXT, -- JSON array
            year TEXT,  -- JSON array
            google_drive_link TEXT,
            img TEXT,
            FOREIGN KEY (diktat_id) REFERENCES diktats(id)
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS asistensis (
            id TEXT PRIMARY KEY,
            year INTEGER,
            uts_uas TEXT,
            ganjil_genap TEXT
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS asistensi_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asistensi_id TEXT,
            name TEXT,
            major TEXT, -- JSON array
            year TEXT,  -- JSON array
            person TEXT, -- JSON array
            date TEXT,
            zoom_meetings_link TEXT,
            recordings_link TEXT,
            FOREIGN KEY (asistensi_id) REFERENCES asistensis(id)
        )
    `);

    console.log('Tables created or already exist.');

    // 2. Clear existing data
    await db.execute('DELETE FROM diktat_items');
    await db.execute('DELETE FROM diktats');
    await db.execute('DELETE FROM asistensi_items');
    await db.execute('DELETE FROM asistensis');

    // 3. Fetch Master Data
    const masterUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQT3zuplCOCJpIet9N6X6bbYBEdJ0uoLC-h5eVrylZcjUvCQS0pliMVAGdFhYGgiGp0RV2SQiK-1XqR/pub?gid=0&single=true&output=csv';
    const response = await fetch(masterUrl);
    const csvText = await response.text();
    const parsed = parseCsv(csvText);

    for (let i = 1; i < parsed.length; i++) {
        const row = parsed[i];
        const year = parseInt(row[0]);
        const ganjilGenap = row[1]?.toLowerCase();
        const utsUas = row[2]?.toLowerCase();
        const isPublished = row[16]?.toLowerCase() === 'true';

        if (!isPublished) continue;

        // Sync Diktat
        if (row[9]) {
            const diktatId = `Diktat_${utsUas}_${ganjilGenap}_${year}`;
            await db.execute({
                sql: 'INSERT INTO diktats (id, year, uts_uas, ganjil_genap) VALUES (?, ?, ?, ?)',
                args: [diktatId, year, utsUas, ganjilGenap]
            });

            const diktatRes = await fetch(row[9]);
            const diktatCsv = await diktatRes.text();
            const diktatParsed = parseCsv(diktatCsv);

            for (const d of diktatParsed.slice(1)) {
                if (!d[0]) continue;
                await db.execute({
                    sql: 'INSERT INTO diktat_items (diktat_id, name, major, year, google_drive_link, img) VALUES (?, ?, ?, ?, ?, ?)',
                    args: [
                        diktatId,
                        d[0],
                        JSON.stringify(d[1]?.split(',').map((m: any) => convertMajorCode(m.trim())).filter(Boolean) || []),
                        JSON.stringify(d[2]?.split(',').map((y: any) => parseInt(y.trim())).filter(Boolean) || []),
                        d[3] || '',
                        d[4] || null
                    ]
                });
            }
        }

        // Sync Asistensi
        if (row[15]) {
            const asistensiId = `Asistensi_${utsUas}_${ganjilGenap}_${year}`;
            await db.execute({
                sql: 'INSERT INTO asistensis (id, year, uts_uas, ganjil_genap) VALUES (?, ?, ?, ?)',
                args: [asistensiId, year, utsUas, ganjilGenap]
            });

            const asistensiRes = await fetch(row[15]);
            const asistensiCsv = await asistensiRes.text();
            const asistensiParsed = parseCsv(asistensiCsv);

            for (let j = 1; j < asistensiParsed.length; j += 7) {
                if (j + 6 < asistensiParsed.length) {
                    const item = asistensiParsed[j];
                    if (!item[0]) continue;
                    await db.execute({
                        sql: 'INSERT INTO asistensi_items (asistensi_id, name, major, year, person, date, zoom_meetings_link, recordings_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        args: [
                            asistensiId,
                            asistensiParsed[j][0],
                            JSON.stringify(asistensiParsed[j + 1][0]?.split(',').map((m: any) => convertMajorCode(m.trim())).filter(Boolean) || []),
                            JSON.stringify(asistensiParsed[j + 2][0]?.split(',').map((y: any) => parseInt(y.trim())).filter(Boolean) || []),
                            JSON.stringify(asistensiParsed[j + 3][0]?.split(',').map((p: any) => ({ name: p.trim() })) || []),
                            asistensiParsed[j + 4][0], // original date string
                            asistensiParsed[j + 5][0] || '',
                            asistensiParsed[j + 6][0] || ''
                        ]
                    });
                }
            }
        }
    }

    console.log('Sync completed successfully!');
}

sync().catch(console.error);
