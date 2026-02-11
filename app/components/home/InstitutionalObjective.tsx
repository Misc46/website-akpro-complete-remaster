"use client";

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

interface InstitutionalObjectiveProps {
    isDarkMode: boolean;
    currentImageIndex: number;
    setCurrentImageIndex: (index: number | ((prev: number) => number)) => void;
    showcaseImages: Array<{ url: string; alt: string }>;
}

export const InstitutionalObjective: React.FC<InstitutionalObjectiveProps> = ({
    isDarkMode,
    currentImageIndex,
    setCurrentImageIndex,
    showcaseImages
}) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <ImageCarousel
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    showcaseImages={showcaseImages}
                />

                <div>
                    <div className="inline-flex items-center gap-2 mb-6 text-highlight-text">
                        <GraduationCap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Objective</span>
                    </div>
                    <h2 className="text-3xl font-black mb-8 leading-tight text-foreground">
                        Preserving and distributing knowledge across generations.
                    </h2>
                    <div className="space-y-6 text-sm font-medium leading-relaxed text-muted-foreground">
                        <p>
                            The AKPRO Archive is a living repository designed to bridge the gap between academic years. We centralize all essential materials to ensure that no student is left behind due to a lack of resources.
                        </p>
                        <p>
                            Managed by the Academic and Professional Department of IME FTUI 2026, this system serves as the primary backbone for academic advocacy and support within the Department of Electrical Engineering.
                        </p>
                    </div>

                    <div className="mt-12 flex items-center gap-6 pt-12 border-t border-border">
                        <img
                            src={isDarkMode
                                ? "/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.png"
                                : "/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.png"
                            }
                            alt="AKPRO Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <div className="h-8 w-[1px] bg-border"></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground">System Managed by</p>
                            <p className="text-[10px] text-highlight-text font-bold uppercase tracking-widest">Tim AKPRO IME FTUI 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
