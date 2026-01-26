import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { jwtVerify } from 'jose';
import Papa from 'papaparse';
import { convertMajorCode } from '@/app/lib/dataUtils';

async function verifyAuth(req: NextRequest) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const masterUrl = process.env.GOOGLE_SHEET_MASTER_URL;
        if (!masterUrl) throw new Error('Master URL missing');

        const response = await fetch(masterUrl);
        const csvText = await response.text();
        const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true }).data;

        // Sync Diktat and Asistensi MASTER rows ONLY
        // We don't want to wipe the detailed items if they were manually added via dashboard
        // But we want to ensure any new semester/year from G-Sheets is available

        for (let i = 1; i < parsed.length; i++) {
            const row = parsed[i];
            const year = parseInt(row[0]);
            const ganjilGenap = row[1]?.toLowerCase();
            const utsUas = row[2]?.toLowerCase();
            const isPublished = row[16]?.toLowerCase() === 'true';

            if (!isPublished) continue;

            const diktatId = `Diktat_${utsUas}_${ganjilGenap}_${year}`;
            const asistensiId = `Asistensi_${utsUas}_${ganjilGenap}_${year}`;

            // Check and insert if missing
            await db.execute({
                sql: 'INSERT OR IGNORE INTO diktats (id, year, uts_uas, ganjil_genap) VALUES (?, ?, ?, ?)',
                args: [diktatId, year, utsUas, ganjilGenap]
            });
            await db.execute({
                sql: 'INSERT OR IGNORE INTO asistensis (id, year, uts_uas, ganjil_genap) VALUES (?, ?, ?, ?)',
                args: [asistensiId, year, utsUas, ganjilGenap]
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
