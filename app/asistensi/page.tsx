import React from 'react';
import { fetchAsistensiData } from '../lib/dataFetcher';
import AsistensiClient from './AsistensiClient';

export default async function AsistensiPage() {
    // This runs at build time (static)
    const data = await fetchAsistensiData();

    return <AsistensiClient initialData={data} />;
}
