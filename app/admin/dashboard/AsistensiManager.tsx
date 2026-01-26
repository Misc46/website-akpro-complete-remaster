"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Video, Link as LinkIcon, AlertCircle, FolderPlus, Edit2, X } from 'lucide-react';

export default function AsistensiManager() {
    const [master, setMaster] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMasterForm, setShowMasterForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Asistensi Form State
    const [formData, setFormData] = useState({
        asistensi_id: '',
        name: '',
        major: ['elektro'] as string[],
        year: [1] as number[],
        person: [{ name: '' }],
        date: '',
        zoom_meetings_link: '',
        recordings_link: ''
    });

    // Master Group Form State
    const [masterFormData, setMasterFormData] = useState({
        year: new Date().getFullYear().toString(),
        ganjil_genap: 'ganjil',
        uts_uas: 'uts',
        type: 'asistensi'
    });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/asistensi');
            const data = await res.json();
            if (res.ok) {
                setMaster(data.master);
                setItems(data.items);
                if (data.master.length > 0 && !formData.asistensi_id) {
                    setFormData(prev => ({ ...prev, asistensi_id: data.master[0].id }));
                }
            }
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            asistensi_id: master.length > 0 ? master[0].id : '',
            name: '',
            major: ['elektro'],
            year: [1],
            person: [{ name: '' }],
            date: '',
            zoom_meetings_link: '',
            recordings_link: ''
        });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const url = '/api/admin/asistensi';
            const method = editingId ? 'PATCH' : 'POST';
            const body = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                resetForm();
                await fetchData();
                alert(editingId ? 'Session updated!' : 'Session scheduled!');
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to save');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            asistensi_id: item.asistensi_id,
            name: item.name,
            major: item.major,
            year: item.year,
            person: item.person,
            date: item.date,
            zoom_meetings_link: item.zoom_meetings_link || '',
            recordings_link: item.recordings_link || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            const res = await fetch('/api/admin/asistensi', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchData();
        } catch (err) {
            setError('Delete failed');
        }
    };

    if (loading) return <div className="text-white italic">Loading Scheduling Engine...</div>;

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

            {/* Entry Form */}
            <div className={`bg-[#002A83] border ${editingId ? 'border-[#00B8D4]' : 'border-[#0036A7]'} rounded-3xl p-8 shadow-xl transition-colors duration-500`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                        {editingId ? <Edit2 className="text-[#00B8D4]" /> : <Plus className="text-[#00B8D4]" />}
                        {editingId ? 'Edit Asistensi' : 'Schedule Asistensi'}
                    </h2>
                    {editingId && (
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-bold"
                        >
                            <X size={16} />
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Master Group</label>
                            <select
                                value={formData.asistensi_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, asistensi_id: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                            >
                                {master.map(m => (
                                    <option key={m.id} value={m.id}>{m.id}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Topic / Title</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="E.g. Responsi UTS Kalkulus"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Asisten Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.person[0].name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, person: [{ name: e.target.value }] }))}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Links</label>
                            <input
                                type="url"
                                value={formData.zoom_meetings_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, zoom_meetings_link: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4] mb-2"
                                placeholder="Zoom Link"
                            />
                            <input
                                type="url"
                                value={formData.recordings_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, recordings_link: e.target.value }))}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="Recording Link"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Filters</label>
                            <div className="flex flex-wrap gap-4 bg-[#001B55] p-3 rounded-xl border border-[#0036A7]">
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
                                        <span className="text-xs text-gray-300 capitalize">{m}</span>
                                    </label>
                                ))}
                                <div className="w-full border-t border-[#0036A7] my-1"></div>
                                {[1, 2].map(y => (
                                    <label key={y} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.year.includes(y)}
                                            onChange={(e) => {
                                                const newYear = e.target.checked
                                                    ? [...formData.year, y]
                                                    : formData.year.filter(x => Number(x) !== y);
                                                setFormData(prev => ({ ...prev, year: newYear as number[] }));
                                            }}
                                        />
                                        <span className="text-xs text-gray-300">Y{y}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full mt-auto ${editingId ? 'bg-[#00B8D4]' : 'bg-[#00B8D4]'} hover:bg-[#00D4FF] text-[#001B55] font-bold py-3 rounded-xl transition shadow-lg`}
                        >
                            {editingId ? 'Update Session' : 'Schedule Session'}
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
                    <h2 className="text-xl font-bold font-serif text-white">Active Schedule</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#001B55] text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Session & Date</th>
                                <th className="px-6 py-4">Asisten</th>
                                <th className="px-6 py-4">Assets</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0036A7]">
                            {items.slice().reverse().map(item => (
                                <tr key={item.id} className={`hover:bg-[#0036A7]/30 transition ${editingId === item.id ? 'bg-[#00B8D4]/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-sm">{item.name}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(item.date).toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {item.person.map((p: any) => p.name).join(', ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 text-gray-400">
                                            {item.zoom_meetings_link && <a href={item.zoom_meetings_link} target="_blank" rel="noreferrer"><Video size={16} className="hover:text-cyan-400" /></a>}
                                            {item.recordings_link && <a href={item.recordings_link} target="_blank" rel="noreferrer"><LinkIcon size={16} className="hover:text-cyan-400" /></a>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3 text-gray-400">
                                        <button onClick={() => handleEdit(item)} className="hover:text-[#00B8D4] transition">
                                            <Edit2 size={18} />
                                        </button>
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
