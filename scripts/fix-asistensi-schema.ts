import dotenv from 'dotenv';
dotenv.config();
import { db } from './db-client';

async function fix() {
    console.log('Adding img column to asistensi_items...');
    try {
        await db.execute('ALTER TABLE asistensi_items ADD COLUMN img TEXT');
        console.log('Column added successfully.');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('Column already exists.');
        } else {
            console.error('Failed to add column:', e.message);
        }
    }
}

fix();
