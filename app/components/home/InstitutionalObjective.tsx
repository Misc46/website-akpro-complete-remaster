"use client";

import React from 'react';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

interface InstitutionalObjectiveProps {
    isDarkMode: boolean;
    showcaseImages: Array<{ url: string; alt: string }>;
}

export const InstitutionalObjective: React.FC<InstitutionalObjectiveProps> = ({
    isDarkMode,
    showcaseImages
}) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <ImageCarousel
                    showcaseImages={showcaseImages}
                />

                <div>
                    <div className="inline-flex items-center gap-2 mb-6 text-highlight-text">
                        <GraduationCap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Selaras | Efektif | Berdaya</span>
                    </div>
                    <h2 className="text-3xl font-black mb-8 leading-tight text-foreground">
                        Bidang Akademis dan Keprofesian IME FTUI 2026.
                    </h2>
                    <div className="space-y-6 text-sm font-medium leading-relaxed text-muted-foreground">
                        <p>
                            Akpro IME FTUI merupakan bidang yang bertanggung jawab dalam mengadvokasi, mewadahi, serta memfasilitasi warga Departemen Teknik Elektro dalam aspek akademis dan keprofesian.
                        </p>
                        <p>
                            Visi kami adalah menjadikan AKPRO IME FTUI 2026 sebagai bidang yang dapat bergerak selaras dalam mengadvokasi akademis secara efektif sehingga dapat menghasilkan warga DTE yang berdaya saing tinggi dalam menjalani dinamika kehidupan akademis dan keprofesian.
                        </p>
                    </div>

                    <div className="mt-12 flex items-center gap-6 pt-12 border-t border-border">
                        <Image
                            src={isDarkMode
                                ? "/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.webp"
                                : "/Logo-Bidang-Akpro-IME-2026-LIGHT-removebg-preview.webp"
                            }
                            alt="AKPRO Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                        <div className="h-8 w-[1px] bg-border"></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground">Sistem Dikelola oleh</p>
                            <p className="text-[10px] text-highlight-text font-bold uppercase tracking-widest">Tim AKPRO IME FTUI 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
