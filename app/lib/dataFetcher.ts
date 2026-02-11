import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import {
    DiktatData,
    AsistensiData,
    AsistensiItem
} from './dataUtils';

// Helper to read local CSV
const readLocalCsv = async (filename: string) => {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    return parsed.data;
};

export const fetchDiktatData = async (): Promise<DiktatData[]> => {
    try {
        const rows = await readLocalCsv('diktats.csv');
        const grouped: Record<string, DiktatData> = {};

        for (const row of rows as any[]) {
            const id = row.diktat_id;
            if (!grouped[id]) {
                grouped[id] = {
                    id,
                    year: parseInt(row.academic_year),
                    uts_uas: row.uts_uas,
                    ganjil_genap: row.ganjil_genap,
                    is_active: row.is_active === '1' || row.is_active === 'true',
                    content: []
                };
            }

            if (row.item_name) {
                grouped[id].content.push({
                    name: row.item_name,
                    major: JSON.parse(row.major || '[]'),
                    year: JSON.parse(row.target_year || '[]'),
                    googleDriveLink: row.google_drive_link,
                    img: row.img || null
                });
            }
        }

        return Object.values(grouped).sort((a, b) => {
            // Sort by Year DESC, then Ganjil/Genap ASC, then UTS/UAS DESC
            if (b.year !== a.year) return b.year - a.year;
            if (a.ganjil_genap !== b.ganjil_genap) return a.ganjil_genap.localeCompare(b.ganjil_genap);
            return b.uts_uas.localeCompare(a.uts_uas);
        });
    } catch (error) {
        console.error('Error fetching diktat data form CSV:', error);
        return [];
    }
};

export const fetchAsistensiData = async (): Promise<AsistensiData[]> => {
    try {
        const rows = await readLocalCsv('asistensis.csv');
        const grouped: Record<string, AsistensiData> = {};

        for (const row of rows as any[]) {
            const id = row.asistensi_id;
            if (!grouped[id]) {
                grouped[id] = {
                    id,
                    year: parseInt(row.academic_year),
                    uts_uas: row.uts_uas,
                    ganjil_genap: row.ganjil_genap,
                    content: []
                };
            }

            if (row.item_name) {
                grouped[id].content.push({
                    name: row.item_name,
                    major: JSON.parse(row.major || '[]'),
                    year: JSON.parse(row.target_year || '[]'),
                    person: JSON.parse(row.person || '[]'),
                    date: row.date,
                    zoomMeetingsLink: row.zoom_meetings_link,
                    recordingsLink: row.recordings_link,
                    img: row.img || null
                });
            }
        }

        return Object.values(grouped).sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (a.ganjil_genap !== b.ganjil_genap) return a.ganjil_genap.localeCompare(b.ganjil_genap);
            return b.uts_uas.localeCompare(a.uts_uas);
        });
    } catch (error) {
        console.error('Error fetching asistensi data from CSV:', error);
        return [];
    }
};

