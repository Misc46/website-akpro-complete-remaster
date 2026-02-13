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

        // Dump Toolbox
        const toolboxCatsRs = await db.execute('SELECT * FROM toolbox_categories ORDER BY order_index ASC');
        const toolboxItemsRs = await db.execute('SELECT * FROM toolbox_items ORDER BY order_index ASC');

        const toolboxCategories = toolboxCatsRs.rows.map((cat: Record<string, unknown>) => {
            const isGrouped = cat.is_grouped === 1 || cat.is_grouped === '1';
            const catItems = (toolboxItemsRs.rows as Record<string, unknown>[]).filter(
                (item) => item.category_id === cat.id
            );

            if (isGrouped) {
                const groupMap: Record<string, { title: string; href: string }[]> = {};
                for (const item of catItems) {
                    const groupName = (item.group_name as string) || 'Ungrouped';
                    if (!groupMap[groupName]) groupMap[groupName] = [];
                    groupMap[groupName].push({
                        title: item.title as string,
                        href: item.href as string,
                    });
                }
                return {
                    id: cat.id,
                    label: cat.label,
                    isGrouped: true,
                    groups: Object.entries(groupMap).map(([name, links]) => ({ name, links })),
                };
            }

            return {
                id: cat.id,
                label: cat.label,
                links: catItems.map((item) => ({
                    title: item.title,
                    description: item.description,
                    href: item.href,
                    icon: item.icon,
                })),
            };
        });

        // Return the data as JSON so the admin can download it
        // File writing is handled locally via `npm run db:dump`
        return NextResponse.json({
            success: true,
            diktatsCount: diktatsRs.rows.length,
            asistensiCount: asistensisRs.rows.length,
            faqsCount: faqsRs.rows.length,
            toolboxCount: toolboxItemsRs.rows.length,
            data: {
                diktatsCsv,
                asistensisCsv,
                faqsJson: faqsData,
                toolboxJson: toolboxCategories
            }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
