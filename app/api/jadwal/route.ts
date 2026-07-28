import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { jadwalAsis } from "@/app/lib/db/schema";
import { eq, and, or, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matkul = searchParams.get("matkul");
  const jurusan = searchParams.get("jurusan");

  if (!matkul) {
    return NextResponse.json({ error: "Matkul is required" }, { status: 400 });
  }

  // Query jadwal berdasarkan matkul dan jurusan
  // Jurusan bisa null (untuk semua) atau match
  const conditions = [eq(jadwalAsis.matkul, matkul)];
  
  if (jurusan) {
    conditions.push(or(eq(jadwalAsis.jurusan, jurusan), isNull(jadwalAsis.jurusan)) as any);
  } else {
    conditions.push(isNull(jadwalAsis.jurusan));
  }

  const results = await db
    .select({
      hari: jadwalAsis.hari,
      jamMulai: jadwalAsis.jamMulai,
      jamSelesai: jadwalAsis.jamSelesai,
    })
    .from(jadwalAsis)
    .where(and(...conditions));

  return NextResponse.json(results);
}
