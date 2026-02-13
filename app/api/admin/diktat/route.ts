import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/scripts/db-client';
import { jwtVerify } from 'jose';

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

export async function GET(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const diktats = await db.execute('SELECT * FROM diktats ORDER BY year DESC, uts_uas DESC');
        const items = await db.execute('SELECT * FROM diktat_items');

        return NextResponse.json({
            master: diktats.rows,
            items: items.rows.map(row => ({
                ...row,
                major: JSON.parse(row.major as string),
                year: JSON.parse(row.year as string)
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { diktat_id, name, major, year, google_drive_link, img } = await req.json();

        await db.execute({
            sql: 'INSERT INTO diktat_items (diktat_id, name, major, year, google_drive_link, img) VALUES (?, ?, ?, ?, ?, ?)',
            args: [diktat_id, name, JSON.stringify(major), JSON.stringify(year), google_drive_link, img || null]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await req.json();
        await db.execute({
            sql: 'DELETE FROM diktat_items WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, is_active } = await req.json();
        await db.execute({
            sql: 'UPDATE diktats SET is_active = ? WHERE id = ?',
            args: [is_active ? 1 : 0, id]
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
