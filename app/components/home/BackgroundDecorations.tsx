"use client";

import React, { memo } from 'react';

interface BackgroundDecorationsProps {
    isDarkMode: boolean;
    intensity?: 'default' | 'subtle';
}

export const BackgroundDecorations: React.FC<BackgroundDecorationsProps> = memo(({ isDarkMode, intensity = 'default' }) => {
    const isSubtle = intensity === 'subtle';
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Base Mesh Gradients */}
            {isDarkMode ? (
                <>
                    {/* Dark Mode Blobs */}
                    <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0036A7] rounded-full blur-[120px] ${isSubtle ? 'opacity-10' : 'opacity-20'}`} />
                    <div className={`absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-[#00B4D4] rounded-full blur-[100px] ${isSubtle ? 'opacity-5' : 'opacity-10'}`} />
                    <div className={`absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#001B55] rounded-full blur-[80px] ${isSubtle ? 'opacity-20' : 'opacity-40'}`} />
                    <div className={`absolute bottom-[-5%] right-[10%] w-[45%] h-[45%] bg-[#002A83] rounded-full blur-[110px] ${isSubtle ? 'opacity-10' : 'opacity-20'}`} />

                    {/* Original SVG Sprinkles for Dark Mode */}
                    <img src="/DarkDeco1.svg" alt="" className={`absolute top-[5%] -right-8 pointer-events-none z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-20' : 'w-72 h-72 opacity-60'}`} />
                    <img src="/DarkDeco2.svg" alt="" className={`absolute top-[15%] -left-10 pointer-events-none rotate-12 z-20 transition-all ${isSubtle ? 'w-40 h-40 opacity-15' : 'w-56 h-56 opacity-50'}`} />
                    <img src="/DarkDeco3.svg" alt="" className={`absolute top-[30%] -right-24 pointer-events-none -rotate-6 z-20 transition-all ${isSubtle ? 'w-56 h-56 opacity-10' : 'w-80 h-80 opacity-40'}`} />
                    <img src="/DarkDeco1.svg" alt="" className={`absolute top-[45%] left-[5%] pointer-events-none rotate-45 z-20 transition-all ${isSubtle ? 'w-32 h-32 opacity-15' : 'w-48 h-48 opacity-50'}`} />
                    <img src="/DarkDeco2.svg" alt="" className={`absolute top-[55%] -right-12 pointer-events-none -rotate-12 z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-20' : 'w-64 h-64 opacity-60'}`} />
                    <img src="/DarkDeco3.svg" alt="" className={`absolute top-[70%] -left-16 pointer-events-none rotate-[30deg] z-20 transition-all ${isSubtle ? 'w-56 h-56 opacity-15' : 'w-72 h-72 opacity-45'}`} />
                    <img src="/DarkDeco1.svg" alt="" className={`absolute top-[85%] right-0 pointer-events-none rotate-[-15deg] z-20 transition-all ${isSubtle ? 'w-56 h-56 opacity-20' : 'w-80 h-80 opacity-55'}`} />
                    <img src="/DarkDeco2.svg" alt="" className={`absolute top-[95%] left-[15%] pointer-events-none rotate-90 z-20 transition-all ${isSubtle ? 'w-32 h-32 opacity-15' : 'w-40 h-40 opacity-40'}`} />
                </>
            ) : (
                <>
                    {/* Light Mode Blobs */}
                    <div className={`absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#a5e1e9] rounded-full blur-[100px] ${isSubtle ? 'opacity-15' : 'opacity-30'}`} />
                    <div className={`absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-[#e0f7fa] rounded-full blur-[120px] ${isSubtle ? 'opacity-30' : 'opacity-60'}`} />
                    <div className={`absolute bottom-[15%] right-[5%] w-[35%] h-[35%] bg-highlight rounded-full blur-[90px] ${isSubtle ? 'opacity-2' : 'opacity-5'}`} />
                    <div className={`absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-[#a5e1e9] rounded-full blur-[110px] ${isSubtle ? 'opacity-10' : 'opacity-20'}`} />

                    {/* Original SVG Sprinkles for Light Mode */}
                    <img src="/LightDeco1.svg" alt="" className={`absolute top-[8%] -left-16 pointer-events-none rotate-12 z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-15' : 'w-72 h-72 opacity-35'}`} />
                    <img src="/LightDeco2.svg" alt="" className={`absolute top-[25%] -right-12 pointer-events-none rotate-45 z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-10' : 'w-64 h-64 opacity-30'}`} />
                    <img src="/LightDeco3.svg" alt="" className={`absolute top-[40%] -left-20 pointer-events-none -rotate-12 z-20 transition-all ${isSubtle ? 'w-56 h-56 opacity-10' : 'w-80 h-80 opacity-25'}`} />
                    <img src="/LightDeco1.svg" alt="" className={`absolute top-[50%] right-[10%] pointer-events-none rotate-[15deg] z-20 transition-all ${isSubtle ? 'w-32 h-32 opacity-15' : 'w-48 h-48 opacity-35'}`} />
                    <img src="/LightDeco2.svg" alt="" className={`absolute top-[65%] -right-16 pointer-events-none rotate-[30deg] z-20 transition-all ${isSubtle ? 'w-56 h-56 opacity-20' : 'w-80 h-80 opacity-45'}`} />
                    <img src="/LightDeco3.svg" alt="" className={`absolute top-[80%] left-[5%] pointer-events-none rotate-[-20deg] z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-15' : 'w-60 h-60 opacity-30'}`} />
                    <img src="/LightDeco1.svg" alt="" className={`absolute top-[92%] -left-12 pointer-events-none -rotate-45 z-20 transition-all ${isSubtle ? 'w-48 h-48 opacity-15' : 'w-64 h-64 opacity-35'}`} />
                    <img src="/LightDeco2.svg" alt="" className={`absolute top-[98%] right-[20%] pointer-events-none rotate-90 z-20 transition-all ${isSubtle ? 'w-32 h-32 opacity-10' : 'w-40 h-40 opacity-25'}`} />
                </>
            )}
        </div>
    );
});

BackgroundDecorations.displayName = 'BackgroundDecorations';
