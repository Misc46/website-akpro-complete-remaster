"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#001B55] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#002A83] border border-[#0036A7] rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#001B55] rounded-2xl flex items-center justify-center mb-4 border border-[#00B8D4]/20">
                        <Lock className="text-[#00B8D4]" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold font-serif text-white text-center">Admin Control</h1>
                    <p className="text-gray-400 text-sm text-center mt-2 font-sans">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Access Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-[#001B55] border border-[#0036A7] text-white px-5 py-3 rounded-xl focus:ring-2 focus:ring-[#00B8D4] outline-none transition font-sans"
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            <ShieldAlert size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Unlock Dashboard'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-500 hover:text-gray-300 text-sm transition font-medium"
                    >
                        Return to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}
