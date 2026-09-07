import{asset,assets,img,backLink,storage,reducedMotion,portrait,escapeHTML}from'./shared.js';
import{mediaMarkup,observeMedia}from'./media.js';
import{AudioManager}from'./audio-manager.js';
let libraryPromise;
// Figma's split can be off-center. Reassemble each spread at one scale, then
// expose its two equal physical leaves without discarding any source content.
function pageMarkup(p){
 return p.pages.map((name,i)=>{
  const pair=p.pages.slice(i-i%2,i-i%2+2),meta=pair.map(k=>assets[k]);
  const widths=meta.map(m=>m.width/m.height),total=widths.reduce((a,b)=>a+b,0);
  return `<div class="book-page" data-density="soft" role="img" aria-label="${escapeHTML(p.title)} 第 ${i+1} 页"><div class="book-spread-art ${i%2?'right-leaf':''}" style="aspect-ratio:${total}">${pair.map((k,j)=>`<img src="${asset(k)}" style="width:${widths[j]/total*100}%" alt="" draggable="false" decoding="async">`).join('')}</div></div>`;
 }).join('');
}
function loadLibrary(){return libraryPromise??=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='assets/vendor/page-flip.browser.js';s.onload=()=>resolve(window.St.PageFlip);s.onerror=()=>reject(Error('翻书组件未能加载'));document.head.append(s);});}
export async function renderBook(root,p,isCurrent=()=>true){
 const PageFlip=await loadLibrary();if(!isCurrent())return()=>{};let flip,resizeTimer,disposed=false;
 const link=p.externalUrl?`<a class="project-external" href="${escapeHTML(p.externalUrl)}" target="_blank" rel="noopener noreferrer">${p.id==='beeflow'?'查看交互数据系统':p.id==='pawtern'?'打开线上项目':'进入线上体验'} ↗</a>`:'';
 const copy=`<div class="project-copy"><div class="project-kicker">${escapeHTML(p.category)} · ${p.keywords.join(' / ')}</div><h1>${escapeHTML(p.title)}</h1>${p.subtitle?`<p class="project-subtitle">${escapeHTML(p.subtitle)}</p>`:''}<p>${escapeHTML(p.description)}</p><p>${escapeHTML(p.demoDescription)}</p>${link}</div>`;
 root.innerHTML=backLink('archive','← 返回档案')+`<article class="project project-${p.id}"><section class="book-section" aria-label="${p.title}作品集翻书"><div class="book-shell"><div class="cover-underlay"></div><div class="page-stack"></div><div class="book-mount"></div><div class="book-spine"></div></div><nav class="book-controls" aria-label="翻页"><button class="prev" aria-label="上一页">←</button><output class="page-counter" aria-live="polite"></output><button class="next" aria-label="下一页">→</button></nav><p class="book-instruction">点击页边 / 拖动页角 · 翻阅作品 <span>↓ 项目体验</span></p></section><section class="project-details ${p.demoType==='phone'?'phone-layout':''}">${p.demoType==='phone'?mediaMarkup(p)+copy:copy+mediaMarkup(p)}</section><a class="project-bottom-back" href="#/archive">← 返回档案</a></article>`;
 const shell=root.querySelector('.book-shell'), mount=root.querySelector('.book-mount');
 const pageRatio=Math.min(...p.pages.filter((_,i)=>i%2===0).map((_,j)=>p.pages.slice(j*2,j*2+2).reduce((sum,k)=>sum+assets[k].width/assets[k].height,0)/2));
 let current=storage.read('portfolio_book_pages',{})[p.id]||0,single=false;
 const save=()=>{const pages=storage.read('portfolio_book_pages',{});pages[p.id]=current;storage.write('portfolio_book_pages',pages);};
 const counter=()=>{current=flip.getCurrentPageIndex();root.querySelector('.page-counter').textContent=single?`${String(current+1).padStart(2,'0')} / ${p.pageCount}`:`${String(current+1).padStart(2,'0')}–${String(Math.min(current+2,p.pageCount)).padStart(2,'0')} / ${p.pageCount}`;root.querySelector('.prev').disabled=current===0;root.querySelector('.next').disabled=current>=(single?p.pageCount-1:p.pageCount-2);save();};
 const rebuild=()=>{
  if(disposed||portrait())return;if(flip){current=flip.getCurrentPageIndex();flip.destroy();}
  single=innerWidth<1024;const pw=single?Math.min(innerWidth*.62,(innerHeight-125)*pageRatio,650):Math.min(innerWidth*.4,(innerHeight-185)*pageRatio,770);const ph=pw/pageRatio;
  shell.classList.toggle('single-page',single);shell.style.width=`${pw*(single?1:2)}px`;shell.style.height=`${ph}px`;
  mount.innerHTML='<div class="flipbook"></div>';const book=mount.firstElementChild;
 book.innerHTML=pageMarkup(p);
  flip=new PageFlip(book,{width:pw,height:ph,size:'fixed',autoSize:false,usePortrait:single,showCover:false,startPage:single?current:current-current%2,drawShadow:!reducedMotion.matches,maxShadowOpacity:.24,flippingTime:650,mobileScrollSupport:false,showPageCorners:!reducedMotion.matches,useMouseEvents:!reducedMotion.matches,disableFlipByClick:true,clickEventForward:false,swipeDistance:25});
  let ready=false,sounded=false;
  flip.on('changeState',e=>{shell.dataset.flipping=String(e.data!=='read');if(ready&&e.data==='flipping'&&!sounded){AudioManager.playRandom();sounded=true;}if(e.data==='read')sounded=false;});
  flip.on('flip',()=>{if(ready&&flip.getCurrentPageIndex()!==current&&!sounded)AudioManager.playRandom();counter();});flip.on('init',counter);flip.loadFromHTML(book.querySelectorAll('.book-page'));shell.dataset.flipping='false';counter();ready=true;
 };
 const move=direction=>{if(portrait())return;try{if(reducedMotion.matches){direction>0?flip.turnToNextPage():flip.turnToPrevPage();}else{direction>0?flip.flipNext('bottom'):flip.flipPrev('bottom');}}catch{}counter();};
 root.querySelector('.prev').onclick=()=>move(-1);root.querySelector('.next').onclick=()=>move(1);
 let down;mount.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});mount.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;if(Math.hypot(dx,dy)<8){const rect=shell.getBoundingClientRect();move(e.clientX<rect.left+rect.width*.5?-1:1);}else if(reducedMotion.matches&&Math.abs(dx)>25)move(dx<0?1:-1);});
 const key=e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)&&!['INPUT','TEXTAREA','VIDEO'].includes(e.target.tagName)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}};
 const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(rebuild,150);};window.addEventListener('keydown',key);window.addEventListener('resize',resize);reducedMotion.addEventListener('change',resize);rebuild();const stopMedia=observeMedia(root);
 return()=>{disposed=true;clearTimeout(resizeTimer);stopMedia();window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);reducedMotion.removeEventListener('change',resize);flip?.destroy();};
}
