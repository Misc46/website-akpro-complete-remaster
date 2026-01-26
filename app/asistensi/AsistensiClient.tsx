"use client";

import React, { useState } from 'react';
import { Calendar, List, Clock, User, Link as LinkIcon, Video, AlertCircle, Sparkles, Archive, ChevronRight, FileText } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState('list');

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

    // For Asistensi, we use all sorted data but highlight the latest
    // Unlike Diktat, Asistensi often doesn't have an "active" flag in the same way, 
    // but the user wants it "the same as diktat". 
    // If we want it EXACTLY the same, we check for an active flag or just show the latest 3.
    // I'll assume we show the latest period as primary and others as archive.

    const [activeGroupId, setActiveGroupId] = useState<string | undefined>(latestAsistensiId);

    const currentGroup = sortedData.find(d => d.id === activeGroupId) || sortedData[0];
    const archiveGroups = sortedData.filter(d => d.id !== activeGroupId);

    if (!currentGroup) return <div className={`p-24 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data asistensi tersedia</div>;

    const filtered = filterContent(currentGroup.content, selectedYear, selectedMajor);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B8D4]/10 border border-[#00B8D4]/20 mb-4">
                        <Sparkles size={12} className="text-[#00B8D4]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00B8D4]">Jadwal Akademik</span>
                    </div>
                    <h1 className={`text-4xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} tracking-tight`}>Jadwal Asistensi</h1>
                    <p className={`text-sm font-sans font-medium mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mendukung pemahaman materi <span className="text-[#00B8D4] font-bold">{currentGroup.uts_uas.toUpperCase()}</span> semester <span className="text-[#00B8D4] font-bold">{currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year}</span>
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className={`flex p-1.5 rounded-2xl ${isDarkMode ? 'bg-[#001B55] border border-[#0036A7]/50' : 'bg-gray-100 border border-gray-200'} shadow-inner`}>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list' ? (isDarkMode ? 'bg-[#00B8D4] text-[#001B55] shadow-lg shadow-[#00B8D4]/20' : 'bg-white text-[#001B55] shadow-md') : (isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-[#001B55]')}`}
                        >
                            <List size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${viewMode === 'calendar' ? (isDarkMode ? 'bg-[#00B8D4] text-[#001B55] shadow-lg shadow-[#00B8D4]/20' : 'bg-white text-[#001B55] shadow-md') : (isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-[#001B55]')}`}
                        >
                            <Calendar size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Grid</span>
                        </button>
                    </div>

                    {/* Period Switcher (Same as Diktat) */}
                    <div className="flex flex-wrap justify-end gap-1.5 ">
                        {sortedData.slice(0, 3).map(g => (
                            <button
                                key={g.id}
                                onClick={() => setActiveGroupId(g.id)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeGroupId === g.id
                                    ? 'bg-[#00B8D4]/20 text-[#00B8D4] border border-[#00B8D4]/50'
                                    : (isDarkMode ? 'bg-[#001B55] text-gray-500 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-[#001B55]')}`}
                            >
                                {g.uts_uas} {g.year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-gradient-to-br from-[#002A83] to-[#001B55] border-[#0036A7]' : 'bg-white border-gray-100 shadow-xl shadow-[#00B8D4]/5'} border shadow-2xl mb-12`}>
                <FilterSelector
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMajor={selectedMajor}
                    setSelectedMajor={setSelectedMajor}
                    ganjilGenap={currentGroup.ganjil_genap}
                    isDarkMode={isDarkMode}
                />
            </div>

            {viewMode === 'list' ? (
                <div className="grid gap-6 mb-24">
                    {filtered.length > 0 ? (
                        filtered.map((item: AsistensiItem, idx: number) => (
                            <div key={idx} className={`group ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-100 hover:border-[#00B8D4]/50 shadow-sm'} p-8 rounded-[2rem] border flex flex-col lg:flex-row justify-between lg:items-center gap-8 transition-all duration-500 hover:shadow-2xl`}>
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.major.map((m: string) => (
                                            <span key={m} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#001B55] text-[#00B8D4]' : 'bg-gray-100 text-[#001B55]'}`}>
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className={`font-bold text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-6 group-hover:text-[#00B8D4] transition-colors`}>{item.name}</h3>

                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#00B8D4]/10 flex items-center justify-center text-[#00B8D4]">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00B8D4]">Asisten</p>
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.person.map((p: { name: string }) => p.name).join(', ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#00B8D4]/10 flex items-center justify-center text-[#00B8D4]">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#00B8D4]">Waktu & Tanggal</p>
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap sm:flex-nowrap gap-4 shrink-0 lg:pt-0 pt-4 border-t lg:border-t-0 border-[#00B8D4]/10">
                                    {item.zoomMeetingsLink && (
                                        <a href={item.zoomMeetingsLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isDarkMode ? 'bg-[#00B8D4] text-[#001B55] shadow-lg shadow-[#00B8D4]/20' : 'bg-[#E0F7FA] text-[#001B55] hover:bg-[#00B8D4]'}`}>
                                            <Video size={18} />
                                            Sesi Zoom
                                        </a>
                                    )}
                                    {item.recordingsLink && (
                                        <a href={item.recordingsLink} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isDarkMode ? 'bg-[#001B55] border border-[#0036A7] text-white hover:bg-[#0036A7]' : 'bg-[#001B55] text-white hover:bg-[#002A83]'}`}>
                                            <LinkIcon size={18} />
                                            Rekaman
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`py-32 text-center border-2 border-dashed ${isDarkMode ? 'border-[#0036A7]' : 'border-gray-200'} rounded-[3rem] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <div className="mb-4 flex justify-center opacity-20">
                                <AlertCircle size={64} />
                            </div>
                            <p className="font-bold text-lg">Belum ada jadwal asistensi tersedia untuk kriteria ini.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {filtered.length > 0 ? (
                        filtered.map((item: AsistensiItem, idx: number) => (
                            <div key={idx} className={`group ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-100 shadow-md'} rounded-[2.5rem] border flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500`}>
                                <div className={`h-28 relative ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#00B8D4] to-[#001B55]'}`}>
                                    <div className="absolute top-6 left-6 flex gap-1.5 flex-wrap">
                                        {item.major.map((m: string) => (
                                            <span key={m} className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20`}>
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className={`font-black text-xl font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-6 group-hover:text-[#00B8D4] transition-colors line-clamp-2 h-16`}>{item.name}</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <User size={16} className="text-[#00B8D4]" />
                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.person[0].name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-[#00B8D4]" />
                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-[#00B8D4]/10 flex gap-4">
                                        {item.zoomMeetingsLink && (
                                            <a href={item.zoomMeetingsLink} target="_blank" className={`flex-1 flex items-center justify-center p-3 rounded-xl ${isDarkMode ? 'bg-[#00B8D4]/10 text-[#00B8D4]' : 'bg-gray-100 text-[#001B55]'} hover:bg-[#00B8D4] hover:text-[#001B55] transition-all duration-300`}>
                                                <Video size={18} />
                                            </a>
                                        )}
                                        {item.recordingsLink && (
                                            <a href={item.recordingsLink} target="_blank" className={`flex-1 flex items-center justify-center p-3 rounded-xl ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-[#001B55]'} hover:bg-[#001B55] hover:text-white transition-all duration-300`}>
                                                <LinkIcon size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">Tidak ada data.</div>
                    )}
                </div>
            )}

            {/* Archive Section for Asistensi */}
            {archiveGroups.length > 0 && (
                <div className="border-t border-[#00B8D4]/10 pt-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[#00B8D4]/10 flex items-center justify-center text-[#00B8D4]">
                            <Archive size={20} />
                        </div>
                        <h2 className={`text-2xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>Arsip Asistensi</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {archiveGroups.map(group => (
                            <button
                                key={group.id}
                                onClick={() => {
                                    setActiveGroupId(group.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${activeGroupId === group.id
                                    ? 'bg-[#00B8D4]/10 border-[#00B8D4] text-[#00B8D4]'
                                    : (isDarkMode ? 'bg-[#002A83] border-[#0036A7] text-gray-400 hover:border-[#00B8D4]/50' : 'bg-white border-gray-100 text-[#001B55] hover:border-[#00B8D4]/30')}`}
                            >
                                <div className="flex items-center gap-4">
                                    <FileText size={18} className={activeGroupId === group.id ? 'text-[#00B8D4]' : 'text-gray-500 group-hover:text-[#00B8D4] transition-colors'} />
                                    <div className="text-left">
                                        <p className="font-black text-[10px] uppercase tracking-[0.2em]">{group.uts_uas} {group.ganjil_genap}</p>
                                        <p className="text-[9px] opacity-60 font-bold mt-0.5">{group.year}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className={`transition-transform duration-300 ${activeGroupId === group.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
