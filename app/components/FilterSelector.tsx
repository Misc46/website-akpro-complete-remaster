"use client";

import React from 'react';
import { getSemester } from '../lib/dataUtils';
import { ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col gap-4">
        <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground/80">Semester Level</label>
            <div className="relative">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs border border-border font-sans font-bold appearance-none bg-background text-foreground rounded-lg focus:ring-1 focus:ring-highlight focus:border-highlight outline-none transition-all cursor-pointer hover:border-highlight/40"
                >
                    <option value={1}>Semester {getSemester(1, ganjilGenap)}</option>
                    <option value={2}>Semester {getSemester(2, ganjilGenap)}</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
        </div>
        <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground/80">Study Program</label>
            <div className="relative">
                <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-border font-sans font-bold appearance-none bg-background text-foreground rounded-lg focus:ring-1 focus:ring-highlight focus:border-highlight outline-none transition-all cursor-pointer hover:border-highlight/40"
                >
                    <option value="">All Programs</option>
                    <option value="elektro">Teknik Elektro</option>
                    <option value="komputer">Teknik Komputer</option>
                    <option value="biomedik">Teknik Biomedik</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
        </div>
    </div>
);
