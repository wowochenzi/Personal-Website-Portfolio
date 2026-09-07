import {portrait,reducedMotion} from './shared.js';
import {AudioManager} from './audio-manager.js';

export const OPENING_DURATION=4880;
// Time / half-width: a short tension hold, accelerating release, then a slow flatten.
const paperPath=[[0,.05],[80,.049],[120,.05],[500,.225],[760,.375],[960,.47],[1060,.503],[1120,.5]];
const friction=[[0,7,180,.65],[.24,-3,128,-.28],[.43,4,90,.22],[.59,-2,62,-.12],[.74,2,35,.08],[.87,-1,14,0],[1,0,0,0]];
const clamp=n=>Math.max(0,Math.min(1,n));
function halfWidth(t,lag=0) {
 const time=clamp((t-lag)/(1120-lag))*1120;
 const end=paperPath.findIndex(([at])=>at>=time);if(end<=0)return paperPath[0][1];
 const [a,x]=paperPath[end-1],[b,y]=paperPath[end],p=(time-a)/(b-a);
 return x+(y-x)*(p*p*(3-2*p));
}

export function playOpening(stage) {
 stage.dataset.ready='false';stage.inert=true;
 const layer=document.createElement('div');layer.className='opening-sequence';layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<div class="opening-paper"><div class="opening-paper__surface"><div class="opening-paper__texture"><div class="opening-texture-stage"></div></div></div><div class="opening-paper__curl opening-paper__curl--left"></div><div class="opening-paper__curl opening-paper__curl--right"></div></div><div class="opening-welcome"><span>WELCOME</span></div>';
 document.body.append(layer);
 const paper=layer.querySelector('.opening-paper'),welcome=layer.querySelector('.opening-welcome'),texture=layer.querySelector('.opening-texture-stage');
 let animations=[],frame=0,clock=null,paused=false,done=false,started=false,resizeFolder=()=>{};
 const reduced=reducedMotion.matches,total=reduced?3030:OPENING_DURATION;
 const cues=reduced?[[90,'paperUnroll',250],[335,'paperSettle'],[1440,'folderSlide',420],[1900,'clip1'],[1980,'clip2'],[2060,'clip3']]:
  [[120,'paperUnroll',860],[1060,'paperSettle'],[2350,'folderSlide',1050],[3480,'clip1'],[3600,'clip2'],[3720,'clip3']];
 const events=new AbortController();const signal=events.signal;
 const block=e=>{if(e.type!=='keydown'||['Escape',' ','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))e.preventDefault();};
 for(const type of ['wheel','touchmove','keydown'])window.addEventListener(type,block,{capture:true,passive:false,signal});
 const size=()=>{texture.style.transform=`scale(${stage.parentElement.clientWidth/1568})`;resizeFolder();};size();
 const syncPause=()=>{
  if(!started||done)return;const suspend=document.hidden||portrait();
  if(suspend===paused)return;paused=suspend;
  for(const a of animations)paused?a.pause():a.play();
  if(paused)AudioManager.stopAll();
 };
 document.addEventListener('visibilitychange',syncPause,{signal});
 window.addEventListener('resize',()=>{size();syncPause();},{signal});
 return new Promise(resolve=>{
  const finish=()=>{
   if(done)return;done=true;cancelAnimationFrame(frame);events.abort();
   animations.forEach(a=>a.cancel());animations=[];layer.remove();
   delete document.body.dataset.opening;stage.dataset.ready='true';stage.inert=false;
   resolve({duration:total,paperDuration:reduced?350:1120});
  };
  const animate=(node,frames,at,duration,easing='ease-out')=>{
   const a=node.animate(frames,{delay:at,duration,fill:'both',easing});animations.push(a);return a;
  };
  const tick=()=>{
   if(done)return;const time=Number(clock.currentTime)||0;
   if(!paused){
    if(!reduced&&time<=1120){
     const left=(.5-halfWidth(time))*innerWidth,right=(.5+halfWidth(time,25))*innerWidth;
     const flat=clamp((time-760)/360),curl=26*(1-flat)+1;
     paper.style.cssText=`--paper-left:${left}px;--paper-width:${right-left}px;--curl-left:${left}px;--curl-right:${right}px;--curl-width:${curl}px;--curl-angle:${(innerWidth<1024?26:36)*(1-flat)}deg;--curl-opacity:${1-flat};--curl-shadow:${15*(1-flat)}px`;
    }
    if(time>=(reduced?350:1120)&&paper.isConnected)paper.remove();
    for(const cue of cues)if(!cue.fired&&time>=cue[0]){cue.fired=true;if(time-cue[0]<100)AudioManager.play(cue[1],{duration:cue[2]});}
   }
   frame=requestAnimationFrame(tick);
  };
  const run=async()=>{
   await Promise.all([document.fonts.ready,...[...stage.querySelectorAll('img')].map(image=>image.decode().catch(()=>{})),...['assets/global/background-original.png'].map(src=>{const image=new Image();image.src=src;return image.decode().catch(()=>{});})]);
   size();
   clock=animate(layer,[{outlineOffset:'0px'},{outlineOffset:'0px'}],0,total,'linear');
   if(reduced){
    paper.querySelectorAll('.opening-paper__curl').forEach(node=>node.remove());
    paper.style.setProperty('--paper-left','0px');paper.style.setProperty('--paper-width','100%');
    animate(paper,[{opacity:0,transform:'scaleX(.72)'},{opacity:1,transform:'scaleX(1)'}],0,350);
   }
   animate(welcome,reduced?[{opacity:0},{opacity:1}]:[{opacity:0,translate:'0 6px',filter:'blur(1px)'},{opacity:1,translate:'0 0',filter:'blur(0)'}],reduced?230:840,reduced?350:510);
   animate(welcome,reduced?[{opacity:1},{opacity:0}]:[{opacity:1,translate:'0 0'},{opacity:0,translate:'0 -3px'}],reduced?1060:1900,reduced?330:400).effect.updateTiming({fill:'forwards'});
   const folder=stage.querySelector('.cover-folder');
   const folderFrames=()=>{
    const scale=(stage.parentElement.clientWidth||innerWidth)/1568,travel=innerHeight/scale+80;
    return reduced?[{opacity:0,translate:'0 35px'},{opacity:1,translate:'0 0'}]:friction.map(([offset,x,y,rotation])=>({offset,translate:`${x}px ${y/180*travel}px`,rotate:`${rotation}deg`,filter:`drop-shadow(0 ${y?4:0}px ${y?3:0}px rgb(65 78 74 / ${y?.12:0}))`,easing:'cubic-bezier(.32,.12,.65,1)'}));
   };
   const folderAnimation=animate(folder,folderFrames(),reduced?1440:2350,reduced?420:1050,'linear');
   resizeFolder=()=>folderAnimation.effect.setKeyframes(folderFrames());
   ['.clip-1','.clip-2','.clip-3'].forEach((selector,i)=>animate(stage.querySelector(selector),reduced?[{opacity:0},{opacity:1}]:[{opacity:0,scale:.94,rotate:`${i%2?-1.7:1.7}deg`},{opacity:1,scale:1,rotate:'0deg'}],reduced?1900+i*80:3480+i*120,reduced?160:220));
   animate(stage.querySelector('.cover-print'),[{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],reduced?2180:3840,reduced?350:540);
   animate(stage.querySelector('.cover-open'),[{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],reduced?2630:4480,400);
   const start=document.timeline.currentTime;animations.forEach(a=>a.startTime=start);
   started=true;document.body.dataset.opening='playing';syncPause();clock.onfinish=finish;
   frame=requestAnimationFrame(tick);
  };
  run().catch(finish);
 });
}
