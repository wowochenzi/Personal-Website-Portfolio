import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.resolve(root,'dist');
if(path.dirname(destination)!==root||path.basename(destination)!=='dist')throw Error('Invalid build destination');
await fs.rm(destination,{recursive:true,force:true});
await fs.mkdir(destination,{recursive:true});
const exclude=new Set(['assets/media/nuofield-demo.mp4']);
for(const entry of ['index.html','scripts','styles','content','assets','design/figma-trees.json']){
 await fs.cp(path.join(root,entry),path.join(destination,entry),{
  recursive:true,
  filter:source=>!exclude.has(path.relative(root,source).split(path.sep).join('/'))
 });
}
await fs.writeFile(path.join(destination,'.nojekyll'),'');
const assets=JSON.parse(await fs.readFile(path.join(destination,'content/assets.json'),'utf8'));
const content=JSON.parse(await fs.readFile(path.join(destination,'content/projects.json'),'utf8'));
for(const item of [...Object.values(assets).map(a=>a.path),...content.projects.map(p=>p.demoSrc).filter(Boolean)]){
 if(!item.startsWith('assets/')||item.includes('..'))throw Error('Non-local asset: '+item);
 await fs.access(path.join(destination,item));
}
let total=0,count=0;
async function inspect(dir){
 for(const item of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory())await inspect(file);
  else {const {size}=await fs.stat(file);total+=size;count++;if(size>=100*1024*1024)throw Error('Oversized GitHub file: '+file);}
 }
}
await inspect(destination);
if(total>=1024**3)throw Error('Build exceeds GitHub Pages 1 GiB limit');
console.log(`Static build ready: ${count} files, ${(total/1024**2).toFixed(1)} MiB; all listed images and videos local.`);
