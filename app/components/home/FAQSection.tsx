"use client";

import React from 'react';
import { Archive, ChevronDown } from 'lucide-react';
import faqs from '../../data/faqs.json';

export const FAQSection: React.FC = () => {
    const toggleFaq = (idx: number) => {
        const el = document.getElementById(`faq-ans-${idx}`);
        const icon = document.getElementById(`faq-icon-${idx}`);
        if (el?.classList.contains('hidden')) {
            el.classList.remove('hidden');
            icon?.classList.add('rotate-180');
        } else {
            el?.classList.add('hidden');
            icon?.classList.remove('rotate-180');
        }
    };

    return (
        <section className="py-24 border-t border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 text-highlight-text">
                        <Archive size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Common Inquiries</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Frequently Asked Questions</h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Everything you need to know about the AKPRO ecosystem</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="group border border-border rounded-2xl overflow-hidden bg-card transition-all hover:border-highlight/30">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-sm font-bold text-foreground group-hover:text-highlight transition-colors">{faq.q}</span>
                                <ChevronDown id={`faq-icon-${idx}`} size={18} className="text-muted-foreground transition-transform duration-300" />
                            </button>
                            <div id={`faq-ans-${idx}`} className="hidden px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-xs leading-relaxed text-muted-foreground font-medium border-t border-border/50 pt-4">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
