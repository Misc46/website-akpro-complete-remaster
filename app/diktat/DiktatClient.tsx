"use client";

import React, { useState } from 'react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import { Archive, ChevronRight, FileText, Sparkles, Download } from 'lucide-react';
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

    const filtered = filterContent(currentGroup.content, selectedYear, selectedMajor);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header section */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B8D4]/10 border border-[#00B8D4]/20 mb-4">
                            <Sparkles size={12} className="text-[#00B8D4]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00B8D4]">Repository Resmi</span>
                        </div>
                        <h1 className={`text-4xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} tracking-tight`}>
                            Kumpulan Diktat
                        </h1>
                        <p className={`text-sm font-sans font-medium mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Persiapan <span className="text-[#00B8D4] font-bold">{currentGroup.uts_uas.toUpperCase()}</span> semester <span className="text-[#00B8D4] font-bold">{currentGroup.ganjil_genap.toUpperCase()} {currentGroup.year}</span>
                        </p>
                    </div>

                    {/* Active Selector Bar - refined */}
                    <div className={`flex flex-wrap gap-1.5 p-1.5 rounded-2xl ${isDarkMode ? 'bg-[#001B55] border border-[#0036A7]/50' : 'bg-gray-100 border border-gray-200'} shadow-inner`}>
                        {(activeGroups.length > 0 ? activeGroups : sortedData.slice(0, 3)).map(g => (
                            <button
                                key={g.id}
                                onClick={() => setActiveGroupId(g.id)}
                                className={`relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeGroupId === g.id
                                    ? 'bg-[#00B8D4] text-[#001B55] shadow-lg shadow-[#00B8D4]/20'
                                    : (isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-[#001B55]')}`}
                            >
                                {g.id === latestDiktatId && <Sparkles size={12} className={activeGroupId === g.id ? 'text-[#001B55]' : 'text-[#00B8D4]'} />}
                                {g.uts_uas} {g.ganjil_genap} {g.year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Filter Panel - slightly toned down */}
                <div className={`p-8 rounded-[2rem] ${isDarkMode ? 'bg-gradient-to-br from-[#002A83] to-[#001B55] border-[#0036A7]' : 'bg-white border-gray-100 shadow-xl shadow-[#00B8D4]/5'} border shadow-2xl transition-all duration-500`}>
                    <FilterSelector
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        selectedMajor={selectedMajor}
                        setSelectedMajor={setSelectedMajor}
                        ganjilGenap={currentGroup.ganjil_genap}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>

            {/* Results Grid - toned down corners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {filtered.length > 0 ? (
                    filtered.map((item: DiktatItem, idx: number) => (
                        <div key={idx} className={`group ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-100 shadow-md'} rounded-[2rem] border flex flex-col overflow-hidden hover:shadow-2xl hover:border-[#00B8D4]/50 transition-all duration-500`}>
                            <div className={`h-28 relative overflow-hidden`}>
                                <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#00B8D4] to-[#001B55]'}`}></div>
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute top-6 left-6">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.major.map((m: string) => (
                                            <span key={m} className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10`}>
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className={`font-bold text-xl font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-8 leading-tight group-hover:text-[#00B8D4] transition-colors h-14 line-clamp-2`}>{item.name}</h3>

                                <a
                                    href={item.googleDriveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full flex items-center justify-center gap-3 ${isDarkMode ? 'bg-[#00B8D4] text-[#001B55]' : 'bg-[#001B55] text-white'} px-6 py-4 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest group/btn shadow-lg hover:shadow-[#00B8D4]/20`}
                                >
                                    <Download size={16} className="group-hover/btn:-translate-y-1 transition-transform" />
                                    <span>Unduh Materi</span>
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`col-span-full py-32 text-center rounded-[2rem] border-2 border-dashed ${isDarkMode ? 'border-[#0036A7] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                        <p className="font-bold text-lg">Materi tidak ditemukan.</p>
                    </div>
                )}
            </div>

            {/* Archive Section - refined */}
            {archiveGroups.length > 0 && (
                <div className="border-t border-[#00B8D4]/10 pt-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[#00B8D4]/10 flex items-center justify-center text-[#00B8D4]">
                            <Archive size={20} />
                        </div>
                        <h2 className={`text-2xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>Arsip Diktat</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        <p className="text-[9px] opacity-60 font-bold mt-0.5">Academic Year {group.year}</p>
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
