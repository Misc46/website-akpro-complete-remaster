import React from 'react';
import { fetchNotesData } from '../../lib/dataFetcher';
import NotesClient from './NotesClient';

export default async function NotesPage() {
    const data = await fetchNotesData();

    return <NotesClient initialNotes={data} />;
}
