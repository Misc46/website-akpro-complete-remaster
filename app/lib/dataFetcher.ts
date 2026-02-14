import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import {
    DiktatData,
    AsistensiData,
    AsistensiItem
} from './dataUtils';

// Helper to read local CSV
// Import JSON data directly - this is bundled at build time and works on Cloudflare Edge
// We use require to avoid compile-time errors if the files haven't been generated yet during dev
let localDiktats: any[] = [];
let localAsistensis: any[] = [];

try {
    localDiktats = require('../data/diktats.json');
} catch (e) {
    console.warn('diktats.json not found, falling back to empty');
}

try {
    localAsistensis = require('../data/asistensis.json');
} catch (e) {
    console.warn('asistensis.json not found, falling back to empty');
}

// Helper to read from Cloudflare KV
const getDataFromKv = async (key: string) => {
    try {
        const env = (process as any).env;
        const kv = (globalThis as any).PUBLIC_DATA || env?.PUBLIC_DATA;
        if (kv) {
            const data = await kv.get(key);
            if (data) {
                try {
                    return JSON.parse(data);
                } catch {
                    // If not JSON, it's probably CSV
                    const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
                    return parsed.data;
                }
            }
        }
    } catch (e) {
        console.warn(`Error reading ${key} from KV:`, e);
    }
    return null;
};

// Helper to read local CSV (only works in Node.js environments)
const readLocalCsv = async (filename: string) => {
    // Check if we are in a Node.js environment with fs support
    if (typeof fs !== 'undefined' && fs.readFileSync) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'data', filename);
            if (!fs.existsSync(filePath)) return null;
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
            return parsed.data;
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const fetchDiktatData = async (): Promise<DiktatData[]> => {
    try {
        // Try KV first (Highest priority - instant updates)
        const kvRows = await getDataFromKv('diktats_json');
        // Then try local CSV (Node.js dev environment)
        const csvRows = kvRows ? null : await readLocalCsv('diktats.csv');
        // Finally fall back to bundled JSON (Build-time backup)
        const rows = kvRows || csvRows || localDiktats;

        const grouped: Record<string, DiktatData> = {};

        for (const row of rows as any[]) {
            const id = row.diktat_id;
            if (!id) continue;

            if (!grouped[id]) {
                grouped[id] = {
                    id,
                    year: parseInt(row.academic_year),
                    uts_uas: row.uts_uas,
                    ganjil_genap: row.ganjil_genap,
                    is_active: row.is_active === 1 || row.is_active === '1' || row.is_active === 'true' || row.is_active === true,
                    content: []
                };
            }

            if (row.item_name) {
                grouped[id].content.push({
                    name: row.item_name,
                    major: typeof row.major === 'string' ? JSON.parse(row.major || '[]') : (row.major || []),
                    year: typeof row.target_year === 'string' ? JSON.parse(row.target_year || '[]') : (row.target_year || []),
                    googleDriveLink: row.google_drive_link,
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
        console.error('Error fetching diktat data:', error);
        return [];
    }
};

export const fetchAsistensiData = async (): Promise<AsistensiData[]> => {
    try {
        const kvRows = await getDataFromKv('asistensis_json');
        const csvRows = kvRows ? null : await readLocalCsv('asistensis.csv');
        const rows = kvRows || csvRows || localAsistensis;

        const grouped: Record<string, AsistensiData> = {};

        for (const row of rows as any[]) {
            const id = row.asistensi_id;
            if (!id) continue;

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
                    major: typeof row.major === 'string' ? JSON.parse(row.major || '[]') : (row.major || []),
                    year: typeof row.target_year === 'string' ? JSON.parse(row.target_year || '[]') : (row.target_year || []),
                    person: typeof row.person === 'string' ? JSON.parse(row.person || '[]') : (row.person || []),
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
        console.error('Error fetching asistensi data:', error);
        return [];
    }
};

export const fetchFaqData = async (): Promise<any[]> => {
    try {
        const kvData = await getDataFromKv('faqs_json');
        if (kvData) return kvData;

        // Fallback to local JSON if in Node
        if (typeof fs !== 'undefined') {
            try {
                const filePath = path.join(process.cwd(), 'app', 'data', 'faqs.json');
                if (fs.existsSync(filePath)) {
                    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
            } catch { }
        }

        // Bundled fallback
        try {
            return require('../data/faqs.json');
        } catch {
            return [];
        }
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
        return [];
    }
};

export const fetchResourceCategories = async (): Promise<any[]> => {
    try {
        const kvData = await getDataFromKv('toolbox_json');
        if (kvData) return kvData;

        // Fallback to local JSON if in Node
        if (typeof fs !== 'undefined') {
            try {
                const filePath = path.join(process.cwd(), 'app', 'data', 'resourceCategories.json');
                if (fs.existsSync(filePath)) {
                    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }
            } catch { }
        }

        // Bundled fallback
        try {
            return require('../data/resourceCategories.json');
        } catch {
            return [];
        }
    } catch (error) {
        console.error('Error fetching resource categories:', error);
        return [];
    }
};

