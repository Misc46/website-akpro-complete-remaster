"use client";

import React, { useState } from 'react';
import { useTheme } from '../../lib/ThemeContext';
import { BackgroundDecorations } from '../../components/home/BackgroundDecorations';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, BookOpen, User, Image as ImageIcon, X } from 'lucide-react';
import { NoteData } from '../../lib/dataUtils';
import Image from 'next/image';

interface NotesClientProps {
    initialNotes: NoteData[];
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
    const { isDarkMode } = useTheme();
    const [notes] = useState<NoteData[]>(initialNotes);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [author, setAuthor] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subject', subject);
        formData.append('author', author);
        formData.append('file', file);

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setUploadStatus({ type: 'success', message: 'Catatan berhasil dikirim dan menunggu persetujuan admin!' });
                setTitle('');
                setSubject('');
                setAuthor('');
                setFile(null);
            } else {
                setUploadStatus({ type: 'error', message: data.error || 'Gagal mengirim catatan' });
            }
        } catch (err: unknown) {
            setUploadStatus({ type: 'error', message: 'Terjadi kesalahan sistem' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <BackgroundDecorations isDarkMode={isDarkMode} intensity="subtle" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-highlight mb-4">
                            <BookOpen size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bank Catatan</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            BERBAGI CATATAN KULIAH
                        </h1>
                        <p className="text-xs font-medium mt-2 text-muted-foreground max-w-2xl">
                            Bantu sesama mahasiswa dengan mengunggah foto catatan kuliahmu. Setiap kontribusi akan diperiksa oleh admin sebelum dipublikasikan.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-12">
                    {/* Notes List */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Catatan Terbaru</h2>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{notes.length} Catatan Terpublikasi</span>
                        </div>

                        {notes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="group bg-muted/20 border border-border rounded-2xl overflow-hidden hover:border-highlight/50 transition-all duration-300"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2.5 rounded-xl bg-highlight/10 text-highlight">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                                    {note.subject}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-black text-foreground mb-1 group-hover:text-highlight transition-colors">
                                                {note.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
                                                <User size={10} />
                                                <span>{note.author_name || 'Anonymous'}</span>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <button
                                            onClick={() => note.image_base64 && setSelectedImage(note.image_base64)}
                                            className="w-full py-3 bg-muted/40 border-t border-border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground hover:bg-highlight/10 hover:text-highlight transition-all"
                                        >
                                            <ImageIcon size={12} />
                                            Lihat Catatan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                                <div className="max-w-xs mx-auto">
                                    <ImageIcon size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Belum ada catatan yang tersedia.</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-2">Jadilah yang pertama berkontribusi!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Sidebar */}
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <div className="p-8 bg-muted/30 backdrop-blur-xl border border-border rounded-3xl shadow-sm relative overflow-hidden group">
                            {/* Decorative Background */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-highlight/5 rounded-full blur-3xl group-hover:bg-highlight/10 transition-all duration-500"></div>

                            <h2 className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground">Kontribusi Catatan</h2>

                            <form onSubmit={handleUpload} className="relative z-10 space-y-5">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Nama Mata Kuliah</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Contoh: Kalkulus 1"
                                        className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-highlight/20 transition-all"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Judul Catatan</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Contoh: Ringkasan Integral"
                                        className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-highlight/20 transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Nama Kontributor (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="Nama atau Inisial"
                                        className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-highlight/20 transition-all"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Foto Catatan (Maks. 1MB)</label>
                                    <div className="relative group/upload">
                                        <input
                                            required
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="note-upload"
                                        />
                                        <label
                                            htmlFor="note-upload"
                                            className="flex flex-col items-center justify-center gap-3 w-full aspect-video bg-background border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-highlight/50 hover:bg-highlight/5 transition-all group-hover/upload:scale-[1.01]"
                                        >
                                            {file ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 size={24} className="text-highlight" />
                                                    <span className="text-[10px] font-bold text-foreground max-w-[200px] truncate">{file.name}</span>
                                                    <span className="text-[8px] text-muted-foreground uppercase">{(file.size / 1024).toFixed(0)} KB</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="p-3 rounded-full bg-muted/50 text-muted-foreground group-hover/upload:text-highlight transition-colors">
                                                        <Upload size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pilih Gambar</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button
                                    disabled={isUploading || !file}
                                    type="submit"
                                    className="w-full py-4 bg-foreground text-background dark:bg-highlight dark:text-highlight-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-highlight/10 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Sedang Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Kirim Catatan
                                        </>
                                    )}
                                </button>
                            </form>

                            {uploadStatus && (
                                <div className={`mt-6 p-4 rounded-2xl flex items-start gap-3 border ${uploadStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    {uploadStatus.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                                    <span className="text-[10px] font-bold uppercase tracking-wide leading-relaxed">{uploadStatus.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Informational Card */}
                        <div className="mt-6 p-6 border border-border rounded-3xl bg-muted/10">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground mb-3 underline decoration-highlight decoration-2 underline-offset-4">Panduan Upload</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <div className="w-1 h-1 rounded-full bg-highlight"></div>
                                    Pastikan tulisan terbaca dengan jelas.
                                </li>
                                <li className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <div className="w-1 h-1 rounded-full bg-highlight"></div>
                                    Resolusi gambar tidak perlu terlalu tinggi.
                                </li>
                                <li className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <div className="w-1 h-1 rounded-full bg-highlight"></div>
                                    Hindari mengandung SARA atau konten tidak pantas.
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-8 right-8 p-3 rounded-full bg-muted/50 text-foreground hover:bg-highlight hover:text-white transition-all shadow-xl"
                    >
                        <X size={24} />
                    </button>
                    <div className="max-w-4xl max-h-[85vh] w-full overflow-hidden rounded-3xl shadow-2xl border border-border bg-muted relative aspect-[3/4]">
                        <Image
                            src={selectedImage}
                            alt="Preview Catatan"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    {/* Caption/Title in Modal */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Mode Pratinjau Catatan</p>
                    </div>
                </div>
            )}
        </div>
    );
}
