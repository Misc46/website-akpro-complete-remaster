"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Search } from 'lucide-react';

interface SearchResultItemProps {
    link: any;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ link }) => {
    const Icon = (LucideIcons as any)[link.icon] || LucideIcons.FolderOpen;

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-xl transition-all bg-card/50 backdrop-blur-sm hover:border-highlight/40 group shadow-sm"
        >
            <div className="p-2.5 bg-highlight/5 text-highlight rounded-lg group-hover:bg-highlight group-hover:text-highlight-foreground transition-colors shrink-0">
                <Icon size={18} />
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
    );
};
