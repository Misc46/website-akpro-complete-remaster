"use server";

import { db } from "@/app/lib/db";
import { requests } from "@/app/lib/db/schema";
import { sendAktorRequestNotification } from "@/app/lib/fonnte";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

// ─── VALIDATION SCHEMA ────────────────────────────────────────────────────────

const RequestSchema = z.object({
  namaLengkap: z.string().min(3, "Nama minimal 3 karakter"),
  angkatan: z
    .number()
    .int()
    .min(2018)
    .max(new Date().getFullYear()),
  jurusan: z.enum(["Elektro", "Biomedik", "Tekkom"]),
  kontak: z.string().min(3, "Masukkan Line ID atau WhatsApp valid"),
  matkul: z.string().min(1, "Pilih mata kuliah"),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  jam: z.string().regex(/^\d{2}:\d{2}$/, "Format jam: HH:MM"),
  sudahHubungiJoy: z.preprocess((val) => val === true || val === 'true', z.boolean().refine(val => val === true, "Kamu harus konfirmasi ke Joy dulu sebelum submit")),
  sudahBayar: z.preprocess((val) => val === true || val === 'true', z.boolean().refine(val => val === true, "Pembayaran harus diselesaikan dulu")),
  buktiBayarUrl: z
    .string()
    .url("Masukkan link Google Drive yang valid")
    .refine(
      (url) => url.includes("drive.google.com"),
      "Link harus dari Google Drive"
    ),
});

export type RequestFormData = z.infer<typeof RequestSchema>;

// ─── ACTION ───────────────────────────────────────────────────────────────────

export type ActionResult =
  | { success: true; id: number }
  | { success: false; errors: Record<string, string[]> };

export async function submitRequest(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    namaLengkap: formData.get("namaLengkap"),
    angkatan: Number(formData.get("angkatan")),
    jurusan: formData.get("jurusan"),
    kontak: formData.get("kontak"),
    matkul: formData.get("matkul"),
    tanggal: formData.get("tanggal"),
    jam: formData.get("jam"),
    sudahHubungiJoy: formData.get("sudahHubungiJoy") === "true",
    sudahBayar: formData.get("sudahBayar") === "true",
    buktiBayarUrl: formData.get("buktiBayarUrl"),
  };

  const parsed = RequestSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const inserted = await db
      .insert(requests)
      .values({
        ...parsed.data,
        status: "pending",
      })
      .returning({ id: requests.id });

    const requestId = inserted[0].id;

    revalidatePath("/admin/requests");

    // Fire-and-forget: notify AKPRO 26 WhatsApp group via Fonnte.
    // We do NOT await so the user never waits on this.
    void sendAktorRequestNotification({
      id: requestId,
      namaLengkap: parsed.data.namaLengkap,
      kontak: parsed.data.kontak,
      jurusan: parsed.data.jurusan,
      angkatan: parsed.data.angkatan,
      matkul: parsed.data.matkul,
      tanggal: parsed.data.tanggal,
      jam: parsed.data.jam,
      buktiBayarUrl: parsed.data.buktiBayarUrl,
    });

    return { success: true, id: requestId };
  } catch (e) {
    console.error("Error submitting request:", e);
    return { success: false, errors: { form: ["Terjadi kesalahan saat menyimpan data"] } };
  }
}

// ─── ADMIN ACTIONS ────────────────────────────────────────────────────────────

export async function assignPengasis(requestId: number, pengasisId: number) {
  try {
    await db
      .update(requests)
      .set({
        pengasisId,
        status: "assigned",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(requests.id, requestId));

    revalidatePath("/admin/requests");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Assign pengasis error:", error);
    return { success: false };
  }
}

export async function verifyPayment(requestId: number) {
  try {
    await db
      .update(requests)
      .set({
        status: "verified",
        sudahBayar: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(requests.id, requestId));

    revalidatePath("/admin/requests");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Verify payment error:", error);
    return { success: false };
  }
}
