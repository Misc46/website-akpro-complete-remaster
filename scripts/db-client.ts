import { createClient } from '@libsql/client/web';
import type { Client } from '@libsql/client';

let client: Client | null = null;

export const getDb = (): Client => {
    if (client) return client;

    let url = process.env.TURSO_DATABASE_URL || '';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    if (!url) {
        throw new Error('TURSO_DATABASE_URL is not defined. Please check your environment variables.');
    }

    if (url.startsWith('libsql://')) {
        url = url.replace('libsql://', 'https://');
    }

    client = createClient({
        url,
        authToken,
    }) as Client;

    return client;
};

// For backward compatibility with existing code
export const db = {
    execute: (args: any) => getDb().execute(args)
} as Client;
