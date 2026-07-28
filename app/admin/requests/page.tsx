import { db } from "@/app/lib/db";
import { requests, pengasis } from "@/app/lib/db/schema";
import { desc } from "drizzle-orm";
import RequestTable from "./RequestTable";

export default async function AdminRequestsPage() {
  const allRequests = await db.select().from(requests).orderBy(desc(requests.createdAt));
  const allPengasis = await db.select().from(pengasis).where(eq(pengasis.aktif, true));

  return (
    <div className="min-h-screen bg-[#001B55] text-white p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-bold font-serif uppercase tracking-tight mb-2">Aktor Requests</h1>
        <p className="text-gray-400">Manage and verify assistant requests from students.</p>
      </header>

      <div className="bg-[#002A83] border border-[#0036A7] rounded-3xl overflow-hidden shadow-xl">
        <RequestTable requests={allRequests} pengasisList={allPengasis} />
      </div>
    </div>
  );
}

// Re-import eq because it's used in the query
import { eq } from "drizzle-orm";
