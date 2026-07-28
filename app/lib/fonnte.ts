const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const FONNTE_AKPRO_GROUP_ID = process.env.FONNTE_AKPRO_GROUP_ID || '120363426820994528@g.us';
const BASE_URL = 'https://api.fonnte.com';

export interface AktorNotificationPayload {
  id: number;
  namaLengkap: string;
  kontak: string;
  jurusan: string;
  angkatan: number;
  matkul: string;
  tanggal: string;
  jam: string;
  buktiBayarUrl: string;
}

/**
  * Generic helper to send WhatsApp message via Fonnte /send API
  */
export async function sendFonnteMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN || FONNTE_TOKEN;
  if (!token) {
    console.warn("FONNTE_TOKEN is not configured in process.env");
    return { success: false, error: "FONNTE_TOKEN missing" };
  }

  const formData = new FormData();
  formData.append("target", target);
  formData.append("message", message);

  try {
    const res = await fetch(`${BASE_URL}/send`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await res.json();
    if (!data.status) {
      console.error("Fonnte send error response:", data);
      return { success: false, error: data.reason || data.detail || "Fonnte send failed" };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Fonnte request exception:", err);
    return { success: false, error: err.message };
  }
}

/**
  * Formats and dispatches a WhatsApp group notification to AKPRO 26
  */
export async function sendAktorRequestNotification(payload: AktorNotificationPayload) {
  const targetGroup = process.env.FONNTE_AKPRO_GROUP_ID || FONNTE_AKPRO_GROUP_ID;

  const formattedMessage = [
   `*Request Asistensi Aktor Baru*`,
    ``,
    `Nama: ${payload.namaLengkap}`,
    `Kontak: ${payload.kontak}`,
    `Jurusan & Angkatan: ${payload.jurusan} ${payload.angkatan}`,
    `Mata Kuliah: ${payload.matkul}`,
    `Jadwal: ${payload.tanggal} @ ${payload.jam}`,
    ``,
    `Bukti Bayar: ${payload.buktiBayarUrl}`,
    `Request ID: #${payload.id}`,
    ``,
    `Khusus BPH/SA - cek dan assign Aktor di dashboard admin.`
].join("\n");

  return sendFonnteMessage(targetGroup, formattedMessage);
}
