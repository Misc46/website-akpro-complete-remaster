"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
    currentImageIndex: number;
    setCurrentImageIndex: (index: number | ((prev: number) => number)) => void;
    showcaseImages: Array<{ url: string; alt: string }>;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
    currentImageIndex,
    setCurrentImageIndex,
    showcaseImages
}) => {
    return (
        <div className="relative group">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-highlight/20 z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-highlight/20 z-10"></div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted/20 relative">
                {showcaseImages.map((img, idx) => (
                    <img
                        key={idx}
                        src={img.url}
                        alt={img.alt}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentImageIndex
                            ? 'opacity-100 scale-100 rotate-0 grayscale-0'
                            : 'opacity-0 scale-105 rotate-1 grayscale'
                            }`}
                    />
                ))}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {showcaseImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1 transition-all duration-500 rounded-full ${idx === currentImageIndex
                                ? 'w-8 bg-highlight'
                                : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => setCurrentImageIndex((prev: number) => (prev - 1 + showcaseImages.length) % showcaseImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 z-20 shadow-xl"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => setCurrentImageIndex((prev: number) => (prev + 1) % showcaseImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 z-20 shadow-xl"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
