import {reducedMotion} from './shared.js';
import {AudioManager} from './audio-manager.js';

// Figma 33:11 / 33:17; coordinates are local to the existing About composition.
const CLOSED={x:-36,y:108},OPEN={x:433,y:96},WIDTH=680.376,HEIGHT=699;
const personalIds=['3:174','3:175','3:176','3:177','3:178','3:179','3:180','3:181','3:182','3:183'];
const source='assets/about/student-work/';
const frame=(x,y,w,h,rotation,innerWidth,innerHeight,body,extra='')=>`<div class="student-photo-position" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="student-photo ${extra}" style="width:${innerWidth}px;height:${innerHeight}px;transform:rotate(${rotation}deg)">${body}</div></div>`;
const photo=(file,alt)=>`<img src="${source+file}" alt="${alt}" draggable="false">`;
function markup(){return `
 <button class="student-work-trigger" aria-label="阅览学生工作" aria-expanded="false" aria-controls="student-work-content" aria-describedby="student-work-hint"></button>
 <span class="student-work-hint" id="student-work-hint" aria-hidden="true">点击阅览学生工作</span>
 <section id="student-work-content" class="student-work-content" aria-label="学生工作档案" hidden>
  <div class="student-work-item student-work-title" style="left:181px;top:25px;width:158.555px;height:40.803px"><h2 style="width:157.367px;height:35px;transform:rotate(2.12deg)">学生工作</h2></div>
  <div class="student-work-item student-work-label" style="left:146px;top:111px;width:303.662px;height:92.806px"><h3 style="width:300.023px;height:77.148px;transform:rotate(3.01deg)">浙江大学<br>国旗仪仗队</h3></div>
  <div class="student-work-item student-work-photos" aria-label="国旗仪仗队照片">
   ${frame(361.49,97.79,190.254,265.112,3.33,175.731,255.344,photo('honor-guard.png','国旗仪仗队执勤照片'),'guard-portrait')}
   ${frame(137,184,213.189,153.414,3.33,205.309,141.738,photo('honor-guard.png','浙江大学国旗仪仗队升旗仪式'),'guard-ceremony')}
  </div>
  <div class="student-work-item student-work-label" style="left:131px;top:371px;width:303.662px;height:92.806px"><h3 style="width:300.023px;height:77.148px;transform:rotate(3.01deg)">浙江大学<br>红原支教团</h3></div>
  <div class="student-work-item student-work-photos" aria-label="红原支教团照片">
   ${frame(350,538,156.156,107.97,3.08,151,100,photo('hongyuan-group.png','红原支教团与学生合影'),'student-photo-shadow')}
   ${frame(101,443,248.804,173.051,3.08,240.535,160.356,photo('hongyuan-teaching.png','红原支教团课堂教学'),'student-photo-shadow')}
   ${frame(362,398,189.97,132.129,3.08,183.655,122.437,photo('hongyuan-classroom.png','红原支教团课堂交流'),'student-photo-shadow')}
  </div>
  <div class="student-work-item student-work-return" style="left:525px;top:575px;width:30.627px;height:71.317px"><button class="student-work-close" aria-label="收回学生工作"><img src="${source}close-arrow.svg" alt="" draggable="false"><span>收回</span></button></div>
 </section>`;}

export function installStudentWork(stage){
 const composition=stage.querySelector('.about-composition');
 const kraft=composition.querySelector('[data-about-asset="03_ABOUT_FOLDER_KRAFT_BACK"]');
 const blue=composition.querySelector('[data-about-asset="03_ABOUT_BLUE_CARD_BG"]');
 const resume=document.createElement('div');resume.className='resume-content';
 for(const node of [...composition.querySelectorAll('.about-copy,.about-publications,.about-skills')]){
  if(personalIds.includes(node.dataset.nodeId))node.dataset.studentPersonal='true';else resume.append(node);
 }
 for(const node of [blue,composition.querySelector('[data-about-asset="03_ABOUT_PROFILE_PHOTO"]')])node.dataset.studentPersonal='true';
 composition.append(resume);
 const folder=document.createElement('div');folder.className='student-work-folder';
 folder.style.cssText=`left:${CLOSED.x}px;top:${CLOSED.y}px;width:${WIDTH}px;height:${HEIGHT}px`;
 kraft.before(folder);folder.append(kraft);kraft.style.left='0px';kraft.style.top='0px';
 folder.insertAdjacentHTML('beforeend',markup());
 const trigger=folder.querySelector('.student-work-trigger'),hint=folder.querySelector('.student-work-hint');
 const content=folder.querySelector('.student-work-content'),close=folder.querySelector('.student-work-close');
 const items=[...content.querySelectorAll('.student-work-item')];
 let studentWorkState='closed',disposed=false,animations=[],raf=0,hovered=false,keyboard=false;
 const events=new AbortController(),signal=events.signal,sounds=new Set(),pixels=new Map();
 const play=(name,options)=>{const sound=AudioManager.play(name,options);if(sound)sounds.add(sound);};
 const setState=state=>{studentWorkState=state;stage.dataset.studentWorkState=state;folder.dataset.state=state;trigger.setAttribute('aria-expanded',String(state==='open'||state==='opening'));};
 setState('closed');folder.dataset.raised='false';
 const highlight=on=>{
  hovered=on&&studentWorkState==='closed'&&!stage.inert;
  folder.classList.toggle('is-hovered',hovered);
  trigger.style.pointerEvents=hovered?'auto':'none';
  hint.setAttribute('aria-hidden',String(!hovered&&!trigger.matches(':focus-visible')));
 };
 // Inspect the original alpha of the two existing paper images. This makes only
 // exposed kraft clickable, including the tab, without hot rectangular margins
 // or invisible hotspots beneath the blue card.
 const images=[kraft.querySelector('img'),blue.querySelector('img')];
 Promise.all(images.map(async image=>{
  await image.decode();if(disposed)return;
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
  pixels.set(image,{width:canvas.width,height:canvas.height,data:context.getImageData(0,0,canvas.width,canvas.height).data});
 })).catch(()=>{});
 const opaque=(image,x,y)=>{
  const r=image.getBoundingClientRect(),pixel=pixels.get(image);
  if(!pixel||!r.width||x<r.left||y<r.top||x>=r.right||y>=r.bottom)return false;
  const px=Math.floor((x-r.left)/r.width*pixel.width),py=Math.floor((y-r.top)/r.height*pixel.height);
  return pixel.data[(py*pixel.width+px)*4+3]>48;
 };
 const hit=(x,y)=>!stage.inert&&studentWorkState==='closed'&&opaque(images[0],x,y)&&!opaque(images[1],x,y);
 stage.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')highlight(hit(e.clientX,e.clientY));},{signal});
 stage.addEventListener('pointerleave',()=>highlight(false),{signal});
 stage.addEventListener('click',e=>{
  if(e.detail===0)return;
  if(hit(e.clientX,e.clientY)){e.preventDefault();e.stopPropagation();open(false);}
 },{capture:true,signal});
 trigger.addEventListener('click',e=>{if(e.detail===0)open(true);},{signal});
 trigger.addEventListener('focus',()=>{if(studentWorkState==='closed'){folder.classList.add('is-focused');hint.setAttribute('aria-hidden','false');}},{signal});
 trigger.addEventListener('blur',()=>{folder.classList.remove('is-focused');hint.setAttribute('aria-hidden',String(!hovered));},{signal});
 close.addEventListener('click',()=>shut(),{signal});
 window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&studentWorkState!=='closed'){
   e.preventDefault();e.stopImmediatePropagation();if(studentWorkState==='open')shut();
  }
 },{capture:true,signal});

 const animate=(node,frames,delay,duration,easing='cubic-bezier(.22,.72,.24,1)')=>{
  const animation=node.animate(frames,{delay,duration,fill:'both',easing});animation.id='student-work-'+node.classList[0];animations.push(animation);return animation;
 };
 const stopAnimations=()=>{cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());animations=[];};
 function movementFrames(opening,reduced){
  const x=OPEN.x-CLOSED.x,y=OPEN.y-CLOSED.y;
  if(reduced)return opening?[{translate:'0 0'},{translate:`${x}px ${y}px`}]:[{translate:`${x}px ${y}px`},{translate:'0 0'}];
  return (opening?
   [[0,0,0,0],[.25,x*.3,y*.3-3,0],[.55,x*.65,y*.65,.2],[.8,x+4,y-.5,.08],[1,x,y,0]]:
   [[0,x,y,0],[.25,x*.7,y*.7-2,-.12],[.55,x*.35,y*.35,-.15],[.82,-2,-1,-.04],[1,0,0,0]]
  ).map(([offset,dx,dy,angle])=>({offset,translate:`${dx}px ${dy}px`,rotate:`${angle}deg`,scale:1,easing:'cubic-bezier(.32,.12,.65,1)'}));
 }
 function transition(opening){
  const reduced=reducedMotion.matches;
  const moveDelay=opening?0:reduced?80:300,moveDuration=reduced?(opening?260:220):(opening?720:680);
  const total=reduced?300:opening?990:980;
  const layerAt=opening?moveDuration*.25:moveDelay+moveDuration*.75;
  const clock=animate(folder,[{outlineOffset:'0px'},{outlineOffset:'0px'}],0,total,'linear');
  animate(folder,movementFrames(opening,reduced),moveDelay,moveDuration,'linear');
  animate(resume,[{opacity:opening?1:.39},{opacity:opening?.39:1}],opening?0:reduced?130:450,reduced?(opening?220:170):420,'ease');
  items.forEach((item,i)=>{
   const delay=opening?(reduced?120+i*12:360+i*70):(reduced?(5-i)*8:(5-i)*24);
   const duration=reduced?(opening?120:70):opening?280:180;
   const show=reduced?[{opacity:0},{opacity:1}]:[{opacity:0,translate:'0 5px',scale:.985},{opacity:1,translate:'0 0',scale:1}];
   animate(item,opening?show:[...show].reverse(),delay,duration);
  });
  const start=document.timeline.currentTime;animations.forEach(a=>a.startTime=start);
  let sliding=opening,landed=false;
  const tick=()=>{
   if(disposed)return;const time=Number(clock.currentTime)||0;
   folder.dataset.raised=String(opening?time>=layerAt:time<layerAt);
   if(!sliding&&time>=moveDelay){sliding=true;play('folderSlide',{duration:moveDuration,volume:.55});}
   if(!landed&&time>=moveDelay+moveDuration){landed=true;play(opening?'paperSettle':'paperDrop',{volume:.55});}
   raf=requestAnimationFrame(tick);
  };
  clock.onfinish=()=>{
   if(disposed)return;
   setState(opening?'open':'closed');folder.dataset.raised=String(opening);
   folder.style.translate=opening?`${OPEN.x-CLOSED.x}px ${OPEN.y-CLOSED.y}px`:'0 0';
   resume.style.opacity=opening?'.39':'1';content.hidden=!opening;content.inert=!opening;
   trigger.tabIndex=opening?-1:0;stopAnimations();
   if(keyboard)(opening?close:trigger).focus({preventScroll:true});
  };
  raf=requestAnimationFrame(tick);
 }
 function open(fromKeyboard){
  if(disposed||stage.inert||studentWorkState!=='closed')return;
  keyboard=fromKeyboard;highlight(false);folder.classList.remove('is-focused');
  setState('opening');content.hidden=false;content.inert=true;
  play('paperGrab');play('folderSlide',{duration:reducedMotion.matches?260:720,volume:.55});transition(true);
 }
 function shut(){
  if(disposed||studentWorkState!=='open')return;
  keyboard=close.matches(':focus-visible')||keyboard;
  setState('closing');content.inert=true;play('click');transition(false);
 }
 return()=>{
  disposed=true;events.abort();stopAnimations();sounds.forEach(sound=>sound.stop());pixels.clear();
 };
}
