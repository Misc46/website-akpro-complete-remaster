"use client";

import React, { useState } from 'react';
import { Calendar, BookOpen, Users, ChevronRight, ArrowRight, ArrowUpRight, Star, FileText, Youtube, Layout, FolderOpen, ChevronDown, ExternalLink, Search, Archive, GraduationCap, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './lib/ThemeContext';

export default function HomePageClient() {
    const { isDarkMode } = useTheme();
    const [activeCategory, setActiveCategory] = useState('transisi');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        {
            id: 'transisi',
            label: 'Transisi Kurikulum',
            isGrouped: true,
            groups: [
                {
                    name: 'Teknik Elektro',
                    links: [
                        { title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1FllbkS93HozAnkxucC3njZFyogbafZ6U/view?usp=sharing' },
                        { title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1wrORAn5yPMr3ANLlYJjNgBqtkjMBoaPw/edit?usp=sharing' }
                    ]
                },
                {
                    name: 'Teknik Komputer',
                    links: [
                        { title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1BazEeK_Djk-72pOcavnGf5uan7ZqrMRY/view' },
                        { title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1xIXdrp50kvbGevwgBTDAgKUvwDmOZFur/edit?usp=sharing' }
                    ]
                },
                {
                    name: 'Teknik Biomedik',
                    links: [
                        { title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1OrONufdYmcRokcZoOu3JU7jJ6dapY-Tq/view?usp=sharing' },
                        { title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1QXGqhLqapza_Iuqha61qBjEVci083vcb/edit?usp=sharing' }
                    ]
                }
            ]
        },
        {
            id: 'akademis',
            label: 'Akademis DTE',
            links: [
                { title: 'Kalender FTUI', description: 'Genap 2025/2026', href: 'https://drive.google.com/file/d/1AT30fW77EQTK3WBDl0rMtbRzDaHzKsIF/view?usp=sharing', icon: Calendar },
                { title: 'MBKM 2024', description: 'Recording Sosialisasi', href: 'https://youtu.be/5YZFkQfC-7g?si=GsUDP0jHBv89PTI2', icon: Youtube },
                { title: 'Buku EE', description: 'Kurikulum Elektro', href: 'https://online.pubhtml5.com/sstc/yjeo/', icon: BookOpen },
                { title: 'Buku CE', description: 'Kurikulum Komputer', href: 'https://online.pubhtml5.com/sstc/kcli/', icon: BookOpen },
                { title: 'Buku BME', description: 'Kurikulum Biomedik', href: 'https://online.pubhtml5.com/sstc/swrt/', icon: BookOpen },
            ]
        },
        {
            id: 'media',
            label: 'Media Belajar',
            links: [
                { title: 'DTE E-book', description: 'Kumpulan E-book Mata Kuliah', href: 'https://drive.google.com/drive/folders/1VJlvzJXKLQNutvG_ieRvpvDJbaV6p2b6?usp=drive_link', icon: FolderOpen },
                { title: 'DRL Playlist', description: 'Dasar Rangkaian Listrik', href: 'https://youtube.com/playlist?list=PLvvIG2wS7Z6H11k9_Vzy9X7hBDDT5E5Gb', icon: Youtube },
                { title: 'RL Pak Tomy', description: 'Rangkaian Listrik Playlist', href: 'https://youtube.com/playlist?list=PLPo1kEEL45jz3t2n0iVZBiZOXtfrZgWYP', icon: Youtube },
                { title: 'DSD Playlist', description: 'Dasar Sistem Digital', href: 'https://youtube.com/playlist?list=PLF9K2dVsV_xK8wSXt5Gi24lhYFhWx0HzA', icon: Youtube },
                { title: 'MT Pak Tomy', description: 'Matematika Teknik Playlist', href: 'https://youtube.com/playlist?list=PLPo1kEEL45jyOsWa4zuKJymIGs9L0s1Yq', icon: Youtube },
            ]
        }
    ];

    const allLinks = categories.flatMap(cat => {
        if (cat.isGrouped) {
            return cat.groups?.flatMap(group =>
                group.links.map(link => ({
                    ...link,
                    description: '',
                    categoryLabel: group.name,
                    icon: FolderOpen
                }))
            ) || [];
        }
        return cat.links?.map(link => ({
            ...link,
            description: link.description || '',
            categoryLabel: cat.label
        })) || [];
    });

    const searchResults = searchQuery
        ? (allLinks as any[]).filter(link =>
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            link.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gradient-to-b from-[#001B55] to-[#00133a]' : 'bg-gradient-to-b from-[#f0fdff] to-white'}`}>
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-foreground">
                        Find and access academic resources with ease.
                    </h1>

                    <p className="text-xs md:text-sm font-medium max-w-xl mx-auto mb-8 text-muted-foreground leading-relaxed">
                        A centralized repository for DTE FTUI students to access course materials, assistance schedules, and essential academic documentation.
                    </p>

                    <div className="relative max-w-lg mx-auto mb-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/50">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="w-full py-3 pl-11 pr-4 rounded-lg border border-border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-highlight/30 focus:border-highlight/50 font-medium text-xs transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center">
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-muted/50 border border-border/50 rounded text-muted-foreground/70 tracking-widest uppercase">Search</kbd>
                        </div>
                    </div>

                    {/* Integrated Search Results View */}
                    {searchQuery && (
                        <div className="max-w-2xl mx-auto text-left animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2 text-highlight-text font-black text-[10px] uppercase tracking-widest">
                                    <Search size={14} />
                                    <span>Search Results ({searchResults.length})</span>
                                </div>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-highlight-text transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="space-y-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 border border-border rounded-xl transition-all bg-card/50 backdrop-blur-sm hover:border-highlight/40 group shadow-sm"
                                        >
                                            <div className="p-2.5 bg-highlight/5 text-highlight rounded-lg group-hover:bg-highlight group-hover:text-highlight-foreground transition-colors shrink-0">
                                                {React.createElement(link.icon as any, { size: 18 })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="text-sm font-bold truncate text-foreground">{link.title}</h4>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 border border-border/50 px-1.5 py-0.5 rounded-full">
                                                        {link.categoryLabel}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider line-clamp-1">
                                                    {link.description || 'Verified Academic Resource'}
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 text-highlight font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pr-2">
                                                <span>Open</span>
                                                <ExternalLink size={14} />
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-12 text-center border border-dashed border-border rounded-xl">
                                        <p className="text-xs font-bold text-muted-foreground">No matching resources found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {!searchQuery && (
                <>
                    {/* Directory Section */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
                        <div className="grid md:grid-cols-3 gap-8">
                            <Link href="/diktat" className="group p-8 border border-border rounded-2xl bg-card shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-highlight/10 rounded-lg text-highlight">
                                        <BookOpen size={24} />
                                    </div>
                                    <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-highlight transition-all" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Diktat Bank</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">Browse our collection of course notes, exam solutions, and study guides for all majors.</p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-highlight">
                                    <span>Enter Directory</span>
                                    <ChevronRight size={14} />
                                </div>
                            </Link>

                            <Link href="/asistensi" className="group p-8 border border-border rounded-2xl bg-card shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-highlight/10 rounded-lg text-highlight">
                                        <Calendar size={24} />
                                    </div>
                                    <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-highlight transition-all" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Tutorial Index</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">Access real-time schedules, meeting links, and recorded sessions from peer tutors.</p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-highlight">
                                    <span>View Schedule</span>
                                    <ChevronRight size={14} />
                                </div>
                            </Link>

                            <div className="group p-8 border border-border rounded-2xl bg-card shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-accent text-accent-foreground rounded-lg">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="px-2 py-1 rounded bg-muted text-[8px] font-black uppercase tracking-widest text-muted-foreground">Coming Soon</div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Aktor</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">Akpro tutor, request asistensi matkul untuk kuis ke tim bp/bphsa akpro.</p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                    <span>Contact BP/BPHSA</span>
                                    <ChevronRight size={14} />
                                </div>
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-accent/5 rounded-full"></div>
                            </div>
                        </div>
                    </section>

                    {/* Toolbox Section */}
                    <section id="toolbox" className="border-t border-border py-20 bg-muted/30 animate-in fade-in duration-500">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-4 text-highlight-text">
                                        <Search size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Toolbox</span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground">Resource Index</h2>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                                                ? 'bg-highlight text-highlight-foreground shadow-md'
                                                : 'bg-background border border-border text-muted-foreground hover:border-highlight/50'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="transition-all duration-300">
                                {categories.find(c => c.id === activeCategory)?.isGrouped ? (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {categories.find(c => c.id === activeCategory)?.groups?.map((group, idx) => (
                                            <div key={group.name} className="p-6 border border-border rounded-xl bg-card shadow-sm">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-highlight-text underline decoration-highlight/30 underline-offset-4">
                                                    <FolderOpen size={14} />
                                                    {group.name}
                                                </h4>
                                                <div className="space-y-2">
                                                    {group.links.map((link, lIdx) => (
                                                        <a
                                                            key={lIdx}
                                                            href={link.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-3 rounded-lg text-[11px] font-bold text-muted-foreground bg-muted/20 hover:bg-highlight/5 hover:text-highlight border border-transparent hover:border-highlight/20 transition-all group/link"
                                                        >
                                                            <span className="truncate pr-4">{link.title}</span>
                                                            <ExternalLink size={12} className="shrink-0 opacity-40 group-hover/link:opacity-100" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {categories.find(c => c.id === activeCategory)?.links?.map((link, idx) => (
                                            <a
                                                key={link.title}
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-4 border border-border rounded-xl transition-all bg-card hover:border-highlight/40 group shadow-sm"
                                            >
                                                <div className="p-2.5 bg-highlight/5 text-highlight rounded-lg group-hover:bg-highlight group-hover:text-highlight-foreground transition-colors shrink-0">
                                                    {React.createElement(link.icon as any, { size: 18 })}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-foreground mb-0.5">{link.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider line-clamp-1">{link.description}</p>
                                                </div>
                                                <div className="hidden sm:flex items-center gap-2 text-highlight font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pr-2">
                                                    <span>Access File</span>
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Metadata Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-background">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-highlight/20"></div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-highlight/20"></div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700">
                            <img
                                src="/akpro-BPHSA.png"
                                alt="Archive Curators 2026"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 mb-6 text-highlight-text">
                            <GraduationCap size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Objective</span>
                        </div>
                        <h2 className="text-3xl font-black mb-8 leading-tight text-foreground">
                            Preserving and distributing knowledge across generations.
                        </h2>
                        <div className="space-y-6 text-sm font-medium leading-relaxed text-muted-foreground">
                            <p>
                                The AKPRO Archive is a living repository designed to bridge the gap between academic years. We centralize all essential materials to ensure that no student is left behind due to a lack of resources.
                            </p>
                            <p>
                                Managed by the Academic and Professional Department of IME FTUI 2026, this system serves as the primary backbone for academic advocacy and support within the Department of Electrical Engineering.
                            </p>
                        </div>

                        <div className="mt-12 flex items-center gap-6 pt-12 border-t border-border">
                            <img
                                src={isDarkMode
                                    ? "/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.png"
                                    : "/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.png"
                                }
                                alt="AKPRO Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div className="h-8 w-[1px] bg-border"></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-foreground">System Managed by</p>
                                <p className="text-[10px] text-highlight-text font-bold uppercase tracking-widest">Tim AKPRO IME FTUI 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
