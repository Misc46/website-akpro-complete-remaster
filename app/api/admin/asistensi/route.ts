import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
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

export async function GET(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const asistensis = await db.execute('SELECT * FROM asistensis ORDER BY year DESC, uts_uas DESC');
        const items = await db.execute('SELECT * FROM asistensi_items');

        return NextResponse.json({
            master: asistensis.rows,
            items: items.rows.map(row => ({
                ...row,
                major: JSON.parse(row.major as string),
                year: JSON.parse(row.year as string),
                person: JSON.parse(row.person as string)
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { asistensi_id, name, major, year, person, date, zoom_meetings_link, recordings_link, img } = await req.json();

        await db.execute({
            sql: 'INSERT INTO asistensi_items (asistensi_id, name, major, year, person, date, zoom_meetings_link, recordings_link, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [
                asistensi_id,
                name,
                JSON.stringify(major),
                JSON.stringify(year),
                JSON.stringify(person),
                date,
                zoom_meetings_link,
                recordings_link,
                img
            ]
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
            sql: 'DELETE FROM asistensi_items WHERE id = ?',
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
        const { id, asistensi_id, name, major, year, person, date, zoom_meetings_link, recordings_link, img } = await req.json();

        await db.execute({
            sql: 'UPDATE asistensi_items SET asistensi_id = ?, name = ?, major = ?, year = ?, person = ?, date = ?, zoom_meetings_link = ?, recordings_link = ?, img = ? WHERE id = ?',
            args: [
                asistensi_id,
                name,
                JSON.stringify(major),
                JSON.stringify(year),
                JSON.stringify(person),
                date,
                zoom_meetings_link,
                recordings_link,
                img,
                id
            ]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
