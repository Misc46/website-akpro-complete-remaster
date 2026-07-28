import { NextRequest, NextResponse } from "next/server";
import { MATKUL_SEMESTER_2, MATKUL_SEMESTER_4 } from "@/app/lib/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const semester = searchParams.get("semester");

  if (semester === "2") {
    return NextResponse.json(MATKUL_SEMESTER_2);
  } else if (semester === "4") {
    return NextResponse.json(MATKUL_SEMESTER_4);
  }

  return NextResponse.json({ error: "Invalid semester" }, { status: 400 });
}
