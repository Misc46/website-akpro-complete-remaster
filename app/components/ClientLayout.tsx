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
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src={isDarkMode
                                ? "/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.png"
                                : "/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.png"
                            }
                            alt="AKPRO Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black tracking-tight text-foreground">AKPRO ARCHIVE</h1>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">DTE FTUI 2026</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className={`text-xs font-bold uppercase tracking-widest ${pathname === '/' ? 'text-highlight' : 'text-muted-foreground hover:text-foreground'} transition`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/diktat"
                                className={`text-xs font-bold uppercase tracking-widest ${pathname === '/diktat' ? 'text-highlight' : 'text-muted-foreground hover:text-foreground'} transition`}
                            >
                                Diktat
                            </Link>
                            <Link
                                href="/asistensi"
                                className={`text-xs font-bold uppercase tracking-widest ${pathname === '/asistensi' ? 'text-highlight' : 'text-muted-foreground hover:text-foreground'} transition`}
                            >
                                Asistensi
                            </Link>
                        </nav>
                        <div className="flex items-center gap-3 border-l border-border pl-6">
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 rounded-md transition text-muted-foreground hover:bg-muted hover:text-foreground"
                                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                <span className="text-xs font-black tracking-widest uppercase">{isDarkMode ? 'Light' : 'Dark'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );

    const Footer = () => (
        <footer className="bg-muted border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-6 shrink-0">
                            <img
                                src={isDarkMode
                                    ? "/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.png"
                                    : "/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.png"
                                }
                                alt="AKPRO Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-black text-xs uppercase tracking-widest text-highlight">AKPRO Archive</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Repositori digital resmi Departemen Teknik Elektro FTUI. Dikelola oleh Bidang Akademis dan Keprofesian IME FTUI Periode 2026.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Resources</h4>
                            <ul className="space-y-2">
                                <li><Link href="/diktat" className="text-xs text-muted-foreground hover:text-highlight transition">Diktat Bank</Link></li>
                                <li><Link href="/asistensi" className="text-xs text-muted-foreground hover:text-highlight transition">Tutorial Sessions</Link></li>
                                <li><Link href="/#toolbox" className="text-xs text-muted-foreground hover:text-highlight transition">Academic Tools</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-foreground">Organization</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-highlight transition">IME FTUI</a></li>
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-highlight transition">DTE FTUI</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        &copy; 2026 AKPRO IME FTUI. Compiled with precision.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-highlight">System Online</span>
                    </div>
                </div>
            </div>
        </footer>
    );

    if (isAdmin) {
        return <div className={`min-h-screen ${isDarkMode ? 'dark bg-background text-foreground' : 'bg-background text-foreground'}`}>{children}</div>;
    }

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-background text-foreground' : 'bg-background text-foreground'}`}>
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
