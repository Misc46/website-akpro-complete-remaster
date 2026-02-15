"use client";

import React, { useState, useMemo, memo } from 'react';
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
    ChevronRight
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
    const [currentDate, setCurrentDate] = useState(() => {
        if (items.length > 0) {
            return new Date(items[0].date);
        }
        return new Date();
    });

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const calendarDays = useMemo(() => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        // Padding for previous month
        const prevMonthTotalDays = daysInMonth(year, month - 1);
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthTotalDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthTotalDays - i) });
        }

        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }

        // Padding for next month
        const remainingCells = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
        }

        return days;
    }, [year, month]);

    const getItemsForDay = (date: Date) => {
        return items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getDate() === date.getDate() &&
                itemDate.getMonth() === date.getMonth() &&
                itemDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-muted/30 border border-border p-4 rounded-xl">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg transition-colors border border-border">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors border border-border">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-xl overflow-hidden shadow-sm">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="bg-muted/50 p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                        {day}
                    </div>
                ))}

                {calendarDays.map((dateObj, idx) => {
                    const dayItems = getItemsForDay(dateObj.date);
                    const isToday = new Date().toDateString() === dateObj.date.toDateString();

                    return (
                        <div
                            key={idx}
                            className={`min-h-[120px] p-2 transition-colors ${dateObj.currentMonth
                                    ? (isDarkMode ? 'bg-muted/5' : 'bg-background')
                                    : (isDarkMode ? 'bg-muted/10 opacity-40' : 'bg-muted/20 opacity-50')
                                } ${isToday ? 'ring-1 ring-inset ring-highlight/50' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-[10px] font-bold ${isToday ? 'bg-highlight text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-muted-foreground'
                                    }`}>
                                    {dateObj.day}
                                </span>
                                {dayItems.length > 0 && (
                                    <span className="text-[8px] font-black bg-highlight/10 text-highlight px-1.5 py-0.5 rounded">
                                        {dayItems.length} Sesi
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                {dayItems.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-1.5 rounded bg-muted/40 border border-border/50 text-[9px] font-bold leading-tight line-clamp-2 hover:border-highlight/30 transition-colors cursor-default"
                                        title={item.name}
                                    >
                                        <div className="flex items-center gap-1 text-[8px] opacity-60 mb-0.5">
                                            <Clock size={8} />
                                            {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-highlight"></div>
                    <span>Hari Ini</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded bg-muted/40 border border-border/50"></div>
                    <span>Sesi Terjadwal</span>
                </div>
            </div>
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

    const currentGroup = useMemo(() =>
        sortedData.find(d => d.id === activeGroupId) || sortedData[0]
        , [sortedData, activeGroupId]);

    const archiveGroups = useMemo(() =>
        sortedData.filter(d => d.id !== activeGroupId)
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
                            {sortedData.map(g => (
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
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Arsip</h4>
                                <div className="grid gap-2">
                                    {archiveGroups.map(group => (
                                        <button
                                            key={group.id}
                                            onClick={() => {
                                                setActiveGroupId(group.id);
                                                window.scrollTo({ top: 0 });
                                            }}
                                            className={`flex items-center justify-between p-3 rounded-lg border text-left ${activeGroupId === group.id
                                                ? 'bg-highlight/10 border-highlight text-highlight-text'
                                                : 'border-border bg-background text-muted-foreground hover:border-highlight/40 hover:text-foreground'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{group.uts_uas} {group.ganjil_genap} {group.year}</span>
                                            </div>
                                        </button>
                                    ))}
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
