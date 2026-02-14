import React from 'react';
import { fetchDiktatData } from '../lib/dataFetcher';
import DiktatClient from './DiktatClient';

export default async function DiktatPage() {
    // This runs at build time (static)
    const data = await fetchDiktatData();

    return <DiktatClient initialData={data} />;
}
