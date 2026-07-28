"use client";

import React from 'react';
import Image from 'next/image';

export default function LogoPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex items-center gap-8">
                {/* Logo Icon */}
                <div className="relative w-48 h-48">
                    <Image
                        src="/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.png"
                        alt="Logo AKPRO"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Text Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="font-serif text-[#001B55] text-8xl font-black font-bold tracking-tight leading-none">
                        AKPRO
                    </h1>
                    <h2 className="font-serif text-[#001B55] text-6xl font-bold tracking-wide mt-2">
                        IME FTUI 2026
                    </h2>
                </div>
            </div>
        </div>
    );
}
