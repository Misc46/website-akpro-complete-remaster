"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
    CheckCircle, 
    ExternalLink, 
    AlertCircle, 
    UserPlus, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Search
} from 'lucide-react';
import { verifyPayment, assignPengasis } from "@/app/lib/actions/request";

interface Request {
    id: number;
    namaLengkap: string;
    angkatan: number;
    jurusan: string;
    matkul: string;
    tanggal: string;
    jam: string;
    sudahHubungiJoy: boolean;
    sudahBayar: boolean;
    buktiBayarUrl: string | null;
    pengasisId: number | null;
    status: string;
    createdAt: string;
}

interface Pengasis {
    id: number;
    nama: string;
    kode: string;
    matkul: string; // JSON string
}

export default function AktorManager() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [pengasisList, setPengasisList] = useState<Pengasis[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/requests');
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests);
                setPengasisList(data.pengasis);
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

    const handleVerify = async (id: number) => {
        setActionLoading(id);
        try {
            const result = await verifyPayment(id);
            if (result.success) {
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

    const handleAssign = async (requestId: number, pengasisId: string) => {
        if (!pengasisId) return;
        setActionLoading(requestId);
        try {
            const result = await assignPengasis(requestId, parseInt(pengasisId));
            if (result.success) {
                await fetchData();
            } else {
                setError('Failed to assign pengasis');
            }
        } catch (err) {
            setError('Assignment failed');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRequests = requests.filter(req => 
        req.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.matkul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="text-white italic">Loading Aktor Requests...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#002A83] p-6 rounded-3xl border border-[#0036A7]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#001B55] border border-[#0036A7] text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00B8D4] transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#001B55] rounded-xl border border-[#0036A7]">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Pending: {requests.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#001B55] rounded-xl border border-[#0036A7]">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Verified: {requests.filter(r => r.status === 'verified').length}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* List Table */}
            <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#0036A7] flex justify-between items-center">
                    <h2 className="text-xl font-bold font-serif text-white">Incoming Requests</h2>
                    <span className="text-xs text-gray-400 font-mono">Total: {filteredRequests.length}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#001B55] text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Matkul & Time</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Assignment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0036A7]">
                            {filteredRequests.map(req => (
                                <tr key={req.id} className="hover:bg-[#0036A7]/30 transition group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white text-sm">{req.namaLengkap}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{req.jurusan} &apos;{req.angkatan.toString().slice(-2)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-200">{req.matkul}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
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
                                            <div className="flex items-center gap-2 text-xs text-white bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                                                <CheckCircle2 size={14} className="text-green-500" />
                                                <span className="font-bold">{pengasisList.find(p => p.id === req.pengasisId)?.nama}</span>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
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
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                            req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                            req.status === 'verified' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                            req.status === 'assigned' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                            req.status === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <button
                                                onClick={() => handleVerify(req.id)}
                                                disabled={actionLoading === req.id}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 ml-auto shadow-lg shadow-green-900/20"
                                            >
                                                <CheckCircle size={14} />
                                                Verify Payment
                                            </button>
                                        )}
                                        {req.status === 'assigned' && (
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                title="Cancel Assignment (TBA)"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
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
        </div>
    );
}
