import dotenv from 'dotenv';
dotenv.config();

const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'jqEU773oxsHAfAmiLvue';

async function main() {
  console.log('Fetching groups from Fonnte API...');
  const getRes = await fetch('https://api.fonnte.com/get-whatsapp-group', {
    method: 'POST',
    headers: { Authorization: FONNTE_TOKEN },
  });
  const resData = await getRes.json();
  const groups: Array<{ id: string; name: string }> = Array.isArray(resData) ? resData : (resData.data || []);
  
  console.log('Total groups count:', groups.length);
  
  const query = 'bphsa';
  const query2 = 'cuy';
  
  const matches = groups.filter(g => 
    g.name && (g.name.toLowerCase().includes(query) || g.name.toLowerCase().includes(query2))
  );
  
  console.log('Matched groups:', matches.map(m => ({ id: m.id, name: m.name })));
}

main().catch(console.error);
