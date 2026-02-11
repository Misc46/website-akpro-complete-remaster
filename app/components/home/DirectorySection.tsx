"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ShieldCheck, ArrowUpRight, ChevronRight } from 'lucide-react';

export const DirectorySection: React.FC = () => {
    return (
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
    );
};
