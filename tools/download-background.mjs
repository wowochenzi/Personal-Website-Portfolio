import fs from 'node:fs/promises';
const source=await fs.readFile('design/context-2-62.txt','utf8');
const url=source.match(/const img221 = "([^"]+)/)[1];
const res=await fetch(url);await fs.writeFile('assets/global/background-original.png',Buffer.from(await res.arrayBuffer()));
