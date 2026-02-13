"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
    isDarkMode: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResultsLength: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    isDarkMode,
    searchQuery,
    setSearchQuery,
    searchResultsLength
}) => {
    return (
        <section className="relative pt-24 pb-12 overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                     Website Akpro IME FTUI 2026
                </h1>

                <p className="text-xs md:text-sm font-normal max-w-xl mx-auto mb-8 text-muted-foreground leading-relaxed">
                    Website Akpro adalah wadah yang menyediakan berbagai informasi terkait Akpro dan hal akademis departemen lainnya seperti kumpulan Diktat, E-Book, Video Asistensi, informasi Kurikulum, informasi magang, dan lain-lain.
                </p>

                <div className="relative max-w-lg mx-auto mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/50">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari sumber daya..."
                        className="w-full py-3 pl-11 pr-4 rounded-lg border border-border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-highlight/30 focus:border-highlight/50 font-medium text-xs transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-muted/50 border border-border/50 rounded text-muted-foreground/70 tracking-widest uppercase">Cari</kbd>
                    </div>
                </div>

                {searchQuery && (
                    <div className="flex items-center justify-between mb-4 px-2 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 text-highlight-text font-bold text-[10px] uppercase tracking-widest">
                            <Search size={14} />
                            <span>Hasil Pencarian ({searchResultsLength})</span>
                        </div>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-highlight-text transition-colors"
                        >
                            Bersihkan
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
