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
            ganjil_genap TEXT,
            is_active INTEGER DEFAULT 0
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS diktat_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            diktat_id TEXT,
            name TEXT,
            major TEXT, 
            year TEXT,  
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
            major TEXT, 
            year TEXT,  
            person TEXT, 
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
    const masterUrl = process.env.GOOGLE_SHEET_MASTER_URL;
    if (!masterUrl) {
        throw new Error('GOOGLE_SHEET_MASTER_URL is not defined in .env.local');
    }
    const response = await fetch(masterUrl);
    const csvText = await response.text();
    const parsed = parseCsv(csvText);

    for (let i = 1; i < parsed.length; i++) {
        const row = parsed[i];
        const year = parseInt(row[1]);
        if (year > 2 && year < 1000) continue; // Skip Year 3, 4 etc. but allow actual years like 2025

        // However, the 'year' in the spreadsheet row[1] seems to be the academic year (e.g. 2025)
        // The 'Tingkat' in sub-sheets is what defines the semester (1, 2, 3, 4).

        const ganjilGenap = row[2]?.toLowerCase();
        const utsUas = row[3]?.toLowerCase();
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

            /**
             * ACTUAL TRANSPOSED LAYOUT (observed from G-Sheet export):
             * Row 0: Description Header (Pekan Asistensi...)
             * Row 1: "Hari" (Label) | Monday | Tuesday | Wednesday | ...
             * Row 2: "Tanggal" (Label) | 2025-03-17 | 2025-03-18 | ...
             * Row 3: "Matkul 1" (Label) | [Subject] | [Subject] | ...
             * Row 4: "Jurusan" (Label) | [E, T, B] | ...
             * Row 5: "Tingkat" (Label) | [1, 2] | ...
             * Row 6: "Pengajar" (Label) | [Name-E22] | ...
             * Row 7: "Jam" (Label) | [10:00] | ...
             * Row 8: "Link Zoom" (Label) | [Link] | ...
             * Row 9: "Link Rekaman" (Label) | [Link] | ...
             */
            if (asistensiParsed.length >= 8) {
                const dateRow = asistensiParsed[2];
                const subjectRow = asistensiParsed[3];
                const majorRow = asistensiParsed[4];
                const targetYearRow = asistensiParsed[5];
                const personRow = asistensiParsed[6];
                const timeRow = asistensiParsed[7];
                const zoomRow = asistensiParsed[8];
                const recordRow = asistensiParsed[9];

                // Subject row is the primary indicator of data presence
                if (subjectRow) {
                    for (let col = 1; col < subjectRow.length; col++) {
                        const subjectName = subjectRow[col]?.trim();

                        // Skip if subject name is blank
                        if (!subjectName || subjectName === '') continue;

                        const dateVal = dateRow ? dateRow[col]?.trim() : '';
                        const major = majorRow ? majorRow[col] : '';
                        const targetYear = targetYearRow ? targetYearRow[col] : '';
                        const person = personRow ? personRow[col] : '';
                        const time = timeRow ? timeRow[col] : '';
                        const zoom = zoomRow ? zoomRow[col] : '';
                        const record = recordRow ? recordRow[col] : '';

                        // Major logic: 'E', 'T', 'B' etc
                        let majors: string[] = [];
                        if (major) {
                            majors = major.split(',').map(m => convertMajorCode(m.trim())).filter(Boolean);
                        }

                        // Year logic: '1', '2' etc
                        let years: number[] = [];
                        if (targetYear) {
                            years = targetYear.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
                        }

                        // Date logic
                        let fullDateStr = dateVal || '';
                        if (time && time.includes(':')) {
                            if (fullDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                fullDateStr = `${fullDateStr}T${time}:00`;
                            } else {
                                fullDateStr = `${fullDateStr} ${time}`;
                            }
                        }

                        await db.execute({
                            sql: 'INSERT INTO asistensi_items (asistensi_id, name, major, year, person, date, zoom_meetings_link, recordings_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            args: [
                                asistensiId,
                                subjectName,
                                JSON.stringify(majors),
                                JSON.stringify(years),
                                JSON.stringify(person?.split(',').map((p: any) => ({ name: p.trim() })) || []),
                                fullDateStr,
                                zoom || '',
                                record || ''
                            ]
                        });
                    }
                }
            }
        }
    }

    console.log('Sync completed successfully!');
}

sync().catch(console.error);
