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

// GET: Fetch all categories + items
export async function GET(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const catsRs = await db.execute('SELECT * FROM toolbox_categories ORDER BY order_index ASC');
        const itemsRs = await db.execute('SELECT * FROM toolbox_items ORDER BY order_index ASC');

        const categories = catsRs.rows.map((cat: Record<string, unknown>) => {
            const isGrouped = cat.is_grouped === 1 || cat.is_grouped === '1';
            const catItems = (itemsRs.rows as Record<string, unknown>[]).filter(
                (item) => item.category_id === cat.id
            );

            if (isGrouped) {
                const groupMap: Record<string, { title: string; description: string | null; href: string; icon: string; id: number }[]> = {};
                for (const item of catItems) {
                    const groupName = (item.group_name as string) || 'Ungrouped';
                    if (!groupMap[groupName]) groupMap[groupName] = [];
                    groupMap[groupName].push({
                        id: item.id as number,
                        title: item.title as string,
                        description: item.description as string | null,
                        href: item.href as string,
                        icon: item.icon as string,
                    });
                }
                return {
                    id: cat.id,
                    label: cat.label,
                    isGrouped: true,
                    order_index: cat.order_index,
                    groups: Object.entries(groupMap).map(([name, links]) => ({ name, links })),
                };
            }

            return {
                id: cat.id,
                label: cat.label,
                isGrouped: false,
                order_index: cat.order_index,
                links: catItems.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    href: item.href,
                    icon: item.icon,
                })),
            };
        });

        // Also return flat item list for easier editing
        return NextResponse.json({ categories, items: itemsRs.rows });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch toolbox data' }, { status: 500 });
    }
}

// POST: Create a new item
export async function POST(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { category_id, group_name, title, description, href, icon, order_index } = await req.json();

        await db.execute({
            sql: 'INSERT INTO toolbox_items (category_id, group_name, title, description, href, icon, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [category_id, group_name || null, title, description || null, href, icon || 'FolderOpen', order_index || 0]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}

// PUT: Update an existing item
export async function PUT(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, category_id, group_name, title, description, href, icon, order_index } = await req.json();

        await db.execute({
            sql: 'UPDATE toolbox_items SET category_id = ?, group_name = ?, title = ?, description = ?, href = ?, icon = ?, order_index = ? WHERE id = ?',
            args: [category_id, group_name || null, title, description || null, href, icon || 'FolderOpen', order_index || 0, id]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}

// DELETE: Delete an item
export async function DELETE(req: NextRequest) {
    if (!await verifyAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await req.json();
        await db.execute({
            sql: 'DELETE FROM toolbox_items WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
