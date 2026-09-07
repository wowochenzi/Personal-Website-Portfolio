import{stage,img,place,fitStage,backLink,storage,reducedMotion,creamPaper}from'./shared.js';
import{navigate}from'./router.js';import{makeDraggable}from'./drag.js';
import{revealArchive}from'./archive-reveal.js';
import{AudioManager}from'./audio-manager.js';
export function renderArchive(root,projects,{restore=false}={}){
 root.innerHTML=backLink('choose','← CHOOSE')+stage('archive');const el=root.querySelector('.stage');let timer;
 const tooltip=document.createElement('div');tooltip.id='archive-project-tooltip';tooltip.className='archive-project-tooltip';tooltip.role='tooltip';tooltip.hidden=true;root.append(tooltip);
 const hideTooltip=()=>{tooltip.hidden=true;};
 const showTooltip=(obj,id,e)=>{
  if(e?.pointerType==='touch'||e?.buttons||el.dataset.archiveLocked==='true'||obj.classList.contains('dragging')||el.classList.contains('opening')){hideTooltip();return;}
  tooltip.textContent=e?(id==='other'?'点击查看其他作品':'双击查看项目细节'):'按 Enter 查看项目细节';tooltip.hidden=false;
  const r=obj.getBoundingClientRect(),x=e?.clientX??(r.left+r.width/2),y=e?.clientY??r.top;
  const w=tooltip.offsetWidth,h=tooltip.offsetHeight;
  tooltip.style.left=`${Math.max(12,Math.min(x+18,document.documentElement.clientWidth-w-12))}px`;
  tooltip.style.top=`${Math.max(12,y+h+28>innerHeight?y-h-16:y+22)}px`;
 };
 window.addEventListener('scroll',hideTooltip,{passive:true});
 el.innerHTML=`<div class="archive-paper" style="${place(445,20,1332,860)}">${creamPaper()}</div><div class="archive-index-paper" style="${place(45.2,99.85,365.6,724.3)}">${img('archive-index-paper')}</div><h1 class="archive-title">Content</h1><nav class="archive-index" aria-label="项目目录">${projects.map((p,i)=>`<a href="#/project/${p.id}"><small>0${i+1}</small><h2>${p.title}</h2>${p.id==='beeflow'?'<div class="index-subtitle">中国流动养蜂人的迁徙、授粉与生计风险可视分析系统</div>':''}<p>${p.category}${i===1?'（实验室项目）':i===2?'（阿里云D20峰会）':''}<br>${p.keywords.join(' / ')}</p></a>`).join('')}<a href="#/other"><small>05</small><h2>其他</h2></a></nav>`;
 const directory=document.createElement('div');directory.className='archive-directory';directory.style.cssText=place(45.2,99.85,365.6,724.3);directory.setAttribute('aria-label','可拖拽的项目目录');
 const paper=el.querySelector('.archive-index-paper'),index=el.querySelector('.archive-index');
 paper.style.cssText=place(0,0,365.6,724.3);index.style.left='70.8px';index.style.top='103.15px';
 directory.append(paper,index);el.append(directory);
 makeDraggable(directory,{id:'directory',stage:el,captureOnPress:false});
 index.addEventListener('click',e=>{if(e.target.closest('a')&&!e.defaultPrevented&&el.dataset.archiveLocked!=='true')AudioManager.play('click');});
 const positions=[['pawtern','PAWTERN',357,374,190.13,327.36,-7.44,499,345],['woodlab','WOODLAB',580,240,246.35,328.46,0,603,558],['nuofield','NUOFIELD',703,345,355.17,454.92,0,918,355],['beeflow','BEEFLOW',996,323,274,459.49,0,1220,455],['other','OTHER',1258,409,337.2,337.2,0,1361,360]];
 positions.forEach(([id,key,x,y,w,h,rot,lx,ly],i)=>{
  const name=id==='other'?'04_ARCHIVE_FOLDER_OTHER':'04_ARCHIVE_OBJ_'+key;
  el.insertAdjacentHTML('beforeend',`<div class="archive-caption" style="left:${lx}px;top:${ly}px">Part 0${i+1}<br>${id==='other'?'其他':projects[i].title.split(' ')[0]}</div><button class="archive-object" data-project="${id}" style="${place(x,y,w,h)};--rotation:${rot}deg" aria-label="打开${id==='other'?'其他作品':projects[i].title}">${img(name)}</button>`);
  const obj=el.querySelector(`[data-project="${id}"]`);const open=()=>{
   if(el.dataset.archiveLocked==='true'||el.classList.contains('opening'))return;hideTooltip();
   AudioManager.play('click');
   const rect=obj.getBoundingClientRect(),s=el.getBoundingClientRect().width/1568;
   obj.style.setProperty('--enter-x',`${(innerWidth/2-rect.left-rect.width/2)*.08/s}px`);
   obj.style.setProperty('--enter-y',`${(innerHeight/2-rect.top-rect.height/2)*.08/s}px`);
   obj.style.zIndex=950;obj.classList.add('selected');el.classList.add('opening');
   timer=setTimeout(()=>navigate(id==='other'?'other':`project/${id}`),reducedMotion.matches?50:340);
  };
  makeDraggable(obj,{id,stage:el,onOpen:open,touchOpen:true});if(id==='other')obj.addEventListener('click',open);
  obj.setAttribute('aria-describedby',tooltip.id);
  obj.addEventListener('pointerenter',e=>showTooltip(obj,id,e));obj.addEventListener('pointermove',e=>showTooltip(obj,id,e));
  obj.addEventListener('pointerleave',hideTooltip);obj.addEventListener('pointerdown',hideTooltip);
  obj.addEventListener('focus',()=>{if(obj.matches(':focus-visible'))showTooltip(obj,id);});obj.addEventListener('blur',hideTooltip);
 });
 el.insertAdjacentHTML('beforeend',`<div class="archive-mask" style="${place(-118,518,1888.57,1485.12)}">${img('raw-archive-imgChatGptImage20269518430911')}</div>`);
 let hintTimer;if(!storage.read('portfolio_archive_hint_seen',false)){el.insertAdjacentHTML('beforeend',`<p class="archive-hint">拖动 · 整理档案　${matchMedia('(pointer:coarse)').matches?'点击':'双击'} · 打开项目</p>`);storage.write('portfolio_archive_hint_seen',true);hintTimer=setTimeout(()=>el.querySelector('.archive-hint')?.remove(),5000);}
 const unfit=fitStage(root),stopReveal=revealArchive(el,restore);return()=>{clearTimeout(timer);clearTimeout(hintTimer);stopReveal();window.removeEventListener('scroll',hideTooltip);unfit();};
}
