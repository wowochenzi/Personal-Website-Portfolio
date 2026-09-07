import fs from 'node:fs/promises';
import path from 'node:path';
const files = process.argv.slice(2);
let queue = (await Promise.all(files.map(async f => JSON.parse(await fs.readFile(f,'utf8'))))).flat();
let cursor=0, total=0;
await Promise.all(Array.from({length:6},async()=>{
  while(cursor<queue.length){
    const item=queue[cursor++]; if(!item.url)throw new Error(`Missing export: ${item.name}`);
    await fs.mkdir(path.dirname(item.path),{recursive:true});
    try {if((await fs.stat(item.path)).size>100)continue;} catch{}
    for(let attempt=0;attempt<3;attempt++){
      try{const res=await fetch(item.url);if(!res.ok)throw Error(`${res.status}`);const bytes=Buffer.from(await res.arrayBuffer());await fs.writeFile(item.path,bytes);break;}
      catch(e){if(attempt===2)throw Error(`${item.name}: ${e.message}`);}
    }
    console.log(`Downloaded ${++total}: ${item.name}`);
  }
}));
