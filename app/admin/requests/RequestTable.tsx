"use client";

import { useState } from "react";
import { verifyPayment, assignPengasis } from "@/app/lib/actions/request";
import { Request, Pengasis } from "@/app/lib/db/schema";
import { ExternalLink, CheckCircle } from "lucide-react";

export default function RequestTable({ 
  requests, 
  pengasisList 
}: { 
  requests: Request[], 
  pengasisList: Pengasis[] 
}) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleVerify = async (id: number) => {
    setLoading(id);
    await verifyPayment(id);
    setLoading(null);
  };

  const handleAssign = async (requestId: number, pengasisId: string) => {
    if (!pengasisId) return;
    setLoading(requestId);
    await assignPengasis(requestId, parseInt(pengasisId));
    setLoading(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#0036A7] text-[#00B8D4] text-xs font-bold uppercase tracking-widest">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">Details</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Assignment</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0036A7]/50">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-[#0036A7]/20 transition-colors">
              <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{req.id}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-white">{req.namaLengkap}</div>
                <div className="text-xs text-gray-400">{req.jurusan} {req.angkatan}</div>
                {req.kontak && (
                  <div className="text-xs text-emerald-400 font-mono mt-0.5">Kontak: {req.kontak}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium">{req.matkul}</div>
                <div className="text-xs text-gray-500">{req.tanggal} @ {req.jam}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                  req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                  req.status === 'verified' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  req.status === 'assigned' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                  req.status === 'done' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                }`}>
                  {req.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {req.buktiBayarUrl ? (
                  <a 
                    href={req.buktiBayarUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#00B8D4] hover:underline"
                  >
                    View Proof <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-red-500">No proof</span>
                )}
              </td>
              <td className="px-6 py-4">
                {req.pengasisId ? (
                  <div className="text-xs text-white bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    {pengasisList.find(p => p.id === req.pengasisId)?.nama || 'Unknown'}
                  </div>
                ) : (
                  <select
                    className="bg-[#001B55] border border-[#0036A7] rounded-lg text-xs p-2 text-white w-full"
                    onChange={(e) => handleAssign(req.id, e.target.value)}
                    defaultValue=""
                    disabled={loading === req.id}
                  >
                    <option value="" disabled>Assign Aktor...</option>
                    {pengasisList
                      .filter(p => {
                        const matkuls = JSON.parse(p.matkul);
                        return matkuls.includes(req.matkul);
                      })
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.nama} ({p.kode})</option>
                      ))
                    }
                  </select>
                )}
              </td>
              <td className="px-6 py-4">
                {req.status === 'pending' && (
                  <button
                    onClick={() => handleVerify(req.id)}
                    disabled={loading === req.id}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
                    title="Verify Payment"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
