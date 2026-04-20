"use client";

import React, { useState, useMemo, memo, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Link as LinkIcon,
    Video,
    AlertCircle,
    FileText,
    Search,
    Info,
    LayoutList,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    X,
    ExternalLink,
    PlayCircle,
    ChevronDown
} from 'lucide-react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import { BackgroundDecorations } from '../components/home/BackgroundDecorations';
import {
    filterContent,
    AsistensiData,
    AsistensiItem
} from '../lib/dataUtils';

interface AsistensiClientProps {
    initialData: AsistensiData[];
}

const CalendarView = memo(({ items, isDarkMode }: { items: AsistensiItem[], isDarkMode: boolean }) => {
    const [selectedItem, setSelectedItem] = useState<AsistensiItem | null>(null);
    const [currentDate, setCurrentDate] = useState(() => {
        if (items.length > 0) {
            return new Date(items[0].date);
        }
        return new Date();
    });

    // Auto-sync calendar view when items change (e.g. switching archive or applying filters)
    useEffect(() => {
        if (items.length > 0) {
            const firstDate = new Date(items[0].date);
            setCurrentDate(firstDate);
        }
    }, [items]);

    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        return new Date(d.setDate(diff));
    };

    const weekStart = startOfWeek(currentDate);
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) { // Sun-Sat
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            days.push(d);
        }
        return days;
    }, [weekStart]);

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    // Calculate relevant time range
    const { startHour, endHour, timeSlots } = useMemo(() => {
        const weekItems = items.filter(item => {
            const d = new Date(item.date);
            const ws = new Date(weekStart);
            const we = new Date(weekStart);
            we.setDate(we.getDate() + 7);
            return d >= ws && d < we;
        });

        if (weekItems.length === 0) {
            const defaultStart = 8;
            const defaultEnd = 17;
            const slots = [];
            for (let i = defaultStart; i <= defaultEnd; i++) {
                slots.push(`${i}.00`, `${i}.30`);
            }
            return { startHour: defaultStart, endHour: defaultEnd, timeSlots: slots };
        }

        let min = 23;
        let max = 0;
        weekItems.forEach(item => {
            const d = new Date(item.date);
            const h = d.getHours();
            if (h < min) min = h;
            if (h > max) max = h;
        });

        const s = Math.max(0, min - 1);
        const e = Math.min(23, max + 2); // Buffer for session duration
        const slots = [];
        for (let i = s; i <= e; i++) {
            slots.push(`${i}.00`, `${i}.30`);
        }
        return { startHour: s, endHour: e, timeSlots: slots };
    }, [items, weekStart]);

    const getItemsForDay = (date: Date) => {
        return items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getDate() === date.getDate() &&
                   itemDate.getMonth() === date.getMonth() &&
                   itemDate.getFullYear() === date.getFullYear();
        });
    };

    // Calculate position in grid based on dynamic startHour
    const getGridPosition = (dateValue: string | Date) => {
        const date = new Date(dateValue);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const totalMinutesFromStart = (hours - startHour) * 60 + minutes;
        // Each 30 mins = 1 grid row.
        return Math.max(1, (totalMinutesFromStart / 30) + 1);
    };

    // Assume average duration is 100 minutes if not specified, 
    // but we can try to find a duration if possible or use a default.
    const getGridSpan = () => {
        // Most asistensi sessions are ~1.5 to 2 hours
        return 3.33; // ~100 minutes (3.33 slots of 30 mins)
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Week Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 border border-border p-4 rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-highlight/10 text-highlight rounded-xl">
                        <CalendarDays size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-foreground leading-tight">
                            Minggu ke-{Math.ceil(currentDate.getDate() / 7)}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {monthNames[weekStart.getMonth()]} {weekStart.getFullYear()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevWeek} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:bg-muted rounded-xl transition-all border border-border text-[10px] font-black uppercase tracking-widest">
                        <ChevronLeft size={16} />
                        <span>Sebelumnya</span>
                    </button>
                    <button onClick={nextWeek} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:bg-muted rounded-xl transition-all border border-border text-[10px] font-black uppercase tracking-widest">
                        <span>Berikutnya</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="relative border border-border rounded-xl md:rounded-2xl overflow-hidden bg-background shadow-xl">
                <div className="">
                    <div className="grid grid-cols-[50px_repeat(7,1fr)] w-full">
                        {/* Empty top-left corner */}
                        <div className="bg-muted/50 border-b border-r border-border py-1 px-2 flex items-center justify-center">
                            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Jam</span>
                        </div>

                        {/* Day Headers */}
                        {weekDays.map((day, idx) => {
                            const isToday = new Date().toDateString() === day.toDateString();
                            return (
                                <div 
                                    key={idx} 
                                    className={`py-1.5 px-0.5 text-center border-b border-r border-border last:border-r-0 ${
                                        isToday ? 'bg-highlight/5' : 'bg-muted/30'
                                    }`}
                                >
                                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] block mb-0 ${
                                        isToday ? 'text-highlight' : 'text-muted-foreground'
                                    }`}>
                                        {dayNames[idx]}
                                    </span>
                                    <span className={`text-sm md:text-base font-black ${
                                        isToday ? 'text-highlight' : 'text-foreground'
                                    }`}>
                                        {day.getDate()}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Grid Body */}
                        <div className="relative col-span-8">
                            <div 
                                className="grid grid-cols-[50px_repeat(7,1fr)]"
                                style={{ 
                                    gridTemplateRows: `repeat(${timeSlots.length}, 28px)` 
                                }}
                            >
                                {/* Time Labels & Grid Lines */}
                                {timeSlots.map((time, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="border-r border-b border-border bg-muted/10 px-1 py-0.5 text-right flex items-center justify-end">
                                            <span className={`text-[8px] md:text-[10px] font-bold ${idx % 2 === 0 ? 'text-foreground/70' : 'text-muted-foreground/30'}`}>
                                                {time}
                                            </span>
                                        </div>
                                        {[...Array(7)].map((_, dayIdx) => (
                                            <div 
                                                key={dayIdx} 
                                                className={`border-r border-b border-border/30 last:border-r-0 ${
                                                    idx % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                                                }`}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Events (Absolute Positioned over Grid) */}
                                <div className="absolute inset-0 pointer-events-none p-px">
                                    <div className="grid grid-cols-[50px_repeat(7,1fr)] h-full w-full">
                                        <div className="col-start-1" /> {/* Reserved for time labels */}
                                        
                                        {weekDays.map((day, dayIdx) => (
                                            <div key={dayIdx} className="relative h-full border-r border-border/0 last:border-r-0">
                                                {getItemsForDay(day).map((item, i) => {
                                                    const rowStart = getGridPosition(item.date);
                                                    const rowSpan = getGridSpan();
                                                    
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => setSelectedItem(item)}
                                                            className="absolute left-[2px] right-[2px] rounded-lg p-2 shadow-md border-l-4 pointer-events-auto transition-all hover:scale-[1.05] hover:z-20 cursor-pointer group active:scale-95"
                                                            style={{
                                                                top: `${(rowStart - 1) * 28}px`,
                                                                height: `${rowSpan * 28}px`,
                                                                backgroundColor: isDarkMode ? 'rgba(0, 42, 131, 0.85)' : 'rgba(224, 247, 250, 0.95)',
                                                                borderColor: '#00b4d4',
                                                                backdropFilter: 'blur(10px)',
                                                            }}
                                                        >
                                                            <div className="flex flex-col h-full overflow-hidden">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <div className="p-0.5 bg-highlight/20 text-highlight rounded">
                                                                        <Clock size={10} />
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-highlight uppercase tracking-widest whitespace-nowrap">
                                                                        {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-xs font-black text-foreground line-clamp-3 leading-tight mb-1 group-hover:text-highlight transition-colors">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-[10px] font-bold text-muted-foreground/80 flex items-center gap-1 mt-auto">
                                                                    <User size={10} />
                                                                    <span className="truncate">{item.person[0]?.name}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend / Info */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-highlight"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hari Ini</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent border border-accent/20"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sesi Terjadwal</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-muted-foreground/50">
                    <Info size={14} />
                    <span className="text-[9px] font-medium italic">Klik sesi untuk detail atau rotasi ke horizontal di mobile.</span>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    <div 
                        className="bg-background border-2 border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Simple Modal Header */}
                        <div className="bg-muted p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-foreground">
                                <CalendarDays size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">Detail Sesi</span>
                            </div>
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="p-2 hover:bg-background/50 text-foreground rounded-lg transition-colors border border-border"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-foreground leading-tight">
                                    {selectedItem.name}
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedItem.major.map((m, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {m}
                                        </span>
                                    ))}
                                    {selectedItem.year.map((y, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-highlight text-foreground text-[10px] font-black uppercase tracking-widest rounded-md">
                                            Angkatan {y}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Waktu</span>
                                    </div>
                                    <p className="font-black text-foreground">
                                        {new Date(selectedItem.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                    </p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Tanggal</span>
                                    </div>
                                    <p className="font-black text-foreground">
                                        {new Date(selectedItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                    <User size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Pengajar</span>
                                </div>
                                <div className="space-y-3">
                                    {selectedItem.person.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                                            <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center font-black">
                                                {p.name.charAt(0)}
                                            </div>
                                            <p className="font-bold text-foreground">{p.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <a 
                                    href={selectedItem.zoomMeetingsLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-4 bg-highlight text-foreground font-black rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-lg shadow-highlight/10"
                                >
                                    <ExternalLink size={18} />
                                    <span>Buka Zoom</span>
                                </a>
                                <a 
                                    href={selectedItem.recordingsLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-4 bg-muted text-foreground border border-border font-black rounded-2xl hover:bg-muted/80 active:scale-95 transition-all"
                                >
                                    <PlayCircle size={18} />
                                    <span>Rekaman</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

CalendarView.displayName = 'CalendarView';

export default function AsistensiClient({ initialData }: AsistensiClientProps) {
    const { isDarkMode } = useTheme();
    const [selectedYear, setSelectedYear] = useState(1);
    const [selectedMajor, setSelectedMajor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    // Sort logic helper for chronological order (Descending)
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

    const latestAsistensiId = sortedData[0]?.id;
    const [activeGroupId, setActiveGroupId] = useState<string | undefined>(latestAsistensiId);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);

    const activeGroups = useMemo(() => sortedData.slice(0, 3), [sortedData]);
    const archiveGroups = useMemo(() => sortedData.slice(3), [sortedData]);

    const currentGroup = useMemo(() =>
        sortedData.find(d => d.id === activeGroupId) || sortedData[0]
        , [sortedData, activeGroupId]);

    if (!currentGroup) return <div className={`p-24 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data asistensi tersedia</div>;

    const filtered = useMemo(() => {
        return filterContent(currentGroup.content, selectedYear, selectedMajor).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [currentGroup, selectedYear, selectedMajor, searchQuery]);

    return (
        <div className="relative min-h-screen">
            <BackgroundDecorations isDarkMode={isDarkMode} intensity="subtle" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Context Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-highlight-text mb-4">
                            <Calendar size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Indeks / Sesi Tutorial</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            Jadwal {currentGroup.uts_uas.toUpperCase()} {currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year}
                        </h1>
                        <p className="text-xs font-medium mt-2 text-muted-foreground">
                            Menampilkan <span className="text-foreground dark:text-white font-bold">{filtered.length}</span> sesi mendatang atau rekaman yang tersedia.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex p-1 rounded-xl bg-muted border border-border">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-highlight' : 'text-muted-foreground hover:text-foreground'}`}
                                title="List View"
                            >
                                <LayoutList size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-background shadow-sm text-highlight' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Calendar View"
                            >
                                <CalendarDays size={18} />
                            </button>
                        </div>

                    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border">
                        {activeGroups.map(g => (
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
                </div>

                <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                    {/* Sidebar Filters */}
                    <aside className="space-y-8 h-fit lg:sticky lg:top-24">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Filter Cepat</h4>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari mata kuliah..."
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
                                        <div className="mt-2 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
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
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
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
                    <div className="min-w-0">
                        {viewMode === 'list' ? (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                {filtered.length > 0 ? (
                                    filtered.map((item: AsistensiItem, idx: number) => (
                                        <div key={idx} className={`group flex flex-col md:flex-row border border-border rounded-xl overflow-hidden ${isDarkMode ? 'bg-muted/10' : 'bg-background shadow-sm'}`}>
                                            <div className="p-6 flex-1">
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {item.major.map((m: string) => (
                                                        <span key={m} className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                                                            {m}
                                                        </span>
                                                    ))}
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-muted text-muted-foreground' : 'bg-highlight/10 text-highlight'}`}>
                                                        TAHUN {item.year.join(' ')}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold mb-6 text-foreground">{item.name}</h3>

                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                                            <User size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pengasis</p>
                                                            <p className="text-xs font-bold">{item.person.map((p: any) => p.name).join(', ')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                                                            <Clock size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Waktu Terjadwal</p>
                                                            <p className="text-xs font-bold text-highlight">
                                                                {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} @ {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`md:w-56 p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-2 ${isDarkMode ? 'bg-muted/30' : 'bg-muted/50'}`}>
                                                {item.zoomMeetingsLink && (
                                                    <a href={item.zoomMeetingsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/90">
                                                        <Video size={14} />
                                                        Gabung Sesi
                                                    </a>
                                                )}
                                                {item.recordingsLink && (
                                                    <a href={item.recordingsLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-background text-foreground text-[10px] font-black uppercase tracking-widest hover:border-highlight/20">
                                                        <LinkIcon size={14} />
                                                        Tonton Rekaman
                                                    </a>
                                                )}
                                                {!item.zoomMeetingsLink && !item.recordingsLink && (
                                                    <div className="flex items-center justify-center gap-2 py-2.5 text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                                                        <Info size={14} />
                                                        Link Belum Tersedia
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
                                        <AlertCircle size={32} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tidak ada sesi yang ditemukan untuk kriteria ini.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <CalendarView items={filtered} isDarkMode={isDarkMode} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
