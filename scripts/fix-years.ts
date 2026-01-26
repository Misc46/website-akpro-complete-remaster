import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { db } from '../app/lib/db';

async function run() {
    console.log('Fixing year data...');
    // Update manual inserted year 3/4 to year 2
    await db.execute('UPDATE asistensi_items SET year = \'[2]\' WHERE name IN (\'Analisis Vektor\', \'Rangkaian Listrik 2\')');
    await db.execute('UPDATE asistensi_items SET year = \'[2]\' WHERE year = \'[3]\' OR year = \'[4]\'');

    // Also check diktat_items if they have year 3 or 4
    await db.execute('UPDATE diktat_items SET year = \'[2]\' WHERE year = \'[3]\' OR year = \'[4]\'');
    console.log('Finished fixing year data.');
}

run().catch(console.error);
