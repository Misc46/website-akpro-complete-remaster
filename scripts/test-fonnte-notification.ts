import dotenv from 'dotenv';
dotenv.config();

// Use the actual group ID discovered earlier
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'jqEU773oxsHAfAmiLvue';
const GROUP_ID = process.env.FONNTE_AKPRO_GROUP_ID || '120363426820994528@g.us';

async function testNotification() {
  const message = [
    `🧪 *[TEST] REQUEST ASISTENSI AKTOR BARU* 🧪`,
    ``,
    `👤 *Nama*: Daffa Test User`,
    `📱 *Kontak*: @daffa_test / 081234567890`,
    `🎓 *Jurusan & Angkatan*: Elektro 2024`,
    `📚 *Mata Kuliah*: Matematika Lanjut 1`,
    `📅 *Jadwal*: 2026-08-04 @ 17:00`,
    ``,
    `💳 *Bukti Bayar*: https://drive.google.com/test`,
    `🆔 *Request ID*: #999`,
    ``,
    `📌 _(ini hanya pesan test — abaikan)_`,
  ].join('\n');

  const formData = new FormData();
  formData.append('target', GROUP_ID);
  formData.append('message', message);

  console.log(`Sending to group: ${GROUP_ID}`);

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: FONNTE_TOKEN },
    body: formData,
  });

  const data = await res.json();
  console.log('Fonnte response:', data);
}

testNotification().catch(console.error);
