"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Persist theme choice (optional but good for UX)
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved !== null) {
            setIsDarkMode(saved === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        return { isDarkMode: true, toggleTheme: () => { } }; // Fallback to avoid crash during SSR/init
    }
    return context;
}
