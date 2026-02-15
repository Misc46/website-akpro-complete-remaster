"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ExternalLink, AlertCircle, Eye, EyeOff, FolderPlus } from 'lucide-react';

export default function DiktatManager() {
    const [master, setMaster] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMasterForm, setShowMasterForm] = useState(false);

    // Diktat Form State
    const [formData, setFormData] = useState({
        diktat_id: '',
        name: '',
        major: ['elektro'],
        year: [1],
        google_drive_link: '',
        img: ''
    });

    // Master Group Form State
    const [masterFormData, setMasterFormData] = useState({
        year: new Date().getFullYear().toString(),
        ganjil_genap: 'ganjil',
        uts_uas: 'uts',
        type: 'diktat'
    });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/diktat');
            const data = await res.json();
            if (res.ok) {
                setMaster(data.master);
                setItems(data.items);
                if (data.master.length > 0 && !formData.diktat_id) {
                    setFormData(prev => ({ ...prev, diktat_id: data.master[0].id }));
                }
            } else {
                setError(data.details || data.error || 'Failed to fetch data');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/diktat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData(prev => ({ ...prev, name: '', google_drive_link: '' }));
                fetchData();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to save');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleMasterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/master-group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(masterFormData)
            });
            if (res.ok) {
                setShowMasterForm(false);
                fetchData();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to create master group');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch('/api/admin/diktat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchData();
        } catch (err) {
            setError('Delete failed');
        }
    };

    const toggleVisibility = async (id: string, currentStatus: number) => {
        try {
            const res = await fetch('/api/admin/diktat', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !currentStatus })
            });
            if (res.ok) fetchData();
        } catch (err) {
            setError('Update failed');
        }
    };

    // Sort Master Groups based on Public Page Logic
    const sortedMaster = useMemo(() => {
        return [...master].sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (a.ganjil_genap !== b.ganjil_genap) {
                return a.ganjil_genap === 'ganjil' ? -1 : 1;
            }
            if (a.uts_uas !== b.uts_uas) {
                return b.uts_uas === 'uas' ? 1 : -1;
            }
            return 0;
        });
    }, [master]);

    // Sort documents for registry
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (a.diktat_id !== b.diktat_id) return b.diktat_id.localeCompare(a.diktat_id);
            return a.name.localeCompare(b.name);
        });
    }, [items]);

    if (loading) return <div className="text-white italic">Loading Diktat Engine...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex justify-end pr-4">
                <button
                    onClick={() => setShowMasterForm(!showMasterForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0036A7] hover:bg-[#00B8D4] text-white hover:text-[#001B55] rounded-xl font-bold transition-all text-sm"
                >
                    <FolderPlus size={18} />
                    {showMasterForm ? 'Cancel Creation' : 'New Master Group'}
                </button>
            </div>

            {/* New Master Group Form */}
            {showMasterForm && (
                <div className="bg-[#002A83] border border-[#00B8D4]/30 rounded-3xl p-8 shadow-xl animate-in slide-in-from-top duration-300">
                    <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
                        <FolderPlus className="text-[#00B8D4]" />
                        Create Master Definition
                    </h2>
                    <form onSubmit={handleMasterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Academic Year</label>
                            <input
                                type="number"
                                value={masterFormData.year}
                                onChange={(e) => setMasterFormData({ ...masterFormData, year: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none"
                                placeholder="Year (e.g. 2025)"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Semester</label>
                            <select
                                value={masterFormData.ganjil_genap}
                                onChange={(e) => setMasterFormData({ ...masterFormData, ganjil_genap: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none"
                            >
                                <option value="ganjil">Ganjil (Odd)</option>
                                <option value="genap">Genap (Even)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Exam Type</label>
                            <select
                                value={masterFormData.uts_uas}
                                onChange={(e) => setMasterFormData({ ...masterFormData, uts_uas: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none"
                            >
                                <option value="uts">UTS (Midterm)</option>
                                <option value="uas">UAS (Final)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold py-3 rounded-xl transition shadow-lg h-[46px]"
                        >
                            Create Group
                        </button>
                    </form>
                </div>
            )}

            {/* Master Group Visibility Menu */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl p-6 shadow-xl">
                <h2 className="text-xl font-bold font-serif text-white mb-4">Master Visibility Control</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {sortedMaster.map(m => (
                        <button
                            key={m.id}
                            onClick={() => toggleVisibility(m.id, m.is_active)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${m.is_active ? 'bg-[#00B8D4]/10 border-[#00B8D4] text-[#00B8D4]' : 'bg-[#001B55] border-[#0036A7] text-gray-500'}`}
                        >
                            {m.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                            <span className="text-[10px] font-bold uppercase tracking-tight text-center">{m.id.replace('Diktat_', '').replace(/_/g, ' ')}</span>
                            <span className="text-[9px] opacity-60 uppercase font-black">{m.is_active ? 'Visible' : 'Archived'}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Entry Form */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
                    <Plus className="text-[#00B8D4]" />
                    Add New Diktat
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Master Group</label>
                            <select
                                value={formData.diktat_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, diktat_id: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                            >
                                {sortedMaster.map(m => (
                                    <option key={m.id} value={m.id}>{m.id}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Matakuliah Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="E.g. Dasar Sistem Kontrol"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">G-Drive Link</label>
                            <input
                                type="url"
                                required
                                value={formData.google_drive_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, google_drive_link: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Major Access</label>
                            <div className="flex gap-4">
                                {['elektro', 'komputer', 'biomedik'].map(m => (
                                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.major.includes(m)}
                                            onChange={(e) => {
                                                const newMajor = e.target.checked
                                                    ? [...formData.major, m]
                                                    : formData.major.filter(x => x !== m);
                                                setFormData(prev => ({ ...prev, major: newMajor }));
                                            }}
                                        />
                                        <span className="text-sm text-gray-300 capitalize">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Semesters (Year)</label>
                            <div className="flex gap-4">
                                {[1, 2].map(y => (
                                    <label key={y} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.year.includes(y)}
                                            onChange={(e) => {
                                                const newYear = e.target.checked
                                                    ? [...formData.year, y]
                                                    : formData.year.filter(x => x !== y);
                                                setFormData(prev => ({ ...prev, year: newYear }));
                                            }}
                                        />
                                        <span className="text-sm text-gray-300">Year {y}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-auto bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold py-3 rounded-xl transition shadow-lg"
                        >
                            Commit to Database
                        </button>
                    </div>
                </form>
                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* List Table */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#0036A7]">
                    <h2 className="text-xl font-bold font-serif text-white">Document Registry</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#001B55] text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Group</th>
                                <th className="px-6 py-4">Filters</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0036A7]">
                            {sortedItems.map(item => (
                                <tr key={item.id} className="hover:bg-[#0036A7]/30 transition">
                                    <td className="px-6 py-4 font-bold text-white text-sm">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{item.diktat_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {item.major.map((m: any) => (
                                                <span key={m} className="px-2 py-0.5 bg-[#00B8D4]/10 text-[#00B8D4] rounded text-[10px] uppercase font-bold">{m}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3 text-gray-400">
                                        <a href={item.google_drive_link} target="_blank" rel="noreferrer" className="hover:text-white transition">
                                            <ExternalLink size={18} />
                                        </a>
                                        <button onClick={() => handleDelete(item.id)} className="hover:text-red-400 transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
