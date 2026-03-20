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

        // Save to Cloudflare KV if available (for instant production updates)
        const env = (process as any).env;
        const kv = (globalThis as any).PUBLIC_DATA || env?.PUBLIC_DATA;

        if (kv) {
            console.log('Saving dump to Cloudflare KV...');
            await Promise.all([
                kv.put('diktats_csv', diktatsCsv),
                kv.put('asistensis_csv', asistensisCsv),
                kv.put('diktats_json', JSON.stringify(diktatsRs.rows)),
                kv.put('asistensis_json', JSON.stringify(asistensisRs.rows)),
                kv.put('faqs_json', JSON.stringify(faqsData)),
                kv.put('toolbox_json', JSON.stringify(toolboxCategories))
            ]);
            console.log('Successfully saved to KV');
        }

        // Trigger Cloudflare Pages rebuild via Deploy Hook
        let deployStatus = 'skipped';
        const runtimeEnv = (process as any).env || {};
        const deployHookUrl = runtimeEnv.CLOUDFLARE_DEPLOY_HOOK || (globalThis as any).CLOUDFLARE_DEPLOY_HOOK;
        
        if (deployHookUrl) {
            try {
                const hookRes = await fetch(deployHookUrl, { method: 'POST' });
                deployStatus = hookRes.ok ? 'triggered' : `failed (${hookRes.status})`;
            } catch (e) {
                deployStatus = `error: ${e instanceof Error ? e.message : 'Unknown'}`;
                console.error('Deploy hook error:', e);
            }
        } else {
            // Debug: Log if the env is missing
            console.warn('CLOUDFLARE_DEPLOY_HOOK is missing from environment');
        }

        return NextResponse.json({
            success: true,
            kvStatus: kv ? 'updated' : 'unavailable',
            deployStatus,
            diktatsCount: diktatsRs.rows.length,
            asistensiCount: asistensisRs.rows.length,
            faqsCount: faqsRs.rows.length,
            toolboxCount: toolboxItemsRs.rows.length,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
