"use client";

import React, { useState } from 'react';
import { FilterSelector } from '../components/FilterSelector';
import { useTheme } from '../lib/ThemeContext';
import {
    getLatestData,
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

    const latest = getLatestData(initialData);
    if (!latest) return <div className={`p-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data diktat tersedia</div>;

    const filtered = filterContent(latest.content, selectedYear, selectedMajor);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className={`text-3xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-1`}>Kumpulan Diktat</h1>
                <p className={`text-sm font-sans ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Semester {latest.year} • {latest.ganjil_genap.toUpperCase()}
                </p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length > 0 ? (
                    filtered.map((item: DiktatItem, idx: number) => (
                        <div key={idx} className={`${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-200'} rounded-xl border flex flex-col overflow-hidden`}>
                            <div className={`h-24 ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#00B8D4] to-[#001B55]'}`}></div>
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {item.major.map((m: string) => (
                                            <span key={m} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDarkMode ? 'bg-[#001B55] text-[#00B8D4]' : 'bg-gray-100 text-[#001B55]'}`}>
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className={`font-bold text-lg font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-4 leading-snug`}>{item.name}</h3>
                                </div>
                                <a
                                    href={item.googleDriveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full ${isDarkMode ? 'bg-[#00B8D4] hover:bg-[#00D4FF]' : 'bg-[#001B55] hover:bg-[#002A83]'} text-white px-4 py-2.5 rounded-lg transition font-sans font-bold text-sm text-center`}
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`col-span-full py-20 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tidak ada data.</div>
                )}
            </div>
        </div>
    );
}
