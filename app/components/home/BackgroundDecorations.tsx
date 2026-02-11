"use client";

import React from 'react';

interface BackgroundDecorationsProps {
    isDarkMode: boolean;
}

export const BackgroundDecorations: React.FC<BackgroundDecorationsProps> = ({ isDarkMode }) => {
    if (isDarkMode) {
        return (
            <>
                <img src="/DarkDeco1.svg" alt="" className="absolute top-[5%] -right-8 w-72 h-72 pointer-events-none opacity-60 z-20" />
                <img src="/DarkDeco2.svg" alt="" className="absolute top-[15%] -left-10 w-56 h-56 pointer-events-none rotate-12 opacity-50 z-20" />
                <img src="/DarkDeco3.svg" alt="" className="absolute top-[30%] -right-24 w-80 h-80 pointer-events-none -rotate-6 opacity-40 z-20" />
                <img src="/DarkDeco1.svg" alt="" className="absolute top-[45%] left-[5%] w-48 h-48 pointer-events-none rotate-45 opacity-50 z-20" />
                <img src="/DarkDeco2.svg" alt="" className="absolute top-[55%] -right-12 w-64 h-64 pointer-events-none -rotate-12 opacity-60 z-20" />
                <img src="/DarkDeco3.svg" alt="" className="absolute top-[70%] -left-16 w-72 h-72 pointer-events-none rotate-[30deg] opacity-45 z-20" />
                <img src="/DarkDeco1.svg" alt="" className="absolute top-[85%] right-0 w-80 h-80 pointer-events-none rotate-[-15deg] opacity-55 z-20" />
                <img src="/DarkDeco2.svg" alt="" className="absolute top-[95%] left-[15%] w-40 h-40 pointer-events-none rotate-90 opacity-40 z-20" />
            </>
        );
    }

    return (
        <>
            <img src="/LightDeco1.svg" alt="" className="absolute top-[8%] -left-16 w-72 h-72 opacity-35 pointer-events-none z-20" />
            <img src="/LightDeco2.svg" alt="" className="absolute top-[25%] -right-12 w-64 h-64 opacity-30 pointer-events-none rotate-45 z-20" />
            <img src="/LightDeco3.svg" alt="" className="absolute top-[40%] -left-20 w-80 h-80 opacity-25 pointer-events-none -rotate-12 z-20" />
            <img src="/LightDeco1.svg" alt="" className="absolute top-[50%] right-[10%] w-48 h-48 opacity-35 pointer-events-none rotate-[15deg] z-20" />
            <img src="/LightDeco2.svg" alt="" className="absolute top-[65%] -right-16 w-80 h-80 opacity-45 pointer-events-none rotate-[30deg] z-20" />
            <img src="/LightDeco3.svg" alt="" className="absolute top-[80%] left-[5%] w-60 h-60 opacity-30 pointer-events-none rotate-[-20deg] z-20" />
            <img src="/LightDeco1.svg" alt="" className="absolute top-[92%] -left-12 w-64 h-64 opacity-35 pointer-events-none -rotate-45 z-20" />
            <img src="/LightDeco2.svg" alt="" className="absolute top-[98%] right-[20%] w-40 h-40 opacity-25 pointer-events-none rotate-90 z-20" />
        </>
    );
};
