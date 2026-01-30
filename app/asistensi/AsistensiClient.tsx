"use client";

import React, { useState } from 'react';
import { Calendar, List, Clock, User, Link as LinkIcon, Video, AlertCircle, Sparkles, Archive, ChevronRight, FileText, Search, Info, MapPin } from 'lucide-react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import {
    filterContent,
    AsistensiData,
    AsistensiItem
} from '../lib/dataUtils';

interface AsistensiClientProps {
    initialData: AsistensiData[];
}

export default function AsistensiClient({ initialData }: AsistensiClientProps) {
    const { isDarkMode } = useTheme();
    const [selectedYear, setSelectedYear] = useState(1);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Sort logic helper for chronological order (Descending)
    const academicSort = (data: AsistensiData[]) => {
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
    const latestAsistensiId = sortedData[0]?.id;

    const [activeGroupId, setActiveGroupId] = useState<string | undefined>(latestAsistensiId);

    const currentGroup = sortedData.find(d => d.id === activeGroupId) || sortedData[0];
    const archiveGroups = sortedData.filter(d => d.id !== activeGroupId);

    if (!currentGroup) return <div className={`p-24 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data asistensi tersedia</div>;

    const filtered = filterContent(currentGroup.content, selectedYear, selectedMajor).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                <div>
                    <div className="flex items-center gap-2 text-highlight-text mb-4">
                        <Calendar size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Index / Tutorial Sessions</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {currentGroup.uts_uas.toUpperCase()} {currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year} Schedule
                    </h1>
                    <p className="text-xs font-medium mt-2 text-muted-foreground">
                        Displaying <span className="text-foreground dark:text-white font-bold">{filtered.length}</span> upcoming or recorded sessions.
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border">
                    {sortedData.map(g => (
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
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Quick Filter</h4>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses..."
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
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Archive</h4>
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
                <div className="space-y-4">
                    {filtered.length > 0 ? (
                        filtered.map((item: AsistensiItem, idx: number) => (
                            <div key={idx} className={`group flex flex-col md:flex-row border border-border rounded-xl overflow-hidden transition-all hover:border-highlight/50 ${isDarkMode ? 'bg-muted/10' : 'bg-background shadow-sm'}`}>
                                <div className="p-6 flex-1">
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {item.major.map((m: string) => (
                                            <span key={m} className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                                                {m}
                                            </span>
                                        ))}
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-muted text-muted-foreground' : 'bg-highlight/10 text-highlight'}`}>
                                            YEAR {item.year.join(' ')}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold mb-6 text-foreground">{item.name}</h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Peer Tutor</p>
                                                <p className="text-xs font-bold">{item.person.map((p: any) => p.name).join(', ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                                <Clock size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Scheduled Time</p>
                                                <p className="text-xs font-bold text-highlight">
                                                    {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} @ {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`md:w-56 p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-2 ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'}`}>
                                    {item.zoomMeetingsLink && (
                                        <a href={item.zoomMeetingsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-all">
                                            <Video size={14} />
                                            Join Session
                                        </a>
                                    )}
                                    {item.recordingsLink && (
                                        <a href={item.recordingsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-background text-foreground text-[10px] font-black uppercase tracking-widest hover:border-highlight/20 transition-all">
                                            <LinkIcon size={14} />
                                            Watch Record
                                        </a>
                                    )}
                                    {!item.zoomMeetingsLink && !item.recordingsLink && (
                                        <div className="flex items-center justify-center gap-2 py-2.5 text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                                            <Info size={14} />
                                            Links Pending
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
                            <AlertCircle size={32} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No sessions found for this criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
