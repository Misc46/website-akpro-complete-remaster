import React from 'react';
import { fetchAsistensiData } from '../lib/dataFetcher';
import AsistensiClient from './AsistensiClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function AsistensiPage() {
    // This runs on the server
    const data = await fetchAsistensiData();

    return <AsistensiClient initialData={data} />;
}
