import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/scripts/db-client';
import { jwtVerify } from 'jose';
import Papa from 'papaparse';

export const runtime = 'edge';

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

        // Dump Asistensis
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

        // Dump FAQs
        const faqsRs = await db.execute('SELECT q, a FROM faqs ORDER BY order_index ASC');
        const faqsData = faqsRs.rows.map(row => ({ q: row.q, a: row.a }));

        // Return the data as JSON so the admin can download it
        // File writing is handled locally via `npm run db:dump`
        return NextResponse.json({
            success: true,
            diktatsCount: diktatsRs.rows.length,
            asistensiCount: asistensisRs.rows.length,
            faqsCount: faqsRs.rows.length,
            data: {
                diktatsCsv,
                asistensisCsv,
                faqsJson: faqsData
            }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
