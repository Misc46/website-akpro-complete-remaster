"use client";

import React, { useState } from 'react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import { Archive, ChevronRight, FileText, Sparkles, Download, Search, Info, Grid, List as ListIcon } from 'lucide-react';
import {
    filterContent,
    DiktatData,
    DiktatItem
} from '../lib/dataUtils';

interface DiktatClientProps {
    initialData: DiktatData[];
}

export default function DiktatClient({ initialData }: DiktatClientProps) {
    const { isDarkMode } = useTheme();
    const [selectedYear, setSelectedYear] = useState(1);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Sort logic helper for chronological order (Descending)
    const academicSort = (data: DiktatData[]) => {
        return [...data].sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (a.ganjil_genap !== b.ganjil_genap) {
                return a.ganjil_genap === 'ganjil' ? -1 : 1;
            }
            if (a.uts_uas !== b.uts_uas) {
                return b.uts_uas === 'uas' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedData = academicSort(initialData);
    const latestDiktatId = sortedData[0]?.id;
    const activeGroups = sortedData.filter(d => d.is_active);
    const archiveGroups = sortedData.filter(d => !d.is_active);

    const [activeGroupId, setActiveGroupId] = useState<string | undefined>(
        activeGroups.length > 0 ? activeGroups[0].id : latestDiktatId
    );

    const currentGroup = sortedData.find(d => d.id === activeGroupId) || sortedData[0];

    if (!currentGroup) {
        return <div className={`p-24 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data diktat tersedia</div>;
    }

    const filtered = filterContent(currentGroup.content, selectedYear, selectedMajor).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                <div>
                    <div className="flex items-center gap-2 text-highlight-text mb-4">
                        <Archive size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Repository / Diktat Bank</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {currentGroup.uts_uas.toUpperCase()} {currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year}
                    </h1>
                    <p className="text-xs font-medium mt-2 text-muted-foreground">
                        Browsing <span className="text-foreground dark:text-white font-bold">{filtered.length}</span> resources for this period.
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border">
                    {sortedData.slice(0, 3).map(g => (
                        <button
                            key={g.id}
                            onClick={() => setActiveGroupId(g.id)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeGroupId === g.id
                                ? 'bg-background text-highlight-text shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {g.uts_uas} {g.ganjil_genap} {g.year}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                {/* Sidebar Filters */}
                <aside className="space-y-8">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Search</h4>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Filter within group..."
                                className="w-full bg-muted border border-border rounded-lg py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-highlight/50 transition"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-muted border border-border rounded-xl">
                        <FilterSelector
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedMajor={selectedMajor}
                            setSelectedMajor={setSelectedMajor}
                            ganjilGenap={currentGroup.ganjil_genap}
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    {archiveGroups.length > 0 && (
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Archived Periods</h4>
                            <div className="grid gap-2">
                                {archiveGroups.map(group => (
                                    <button
                                        key={group.id}
                                        onClick={() => {
                                            setActiveGroupId(group.id);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${activeGroupId === group.id
                                            ? 'bg-highlight/10 border-highlight text-highlight-text'
                                            : 'border-border bg-background text-muted-foreground hover:border-highlight/40 hover:text-foreground'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{group.uts_uas} {group.ganjil_genap} {group.year}</span>
                                        </div>
                                        <ChevronRight size={12} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <div className="space-y-6">
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((item: DiktatItem, idx: number) => (
                                <div key={idx} className={`group flex flex-col border border-border rounded-xl overflow-hidden transition-all hover:border-highlight/50 ${isDarkMode ? 'bg-muted/20' : 'bg-background shadow-sm'}`}>
                                    <div className="h-32 bg-muted relative overflow-hidden flex items-center justify-center border-b border-border">
                                        {item.img ? (
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                        ) : (
                                            <FileText size={48} className="text-highlight/20" />
                                        )}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                            {item.major.map((m: string) => (
                                                <span key={m} className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-background/80 backdrop-blur border border-border text-foreground">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-sm mb-6 flex-1 line-clamp-2 text-foreground">{item.name}</h3>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Info size={12} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">DRIVE_FILE</span>
                                            </div>
                                            <a
                                                href={item.googleDriveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-highlight text-[9px] font-black uppercase tracking-[0.1em] hover:underline"
                                            >
                                                <span>Download</span>
                                                <Download size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
                            <Info size={32} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No matching records found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
