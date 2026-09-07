import{stage,img,asset,assets,fitStage,backLink,reducedMotion,portrait,escapeHTML}from'./shared.js';
import{showcaseScroller}from'./scroll-motion.js';
import{AudioManager}from'./audio-manager.js';
const letters=['A','B','C','D'],labels=['品牌设计','商业创新设计','AIGC插画','空间构成'];
const states={default:[330,403,428,553],A:[240,1075,1100,1225],B:[240,313,1074,1199],C:[240,313,338,1248],D:[240,313,338,463]};
const windowTop={A:302,B:278,C:290,D:290};
export function renderOther(root,copy){
 root.innerHTML=backLink('archive','← 返回档案')+stage('other');const el=root.querySelector('.stage');let active=null,unfit=fitStage(root),animationId,lastTime=0,offsets={A:0,B:0,C:0,D:0},hover=false,drag=null,resumeAt=0;
 const scroller=showcaseScroller();let layoutFrame=0,layoutVersion=0;
 const cancelScroll=()=>{layoutVersion++;cancelAnimationFrame(layoutFrame);scroller.cancel();};
 window.addEventListener('wheel',cancelScroll,{passive:true});window.addEventListener('touchstart',cancelScroll,{passive:true});
 el.innerHTML=`<h1 class="other-title">Other Works</h1>${letters.map((k,i)=>`<section class="other-folder folder-${k}" data-folder="${k}" style="top:${states.default[i]}px;z-index:${i+1}"><div class="other-paper-crop">${img('raw-other-'+({A:'img011',B:'img101',C:'img031',D:'img091'}[k]),'folder-paper')}</div><button class="folder-label label-${k}" aria-expanded="false" aria-controls="gallery-${k}"><span class="a11y-only">${k} </span>${labels[i]}</button><div id="gallery-${k}" class="folder-gallery" style="top:${windowTop[k]}px" hidden><div class="strip-window" tabindex="0" role="region" aria-label="${labels[i]}，可拖动或按方向键浏览"><div class="strip-track"></div></div>${copy[k]?`<div class="other-copy"><h2>${copy[k].title}</h2><p>${copy[k].description}</p></div>`:''}</div></section>`).join('')}`;
 function setActive(k){cancelScroll();active=active===k?null:k;AudioManager.play(active?'otherOpen':'otherClose');unfit();unfit=fitStage(root,!!active);el.classList.toggle('expanded',!!active);el.dataset.active=active||'';hover=false;drag=null;
  el.querySelectorAll('.other-folder').forEach((folder,i)=>{const letter=letters[i],yes=active===letter;folder.style.top=`${states[active||'default'][i]}px`;folder.querySelector('button').setAttribute('aria-expanded',String(yes));folder.querySelector('.folder-gallery').hidden=!yes;
   if(yes){const stripName='09_OTHER_STRIP_'+letter,track=folder.querySelector('.strip-track');if(!track.children.length){track.innerHTML=img(stripName,'strip-image',labels[i]+'作品长条')+img(stripName,'strip-image','');track.lastElementChild.setAttribute('aria-hidden','true');const meta=assets[stripName];track.style.setProperty('--strip-width',`${meta.width/meta.height*305}px`);}}
  });
  if(active){const selected=active,token=layoutVersion;layoutFrame=requestAnimationFrame(()=>{layoutFrame=requestAnimationFrame(()=>{
   if(token!==layoutVersion||selected!==active)return;
   const view=el.querySelector('#gallery-'+selected+' .strip-window'),rect=view.getBoundingClientRect(),folder=view.closest('.other-folder');
   const scale=el.getBoundingClientRect().width/1568;
   // Account for the remaining folder transition when aiming at its final center.
   const remaining=(states[selected][letters.indexOf(selected)]-parseFloat(getComputedStyle(folder).top))*scale;
   scroller.to(rect.top+scrollY+remaining+rect.height/2-innerHeight*.48);
  });});}
 }
 el.querySelectorAll('.folder-label').forEach((b,i)=>b.onclick=()=>setActive(letters[i]));
 el.querySelectorAll('.strip-window').forEach(view=>{
  view.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')hover=true;});view.addEventListener('pointerleave',()=>hover=false);
  view.addEventListener('pointerdown',e=>{if(e.button!==0||portrait())return;drag={x:e.clientX,offset:offsets[active]};view.setPointerCapture(e.pointerId);view.classList.add('dragging');});
  view.addEventListener('pointermove',e=>{if(drag&&active){const scale=el.getBoundingClientRect().width/1568;offsets[active]=drag.offset-(e.clientX-drag.x)/scale;paint();}});
  const finish=()=>{drag=null;resumeAt=performance.now()+800;view.classList.remove('dragging');};view.addEventListener('pointerup',finish);view.addEventListener('pointercancel',finish);
  view.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();offsets[active]+=e.key==='ArrowRight'?200:-200;resumeAt=performance.now()+800;paint();}});
  view.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();offsets[active]+=e.deltaX;resumeAt=performance.now()+800;paint();}},{passive:false});
 });
 function paint(){if(!active)return;const track=el.querySelector(`[data-folder="${active}"] .strip-track`),scale=el.getBoundingClientRect().width/1568,w=track.firstElementChild?.getBoundingClientRect().width/scale;if(!w)return;offsets[active]=((offsets[active]%w)+w)%w;track.style.transform=`translateX(${-offsets[active]}px)`;}
 function tick(t){const dt=lastTime?Math.min((t-lastTime)/1000,.1):0;lastTime=t;if(active&&!reducedMotion.matches&&!portrait()&&!document.hidden&&!hover&&!drag&&t>resumeAt){const scale=el.getBoundingClientRect().width/1568;offsets[active]+=36*dt/scale;paint();}animationId=requestAnimationFrame(tick);}animationId=requestAnimationFrame(tick);
 return()=>{cancelScroll();window.removeEventListener('wheel',cancelScroll);window.removeEventListener('touchstart',cancelScroll);unfit();cancelAnimationFrame(animationId);};
}
