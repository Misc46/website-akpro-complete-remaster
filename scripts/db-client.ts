import { createClient } from '@libsql/client/web';
import type { Client } from '@libsql/client/web';

let client: Client | null = null;

export const getDb = (): Client => {
    if (client) return client;

    const url = process.env.TURSO_DATABASE_URL || '';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    if (!url) {
        console.error('DB Config Error: TURSO_DATABASE_URL is missing');
        throw new Error('TURSO_DATABASE_URL is not defined. Please check your environment variables.');
    }

    console.log('Initializing Turso Client with URL:', url.substring(0, 15) + '...');

    client = createClient({
        url: url.startsWith('libsql://') ? url.replace('libsql://', 'https://') : url,
        authToken,
    }) as Client;

    return client;
};

// For backward compatibility with existing code
export const db = {
    execute: (args: any) => {
        const c = getDb();
        return c.execute(args);
    }
} as Client;
