"use client";

import React, { useState, useMemo, memo } from 'react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import { Archive, FileText, Download, Search, Info, ChevronDown } from 'lucide-react';
import { BackgroundDecorations } from '../components/home/BackgroundDecorations';
import {
    filterContent,
    DiktatData,
    DiktatItem
} from '../lib/dataUtils';

interface DiktatClientProps {
    initialData: DiktatData[];
}

const DiktatThumbnail = memo(({ item, isDarkMode }: { item: DiktatItem, isDarkMode: boolean }) => {
    const placeholderImg = useMemo(() => {
        const placeholders = [
            '/placeholder_img/img_placeholder_1.svg',
            '/placeholder_img/img_placeholder_2.svg',
            '/placeholder_img/img_placeholder_3.svg',
            '/placeholder_img/img_placeholder_4.svg',
            '/placeholder_img/img_placeholder_5.svg',
        ];
        let hash = 0;
        for (let i = 0; i < item.name.length; i++) {
            hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return placeholders[Math.abs(hash) % placeholders.length];
    }, [item.name]);

    if (item.img) {
        return (
            <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden bg-muted/10">
            <img
                src={placeholderImg}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white/30 border-black/5'} backdrop-blur-md border`}>
                    <FileText size={18} className="text-foreground/60" />
                </div>
            </div>
        </div>
    );
});

DiktatThumbnail.displayName = 'DiktatThumbnail';

export default function DiktatClient({ initialData }: DiktatClientProps) {
    const { isDarkMode } = useTheme();
    const [selectedYear, setSelectedYear] = useState(1);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);

    // Memoize sorted data
    const sortedData = useMemo(() => {
        return [...initialData].sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (a.ganjil_genap !== b.ganjil_genap) {
                return a.ganjil_genap === 'ganjil' ? -1 : 1;
            }
            if (a.uts_uas !== b.uts_uas) {
                return b.uts_uas === 'uas' ? 1 : -1;
            }
            return 0;
        });
    }, [initialData]);

    const activeGroups = useMemo(() => sortedData.filter(d => d.is_active), [sortedData]);
    const archiveGroups = useMemo(() => sortedData.filter(d => !d.is_active), [sortedData]);

    const latestDiktatId = sortedData[0]?.id;
    const [activeGroupId, setActiveGroupId] = useState<string | undefined>(
        activeGroups.length > 0 ? activeGroups[0].id : latestDiktatId
    );

    const currentGroup = useMemo(() =>
        sortedData.find(d => d.id === activeGroupId) || sortedData[0]
        , [sortedData, activeGroupId]);

    const filtered = useMemo(() => {
        if (!currentGroup) return [];
        return filterContent(currentGroup.content, selectedYear, selectedMajor).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [currentGroup, selectedYear, selectedMajor, searchQuery]);

    if (!currentGroup) {
        return <div className={`p-24 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data diktat tersedia</div>;
    }

    return (
        <div className="relative min-h-screen">
            <BackgroundDecorations isDarkMode={isDarkMode} intensity="subtle" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Context Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-highlight-text mb-4">
                            <Archive size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bank Diktat</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            {currentGroup.uts_uas.toUpperCase()} {currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year}
                        </h1>
                        <p className="text-xs font-medium mt-2 text-muted-foreground">
                            Menampilkan <span className="text-foreground dark:text-white font-bold">{filtered.length}</span> dokumen untuk periode ini.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border">
                        {sortedData.slice(0, 3).map(g => (
                            <button
                                key={g.id}
                                onClick={() => setActiveGroupId(g.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeGroupId === g.id
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
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Cari</h4>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari dalam dokumen..."
                                    className="w-full bg-muted border border-border rounded-lg py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-highlight/50"
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
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Arsip Periode</h4>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-xs border font-sans font-bold bg-background text-foreground rounded-xl focus:ring-1 focus:ring-highlight focus:border-highlight outline-none cursor-pointer hover:border-highlight/40 ${isArchiveOpen ? 'border-highlight ring-1 ring-highlight' : 'border-border'}`}
                                    >
                                        <span>
                                            {archiveGroups.find(g => g.id === activeGroupId)
                                                ? (() => {
                                                    const group = archiveGroups.find(g => g.id === activeGroupId)!;
                                                    return `${group.uts_uas.toUpperCase()} ${group.ganjil_genap.toUpperCase()} ${group.year}`;
                                                })()
                                                : "Pilih Periode Arsip..."}
                                        </span>
                                        <ChevronDown size={14} className={`text-muted-foreground ${isArchiveOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isArchiveOpen && (
                                        <div className="mt-2 flex flex-col gap-2">
                                            {archiveGroups.map(group => (
                                                <button
                                                    key={group.id}
                                                    onClick={() => {
                                                        setActiveGroupId(group.id);
                                                        setIsArchiveOpen(false);
                                                        window.scrollTo({ top: 0 });
                                                    }}
                                                    className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-lg border ${activeGroupId === group.id
                                                        ? 'bg-highlight/10 border-highlight text-highlight-text'
                                                        : 'bg-muted/30 border-transparent hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-wide">
                                                        {group.uts_uas} {group.ganjil_genap} {group.year}
                                                    </span>
                                                    {activeGroupId === group.id && <div className="w-1.5 h-1.5 rounded-full bg-highlight"></div>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {filtered.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map((item: DiktatItem, idx: number) => (
                                    <a
                                        key={idx}
                                        href={item.googleDriveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex flex-col border border-border rounded-xl overflow-hidden hover:border-highlight/50 ${isDarkMode ? 'bg-muted/10' : 'bg-background shadow-sm'}`}
                                    >
                                        <div className="h-28 bg-muted/30 relative flex items-center justify-center border-b border-border">
                                            <DiktatThumbnail item={item} isDarkMode={isDarkMode} />
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {item.major.map((m: string) => (
                                                    <span key={m} className="px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border/50">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="font-bold text-xs mb-4 flex-1 line-clamp-2 text-foreground group-hover:text-highlight transition-colors leading-relaxed">{item.name}</h3>

                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Drive Link</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-highlight text-[8px] font-black uppercase tracking-widest">
                                                    <span>Get</span>
                                                    <Download size={10} />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
                                <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
                                    <Info size={32} className="mx-auto text-border mb-4" />
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tidak ada dokumen yang ditemukan.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
