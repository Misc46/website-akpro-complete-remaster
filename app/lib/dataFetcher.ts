import Papa from 'papaparse';
import {
    DiktatData,
    AsistensiData,
    AsistensiItem,
    NoteData,
    FAQData,
    ToolboxCategory
} from './dataUtils';

interface KVNamespace {
    get(key: string): Promise<string | null>;
}

// Static JSON imports — these get bundled at build time by webpack/turbopack.
// They work on BOTH Node.js and Cloudflare Edge because they become inline data.
// If the files don't exist yet (first build), they'll be empty arrays.
import localDiktats from '../data/diktats.json';
import localAsistensis from '../data/asistensis.json';
import localFaqs from '../data/faqs.json';
import localResourceCategories from '../data/resourceCategories.json';

// Helper to read from Cloudflare KV (works on Edge, no-ops locally)
const getDataFromKv = async (key: string): Promise<any> => {
    try {
        const env = process.env as Record<string, unknown>;
        const kv = ((globalThis as Record<string, unknown>).PUBLIC_DATA || env?.PUBLIC_DATA) as KVNamespace | undefined;

        if (!kv || typeof kv.get !== 'function') {
            return null;
        }

        const data = await kv.get(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                const parsed = Papa.parse(data, { header: true, skipEmptyLines: true });
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn(`Error reading ${key} from KV:`, e);
    }
    return null;
};

export const fetchDiktatData = async (): Promise<DiktatData[]> => {
    try {
        // 1. Try KV (live updates from admin "Publish" button)
        const kvRows = await getDataFromKv('diktats_json');
        // 2. Fall back to bundled JSON (from last build)
        const rows = (kvRows || localDiktats) as any[];

        const grouped: Record<string, DiktatData> = {};

        for (const row of rows) {
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
        const rows = (kvRows || localAsistensis) as any[];

        const grouped: Record<string, AsistensiData> = {};

        for (const row of rows) {
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

export const fetchFaqData = async (): Promise<FAQData[]> => {
    try {
        const kvData = await getDataFromKv('faqs_json');
        return (kvData || localFaqs || []) as FAQData[];
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
        return [];
    }
};

export const fetchResourceCategories = async (): Promise<ToolboxCategory[]> => {
    try {
        const kvData = await getDataFromKv('toolbox_json');
        return (kvData || localResourceCategories || []) as ToolboxCategory[];
    } catch (error) {
        console.error('Error fetching resource categories:', error);
        return [];
    }
};

export const fetchNotesData = async (): Promise<NoteData[]> => {
    try {
        // 1. Try KV
        const kvData = await getDataFromKv('approved_notes_json');
        if (kvData) return kvData;

        // 2. Fallback to API/DB (Internal fetch)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
        if (baseUrl) {
            const res = await fetch(`${baseUrl}/api/notes`);
            if (res.ok) return await res.json();
        }
    } catch (error) {
        console.error('Error fetching notes data:', error);
    }
    return [];
};
