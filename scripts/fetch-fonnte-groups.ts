import dotenv from 'dotenv';
dotenv.config();

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'jqEU773oxsHAfAmiLvue';

async function main() {
  console.log('Syncing group list via Fonnte...');
  try {
    const fetchRes = await fetch('https://api.fonnte.com/fetch-group', {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN },
    });
    const fetchJson = await fetchRes.json();
    console.log('fetch-group response:', fetchJson);

    console.log('Retrieving group list...');
    const getRes = await fetch('https://api.fonnte.com/get-whatsapp-group', {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN },
    });
    const getJson = await getRes.json();
    console.log('get-whatsapp-group response:', JSON.stringify(getJson, null, 2));
  } catch (e) {
    console.error('Error fetching groups:', e);
  }
}

main();
