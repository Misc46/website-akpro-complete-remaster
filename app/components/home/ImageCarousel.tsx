"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageCarouselProps {
    showcaseImages: Array<{ url: string; alt: string }>;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
    showcaseImages
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
        setProgress(0);
    }, [showcaseImages.length]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length);
        setProgress(0);
    }, [showcaseImages.length]);

    // Independent progress timer
    useEffect(() => {
        if (isPaused) return;

        const intervalTime = 50;
        const duration = 5000;
        const step = (intervalTime / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + step;
                return next >= 100 ? 100 : next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isPaused, currentIndex]);

    // Handle the actual switch when progress completes
    useEffect(() => {
        if (progress >= 100) {
            nextImage();
        }
    }, [progress, nextImage]);

    const handleManualChange = (index: number) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
        setProgress(0);
    };

    return (
        <div
            className="relative group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Decorative Corners */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-highlight/20 z-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-highlight/20 z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"></div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted/20 relative shadow-2xl">
                {showcaseImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105 pointer-events-none'
                            }`}
                    >
                        <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    </div>
                ))}

                {/* Status Indicator (Mobile) */}
                <div className="absolute top-4 right-4 z-20 md:hidden">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white">
                        {currentIndex + 1} / {showcaseImages.length}
                    </div>
                </div>

                {/* Single Progress Bar at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
                    <div
                        className="h-full bg-highlight transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Pause/Play micro-indicator */}
                <div className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-white">
                        {isPaused ? <Pause size={12} /> : <Play size={12} />}
                    </div>
                </div>

                {/* Simplified Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
                    {showcaseImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleManualChange(idx)}
                            className={`h-1 transition-all duration-300 rounded-full ${idx === currentIndex
                                ? 'w-8 bg-highlight'
                                : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/40 backdrop-blur-lg text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-highlight hover:text-black hover:border-highlight z-30 active:scale-95 shadow-2xl"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/40 backdrop-blur-lg text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-highlight hover:text-black hover:border-highlight z-30 active:scale-95 shadow-2xl"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
