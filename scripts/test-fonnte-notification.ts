import dotenv from 'dotenv';
dotenv.config();

// Use the target group ID configured in .env
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'jqEU773oxsHAfAmiLvue';
const GROUP_ID = process.env.FONNTE_AKPRO_GROUP_ID || '120363426417067435@g.us';

async function testNotification() {
  const message = [
    `*[TEST] Request Asistensi Aktor Baru*`,
    ``,
    `Nama: Daffa Test User`,
    `Kontak: @daffa_test / 081234567890`,
    `Jurusan & Angkatan: Teknik Elektro 2024`,
    `Mata Kuliah: Matematika Lanjut 1`,
    `Jadwal: 2026-08-04 @ 17:00`,
    ``,
    `Bukti Bayar: https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9/view?usp=sharing`,
    `Request ID: #999`,
    ``,
    `Khusus BPH/SA - cek dan assign Aktor di dashboard admin.`
  ].join('\n');

  console.log(`Sending test notification to group ${GROUP_ID}...`);
  
  const formData = new FormData();
  formData.append('target', GROUP_ID);
  formData.append('message', message);

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: FONNTE_TOKEN,
      },
      body: formData,
    });

    const data = await res.json();
    console.log('Response from Fonnte:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to send:', err);
  }
}

testNotification();
