"use client";

import React, { useState } from 'react';
import { Calendar, List, Clock, User, Link as LinkIcon, Video } from 'lucide-react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import {
    getLatestData,
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

    const latest = getLatestData(initialData);
    if (!latest) return <div className={`p-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data asistensi tersedia</div>;

    const filtered = filterContent(latest.content, selectedYear, selectedMajor);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className={`text-3xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-1`}>Jadwal Asistensi</h1>
                    <p className={`text-sm font-sans ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Semester {latest.year} • {latest.ganjil_genap.toUpperCase()}
                    </p>
                </div>
                <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-[#001B55] border border-[#0036A7]' : 'bg-gray-100 border border-gray-200'}`}>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-[#00B8D4] text-[#001B55]' : 'bg-white text-[#001B55] shadow-sm') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
                    >
                        <List size={16} />
                        <span className="text-xs font-bold">List</span>
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${viewMode === 'calendar' ? (isDarkMode ? 'bg-[#00B8D4] text-[#001B55]' : 'bg-white text-[#001B55] shadow-sm') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
                    >
                        <Calendar size={16} />
                        <span className="text-xs font-bold">Calendar</span>
                    </button>
                </div>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-200'} border mb-10`}>
                <FilterSelector
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMajor={selectedMajor}
                    setSelectedMajor={setSelectedMajor}
                    ganjilGenap={latest.ganjil_genap}
                    isDarkMode={isDarkMode}
                />
            </div>

            {viewMode === 'list' ? (
                <div className="grid gap-3">
                    {filtered.length > 0 ? (
                        filtered.map((item: AsistensiItem, idx: number) => (
                            <div key={idx} className={`${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-200'} p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                                <div className="flex-1">
                                    <div className="flex gap-1.5 mb-2">
                                        {item.major.map((m: string) => (
                                            <span key={m} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDarkMode ? 'bg-[#001B55] text-[#00B8D4]' : 'bg-gray-100 text-[#001B55]'}`}>
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className={`font-bold text-lg font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-2`}>{item.name}</h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-sans">
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} />
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{item.person.map((p: { name: string }) => p.name).join(', ')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} />
                                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    {item.zoomMeetingsLink && (
                                        <a href={item.zoomMeetingsLink} target="_blank" rel="noopener noreferrer" className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition ${isDarkMode ? 'bg-[#00B8D4] text-[#001B55]' : 'bg-[#E0F7FA] text-[#001B55]'}`}>
                                            <Video size={14} />
                                            Zoom
                                        </a>
                                    )}
                                    {item.recordingsLink && (
                                        <a href={item.recordingsLink} target="_blank" rel="noopener noreferrer" className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#001B55] text-white hover:bg-[#002A83]'}`}>
                                            <LinkIcon size={14} />
                                            Recording
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`py-20 text-center border-2 border-dashed ${isDarkMode ? 'border-gray-100/10' : 'border-gray-200'} rounded-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Tidak ada jadwal.
                        </div>
                    )}
                </div>
            ) : (
                <div className={`${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-200'} p-12 rounded-xl border text-center`}>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>Calendar view coming soon</p>
                </div>
            )}
        </div>
    );
}
