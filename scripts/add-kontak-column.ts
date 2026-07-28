import dotenv from 'dotenv';
dotenv.config();
import { db } from './db-client';

async function run() {
    try {
        console.log('Adding kontak column to requests table...');
        await db.execute('ALTER TABLE requests ADD COLUMN kontak TEXT');
        console.log('Successfully added kontak column to requests table!');
    } catch (e: any) {
        if (e?.message?.includes('duplicate column name')) {
            console.log('Column kontak already exists in requests table.');
        } else {
            console.error('Error executing alter table:', e);
        }
    }
}

run();
