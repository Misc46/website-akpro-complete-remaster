import { db } from "@/app/lib/db";
import { requests, pengasis } from "@/app/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge';

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing request id" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (data.pengasisId !== undefined) {
      updateData.pengasisId = data.pengasisId;
      if (data.pengasisId !== null && !data.status) {
        updateData.status = "assigned";
      } else if (data.pengasisId === null && (!data.status || data.status === "assigned")) {
        updateData.status = "verified";
      }
    }

    if (data.status !== undefined) updateData.status = data.status;
    if (data.catatan !== undefined) updateData.catatan = data.catatan;
    if (data.kontak !== undefined) updateData.kontak = data.kontak;
    if (data.sudahBayar !== undefined) {
      updateData.sudahBayar = data.sudahBayar;
      if (data.sudahBayar && (!data.status || data.status === "pending")) {
        updateData.status = "verified";
      }
    }

    await db.update(requests).set(updateData).where(eq(requests.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    await db.delete(requests).where(eq(requests.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete request error:", error);
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}

