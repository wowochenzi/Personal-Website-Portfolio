import fs from 'node:fs/promises';
const groups=JSON.parse(await fs.readFile('design/alpha-groups.json','utf8'));
for(const g of groups){for(let i=0;i<g.items.length;i++){try{const b=Buffer.from(await fs.readFile(`design/alpha-${g.page.replace(':','-')}-${i}.b64`,'utf8'),'base64');console.log(g.page,i,b.readUInt32BE(16),b.readUInt32BE(20));}catch{}}}
