"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, FolderOpen, ExternalLink, ArrowUpRight } from 'lucide-react';

interface ToolboxSectionProps {
    categories: any[];
    activeCategory: string;
    setActiveCategory: (id: string) => void;
}

export const ToolboxSection: React.FC<ToolboxSectionProps> = ({
    categories,
    activeCategory,
    setActiveCategory
}) => {
    const activeCatData = categories.find(c => c.id === activeCategory);

    const getIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName];
        return Icon ? <Icon size={18} /> : <FolderOpen size={18} />;
    };

    return (
        <section id="toolbox" className="relative border-t border-border py-20 animate-in fade-in duration-500 overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 bg-muted/30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {activeCatData?.isGrouped ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {activeCatData.groups?.map((group: any) => (
                                <div key={group.name} className="p-6 border border-border rounded-xl bg-card shadow-sm">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-highlight-text underline decoration-highlight/30 underline-offset-4">
                                        <FolderOpen size={14} />
                                        {group.name}
                                    </h4>
                                    <div className="space-y-2">
                                        {group.links.map((link: any, lIdx: number) => (
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
                            {activeCatData?.links?.map((link: any) => (
                                <a
                                    key={link.title}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 border border-border rounded-xl transition-all bg-card hover:border-highlight/40 group shadow-sm"
                                >
                                    <div className="p-2.5 bg-highlight/5 text-highlight rounded-lg group-hover:bg-highlight group-hover:text-highlight-foreground transition-colors shrink-0">
                                        {getIcon(link.icon)}
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
    );
};
