"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../lib/ThemeContext';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isDarkMode, toggleTheme } = useTheme();
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    const Header = () => (
        <header className={`${isDarkMode ? 'bg-[#001B55] border-b border-[#002A83]' : 'bg-white border-b border-gray-100'} shadow-sm sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${isDarkMode ? 'bg-gradient-to-br from-[#002A83] to-[#0036A7]' : 'bg-gradient-to-br from-[#00B8D4] to-[#002A83]'} rounded-lg`}></div>
                        <div>
                            <h1 className={`text-xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-[#001B55]'}`}>AKPRO IME</h1>
                            <p className={`text-xs font-sans ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>FTUI 2026</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                href="/"
                                className={`${isDarkMode ? 'text-[#00B8D4]' : 'text-[#001B55]'} hover:text-[#00B8D4] transition font-medium`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/diktat"
                                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-[#00B8D4] transition font-medium`}
                            >
                                Diktat
                            </Link>
                            <Link
                                href="/asistensi"
                                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-[#00B8D4] transition font-medium`}
                            >
                                Asistensi
                            </Link>
                        </nav>
                        <button
                            onClick={toggleTheme}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${isDarkMode
                                ? 'bg-[#002A83] text-white hover:bg-[#0036A7]'
                                : 'bg-gray-100 text-[#001B55] hover:bg-gray-200'
                                }`}
                        >
                            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );

    const Footer = () => (
        <footer className={`${isDarkMode ? 'bg-[#000D2B] border-t border-white/5' : 'bg-[#001B55]'} py-12 text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#00B8D4] rounded-md"></div>
                        <span className="font-bold font-serif text-xl tracking-tight">AKPRO IME FTUI</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        &copy; 2026 AKPRO IME FTUI. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        </footer>
    );

    if (isAdmin) {
        return <div className={`min-h-screen ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#F8FDFF]'}`}>{children}</div>;
    }

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#001B55]' : 'bg-[#F8FDFF]'}`}>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutContent>
            {children}
        </LayoutContent>
    );
}
