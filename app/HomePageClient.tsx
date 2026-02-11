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
import resourceCategoriesData from './data/resourceCategories.json';
import showcaseImages from './data/showcaseImages.json';

export default function HomePageClient() {
    const { isDarkMode } = useTheme();
    const [activeCategory, setActiveCategory] = useState('transisi');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Prepare links for search
    const allLinks = useMemo(() => {
        return resourceCategoriesData.flatMap(cat => {
            if (cat.isGrouped) {
                return cat.groups?.flatMap(group =>
                    group.links.map(link => ({
                        ...link,
                        description: '',
                        categoryLabel: group.name,
                        icon: 'FolderOpen'
                    }))
                ) || [];
            }
            return cat.links?.map(link => ({
                ...link,
                description: link.description || '',
                categoryLabel: cat.label
            })) || [];
        });
    }, []);

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
                                    <p className="text-xs font-bold text-muted-foreground">No matching resources found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <DirectorySection />
                        <ToolboxSection
                            categories={resourceCategoriesData}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                        />
                        <FAQSection />
                        <InstitutionalObjective
                            isDarkMode={isDarkMode}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                            showcaseImages={showcaseImages}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
