"use client";

import React from 'react';
import { getSemester } from '../lib/dataUtils';

interface FilterSelectorProps {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    selectedMajor: string;
    setSelectedMajor: (major: string) => void;
    ganjilGenap: string;
    isDarkMode: boolean;
}

export const FilterSelector = ({
    selectedYear,
    setSelectedYear,
    selectedMajor,
    setSelectedMajor,
    ganjilGenap,
    isDarkMode
}: FilterSelectorProps) => (
    <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[150px]">
            <label className={`block text-[10px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Semester</label>
            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={`w-full px-3 py-2 text-sm border font-sans font-medium appearance-none ${isDarkMode ? 'bg-[#001B55] border-[#0036A7] text-white' : 'bg-white border-gray-200 text-[#001B55]'} rounded-lg focus:ring-1 focus:ring-[#00B8D4] outline-none transition`}
            >
                <option value={1}>Semester {getSemester(1, ganjilGenap)}</option>
                <option value={2}>Semester {getSemester(2, ganjilGenap)}</option>
                <option value={3}>Semester {getSemester(3, ganjilGenap)}</option>
                <option value={4}>Semester {getSemester(4, ganjilGenap)}</option>
            </select>
        </div>
        <div className="flex-1 min-w-[150px]">
            <label className={`block text-[10px] font-bold uppercase mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prodi</label>
            <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className={`w-full px-3 py-2 text-sm border font-sans font-medium appearance-none ${isDarkMode ? 'bg-[#001B55] border-[#0036A7] text-white' : 'bg-white border-gray-200 text-[#001B55]'} rounded-lg focus:ring-1 focus:ring-[#00B8D4] outline-none transition`}
            >
                <option value="">Semua</option>
                <option value="elektro">Elektro</option>
                <option value="komputer">Komputer</option>
                <option value="biomedik">Biomedik</option>
            </select>
        </div>
    </div>
);
