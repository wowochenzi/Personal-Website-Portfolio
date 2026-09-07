import fs from 'node:fs/promises';
const groups={cover:'2-62',choose:'6-44',archive:'3-287',other:'6-4340'};
await fs.mkdir('assets/raw',{recursive:true});const entries=[];
for(const [group,id]of Object.entries(groups)){const source=await fs.readFile(`design/context-${id}.txt`,'utf8');for(const m of source.matchAll(/const (\w+) = "([^"]+)"/g)){entries.push({name:`raw-${group}-${m[1]}`,path:`assets/raw/${group}-${m[1]}.${m[2].endsWith('.svg')?'svg':'png'}`,url:m[2]});}}
await Promise.all(entries.map(async e=>{const r=await fetch(e.url);await fs.writeFile(e.path,Buffer.from(await r.arrayBuffer()));}));
const assets=JSON.parse(await fs.readFile('content/assets.json','utf8'));for(const e of entries)assets[e.name]={path:e.path};await fs.writeFile('content/assets.json',JSON.stringify(assets,null,2));
const mapping={'1-2':['assets/cover/cover-clip-01.png','assets/cover/cover-clip-03.png','assets/cover/cover-clip-02.png','assets/cover/01_COVER_FOLDER_INNER_PAPER.png'],'3-90':['assets/about/03_ABOUT_PROFILE_PHOTO.png','assets/about/03_ABOUT_FOLDER_KRAFT_BACK.png','assets/about/03_ABOUT_BLUE_CARD_BG.png'],'3-229':['assets/archive/archive-index-paper.png','assets/archive/mask-cropped.png','assets/archive/04_ARCHIVE_OBJ_WOODLAB.png','assets/archive/04_ARCHIVE_OBJ_BEEFLOW.png','assets/archive/04_ARCHIVE_OBJ_NUOFIELD.png'],'6-130':['assets/projects/05_PAWTERN_PHONE_FRAME.png']};
for(const [key,paths] of Object.entries(mapping)){for(let i=0;i<paths.length;i++)await fs.writeFile(paths[i],Buffer.from(await fs.readFile(`design/alpha-${key}-${i}.b64`,'utf8'),'base64'));}
