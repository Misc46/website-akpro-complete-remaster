"use client";

import React from 'react';
import { Calendar, BookOpen, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './lib/ThemeContext';

export default function HomePageClient() {
    const { isDarkMode } = useTheme();

    const Hero = () => (
        <section className={`${isDarkMode ? 'bg-gradient-to-br from-[#001B55] via-[#002A83] to-[#0036A7]' : 'bg-gradient-to-br from-[#F0FDFF] via-[#E0F7FA] to-white'} py-20 text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-current">
                <h1 className="text-5xl md:text-6xl font-extrabold font-serif mb-6 leading-tight">
                    <span className={`${isDarkMode ? 'bg-gradient-to-r from-[#00B8D4] via-[#80E5FF] to-[#00D4FF] bg-clip-text text-transparent' : 'text-[#001B55]'}`}>
                        AKPRO IME FTUI
                    </span>
                </h1>
                <p className={`text-xl font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 max-w-2xl mx-auto`}>
                    Akademis dan Keprofesian Ikatan Mahasiswa Teknik Eletktro FTUI - Mendukung pembelajaran mahasiswa Departemen Teknik Elektro FTUI
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        href="/diktat"
                        className={`inline-block ${isDarkMode ? 'bg-[#00B8D4] hover:bg-[#00D4FF]' : 'bg-[#001B55] hover:bg-[#002A83]'} text-white px-8 py-3 rounded-lg font-sans font-semibold shadow-md hover:shadow-lg transition`}
                    >
                        Lihat Diktat
                    </Link>
                    <Link
                        href="/asistensi"
                        className={`inline-block bg-transparent border-2 border-[#00B8D4] text-[#00B8D4] hover:bg-[#00B8D4] hover:text-white px-8 py-3 rounded-lg font-sans font-semibold transition`}
                    >
                        Jadwal Asistensi
                    </Link>
                </div>
            </div>
        </section>
    );

    const FeatureCard = ({ icon: Icon, title, description, href, accentColor }: any) => (
        <Link href={href} className={`${isDarkMode ? 'bg-[#002A83] border-[#0036A7] hover:bg-[#0036A7]' : 'bg-white border-gray-100 hover:border-[#00B8D4]/30'} p-8 rounded-2xl shadow-sm hover:shadow-xl transition cursor-pointer border block relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${accentColor}`}></div>
            <div className={`w-14 h-14 ${isDarkMode ? 'bg-gradient-to-br from-[#0036A7] to-[#00B8D4]' : 'bg-gradient-to-br from-[#00B8D4] to-[#001B55]'} rounded-xl flex items-center justify-center mb-6`}>
                <Icon className="text-white" size={28} />
            </div>
            <h3 className={`text-2xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-3`}>{title}</h3>
            <p className={`font-sans leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
            <div className="flex items-center text-[#00B8D4] mt-6 font-medium group-hover:gap-2 transition-all">
                <span>Selengkapnya</span>
                <ChevronRight size={18} />
            </div>
        </Link>
    );

    return (
        <div className="flex flex-col">
            <Hero />
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={BookOpen}
                        title="Kumpulan Diktat"
                        description="Akses diktat mata kuliah untuk mendukung pembelajaran Anda dengan materi yang terkurasi."
                        href="/diktat"
                        accentColor="bg-yellow-400"
                    />
                    <FeatureCard
                        icon={Calendar}
                        title="Jadwal Asistensi"
                        description="Lihat jadwal asistensi terbaru dan bergabung dengan sesi pembelajaran interaktif."
                        href="/asistensi"
                        accentColor="bg-blue-400"
                    />
                    <FeatureCard
                        icon={Users}
                        title="Tentang AKPRO"
                        description="Pelajari lebih lanjut tentang program, tim kami, and visi kami untuk pendidikan."
                        href="/#about"
                        accentColor="bg-cyan-400"
                    />
                </div>
            </section>

            <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100/10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className={`text-4xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'} mb-8`}>Tentang AKPRO IME FTUI</h2>
                        <div className="space-y-6">
                            <p className={`text-lg font-sans leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                AKPRO (Akademis Praktis dan Produktif) adalah program yang didedikasikan untuk mendukung pembelajaran mahasiswa Departemen Teknik Elektro, Fakultas Teknik, Universitas Indonesia.
                            </p>
                            <p className={`text-lg font-sans leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Kami menyediakan berbagai sumber belajar termasuk diktat mata kuliah, jadwal asistensi, and rekaman sesi pembelajaran untuk membantu mahasiswa mencapai prestasi akademis terbaik mereka.
                            </p>
                        </div>
                        <div className={`mt-10 p-6 rounded-xl ${isDarkMode ? 'bg-[#002A83]' : 'bg-[#E0F7FA] border border-[#00B8D4]/20'}`}>
                            <p className={`font-medium ${isDarkMode ? 'text-[#80E5FF]' : 'text-[#001B55]'}`}>
                                "Supporting your academic journey with excellence."
                            </p>
                        </div>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-[#0036A7] to-[#00B8D4]' : 'from-[#00B8D4] to-[#001B55]'} opacity-20`}></div>
                        <div className={`flex items-center justify-center h-full ${isDarkMode ? 'bg-[#002A83]' : 'bg-gray-100'}`}>
                            <div className={`w-32 h-32 rounded-3xl ${isDarkMode ? 'bg-[#001B55]' : 'bg-white shadow-lg'} flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0`}>
                                <Users size={64} className={isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
