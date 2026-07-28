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
        // Fetch all notes (including BLOBs as base64 for preview)
        const result = await db.execute("SELECT id, title, subject, author_name, status, created_at, image_data FROM notes ORDER BY created_at DESC");

        const notes = result.rows.map(row => {
            let base64 = null;
            if (row.image_data) {
                // In Turso/libsql result.rows, BLOBs are returned as ArrayBuffer/Buffer
                base64 = `data:image/jpeg;base64,${Buffer.from(row.image_data as unknown as ArrayBuffer).toString('base64')}`;
            }
            return {
                id: row.id,
                title: row.title,
                subject: row.subject,
                author_name: row.author_name,
                status: row.status,
                created_at: row.created_at,
                image_base64: base64
            };
        });

        return NextResponse.json(notes);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, status } = await req.json();

        await db.execute({
            sql: 'UPDATE notes SET status = ? WHERE id = ?',
            args: [status, id]
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await req.json();
        await db.execute({
            sql: 'DELETE FROM notes WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
