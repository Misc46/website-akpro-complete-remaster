import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/scripts/db-client';
import { jwtVerify } from 'jose';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

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
        const publicDataDir = path.join(process.cwd(), 'public', 'data');
        if (!fs.existsSync(publicDataDir)) {
            fs.mkdirSync(publicDataDir, { recursive: true });
        }

        // Dump Diktats
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
        const diktatsRs = await db.execute(diktatsQuery);
        const diktatsCsv = Papa.unparse(diktatsRs.rows);
        fs.writeFileSync(path.join(publicDataDir, 'diktats.csv'), diktatsCsv);

        // Dump Asistensis (Note: img column does not exist in asistensi_items table)
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
        const asistensisRs = await db.execute(asistensisQuery);
        const asistensisCsv = Papa.unparse(asistensisRs.rows);
        fs.writeFileSync(path.join(publicDataDir, 'asistensis.csv'), asistensisCsv);

        return NextResponse.json({
            success: true,
            diktatsCount: diktatsRs.rows.length,
            asistensiCount: asistensisRs.rows.length
        });
    } catch (error: any) {
        console.error('Dump error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
