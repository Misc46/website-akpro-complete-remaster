"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, Save, X, AlertCircle,
    Wrench, FolderOpen, Youtube, BookOpen, Calendar,
    ChevronDown
} from 'lucide-react';

const ICON_OPTIONS = [
    { value: 'FolderOpen', label: 'Folder', Icon: FolderOpen },
    { value: 'Youtube', label: 'YouTube', Icon: Youtube },
    { value: 'BookOpen', label: 'Book', Icon: BookOpen },
    { value: 'Calendar', label: 'Calendar', Icon: Calendar },
];

const CATEGORY_OPTIONS = [
    { value: 'akademis', label: 'Akademis DTE' },
    { value: 'media', label: 'Media Belajar' },
    { value: 'transisi', label: 'Transisi Kurikulum' },
];

interface ToolboxItem {
    id: number;
    category_id: string;
    group_name: string | null;
    title: string;
    description: string | null;
    href: string;
    icon: string;
    order_index: number;
}

export default function ToolboxManager() {
    const [items, setItems] = useState<ToolboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<ToolboxItem>>({});
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [newData, setNewData] = useState({
        category_id: 'akademis',
        group_name: '',
        title: '',
        description: '',
        href: '',
        icon: 'FolderOpen',
        order_index: 0,
    });

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/admin/toolbox');
            const data = await res.json();
            if (res.ok) {
                setItems(data.items || []);
            }
        } catch {
            setError('Failed to fetch toolbox items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/toolbox', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newData,
                    group_name: newData.group_name || null,
                    description: newData.description || null,
                })
            });
            if (res.ok) {
                setNewData({
                    category_id: 'akademis',
                    group_name: '',
                    title: '',
                    description: '',
                    href: '',
                    icon: 'FolderOpen',
                    order_index: items.length,
                });
                setShowForm(false);
                fetchItems();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to create');
            }
        } catch {
            setError('Network error');
        }
    };

    const handleUpdate = async (id: number) => {
        setError('');
        try {
            const res = await fetch('/api/admin/toolbox', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editData })
            });
            if (res.ok) {
                setEditingId(null);
                fetchItems();
            } else {
                const d = await res.json();
                setError(d.error || 'Failed to update');
            }
        } catch {
            setError('Network error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this toolbox item?')) return;
        try {
            const res = await fetch('/api/admin/toolbox', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchItems();
        } catch {
            setError('Delete failed');
        }
    };

    const startEditing = (item: ToolboxItem) => {
        setEditingId(item.id);
        setEditData({ ...item });
    };

    const getIconComponent = (iconName: string, size = 16) => {
        const found = ICON_OPTIONS.find(o => o.value === iconName);
        if (found) {
            const IconComp = found.Icon;
            return <IconComp size={size} />;
        }
        return <FolderOpen size={size} />;
    };

    const getCategoryLabel = (catId: string) => {
        return CATEGORY_OPTIONS.find(c => c.value === catId)?.label || catId;
    };

    const filteredItems = filterCategory === 'all'
        ? items
        : items.filter(i => i.category_id === filterCategory);

    const IconSelector = ({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) => (
        <div className="flex gap-1.5">
            {ICON_OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    id={`${id}-icon-${opt.value}`}
                    className={`p-2.5 rounded-lg border transition-all ${value === opt.value
                        ? 'bg-[#00B8D4] text-[#001B55] border-[#00B8D4] shadow-md shadow-[#00B8D4]/20'
                        : 'bg-[#001B55] text-gray-400 border-[#0036A7] hover:border-[#00B8D4]/50 hover:text-white'
                        }`}
                    title={opt.label}
                >
                    <opt.Icon size={16} />
                </button>
            ))}
        </div>
    );

    if (loading) return <div className="text-white italic">Loading Toolbox Manager...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with filter + add button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setFilterCategory('all')}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filterCategory === 'all'
                                ? 'bg-[#00B8D4] text-[#001B55]'
                                : 'bg-[#002A83] text-gray-400 border border-[#0036A7] hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORY_OPTIONS.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setFilterCategory(cat.value)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filterCategory === cat.value
                                    ? 'bg-[#00B8D4] text-[#001B55]'
                                    : 'bg-[#002A83] text-gray-400 border border-[#0036A7] hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold px-5 py-2.5 rounded-xl transition shadow-lg text-sm"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Add Item'}
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl p-8 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-2">
                        <Plus className="text-[#00B8D4]" />
                        Add Toolbox Item
                    </h2>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        value={newData.category_id}
                                        onChange={(e) => setNewData({ ...newData, category_id: e.target.value })}
                                        className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4] appearance-none cursor-pointer"
                                    >
                                        {CATEGORY_OPTIONS.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Group Name <span className="text-gray-500/60">(for grouped categories)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newData.group_name}
                                    onChange={(e) => setNewData({ ...newData, group_name: e.target.value })}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                    placeholder="E.g. Teknik Elektro"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newData.title}
                                    onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                    placeholder="E.g. Kalender FTUI"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order</label>
                                <input
                                    type="number"
                                    value={newData.order_index}
                                    onChange={(e) => setNewData({ ...newData, order_index: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <input
                                type="text"
                                value={newData.description}
                                onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="Short description (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link (URL)</label>
                            <input
                                type="url"
                                required
                                value={newData.href}
                                onChange={(e) => setNewData({ ...newData, href: e.target.value })}
                                className="w-full bg-[#001B55] border border-[#0036A7] text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon</label>
                            <IconSelector value={newData.icon} onChange={(v) => setNewData({ ...newData, icon: v })} id="new-item" />
                        </div>

                        <button
                            type="submit"
                            className="bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] font-bold px-8 py-3 rounded-xl transition shadow-lg"
                        >
                            Add Item
                        </button>
                    </form>
                </div>
            )}

            {/* Items List */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#0036A7] flex items-center justify-between">
                    <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                        <Wrench size={20} className="text-[#00B8D4]" />
                        Toolbox Registry
                    </h2>
                    <span className="text-xs text-gray-400 font-mono">{filteredItems.length} items</span>
                </div>
                <div className="p-6 space-y-3">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="border border-[#0036A7] rounded-2xl p-5 bg-[#001B55]/50 hover:bg-[#001B55] transition-all">
                            {editingId === item.id ? (
                                /* ---- EDIT MODE ---- */
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Category</label>
                                            <select
                                                value={editData.category_id || ''}
                                                onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                                                className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                            >
                                                {CATEGORY_OPTIONS.map(cat => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Group Name</label>
                                            <input
                                                type="text"
                                                value={editData.group_name || ''}
                                                onChange={(e) => setEditData({ ...editData, group_name: e.target.value || null })}
                                                className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                                placeholder="(for grouped categories)"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={editData.title || ''}
                                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                                className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Order</label>
                                            <input
                                                type="number"
                                                value={editData.order_index ?? 0}
                                                onChange={(e) => setEditData({ ...editData, order_index: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={editData.description || ''}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Link</label>
                                        <input
                                            type="url"
                                            value={editData.href || ''}
                                            onChange={(e) => setEditData({ ...editData, href: e.target.value })}
                                            className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-1.5 rounded-lg outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Icon</label>
                                        <IconSelector value={editData.icon || 'FolderOpen'} onChange={(v) => setEditData({ ...editData, icon: v })} id={`edit-${item.id}`} />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-white transition">
                                            <X size={18} />
                                        </button>
                                        <button onClick={() => handleUpdate(item.id)} className="p-2 text-[#00B8D4] hover:text-[#00D4FF] transition">
                                            <Save size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ---- VIEW MODE ---- */
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-start gap-3 flex-grow min-w-0">
                                        <div className="p-2 bg-[#0036A7]/50 text-[#00B8D4] rounded-lg shrink-0 mt-0.5">
                                            {getIconComponent(item.icon)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-[9px] font-bold bg-[#0036A7] px-2 py-0.5 rounded text-[#00B8D4] uppercase tracking-wider">
                                                    {getCategoryLabel(item.category_id)}
                                                </span>
                                                {item.group_name && (
                                                    <span className="text-[9px] font-bold bg-[#001B55] px-2 py-0.5 rounded text-gray-400 border border-[#0036A7]">
                                                        {item.group_name}
                                                    </span>
                                                )}
                                                <span className="text-[9px] font-mono text-gray-500">#{item.order_index}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                                            )}
                                            <p className="text-[10px] text-gray-500 mt-1 truncate font-mono">{item.href}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => startEditing(item)} className="p-2 text-gray-400 hover:text-[#00B8D4] transition">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredItems.length === 0 && <p className="text-gray-500 text-sm italic py-4">No toolbox items found.</p>}
                </div>
            </div>
        </div>
    );
}
