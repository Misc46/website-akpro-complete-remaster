import React from 'react';
import { fetchAsistensiData } from '../lib/dataFetcher';
import AsistensiClient from './AsistensiClient';

// Enable Incremental Static Regeneration (ISR) - revalidate every 60 seconds
export const revalidate = 60;

export default async function AsistensiPage() {
    // This runs on the server
    const data = await fetchAsistensiData();

    return <AsistensiClient initialData={data} />;
}
