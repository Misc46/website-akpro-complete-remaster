import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
console.log('Imports loaded');
import { db } from './db-client';
import Papa from 'papaparse';

console.log('Loading environment variables...');
const envConfig = dotenv.config();
console.log('Dotenv result:', envConfig.error ? 'Error' : 'Success', 'Parsed keys:', envConfig.parsed ? Object.keys(envConfig.parsed).length : 0);

async function dump() {
    console.log('Starting dump from Turso to CSV...');

    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(publicDataDir)) {
        fs.mkdirSync(publicDataDir, { recursive: true });
    }

    // Dump Diktats
    console.log('Fetching diktats...');
    const diktatsQuery = `
        SELECT 
            d.id as diktat_id,
            d.year as academic_year,
            d.uts_uas,
            d.ganjil_genap,
            d.is_active,
            i.name as item_name,
            i.major,
            i.year as target_year,
            i.google_drive_link,
            i.img
        FROM diktats d
        LEFT JOIN diktat_items i ON d.id = i.diktat_id
        ORDER BY d.year DESC, d.ganjil_genap ASC, d.uts_uas DESC
    `;

    try {
        const diktatsRs = await db.execute(diktatsQuery);
        const diktatsCsv = Papa.unparse(diktatsRs.rows);
        fs.writeFileSync(path.join(publicDataDir, 'diktats.csv'), diktatsCsv);
        console.log(`Dumped ${diktatsRs.rows.length} diktat rows to public/data/diktats.csv`);
    } catch (e) {
        console.error('Error dumping diktats:', e);
    }

    // Dump Asistensis
    console.log('Fetching asistensis...');
    const asistensisQuery = `
        SELECT 
            a.id as asistensi_id,
            a.year as academic_year,
            a.uts_uas,
            a.ganjil_genap,
            i.name as item_name,
            i.major,
            i.year as target_year,
            i.person,
            i.date,
            i.zoom_meetings_link,
            i.recordings_link
        FROM asistensis a
        LEFT JOIN asistensi_items i ON a.id = i.asistensi_id
        ORDER BY a.year DESC, a.ganjil_genap ASC, a.uts_uas DESC
    `;

    try {
        const asistensisRs = await db.execute(asistensisQuery);
        const asistensisCsv = Papa.unparse(asistensisRs.rows);
        fs.writeFileSync(path.join(publicDataDir, 'asistensis.csv'), asistensisCsv);
        console.log(`Dumped ${asistensisRs.rows.length} asistensi rows to public/data/asistensis.csv`);
    } catch (e) {
        console.error('Error dumping asistensis:', e);
    }

    // Dump FAQs
    console.log('Fetching faqs...');
    try {
        const faqsRs = await db.execute('SELECT q, a FROM faqs ORDER BY order_index ASC');
        const faqsData = faqsRs.rows.map(row => ({ q: row.q, a: row.a }));
        const appDataDir = path.join(process.cwd(), 'app', 'data');
        if (!fs.existsSync(appDataDir)) {
            fs.mkdirSync(appDataDir, { recursive: true });
        }
        fs.writeFileSync(path.join(appDataDir, 'faqs.json'), JSON.stringify(faqsData, null, 4));
        console.log(`Dumped ${faqsRs.rows.length} FAQ rows to app/data/faqs.json`);
    } catch (e) {
        console.error('Error dumping faqs:', e);
    }

    console.log('Dump completed successfully!');
}

dump().catch(console.error);
