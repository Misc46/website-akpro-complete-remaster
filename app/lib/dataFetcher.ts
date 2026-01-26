import { db } from './db';
import {
    DiktatData,
    AsistensiData,
    AsistensiItem,
    convertMajorCode,
    parseCsv
} from './dataUtils';

export const fetchDiktatData = async (): Promise<DiktatData[]> => {
    if (process.env.NEXT_PUBLIC_USE_TURSO === 'true' || process.env.TURSO_DATABASE_URL) {
        try {
            console.log('Fetching diktat data from Turso...');
            const diktatsRs = await db.execute('SELECT * FROM diktats');
            const diktatList: DiktatData[] = [];

            for (const row of diktatsRs.rows) {
                const itemsRs = await db.execute({
                    sql: 'SELECT * FROM diktat_items WHERE diktat_id = ?',
                    args: [row.id as string]
                });

                diktatList.push({
                    id: row.id as string,
                    year: row.year as number,
                    uts_uas: row.uts_uas as string,
                    ganjil_genap: row.ganjil_genap as string,
                    content: itemsRs.rows.map((item: any) => ({
                        name: item.name as string,
                        major: JSON.parse(item.major as string),
                        year: JSON.parse(item.year as string),
                        googleDriveLink: item.google_drive_link as string,
                        img: item.img as string | null
                    }))
                });
            }
            return diktatList;
        } catch (e) {
            console.error('Error fetching from Turso, falling back to CSV:', e);
        }
    }

    try {
        const masterUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQT3zuplCOCJpIet9N6X6bbYBEdJ0uoLC-h5eVrylZcjUvCQS0pliMVAGdFhYGgiGp0RV2SQiK-1XqR/pub?gid=0&single=true&output=csv';
        const response = await fetch(masterUrl);
        const csvText = await response.text();
        const parsed = parseCsv(csvText);

        const diktatList: DiktatData[] = [];

        for (let i = 1; i < parsed.length; i++) {
            const row = parsed[i];
            const year = parseInt(row[0]);
            const ganjilGenap = row[1]?.toLowerCase();
            const utsUas = row[2]?.toLowerCase();
            const isPublished = row[16]?.toLowerCase() === 'true';

            if (!isPublished) continue;

            if (row[9]) {
                try {
                    const diktatRes = await fetch(row[9]);
                    const diktatCsv = await diktatRes.text();
                    const diktatParsed = parseCsv(diktatCsv);

                    const content = diktatParsed.slice(1).map((d: any) => ({
                        name: d[0],
                        major: d[1]?.split(',').map((m: any) => convertMajorCode(m.trim())).filter(Boolean) || [],
                        year: d[2]?.split(',').map((y: any) => parseInt(y.trim())).filter(Boolean) || [],
                        googleDriveLink: d[3] || '',
                        img: d[4] || null
                    }));

                    diktatList.push({
                        id: `Diktat_${utsUas}_${ganjilGenap}_${year}`,
                        year,
                        uts_uas: utsUas,
                        ganjil_genap: ganjilGenap,
                        content
                    });
                } catch (e) {
                    console.error('Error fetching diktat:', e);
                }
            }
        }
        return diktatList;
    } catch (error) {
        console.error('Error fetching diktat data:', error);
        return [];
    }
};

export const fetchAsistensiData = async (): Promise<AsistensiData[]> => {
    if (process.env.NEXT_PUBLIC_USE_TURSO === 'true' || process.env.TURSO_DATABASE_URL) {
        try {
            console.log('Fetching asistensi data from Turso...');
            const asistensiRs = await db.execute('SELECT * FROM asistensis');
            const asistensiList: AsistensiData[] = [];

            for (const row of asistensiRs.rows) {
                const itemsRs = await db.execute({
                    sql: 'SELECT * FROM asistensi_items WHERE asistensi_id = ?',
                    args: [row.id as string]
                });

                asistensiList.push({
                    id: row.id as string,
                    year: row.year as number,
                    uts_uas: row.uts_uas as string,
                    ganjil_genap: row.ganjil_genap as string,
                    content: itemsRs.rows.map((item: any) => ({
                        name: item.name as string,
                        major: JSON.parse(item.major as string),
                        year: JSON.parse(item.year as string),
                        person: JSON.parse(item.person as string),
                        date: item.date as string,
                        zoomMeetingsLink: item.zoom_meetings_link as string,
                        recordingsLink: item.recordings_link as string
                    }))
                });
            }
            return asistensiList;
        } catch (e) {
            console.error('Error fetching from Turso, falling back to CSV:', e);
        }
    }

    try {
        const masterUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQT3zuplCOCJpIet9N6X6bbYBEdJ0uoLC-h5eVrylZcjUvCQS0pliMVAGdFhYGgiGp0RV2SQiK-1XqR/pub?gid=0&single=true&output=csv';
        const response = await fetch(masterUrl);
        const csvText = await response.text();
        const parsed = parseCsv(csvText);

        const asistensiList: AsistensiData[] = [];

        for (let i = 1; i < parsed.length; i++) {
            const row = parsed[i];
            const year = parseInt(row[0]);
            const ganjilGenap = row[1]?.toLowerCase();
            const utsUas = row[2]?.toLowerCase();
            const isPublished = row[16]?.toLowerCase() === 'true';

            if (!isPublished) continue;

            if (row[15]) {
                try {
                    const asistensiRes = await fetch(row[15]);
                    const asistensiCsv = await asistensiRes.text();
                    const asistensiParsed = parseCsv(asistensiCsv);

                    const content: AsistensiItem[] = [];
                    for (let j = 1; j < asistensiParsed.length; j += 7) {
                        if (j + 6 < asistensiParsed.length) {
                            content.push({
                                name: asistensiParsed[j][0],
                                major: asistensiParsed[j + 1][0]?.split(',').map((m: any) => convertMajorCode(m.trim())).filter(Boolean) || [],
                                year: asistensiParsed[j + 2][0]?.split(',').map((y: any) => parseInt(y.trim())).filter(Boolean) || [],
                                person: asistensiParsed[j + 3][0]?.split(',').map((p: any) => ({ name: p.trim() })) || [],
                                date: asistensiParsed[j + 4][0],
                                zoomMeetingsLink: asistensiParsed[j + 5][0] || '',
                                recordingsLink: asistensiParsed[j + 6][0] || ''
                            });
                        }
                    }

                    asistensiList.push({
                        id: `Asistensi_${utsUas}_${ganjilGenap}_${year}`,
                        year,
                        uts_uas: utsUas,
                        ganjil_genap: ganjilGenap,
                        content
                    });
                } catch (e) {
                    console.error('Error fetching asistensi:', e);
                }
            }
        }
        return asistensiList;
    } catch (error) {
        console.error('Error fetching asistensi data:', error);
        return [];
    }
};
