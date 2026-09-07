import{setAssets,escapeHTML}from'./shared.js';
import{installRouter,readRoute}from'./router.js';
import{renderCover}from'./cover.js';import{renderChoose}from'./choose.js';
import{playOpening}from'./opening.js';
import{AudioManager,installSoundToggle}from'./audio-manager.js';
const root=document.querySelector('#app');let dispose=()=>{},generation=0,previousScene=null;
try{
 const[assets,content,trees]=await Promise.all(['content/assets.json','content/projects.json','design/figma-trees.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(`无法加载 ${url}`);return r.json();}));setAssets(assets);
 installSoundToggle();
 // Only the Cover owns the opening story. Reloading a deep link keeps the
 // requested scene and lets its own entry animation run directly.
 if(readRoute().scene==='cover'){
  root.dataset.scene='cover';window.scrollTo(0,0);
  const closeInitialCover=renderCover(root);
  await playOpening(root.querySelector('.cover'));closeInitialCover();
 }else delete document.body.dataset.opening;
 installRouter(async()=>{const token=++generation;dispose();AudioManager.stopAll();dispose=()=>{};const route=readRoute(),fromScene=previousScene;previousScene=route.scene;window.scrollTo(0,0);root.dataset.scene=route.scene;root.innerHTML='';try{
  let next;if(route.scene==='cover')next=renderCover(root);else if(route.scene==='choose')next=renderChoose(root);
  else if(route.scene==='about'){const{renderAbout}=await import('./about.js');if(token!==generation)return;next=renderAbout(root,trees.find(p=>p.name==='03_ABOUT').children.find(n=>n.name==='03_ABOUT_REFERENCE_FULL'));}
  else if(route.scene==='archive'){const{renderArchive}=await import('./archive.js');if(token!==generation)return;next=renderArchive(root,content.projects,{restore:['project','other'].includes(fromScene)});}
  else if(route.scene==='other'){const{renderOther}=await import('./other.js');if(token!==generation)return;next=renderOther(root,content.other);}
  else{const{renderBook}=await import('./book.js');if(token!==generation)return;next=await renderBook(root,content.projects.find(p=>p.id===route.id),()=>token===generation);}
  if(token!==generation){next?.();return;}dispose=next||(()=>{});
  if(['archive','about','choose'].includes(route.scene))requestAnimationFrame(()=>{
   if(token!==generation)return;
   const stage=root.querySelector('.stage');
   if(stage?.getBoundingClientRect().width)window.scrollTo({top:75*stage.getBoundingClientRect().width/1568,behavior:'instant'});
  });
 }catch(e){root.innerHTML=`<section class="scene-error"><h1>档案暂时无法打开</h1><p>${escapeHTML(e.message)}</p><a href="#/choose">← 返回导航</a></section>`;console.error(e);}});
}catch(e){delete document.body.dataset.opening;root.innerHTML=`<section class="scene-error"><h1>资源尚未准备好</h1><p>${escapeHTML(e.message)}</p></section>`;console.error(e);}
