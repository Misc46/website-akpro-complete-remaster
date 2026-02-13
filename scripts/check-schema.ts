import dotenv from 'dotenv';
dotenv.config();
import { db } from './db-client';

async function check() {
    try {
        console.log('--- Table: diktats ---');
        const diktats = await db.execute('PRAGMA table_info(diktats)');
        console.log(diktats.rows.map(r => r.name));

        console.log('\n--- Table: diktat_items ---');
        const d_items = await db.execute('PRAGMA table_info(diktat_items)');
        console.log(d_items.rows.map(r => r.name));

        console.log('\n--- Table: asistensis ---');
        const asistensis = await db.execute('PRAGMA table_info(asistensis)');
        console.log(asistensis.rows.map(r => r.name));

        console.log('\n--- Table: asistensi_items ---');
        const a_items = await db.execute('PRAGMA table_info(asistensi_items)');
        console.log(a_items.rows.map(r => r.name));

    } catch (e) {
        console.error('Error checking schema:', e);
    }
}

check();
