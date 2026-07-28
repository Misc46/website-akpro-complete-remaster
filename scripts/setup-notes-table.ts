import dotenv from 'dotenv';
dotenv.config();
import { db } from './db-client';

async function setup() {
    try {
        console.log('Dropping and creating notes table...');
        await db.execute('DROP TABLE IF EXISTS notes');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                subject TEXT NOT NULL,
                author_name TEXT,
                file_url TEXT,
                image_data BLOB,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table created or already exists.');
    } catch (e) {
        console.error('Error setting up table:', e);
    }
}

setup();
