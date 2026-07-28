import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const rawUrl = process.env.TURSO_DATABASE_URL || '';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

if (!rawUrl) {
    throw new Error('TURSO_DATABASE_URL is not defined.');
}

// Force HTTPS for Cloudflare Edge compatibility
const url = rawUrl.startsWith('libsql://')
    ? rawUrl.replace('libsql://', 'https://')
    : rawUrl;

export const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
