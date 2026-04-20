"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from './lib/ThemeContext';

// Components
import { BackgroundDecorations } from './components/home/BackgroundDecorations';
import { HeroSection } from './components/home/HeroSection';
import { DirectorySection } from './components/home/DirectorySection';
import { ToolboxSection } from './components/home/ToolboxSection';
import { FAQSection } from './components/home/FAQSection';
import { InstitutionalObjective } from './components/home/InstitutionalObjective';
import { SearchResultItem } from './components/home/SearchResultItem';

// Data
import showcaseImages from './data/showcaseImages.json';

interface HomePageClientProps {
    resourceCategories: any[];
    faqs: any[];
}

export default function HomePageClient({ resourceCategories, faqs }: HomePageClientProps) {
    const { isDarkMode } = useTheme();
    const [activeCategory, setActiveCategory] = useState('transisi');
    const [searchQuery, setSearchQuery] = useState('');



    // Prepare links for search
    const allLinks = useMemo(() => {
        return resourceCategories.flatMap((cat: any) => {
            if (cat.isGrouped) {
                return cat.groups?.flatMap((group: any) =>
                    group.links.map((link: any) => ({
                        ...link,
                        description: '',
                        categoryLabel: group.name,
                        icon: 'FolderOpen'
                    }))
                ) || [];
            }
            return cat.links?.map((link: any) => ({
                ...link,
                description: link.description || '',
                categoryLabel: cat.label
            })) || [];
        });
    }, [resourceCategories]);

    // Filter links based on search query
    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        return allLinks.filter(link =>
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            link.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allLinks]);

    return (
        <div className="flex flex-col relative">
            <BackgroundDecorations isDarkMode={isDarkMode} />

            <div className="relative z-30">
                <HeroSection
                    isDarkMode={isDarkMode}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResultsLength={searchResults.length}
                />
            </div>

            <div className="relative z-30">
                {searchQuery ? (
                    <section className="max-w-2xl mx-auto px-4 pb-20 w-full animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            {searchResults.length > 0 ? (
                                searchResults.map((link, idx) => (
                                    <SearchResultItem key={idx} link={link} />
                                ))
                            ) : (
                                <div className="p-12 text-center border border-dashed border-border rounded-xl">
                                    <p className="text-sm font-bold text-muted-foreground">Tidak ada sumber daya yang cocok ditemukan untuk "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <DirectorySection />
                        <ToolboxSection
                            categories={resourceCategories}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                        <FAQSection faqs={faqs} />
                        <InstitutionalObjective
                            isDarkMode={isDarkMode}
                            showcaseImages={showcaseImages}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
