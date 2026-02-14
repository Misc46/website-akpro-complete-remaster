"use client";

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Database,
    LogOut,
    FileText,
    Activity,
    CalendarDays,
    Wrench
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DiktatManager from './DiktatManager';
import AsistensiManager from './AsistensiManager';
import FAQManager from './FAQManager';
import ToolboxManager from './ToolboxManager';
import { HelpCircle } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'diktat' | 'asistensi' | 'faq' | 'toolbox' | 'infrastructure'>('overview');
    const [message, setMessage] = useState('');

    const handleLogout = async () => {
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login');
        router.refresh();
    };

    const StatusCard = ({ title, value, statusColor }: { title: string, value: string, statusColor: string }) => (
        <div className="bg-[#002A83] border border-[#0036A7] p-6 rounded-2xl">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white font-serif">{value}</h3>
                <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></div>
            </div>
        </div>
    );

    const SidebarBtn = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === id ? 'bg-[#00B8D4] text-[#001B55]' : 'text-gray-400 hover:bg-[#0036A7] hover:text-white'}`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#001B55] text-white font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#002A83] border-b md:border-b-0 md:border-r border-[#0036A7] p-6 flex flex-col shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <img
                        src="/Logo-Bidang-Akpro-IME-2026-DARK-removebg-preview.png"
                        alt="AKPRO Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <span className="font-bold font-serif text-lg tracking-tight">Admin OS</span>
                </div>

                <nav className="flex-grow space-y-2">
                    <SidebarBtn id="overview" icon={LayoutDashboard} label="Overview" />
                    <SidebarBtn id="diktat" icon={FileText} label="Diktat Docs" />
                    <SidebarBtn id="asistensi" icon={CalendarDays} label="Asistensi" />
                    <SidebarBtn id="faq" icon={HelpCircle} label="FAQ Editor" />
                    <SidebarBtn id="toolbox" icon={Wrench} label="Toolbox" />
                    <SidebarBtn id="infrastructure" icon={Database} label="Infrastructure" />
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition mt-auto"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-white mb-1 uppercase tracking-tight">
                            {activeTab === 'overview' ? 'Systems Overview' :
                                activeTab === 'diktat' ? 'Diktat Vault' :
                                    activeTab === 'asistensi' ? 'Master Scheduler' :
                                        activeTab === 'toolbox' ? 'Toolbox Editor' :
                                            activeTab === 'infrastructure' ? 'Systems & Cache' : 'FAQ Engine'}
                        </h1>
                        <p className="text-gray-400 text-sm font-sans">Control panel for AKPRO IME FTUI infrastructure</p>
                    </div>
                </header>

                {message && (
                    <div className="mb-8 p-4 bg-[#00B8D4]/10 border border-[#00B8D4]/20 rounded-xl text-[#00B8D4] text-xs font-bold animate-in zoom-in duration-300">
                        {message}
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="animate-in slide-in-from-bottom duration-500 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatusCard title="Backend Status" value="Healthy" statusColor="bg-green-500" />
                            <StatusCard title="Database" value="Active" statusColor="bg-green-500" />
                            <StatusCard title="Traffic" value="Stable" statusColor="bg-[#00B8D4]" />
                            <StatusCard title="Environment" value="Production" statusColor="bg-blue-500" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                                <div className="p-6 border-b border-[#0036A7] flex items-center justify-between">
                                    <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                                        <Activity size={20} className="text-[#00B8D4]" />
                                        Activity Logs
                                    </h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[
                                        { t: 'Just Now', m: 'Admin dashboard state initialized', s: 'info' },
                                        { t: '2m ago', m: 'Database connection verified with Turso Edge', s: 'success' },
                                        { t: '1h ago', m: 'Security protocols updated', s: 'warn' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-[#0036A7]/50 last:border-0 last:pb-0">
                                            <span className="text-gray-500 text-[10px] font-mono w-20 shrink-0 uppercase">{log.t}</span>
                                            <p className="text-sm text-gray-300">{log.m}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'infrastructure' && (
                    <div className="animate-in slide-in-from-right duration-500 max-w-2xl">
                        <div className="bg-gradient-to-br from-[#002A83] to-[#013DA1] border border-[#0036A7] rounded-3xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold font-serif text-white mb-4">Cloudflare Edge Cache</h3>
                            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                Manage the high-performance Key-Value storage that powers the public site.
                                Syncing ensures that your latest database changes are distributed across 300+ global data centers.
                            </p>

                            <div className="p-6 bg-[#001B55]/50 rounded-2xl border border-[#0036A7] mb-6">
                                <h4 className="text-xs font-bold text-[#00B8D4] uppercase tracking-widest mb-2">Live Site Sync</h4>
                                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                                    Pull the latest state from your Turso database and publish it to the live site instantly.
                                </p>
                                <button
                                    onClick={async () => {
                                        try {
                                            setMessage('Publishing database updates to live site...');
                                            const res = await fetch('/api/admin/dump', { method: 'POST' });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setMessage(`Success: Published ${data.diktatsCount} diktats, ${data.asistensiCount} asistensi, and ${data.faqsCount} FAQs.`);
                                            } else {
                                                setMessage(`Error: ${data.error}`);
                                            }
                                        } catch (e) {
                                            setMessage('Failed to reach server. Check connection.');
                                        }
                                    }}
                                    className="w-full py-4 bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,184,212,0.4)]"
                                >
                                    <Activity size={18} />
                                    Publish Updates to Live Site
                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                                <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">
                                    <Database size={16} />
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold text-yellow-500 uppercase">Architecture Note</h5>
                                    <p className="text-[10px] text-gray-400 italic">
                                        Manual sync is required because the public site is "db-less" for maximum speed and zero costs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'diktat' && <DiktatManager />}
                {activeTab === 'asistensi' && <AsistensiManager />}
                {activeTab === 'faq' && <FAQManager />}
                {activeTab === 'toolbox' && <ToolboxManager />}
            </main>
        </div>
    );
}
