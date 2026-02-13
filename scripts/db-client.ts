import { createClient as createWebClient } from '@libsql/client/web';
import { createClient as createNodeClient, type Client } from '@libsql/client';

let client: Client | null = null;

// Detect if we're running on edge runtime (Cloudflare Pages)
const isEdge = typeof globalThis.navigator !== 'undefined' ||
    typeof (globalThis as Record<string, unknown>).EdgeRuntime === 'string';

export const getDb = (): Client => {
    if (client) return client;

    const url = process.env.TURSO_DATABASE_URL || '';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    if (!url) {
        throw new Error('TURSO_DATABASE_URL is not defined. Please check your environment variables.');
    }

    // Use web client for edge runtime (Cloudflare), node client for local scripts
    const factory = isEdge ? createWebClient : createNodeClient;
    client = factory({ url, authToken }) as Client;

    return client;
};

// For backward compatibility with existing code
export const db = {
    execute: (args: any) => getDb().execute(args)
} as Client;

