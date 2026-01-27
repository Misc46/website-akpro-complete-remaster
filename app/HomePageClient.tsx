"use client";

import React, { useState } from 'react';
import { Calendar, BookOpen, Users, ChevronRight, ArrowRight, Star, FileText, Youtube, Layout, FolderOpen, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './lib/ThemeContext';

export default function HomePageClient() {
    const { isDarkMode } = useTheme();
    const [activeCategory, setActiveCategory] = useState('transisi');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const Hero = () => (
        <section className={`relative overflow-hidden ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#F0FDFF]'} pt-24 pb-20`}>
            {/* Background elements */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none`}>
                <div className={`absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl ${isDarkMode ? 'bg-[#00B8D4]' : 'bg-[#00B8D4]'}`}></div>
                <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-[#0036A7]' : 'bg-[#001B55]'}`}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00B8D4]/10 border border-[#00B8D4]/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Star size={14} className="text-[#00B8D4] fill-[#00B8D4]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#00B8D4]">Pusat Akademik DTE FTUI</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black font-serif mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <span className={`${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>Empowering Your </span>
                    <span className="bg-gradient-to-r from-[#00B8D4] to-[#0036A7] bg-clip-text text-transparent">Academic & Professional Journey</span>
                </h1>

                <p className={`text-xl font-medium font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200`}>
                    Platform terpadu untuk mengakses diktat eksklusif, jadwal asistensi interaktif, dan sumber daya pendukung untuk mahasiswa Departemen Teknik Elektro FTUI.
                </p>

                <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link
                        href="/diktat"
                        className={`group relative flex items-center gap-3 ${isDarkMode ? 'bg-[#00B8D4] text-[#001B55]' : 'bg-[#001B55] text-white'} px-10 py-5 rounded-[2rem] font-sans font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(0,184,212,0.2)] hover:shadow-[#00B8D4]/40 transition-all duration-300 hover:-translate-y-1`}
                    >
                        Jelajahi Diktat
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/asistensi"
                        className={`flex items-center gap-3 bg-transparent border-2 ${isDarkMode ? 'border-[#0036A7] text-white hover:bg-[#0036A7]' : 'border-gray-200 text-[#001B55] hover:bg-gray-50'} px-10 py-5 rounded-[2rem] font-sans font-black text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-1`}
                    >
                        Jadwal Sesi
                    </Link>
                </div>
            </div>
        </section>
    );

    const FeatureCard = ({ icon: Icon, title, description, href, delay }: any) => (
        <Link href={href} className={`group relative ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-[#E0F7FA] border-[#B2EBF2] shadow-xl shadow-[#00B8D4]/10'} p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 border block overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ${delay}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 group-hover:opacity-20 transition-all duration-700 bg-[#00B8D4] group-hover:scale-150`}></div>

            <div className={`w-16 h-16 ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#E0F7FA]'} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} size={32} />
            </div>

            <h3 className={`text-3xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-4 tracking-tight`}>{title}</h3>
            <p className={`font-medium font-sans leading-loose text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>

            <div className="flex items-center gap-2 text-[#00B8D4] mt-8 font-black text-xs uppercase tracking-widest">
                <span>Mulai Sekarang</span>
                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </div>
        </Link>
    );

    const ListItem = ({ icon: Icon, title, description, href, delay }: any) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-stretch w-full ${isDarkMode ? 'bg-[#002A83]/20 border-[#0036A7]/30 hover:bg-[#002A83]/40' : 'bg-[#E0F7FA] border-[#B2EBF2] shadow-sm hover:shadow-md hover:bg-[#B2EBF2]'} rounded-3xl transition-all duration-300 border animate-in fade-in slide-in-from-bottom-2 ${delay} hover:-translate-y-0.5`}
        >
            <div className="flex items-center gap-6 p-6 w-full">
                <div className={`w-14 h-14 shrink-0 ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#E0F7FA]'} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <Icon className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-1`}>{title}</h4>
                    <p className={`text-xs font-bold font-sans uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
                </div>
                <div className={`hidden sm:flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}>
                    <span>Buka Link</span>
                    <ExternalLink size={14} />
                </div>
                <ChevronRight size={24} className={`text-[#00B8D4] group-hover:translate-x-1 transition-transform shrink-0`} />
            </div>
        </a>
    );

    const GroupedLinkCard = ({ title, links, delay }: any) => (
        <div className={`group relative flex flex-col h-full ${isDarkMode ? 'bg-[#002A83]/50 border-[#0036A7]/30' : 'bg-[#E0F7FA] border-[#B2EBF2] shadow-sm'} p-8 rounded-[2.5rem] border animate-in fade-in slide-in-from-bottom-4 duration-500 ${delay}`}>
            <h4 className={`text-2xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-4 tracking-tight`}>{title}</h4>
            <div className={`h-[1px] w-full ${isDarkMode ? 'bg-[#0036A7]/50' : 'bg-[#B2EBF2]'} mb-6`}></div>
            <div className="space-y-4">
                {links.map((link: any, idx: number) => (
                    <a
                        key={idx}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between group/link text-sm font-bold ${isDarkMode ? 'text-gray-300 hover:text-[#00B8D4]' : 'text-gray-500 hover:text-[#001B55]'} transition-colors`}
                    >
                        <span>{link.title}</span>
                        <ExternalLink size={14} className="opacity-40 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col overflow-hidden">
            <Hero />

            <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative`}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <FeatureCard
                        icon={BookOpen}
                        title="Diktat Vault"
                        description="Koleksi lengkap materi kuliah, solusi ujian tahun-tahun sebelumnya, dan panduan belajar yang dikurasi langsung oleh AKPRO."
                        href="/diktat"
                        delay="delay-100"
                    />
                    <FeatureCard
                        icon={Calendar}
                        title="Jadwal Asistensi"
                        description="Informasi jadwal asistensi real-time, link meeting Zoom, dan rekaman sesi pembelajaran yang bisa diakses kapan saja."
                        href="/asistensi"
                        delay="delay-200"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Dukungan Peer"
                        description="Program pemberdayaan mahasiswa melalui kolaborasi belajar dan berbagi pengetahuan antar angkatan di DTE FTUI."
                        href="/#about"
                        delay="delay-300"
                    />
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="w-full flex flex-col md:flex-row md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-[2px] w-8 bg-[#00B8D4]/30"></div>
                        <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`}>Academic Toolbox</h3>
                        <div className="h-[2px] flex-1 bg-[#00B8D4]/10"></div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border ${isDarkMode ? 'bg-[#002A83] border-[#0036A7] text-white' : 'bg-[#E0F7FA] border-[#B2EBF2] text-[#001B55]'} font-black text-[10px] uppercase tracking-widest transition-all hover:border-[#00B8D4] focus:outline-none`}
                        >
                            {categories.find(c => c.id === activeCategory)?.label}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border ${isDarkMode ? 'bg-[#001B55] border-[#0036A7]' : 'bg-[#E0F7FA] border-[#B2EBF2]'} shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setActiveCategory(cat.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeCategory === cat.id ? 'text-[#00B8D4] bg-[#00B8D4]/5' : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-[#001B55] hover:bg-[#B2EBF2]'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={`w-full ${categories.find(c => c.id === activeCategory)?.isGrouped ? 'grid md:grid-cols-3 gap-8' : 'flex flex-col items-stretch gap-4'} min-h-[160px]`}>
                    {categories.find(c => c.id === activeCategory)?.isGrouped ? (
                        categories.find(c => c.id === activeCategory)?.groups?.map((group, idx) => (
                            <GroupedLinkCard
                                key={group.name}
                                title={group.name}
                                links={group.links}
                                delay={`delay-${(idx + 1) * 100}`}
                            />
                        ))
                    ) : (
                        categories.find(c => c.id === activeCategory)?.links?.map((link, idx) => (
                            <ListItem
                                key={link.title}
                                icon={link.icon}
                                title={link.title}
                                description={link.description}
                                href={link.href}
                                delay={`delay-${(idx + 1) * 50}`}
                            />
                        ))
                    )}
                </div>
            </section>

            <section id="about" className={`relative py-32 ${isDarkMode ? 'bg-[#000D2B]/50' : 'bg-[#E0F7FA]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1">
                        <div className="h-[500px] relative">
                            <div className={`absolute inset-0 rounded-[3rem] ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#001B55] to-[#00B8D4]'} opacity-10 rotate-3`}></div>
                            <div className={`absolute inset-0 rounded-[3rem] ${isDarkMode ? 'bg-[#002A83]' : 'bg-[#F0FDFF]'} border ${isDarkMode ? 'border-[#0036A7]' : 'border-[#B2EBF2]'} shadow-2xl flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden`}>
                                <img
                                    src="/akpro-BPHSA.png"
                                    alt="Amanah AKPRO IME FTUI 2026"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001B55]/80 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <h4 className="text-4xl font-black font-serif text-white mb-2 tracking-tighter">2026</h4>
                                    <p className="text-[#00B8D4] font-black uppercase tracking-widest text-xs">BPHSA Akpro IME FTUI</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <p className="text-[#00B8D4] font-black uppercase tracking-[0.3em] text-xs mb-6">Visi Kami</p>
                        <h2 className={`text-5xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-10 leading-tight`}>
                            Berdaya Saing Tinggi & <br />Selaras dalam Advokasi
                        </h2>

                        <div className="space-y-8">
                            <p className={`text-xl font-medium font-sans leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                Menjadikan AKPRO IME FTUI 2026 sebagai bidang yang dapat bergerak selaras dalam mengadvokasi akademis secara efektif.
                            </p>
                            <p className={`text-xl font-medium font-sans leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                Kami berkomitmen menghasilkan warga DTE yang berdaya saing tinggi dalam menjalani dinamika kehidupan akademis dan keprofesian.
                            </p>
                        </div>

                        <div className="mt-12 flex pt-12 border-t border-[#00B8D4]/20">
                            <div className="flex -space-x-5">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div key={i} className={`w-14 h-14 rounded-full border-4 ${isDarkMode ? 'border-[#001B55]' : 'border-[#F0FDFF]'} bg-[#0036A7] transition-transform hover:-translate-y-2 cursor-pointer shadow-lg`}></div>
                                ))}
                            </div>
                            <div className="ml-8">
                                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>Dikelola oleh Tim AKPRO</p>
                                <p className="text-xs text-[#00B8D4] font-bold">IME FTUI Periode 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
