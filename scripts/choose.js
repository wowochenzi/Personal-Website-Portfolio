import{stage,img,fitStage,reducedMotion}from'./shared.js';
import{takeProjectJourney,navigate}from'./router.js';
import{coverMarkup}from'./cover-art.js';
import{folderHitAreas}from'./folder-hit-area.js';
import{AudioManager}from'./audio-manager.js';
export function chooseMarkup(){return `<h1 class="choose-heading">CHOOSE ONE PAGE ↓</h1>${[['CONTENT','Content','archive'],['ABOUT','About Me','about'],['HOME','Home Page','cover']].map(([key,label,route])=>`<a class="nav-folder nav-${key.toLowerCase()}" href="#/${route}" aria-label="${label}"><div class="nav-image-box">${img('raw-choose-'+({HOME:'imgChatGptImage20269518430911',ABOUT:'imgChatGptImage20269518430922',CONTENT:'imgChatGptImage20269518430932'}[key]))}</div><div class="nav-title-box"><span class="nav-title">${label}</span></div></a>`).join('')}`;}
export function renderChoose(root){
 root.innerHTML=stage('choose');const el=root.querySelector('.stage');el.innerHTML=chooseMarkup();const unfit=fitStage(root);
 let timer,disposed=false,closing=false,motionVersion=0;const animations=[];
 const animate=(node,frames,options)=>{const a=node.animate(frames,{fill:'both',easing:'cubic-bezier(.22,.72,.24,1)',...options});animations.push(a);return a;};
 const cover=document.createElement('div');cover.className='choose-cover-return';cover.inert=true;cover.innerHTML=coverMarkup();el.append(cover);
 for(const link of el.querySelectorAll('.nav-about,.nav-content'))link.addEventListener('click',async e=>{
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  e.preventDefault();if(closing||disposed)return;closing=true;el.inert=true;
  AudioManager.play('click');
  const version=++motionVersion;
  for(const node of el.querySelectorAll('.nav-folder')){
   const style=getComputedStyle(node);
   animate(node,node===link?
    [{opacity:1,transform:style.transform,translate:'0 0',scale:1},{opacity:1,transform:style.transform,translate:'0 -8px',scale:1.01}]:
    [{opacity:style.opacity},{opacity:.3}],{duration:reducedMotion.matches?80:180});
  }
  await animate(el,[{opacity:1},{opacity:0}],{delay:reducedMotion.matches?0:140,duration:reducedMotion.matches?120:260}).finished.catch(()=>{});
  if(!disposed&&version===motionVersion)navigate(link.classList.contains('nav-about')?'about':'archive');
 });
 el.querySelector('.nav-home').addEventListener('click',async e=>{
  if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(closing||disposed)return;closing=true;el.inert=true;
  AudioManager.play('click');
  const version=++motionVersion;
  await Promise.all([...cover.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));if(disposed||version!==motionVersion)return;
  if(reducedMotion.matches){await animate(el,[{opacity:1},{opacity:0}],{duration:160}).finished.catch(()=>{});if(!disposed&&version===motionVersion)navigate('cover');return;}
  const scale=el.getBoundingClientRect().width/1568;cover.style.transform=`translateY(${scrollY/scale}px)`;cover.style.visibility='visible';
  animate(el.querySelector('.choose-heading'),[{opacity:1},{opacity:0}],{duration:240});
  for(const [i,name]of ['home','about','content'].entries()){
   const node=el.querySelector('.nav-'+name);
   animate(node.querySelector('.nav-title-box'),[{opacity:1},{opacity:0}],{duration:220});
   animate(node,[{transform:getComputedStyle(node).transform,opacity:getComputedStyle(node).opacity},{transform:`translate(${[370,0,-370][i]}px,35px) scale(.82)`,opacity:1,offset:.62},{transform:`translate(${[370,0,-370][i]}px,35px) scale(.82)`,opacity:0,offset:1}],{duration:1000});
  }
  animate(cover.querySelector('.cover-face'),[{opacity:0,transform:'perspective(1400px) rotateX(4deg) rotateY(-10deg) rotateZ(-.5deg)'},{opacity:1,transform:'perspective(1400px) rotateX(4deg) rotateY(-10deg) rotateZ(-.5deg)',offset:.4},{opacity:1,transform:'perspective(1400px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)'}],{delay:540,duration:760});
  animate(cover.querySelector('.cover-print'),[{opacity:0},{opacity:1}],{delay:1160,duration:400});
  await animate(cover.querySelector('.cover-open'),[{opacity:0},{opacity:1}],{delay:1280,duration:280}).finished.catch(()=>{});
  if(!disposed&&version===motionVersion)navigate('cover');
 });
 const resetMotion=()=>{++motionVersion;clearTimeout(timer);animations.forEach(a=>a.cancel());animations.length=0;el.inert=false;closing=false;cover.style.visibility='hidden';el.classList.remove('auto-project-journey');};
 const cancel=()=>{disposed=true;resetMotion();};
 const key=e=>{if(e.key==='Escape')resetMotion();};
 window.addEventListener('keydown',key);
 if(takeProjectJourney()){
  el.inert=true;closing=true;el.classList.add('auto-project-journey');const version=++motionVersion;
  animate(el,[{opacity:0},{opacity:1}],{duration:reducedMotion.matches?80:220});
  timer=setTimeout(async()=>{
   if(disposed||version!==motionVersion)return;
   for(const node of el.querySelectorAll('.nav-folder'))animate(node,node.classList.contains('nav-content')?[{transform:'translateY(0) scale(1)'},{transform:'translateY(-42px) scale(1.015)'}]:[{opacity:1},{opacity:.7}],{duration:reducedMotion.matches?0:300,easing:'cubic-bezier(.22,.72,.24,1)'});
   await animate(el,[{opacity:1,offset:0},{opacity:1,offset:.65},{opacity:0,offset:1}],{duration:reducedMotion.matches?160:1120}).finished.catch(()=>{});
   if(!disposed&&version===motionVersion)navigate('archive');
  },reducedMotion.matches?80:320);
 }
 const stopHitAreas=folderHitAreas(el);
 return()=>{cancel();stopHitAreas();window.removeEventListener('keydown',key);unfit();};
}
