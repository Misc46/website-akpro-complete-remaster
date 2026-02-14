import { createClient } from '@libsql/client/http';
import type { Client } from '@libsql/client/http';

let client: Client | null = null;

export const getDb = (): Client => {
    if (client) return client;

    const rawUrl = process.env.TURSO_DATABASE_URL || '';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    if (!rawUrl) {
        console.error('DB Config Error: TURSO_DATABASE_URL is missing');
        throw new Error('TURSO_DATABASE_URL is not defined.');
    }

    // Force HTTPS for Cloudflare Edge compatibility
    const url = rawUrl.startsWith('libsql://')
        ? rawUrl.replace('libsql://', 'https://')
        : rawUrl;

    console.log('Fetching from Turso:', url.substring(0, 20) + '...');

    client = createClient({ url, authToken });
    return client;
};

export const db = {
    execute: (args: any) => getDb().execute(args)
} as Client;
