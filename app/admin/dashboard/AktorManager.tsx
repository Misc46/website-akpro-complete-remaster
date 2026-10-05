"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    CheckCircle, 
    ExternalLink, 
    AlertCircle, 
    UserPlus, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Search,
    Eye,
    Copy,
    Check,
    MessageCircle,
    Edit3,
    Trash2,
    X,
    LayoutGrid,
    List,
    Calendar,
    FileText,
    Phone,
    UserCheck,
    Save
} from 'lucide-react';
import { verifyPayment, assignPengasis, updateRequestDetails, deleteRequest } from "@/app/lib/actions/request";

interface Request {
    id: number;
    namaLengkap: string;
    angkatan: number;
    jurusan: string;
    kontak: string | null;
    matkul: string;
    tanggal: string;
    jam: string;
    sudahHubungiJoy: boolean;
    sudahBayar: boolean;
    buktiBayarUrl: string | null;
    pengasisId: number | null;
    status: string;
    catatan: string | null;
    createdAt: string;
    updatedAt?: string;
}

interface Pengasis {
    id: number;
    nama: string;
    kode: string;
    semester?: number;
    matkul: string; // JSON string
}

export default function AktorManager() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [pengasisList, setPengasisList] = useState<Pengasis[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    
    // Details Modal / Card State
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [editPengasisId, setEditPengasisId] = useState<string>('');
    const [editStatus, setEditStatus] = useState<string>('');
    const [editCatatan, setEditCatatan] = useState<string>('');
    const [editKontak, setEditKontak] = useState<string>('');
    const [isEditingKontak, setIsEditingKontak] = useState<boolean>(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [modalSaving, setModalSaving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/requests');
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests);
                setPengasisList(data.pengasis);
                
                // If a modal is open, keep selectedRequest in sync
                setSelectedRequest(prev => {
                    if (!prev) return null;
                    const updated = data.requests.find((r: Request) => r.id === prev.id);
                    return updated || null;
                });
            } else {
                setError(data.error || 'Failed to fetch requests');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Open Details Modal
    const openDetails = (req: Request) => {
        setSelectedRequest(req);
        setEditPengasisId(req.pengasisId ? req.pengasisId.toString() : '');
        setEditStatus(req.status);
        setEditCatatan(req.catatan || '');
        setEditKontak(req.kontak || '');
        setIsEditingKontak(false);
    };

    const closeDetails = () => {
        setSelectedRequest(null);
        setIsEditingKontak(false);
    };

    const handleVerify = async (id: number) => {
        setActionLoading(id);
        setError('');
        try {
            const result = await verifyPayment(id);
            if (result.success) {
                setSuccessMessage('Payment verified successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
                await fetchData();
            } else {
                setError('Failed to verify payment');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAssign = async (requestId: number, pengasisIdStr: string) => {
        setActionLoading(requestId);
        setError('');
        try {
            if (!pengasisIdStr || pengasisIdStr === 'unassign') {
                const res = await updateRequestDetails(requestId, { pengasisId: null, status: 'verified' });
                if (res.success) {
                    await fetchData();
                } else {
                    setError('Failed to unassign tutor');
                }
            } else {
                const result = await assignPengasis(requestId, parseInt(pengasisIdStr));
                if (result.success) {
                    await fetchData();
                } else {
                    setError('Failed to assign pengasis');
                }
            }
        } catch (err) {
            setError('Assignment failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveModalChanges = async () => {
        if (!selectedRequest) return;
        setModalSaving(true);
        setError('');
        try {
            const updates: {
                pengasisId?: number | null;
                status?: string;
                catatan?: string | null;
                kontak?: string | null;
            } = {
                status: editStatus,
                catatan: editCatatan,
                kontak: editKontak,
            };

            if (editPengasisId === 'unassign' || editPengasisId === '') {
                updates.pengasisId = null;
            } else {
                updates.pengasisId = parseInt(editPengasisId);
            }

            const res = await updateRequestDetails(selectedRequest.id, updates);
            if (res.success) {
                setSuccessMessage('Request details updated successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
                await fetchData();
                setIsEditingKontak(false);
            } else {
                setError(res.error || 'Failed to save changes');
            }
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setModalSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
            return;
        }
        setActionLoading(id);
        setError('');
        try {
            const res = await deleteRequest(id);
            if (res.success) {
                if (selectedRequest?.id === id) {
                    closeDetails();
                }
                await fetchData();
                setSuccessMessage('Request deleted');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(res.error || 'Failed to delete request');
            }
        } catch (err) {
            setError('Failed to delete request');
        } finally {
            setActionLoading(null);
        }
    };

    const copyToClipboard = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter requests
    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesQuery = 
                req.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.matkul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (req.kontak && req.kontak.toLowerCase().includes(searchQuery.toLowerCase())) ||
                req.jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.status.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
            case 'verified':
                return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
            case 'assigned':
                return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
            case 'done':
                return 'bg-green-500/10 text-green-400 border border-green-500/20';
            case 'cancelled':
                return 'bg-red-500/10 text-red-400 border border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
        }
    };

    const formatWhatsAppLink = (kontak: string | null) => {
        if (!kontak) return null;
        const cleaned = kontak.replace(/[^0-9]/g, '');
        if (cleaned.length >= 9) {
            let phone = cleaned;
            if (phone.startsWith('0')) {
                phone = '62' + phone.slice(1);
            } else if (!phone.startsWith('62')) {
                phone = '62' + phone;
            }
            return `https://wa.me/${phone}`;
        }
        return null;
    };

    if (loading) return <div className="text-white italic">Loading Aktor Requests...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header, Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[#002A83] p-6 rounded-3xl border border-[#0036A7]">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search student, matkul, contact..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#001B55] border border-[#0036A7] text-white pl-12 pr-4 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00B8D4] transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#001B55] border border-[#0036A7] text-white px-3 py-2.5 rounded-xl text-xs outline-none cursor-pointer"
                    >
                        <option value="all">Semua Status ({requests.length})</option>
                        <option value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</option>
                        <option value="verified">Verified ({requests.filter(r => r.status === 'verified').length})</option>
                        <option value="assigned">Assigned ({requests.filter(r => r.status === 'assigned').length})</option>
                        <option value="done">Done ({requests.filter(r => r.status === 'done').length})</option>
                        <option value="cancelled">Cancelled ({requests.filter(r => r.status === 'cancelled').length})</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex bg-[#001B55] p-1 rounded-xl border border-[#0036A7]">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-[#00B8D4] text-[#001B55]' : 'text-gray-400 hover:text-white'}`}
                            title="Table View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-1.5 rounded-lg transition ${viewMode === 'cards' ? 'bg-[#00B8D4] text-[#001B55]' : 'text-gray-400 hover:text-white'}`}
                            title="Cards View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#001B55] rounded-xl border border-[#0036A7]">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-[10px] font-bold uppercase text-gray-400">Pending: {requests.filter(r => r.status === 'pending').length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#001B55] rounded-xl border border-[#0036A7]">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-[10px] font-bold uppercase text-gray-400">Assigned: {requests.filter(r => r.status === 'assigned').length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center justify-between text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-white"><X size={14} /></button>
                </div>
            )}

            {successMessage && (
                <div className="flex items-center justify-between text-emerald-400 text-xs bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage('')} className="text-emerald-400 hover:text-white"><X size={14} /></button>
                </div>
            )}

            {/* Content List: Table View or Cards View */}
            {viewMode === 'table' ? (
                <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-[#0036A7] flex justify-between items-center">
                        <h2 className="text-xl font-bold font-serif text-white">Incoming Requests</h2>
                        <span className="text-xs text-gray-400 font-mono">Total: {filteredRequests.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#001B55] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student & Contact</th>
                                    <th className="px-6 py-4">Matkul & Time</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Assignment</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0036A7]">
                                {filteredRequests.map(req => {
                                    const assignedPengasis = pengasisList.find(p => p.id === req.pengasisId);
                                    const waLink = formatWhatsAppLink(req.kontak);

                                    return (
                                        <tr key={req.id} className="hover:bg-[#0036A7]/30 transition group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white text-sm">{req.namaLengkap}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">{req.jurusan} &apos;{req.angkatan.toString().slice(-2)}</p>
                                                
                                                {/* Contact info pill */}
                                                {req.kontak ? (
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                            <Phone size={10} />
                                                            {req.kontak}
                                                        </span>
                                                        <button 
                                                            onClick={() => copyToClipboard(req.kontak!, req.id)}
                                                            className="p-1 hover:bg-[#001B55] text-gray-400 hover:text-white rounded transition"
                                                            title="Copy contact"
                                                        >
                                                            {copiedId === req.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                        </button>
                                                        {waLink && (
                                                            <a 
                                                                href={waLink} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="p-1 hover:bg-[#001B55] text-emerald-400 hover:text-emerald-300 rounded transition"
                                                                title="Chat on WhatsApp"
                                                            >
                                                                <MessageCircle size={12} />
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-500 italic mt-1 block">No contact</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-200 font-medium">{req.matkul}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                                    <Clock size={12} />
                                                    <span>{req.tanggal} @ {req.jam}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.buktiBayarUrl ? (
                                                    <a 
                                                        href={req.buktiBayarUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B8D4]/10 text-[#00B8D4] hover:bg-[#00B8D4]/20 rounded-lg text-[10px] font-bold transition-all border border-[#00B8D4]/20"
                                                    >
                                                        View Proof <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20 uppercase">No Proof</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.pengasisId ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2 text-xs text-white bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                                            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                                            <span className="font-bold truncate max-w-[140px]">{assignedPengasis?.nama || 'Assigned'}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => openDetails(req)}
                                                            className="p-1.5 bg-[#001B55] hover:bg-[#0036A7] text-[#00B8D4] rounded-lg transition"
                                                            title="Edit Pengasis"
                                                        >
                                                            <Edit3 size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative min-w-[160px]">
                                                        <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                        <select
                                                            className="bg-[#001B55] border border-[#0036A7] rounded-xl text-xs pl-9 pr-4 py-2 text-white w-full outline-none focus:border-[#00B8D4] transition-all appearance-none cursor-pointer"
                                                            onChange={(e) => handleAssign(req.id, e.target.value)}
                                                            defaultValue=""
                                                            disabled={actionLoading === req.id || req.status === 'pending'}
                                                        >
                                                            <option value="" disabled>Assign Assistant...</option>
                                                            {pengasisList
                                                                .filter(p => {
                                                                    try {
                                                                        const matkuls = JSON.parse(p.matkul);
                                                                        return matkuls.includes(req.matkul);
                                                                    } catch (e) {
                                                                        return false;
                                                                    }
                                                                })
                                                                .map(p => (
                                                                    <option key={p.id} value={p.id}>{p.nama} ({p.kode})</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusBadge(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {req.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleVerify(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                                                            title="Verify Payment"
                                                        >
                                                            <CheckCircle size={12} />
                                                            <span>Verify</span>
                                                        </button>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => openDetails(req)}
                                                        className="px-3 py-1.5 bg-[#001B55] hover:bg-[#0036A7] text-[#00B8D4] border border-[#0036A7] rounded-lg text-[10px] font-bold transition flex items-center gap-1.5"
                                                    >
                                                        <Eye size={12} />
                                                        <span>Details</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredRequests.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="inline-flex p-4 bg-[#001B55] rounded-full text-gray-500 mb-4">
                                <Clock size={32} />
                            </div>
                            <p className="text-gray-500 font-bold italic">No requests found matching your criteria.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Cards View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map(req => {
                        const assignedPengasis = pengasisList.find(p => p.id === req.pengasisId);
                        const waLink = formatWhatsAppLink(req.kontak);

                        return (
                            <div 
                                key={req.id} 
                                className="bg-[#002A83] border border-[#0036A7] hover:border-[#00B8D4]/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">#{req.id}</span>
                                            <h3 className="text-lg font-bold text-white font-serif">{req.namaLengkap}</h3>
                                            <p className="text-[10px] text-gray-400 uppercase font-black">{req.jurusan} &apos;{req.angkatan.toString().slice(-2)}</p>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusBadge(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    {/* Contact info pill */}
                                    <div className="bg-[#001B55] p-3 rounded-xl border border-[#0036A7]/60 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Phone size={13} className="text-[#00B8D4]" />
                                            <span className="text-xs font-mono text-gray-200">{req.kontak || 'No contact info'}</span>
                                        </div>
                                        {req.kontak && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => copyToClipboard(req.kontak!, req.id)}
                                                    className="p-1 hover:bg-[#002A83] text-gray-400 hover:text-white rounded transition"
                                                    title="Copy contact"
                                                >
                                                    {copiedId === req.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                </button>
                                                {waLink && (
                                                    <a
                                                        href={waLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 hover:bg-[#002A83] text-emerald-400 hover:text-emerald-300 rounded transition"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Session Info */}
                                    <div className="space-y-1 text-xs">
                                        <p className="text-gray-300 font-bold">{req.matkul}</p>
                                        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                                            <Clock size={12} />
                                            <span>{req.tanggal} @ {req.jam} WIB</span>
                                        </div>
                                    </div>

                                    {/* Assignment info */}
                                    <div className="pt-2 border-t border-[#0036A7]/60">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">Pengasis</span>
                                        {req.pengasisId ? (
                                            <div className="flex items-center justify-between bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 text-xs">
                                                <div className="flex items-center gap-2 text-white">
                                                    <CheckCircle2 size={14} className="text-green-400" />
                                                    <span className="font-bold">{assignedPengasis?.nama}</span>
                                                </div>
                                                <button
                                                    onClick={() => openDetails(req)}
                                                    className="text-[10px] font-bold text-[#00B8D4] hover:underline"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openDetails(req)}
                                                className="w-full py-2 px-3 bg-[#001B55] hover:bg-[#001B55]/80 text-[#00B8D4] border border-dashed border-[#00B8D4]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                                            >
                                                <UserPlus size={14} />
                                                <span>Assign Pengasis</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-[#0036A7] flex items-center justify-between gap-2">
                                    {req.buktiBayarUrl ? (
                                        <a 
                                            href={req.buktiBayarUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-bold text-[#00B8D4] hover:underline flex items-center gap-1"
                                        >
                                            Bukti Bayar <ExternalLink size={10} />
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-red-400 uppercase font-bold">No receipt</span>
                                    )}

                                    <button
                                        onClick={() => openDetails(req)}
                                        className="px-4 py-2 bg-[#001B55] hover:bg-[#0036A7] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-[#0036A7]"
                                    >
                                        <Eye size={12} />
                                        <span>Details & Edit</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* DETAILS MODAL / CARD */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div 
                        className="bg-[#002A83] border border-[#0036A7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white relative space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-[#0036A7]">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                                        Request #{selectedRequest.id}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${getStatusBadge(editStatus)}`}>
                                        {editStatus}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold font-serif text-white">{selectedRequest.namaLengkap}</h3>
                                <p className="text-xs text-gray-400 uppercase font-black mt-0.5">
                                    {selectedRequest.jurusan} &bull; Angkatan {selectedRequest.angkatan}
                                </p>
                            </div>
                            <button 
                                onClick={closeDetails}
                                className="p-2 text-gray-400 hover:text-white bg-[#001B55] rounded-xl hover:bg-[#0036A7] transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contact Information Section */}
                        <div className="bg-[#001B55] p-5 rounded-2xl border border-[#0036A7] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                    <Phone size={14} className="text-[#00B8D4]" />
                                    Contact Information
                                </span>
                                <div className="flex items-center gap-2">
                                    {isEditingKontak ? (
                                        <button
                                            onClick={() => setIsEditingKontak(false)}
                                            className="text-[10px] text-gray-400 hover:text-white uppercase font-bold"
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingKontak(true)}
                                            className="text-[10px] text-[#00B8D4] hover:underline uppercase font-bold flex items-center gap-1"
                                        >
                                            <Edit3 size={10} /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isEditingKontak ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editKontak}
                                        onChange={(e) => setEditKontak(e.target.value)}
                                        placeholder="Enter Line ID or WhatsApp number"
                                        className="w-full bg-[#002A83] border border-[#0036A7] text-white px-3 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#00B8D4]"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-[#002A83] p-3 rounded-xl border border-[#0036A7]/60">
                                    <span className="text-sm font-mono text-emerald-400 font-bold">
                                        {editKontak || 'Belum ada kontak'}
                                    </span>
                                    {editKontak && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(editKontak, selectedRequest.id)}
                                                className="px-2.5 py-1 bg-[#001B55] hover:bg-[#0036A7] text-white text-xs rounded-lg transition flex items-center gap-1 border border-[#0036A7]"
                                            >
                                                {copiedId === selectedRequest.id ? (
                                                    <>
                                                        <Check size={12} className="text-green-400" />
                                                        <span className="text-green-400">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                            {formatWhatsAppLink(editKontak) && (
                                                <a
                                                    href={formatWhatsAppLink(editKontak)!}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg transition flex items-center gap-1 shadow-xs"
                                                >
                                                    <MessageCircle size={12} />
                                                    <span>WhatsApp</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Session Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#001B55] p-4 rounded-2xl border border-[#0036A7] space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Mata Kuliah</span>
                                <p className="text-base font-bold text-white">{selectedRequest.matkul}</p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                                    <Clock size={14} className="text-[#00B8D4]" />
                                    <span>{selectedRequest.tanggal} @ {selectedRequest.jam} WIB</span>
                                </div>
                            </div>

                            <div className="bg-[#001B55] p-4 rounded-2xl border border-[#0036A7] space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Status & Confirmation</span>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                                        selectedRequest.sudahBayar ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    }`}>
                                        {selectedRequest.sudahBayar ? 'Sudah Bayar' : 'Belum Bayar'}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                                        selectedRequest.sudahHubungiJoy ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                        {selectedRequest.sudahHubungiJoy ? 'Hubungi Joy: Ya' : 'Hubungi Joy: Tidak'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Verification & Proof */}
                        <div className="bg-[#001B55] p-5 rounded-2xl border border-[#0036A7] space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                                Payment Verification
                            </span>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {selectedRequest.buktiBayarUrl ? (
                                    <a
                                        href={selectedRequest.buktiBayarUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#00B8D4]/10 text-[#00B8D4] hover:bg-[#00B8D4]/20 rounded-xl text-xs font-bold border border-[#00B8D4]/30 transition"
                                    >
                                        <span>Buka Bukti Bayar Google Drive</span>
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <span className="text-xs text-red-400 italic">User belum melampirkan link bukti bayar.</span>
                                )}

                                {!selectedRequest.sudahBayar && (
                                    <button
                                        onClick={() => handleVerify(selectedRequest.id)}
                                        disabled={actionLoading === selectedRequest.id}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                                    >
                                        <CheckCircle size={14} />
                                        <span>Konfirmasi Pembayaran</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Pengasis Assignment Section (Editable) */}
                        <div className="bg-[#001B55] p-5 rounded-2xl border border-[#0036A7] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                    <UserCheck size={14} className="text-[#00B8D4]" />
                                    Edit Pengasis / Aktor Tutor
                                </span>
                                {selectedRequest.pengasisId && (
                                    <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">
                                        Assigned
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Pilih Aktor:</label>
                                <select
                                    value={editPengasisId}
                                    onChange={(e) => setEditPengasisId(e.target.value)}
                                    className="w-full bg-[#002A83] border border-[#0036A7] text-white px-4 py-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00B8D4] cursor-pointer"
                                >
                                    <option value="">-- Belum ada Pengasis --</option>
                                    <option value="unassign" className="text-red-400">&times; Batalkan Assignment (Kosongkan)</option>
                                    <optgroup label="Tutor untuk mata kuliah ini:">
                                        {pengasisList
                                            .filter(p => {
                                                try {
                                                    const matkuls = JSON.parse(p.matkul);
                                                    return matkuls.includes(selectedRequest.matkul);
                                                } catch {
                                                    return false;
                                                }
                                            })
                                            .map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nama} ({p.kode}) &bull; Smt {p.semester}
                                                </option>
                                            ))
                                        }
                                    </optgroup>
                                    <optgroup label="Semua Tutor Aktif:">
                                        {pengasisList.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nama} ({p.kode})
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        {/* Status & Notes Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Change Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white px-3 py-2.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#00B8D4] cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="verified">Verified</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="done">Done</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Admin Notes (Catatan)</label>
                                <textarea
                                    value={editCatatan}
                                    onChange={(e) => setEditCatatan(e.target.value)}
                                    rows={2}
                                    placeholder="Catatan internal admin (e.g. link zoom, konfirmasi tutor)..."
                                    className="w-full bg-[#001B55] border border-[#0036A7] text-white p-2.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#00B8D4]"
                                />
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="pt-4 border-t border-[#0036A7] flex flex-col sm:flex-row items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => handleDelete(selectedRequest.id)}
                                disabled={actionLoading === selectedRequest.id}
                                className="w-full sm:w-auto px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                                <Trash2 size={14} />
                                <span>Delete Request</span>
                            </button>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={closeDetails}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-[#001B55] hover:bg-[#0036A7] text-gray-300 hover:text-white rounded-xl text-xs font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveModalChanges}
                                    disabled={modalSaving}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-[#00B8D4] hover:bg-[#00D4FF] text-[#001B55] rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    <span>{modalSaving ? 'Saving...' : 'Save All Changes'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
