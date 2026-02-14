import React from 'react';
import { fetchDiktatData } from '../lib/dataFetcher';
import DiktatClient from './DiktatClient';

export const dynamic = 'force-dynamic';

export default async function DiktatPage() {
    // This runs on the server
    const data = await fetchDiktatData();

    return <DiktatClient initialData={data} />;
}
