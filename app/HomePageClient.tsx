"use client";

import React from 'react';
import { Calendar, BookOpen, Users, ChevronRight, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './lib/ThemeContext';

export default function HomePageClient() {
    const { isDarkMode } = useTheme();

    const Hero = () => (
        <section className={`relative overflow-hidden ${isDarkMode ? 'bg-[#001B55]' : 'bg-white'} pt-24 pb-20`}>
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
                    <span className="bg-gradient-to-r from-[#00B8D4] to-[#0036A7] bg-clip-text text-transparent">Academic Journey</span>
                </h1>

                <p className={`text-xl font-medium font-sans ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200`}>
                    Platform terpadu untuk mengakses diktat eksklusif, jadwal asistensi interaktif, dan sumber daya pendukung untuk mahasiswa Teknik Elektro FTUI.
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
        <Link href={href} className={`group relative ${isDarkMode ? 'bg-[#002A83] border-[#0036A7]' : 'bg-white border-gray-100 shadow-xl shadow-[#00B8D4]/5'} p-10 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 border block overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ${delay}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 group-hover:opacity-20 transition-all duration-700 bg-[#00B8D4] group-hover:scale-150`}></div>

            <div className={`w-16 h-16 ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#E0F7FA]'} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} size={32} />
            </div>

            <h3 className={`text-3xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-4 tracking-tight`}>{title}</h3>
            <p className={`font-medium font-sans leading-loose text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>

            <div className="flex items-center gap-2 text-[#00B8D4] mt-8 font-black text-xs uppercase tracking-widest">
                <span>Mulai Sekarang</span>
                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </div>
        </Link>
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
                        title="Live Sessions"
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

            <section id="about" className={`relative py-32 ${isDarkMode ? 'bg-[#000D2B]/50' : 'bg-[#F8FDFF]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1">
                        <div className="h-[500px] relative">
                            <div className={`absolute inset-0 rounded-[3rem] ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#001B55] to-[#00B8D4]'} opacity-10 rotate-3`}></div>
                            <div className={`absolute inset-0 rounded-[3rem] ${isDarkMode ? 'bg-[#002A83]' : 'bg-white'} border ${isDarkMode ? 'border-[#0036A7]' : 'border-gray-100'} shadow-2xl flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform duration-700`}>
                                <div className="text-center p-12">
                                    <div className="w-24 h-24 bg-[#00B8D4]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Users size={48} className="text-[#00B8D4]" />
                                    </div>
                                    <h4 className={`text-5xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-4 tracking-tighter`}>2026</h4>
                                    <p className="text-[#00B8D4] font-black uppercase tracking-widest text-xs">Amanah AKPRO IME FTUI</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <p className="text-[#00B8D4] font-black uppercase tracking-[0.3em] text-xs mb-6">Misi Kami</p>
                        <h2 className={`text-5xl font-black font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-10 leading-tight`}>
                            Membangun Pondasi <br />Akademis yang Kokoh
                        </h2>

                        <div className="space-y-8">
                            <p className={`text-xl font-medium font-sans leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Departemen Akademis Praktis dan Produktif (AKPRO) hadir sebagai jembatan bagi mahasiswa DTE FTUI untuk meraih potensi maksimal mereka.
                            </p>
                            <p className={`text-xl font-medium font-sans leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Kami percaya bahwa aksesibilitas terhadap sumber daya berkualitas adalah kunci keberhasilan akademis bersama.
                            </p>
                        </div>

                        <div className="mt-12 flex pt-12 border-t border-[#00B8D4]/20">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-14 h-14 rounded-full border-4 ${isDarkMode ? 'border-[#001B55]' : 'border-white'} bg-[#0036A7] transition-transform hover:-translate-y-2 cursor-pointer`}></div>
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
