import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/scripts/db-client';

export const runtime = 'edge';

interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
}

// GET: Fetch approved notes (from KV if available)
export async function GET() {
    try {
        const env = process.env as Record<string, unknown>;
        const kv = ((globalThis as Record<string, unknown>).PUBLIC_DATA || env?.PUBLIC_DATA) as KVNamespace | undefined;

        if (kv && typeof kv.get === 'function') {
            const notes = await kv.get('approved_notes_json');
            if (notes) {
                return NextResponse.json(JSON.parse(notes));
            }
        }

        // Fallback to DB (might be slow but works for dev)
        const result = await db.execute("SELECT id, title, subject, author_name, created_at FROM notes WHERE status = 'approved' ORDER BY created_at DESC");
        return NextResponse.json(result.rows);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST: Submit a new note (pending approval)
export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const title = data.get('title') as string;
        const subject = data.get('subject') as string;
        const author = data.get('author') as string;
        const file = data.get('file') as File;

        if (!file || file.size > 1024 * 1024) {
            return NextResponse.json({ error: 'File too large or missing' }, { status: 400 });
        }

        // Convert file to Buffer/ArrayBuffer for Turso BLOB
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await db.execute({
            sql: 'INSERT INTO notes (title, subject, author_name, image_data, status) VALUES (?, ?, ?, ?, ?)',
            args: [title, subject, author, buffer, 'pending']
        });

        return NextResponse.json({ success: true, message: 'Note submitted for approval' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Submit note error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
