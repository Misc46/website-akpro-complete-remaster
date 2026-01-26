import React from 'react';
import { fetchDiktatData } from '../lib/dataFetcher';
import DiktatClient from './DiktatClient';

// Enable Incremental Static Regeneration (ISR) - revalidate every 60 seconds
export const revalidate = 60;

export default async function DiktatPage() {
    // This runs on the server
    const data = await fetchDiktatData();

    return <DiktatClient initialData={data} />;
}
