import fs from 'node:fs/promises';
const available=(await fs.readdir('assets/audio')).filter(file=>file.endsWith('.mp3')).sort();
await fs.writeFile('assets/audio/manifest.json',JSON.stringify({available},null,2)+'\n');
console.log(`Local sound pack: ${available.length} MP3 files available.`);
