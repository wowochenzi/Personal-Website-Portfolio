import fs from 'node:fs/promises';
let s=await fs.readFile('scripts/choose.js','utf8');s=s.replace('<span class="nav-title">${label}</span>','<div class="nav-title-box"><span class="nav-title">${label}</span></div>');await fs.writeFile('scripts/choose.js',s);
