import dotenv from 'dotenv';
dotenv.config();
import { db } from '../scripts/db-client';
import faqs from '../app/data/faqs.json';

async function migrate() {
    console.log('Creating faqs table...');
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS faqs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                q TEXT NOT NULL,
                a TEXT NOT NULL,
                order_index INTEGER DEFAULT 0
            )
        `);
        console.log('Table created or already exists.');

        // Check if empty
        const count = await db.execute('SELECT COUNT(*) as count FROM faqs');
        if ((count.rows[0] as any).count === 0) {
            console.log('Seeding initial FAQs from JSON...');
            for (let i = 0; i < faqs.length; i++) {
                const faq = faqs[i];
                await db.execute({
                    sql: 'INSERT INTO faqs (q, a, order_index) VALUES (?, ?, ?)',
                    args: [faq.q, faq.a, i]
                });
            }
            console.log('Seeding completed.');
        } else {
            console.log('Table already has data, skipping seed.');
        }
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

migrate();
