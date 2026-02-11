import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/scripts/db-client';
import { jwtVerify } from 'jose';

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
        const { year, ganjil_genap, uts_uas, type } = await req.json();

        if (!year || !ganjil_genap || !uts_uas || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (type === 'diktat') {
            const id = `Diktat_${uts_uas}_${ganjil_genap}_${year}`;
            await db.execute({
                sql: 'INSERT INTO diktats (id, year, uts_uas, ganjil_genap, is_active) VALUES (?, ?, ?, ?, 1)',
                args: [id, parseInt(year), uts_uas, ganjil_genap]
            });
        } else if (type === 'asistensi') {
            const id = `Asistensi_${uts_uas}_${ganjil_genap}_${year}`;
            await db.execute({
                sql: 'INSERT INTO asistensis (id, year, uts_uas, ganjil_genap) VALUES (?, ?, ?, ?)',
                args: [id, parseInt(year), uts_uas, ganjil_genap]
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('UNIQUE')) {
            return NextResponse.json({ error: 'Group already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
