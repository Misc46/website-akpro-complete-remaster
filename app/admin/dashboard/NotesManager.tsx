"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, Clock, CheckCircle, XCircle, Image as ImageIcon, Eye } from 'lucide-react';
import { NoteData } from '../../lib/dataUtils';
import Image from 'next/image';

export default function NotesManager() {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/notes');
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch('/api/admin/notes', {
                method: 'PATCH',
                body: JSON.stringify({ id, status }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setNotes(notes.map(n => n.id === id ? { ...n, status } : n));
            }
        } catch (error) {
            console.error('Failed to update note status:', error);
        }
    };

    const deleteNote = async (id: number) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            const res = await fetch('/api/admin/notes', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setNotes(notes.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest">Loading notes queue...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Moderasi Catatan</h2>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">{notes.filter(n => n.status === 'pending').length} Pending</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-muted/20 border border-border rounded-xl flex items-center justify-between gap-6 group hover:border-highlight/30 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => note.image_base64 && setSelectedImage(note.image_base64)}
                                className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border group-hover:border-highlight/50 transition-colors relative"
                            >
                                {note.image_base64 ? (
                                    <>
                                        <Image
                                            src={note.image_base64}
                                            alt=""
                                            fill
                                            className="object-cover opacity-80"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye size={14} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <ImageIcon size={20} className="text-muted-foreground" />
                                )}
                            </button>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wide">{note.title}</h3>
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-muted border border-border/50 text-muted-foreground">
                                        {note.subject}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(note.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-border" /> {note.author_name || 'Anonymous'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {note.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => updateStatus(note.id, 'approved')}
                                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                        title="Approve"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(note.id, 'rejected')}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        title="Reject"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${note.status === 'approved'
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                    {note.status === 'approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {note.status}
                                </div>
                            )}
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all ml-2"
                                title="Delete Permanently"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {notes.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Queue moderasi kosong</p>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="max-w-4xl max-h-[90vh] w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl bg-muted border border-border relative" onClick={e => e.stopPropagation()}>
                        <Image
                            src={selectedImage}
                            alt="Full Preview"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
