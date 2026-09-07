import fs from 'node:fs/promises';
let s=await fs.readFile('tools/verify.mjs','utf8');s=s.replaceAll("top:e.style.top,z:e.style.zIndex","top:e.style.top");await fs.writeFile('tools/verify.mjs',s);
