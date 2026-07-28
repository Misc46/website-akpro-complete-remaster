import { db } from "@/app/lib/db";
import { requests, pengasis } from "@/app/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allRequests = await db.select().from(requests).orderBy(desc(requests.createdAt));
    const allPengasis = await db.select().from(pengasis).where(eq(pengasis.aktif, true));
    
    return NextResponse.json({ requests: allRequests, pengasis: allPengasis });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
