"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, AlertCircle, HelpCircle } from 'lucide-react';

export default function FAQManager() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ q: '', a: '', order_index: 0 });
    const [newData, setNewData] = useState({ q: '', a: '', order_index: 0 });

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/admin/faq');
            const data = await res.json();
            if (res.ok) {
                setFaqs(data);
                setNewData(prev => ({ ...prev, order_index: data.length }));
            } else {
                setError(data.details || data.error || 'Failed to fetch FAQs');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (res.ok) {
                setNewData({ q: '', a: '', order_index: faqs.length + 1 });
                fetchFaqs();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to create FAQ');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleUpdate = async (id: number) => {
        setError('');
        try {
            const res = await fetch('/api/admin/faq', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editData })
            });
            if (res.ok) {
                setEditingId(null);
                fetchFaqs();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to update FAQ');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            const res = await fetch('/api/admin/faq', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchFaqs();
        } catch (err) {
            setError('Delete failed');
        }
    };

    const startEditing = (faq: any) => {
        setEditingId(faq.id);
        setEditData({ q: faq.q, a: faq.a, order_index: faq.order_index });
    };

    if (loading) return <div className="text-white italic">Loading FAQ Engine...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Create Form */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
                    <Plus className="text-[#00B8D4]" />
                    Add New FAQ
                </h2>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Question</label>
                            <input
                                type="text"
                                required
                                value={newData.q}
                                onChange={(e) => setNewData({ ...newData, q: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="E.g. Apa itu Arsip AKPRO?"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order Index</label>
                            <input
                                type="number"
                                value={newData.order_index}
                                onChange={(e) => setNewData({ ...newData, order_index: parseInt(e.target.value) })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Answer</label>
                        <textarea
                            required
                            rows={3}
                            value={newData.a}
                            onChange={(e) => setNewData({ ...newData, a: e.target.value })}
                            className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4] resize-none"
                            placeholder="Provide a clear and concise answer..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold px-8 py-3 rounded-xl transition shadow-lg"
                    >
                        Add FAQ
                    </button>
                </form>
                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#0036A7]">
                    <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                        <HelpCircle size={20} className="text-[#00B8D4]" />
                        FAQ Registry
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="border border-[#0036A7] rounded-2xl p-5 bg-[#001B55]/50 hover:bg-[#001B55] transition-all">
                            {editingId === faq.id ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-3">
                                            <input
                                                type="text"
                                                value={editData.q}
                                                onChange={(e) => setEditData({ ...editData, q: e.target.value })}
                                                className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none"
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            value={editData.order_index}
                                            onChange={(e) => setEditData({ ...editData, order_index: parseInt(e.target.value) })}
                                            className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none"
                                        />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={editData.a}
                                        onChange={(e) => setEditData({ ...editData, a: e.target.value })}
                                        className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-white transition">
                                            <X size={18} />
                                        </button>
                                        <button onClick={() => handleUpdate(faq.id)} className="p-2 text-[#00B8D4] hover:text-[#00D4FF] transition">
                                            <Save size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-bold bg-[#0036A7] px-2 py-0.5 rounded text-gray-400">#{faq.order_index}</span>
                                            <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed font-sans">{faq.a}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => startEditing(faq)} className="p-2 text-gray-400 hover:text-[#00B8D4] transition">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(faq.id)} className="p-2 text-gray-400 hover:text-red-400 transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {faqs.length === 0 && <p className="text-gray-500 text-sm italic py-4">No FAQs found.</p>}
                </div>
            </div>
        </div>
    );
}
