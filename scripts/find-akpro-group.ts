import dotenv from 'dotenv';
dotenv.config();

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'jqEU773oxsHAfAmiLvue';

async function main() {
  const getRes = await fetch('https://api.fonnte.com/get-whatsapp-group', {
    method: 'POST',
    headers: { Authorization: FONNTE_TOKEN },
  });
  const resData = await getRes.json();
  const groups: Array<{ id: string; name: string }> = Array.isArray(resData) ? resData : (resData.data || []);
  
  console.log('Total groups count:', groups.length);
  const akproGroups = groups.filter(g => g.name && g.name.toUpperCase().includes('AKPRO'));
  console.log('Matched AKPRO groups:', akproGroups);
}

main();
