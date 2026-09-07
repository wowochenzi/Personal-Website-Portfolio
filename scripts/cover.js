import{stage,img,fitStage,reducedMotion,place}from'./shared.js';
import{navigate}from'./router.js';
import{chooseMarkup}from'./choose.js';
import{coverMarkup}from'./cover-art.js';
import{AudioManager}from'./audio-manager.js';
export function renderCover(root){
 root.innerHTML=stage('cover');const el=root.querySelector('.stage');
 el.innerHTML=coverMarkup();
 const destination=document.createElement('div');destination.className='cover-navigation';destination.inert=true;destination.innerHTML=chooseMarkup();el.append(destination);
 el.dataset.ready='true';let disposed=false,busy=false,splitSound;const animations=[];
 const animate=(node,frames,options={})=>{const pace=reducedMotion.matches?1:1.5;const a=node.animate(frames,{fill:'both',easing:'cubic-bezier(.22,.72,.24,1)',...options,duration:(options.duration??1000)*pace,delay:(options.delay??0)*pace});animations.push(a);return a;};
 el.querySelector('button').onclick=async e=>{
  if(busy||el.dataset.ready!=='true')return;busy=true;e.currentTarget.disabled=true;
  AudioManager.play('click');AudioManager.play('folderOpen');
  await Promise.all([...destination.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));if(disposed)return;
  const scale=el.getBoundingClientRect().width/1568,offset=Math.min(75,Math.max(0,(900*scale-innerHeight)/scale));
  el.classList.add('morphing');destination.style.visibility='visible';
  splitSound=setTimeout(()=>AudioManager.play('folderSplit'),reducedMotion.matches?60:300);
  if(reducedMotion.matches){await animate(el.querySelector('.cover-face'),[{opacity:1},{opacity:0}],{duration:120}).finished.catch(()=>{});if(!disposed)navigate('choose');return;}
  animate(el.querySelector('.cover-face'),[{transform:'perspective(1400px) rotateX(0deg) rotateY(0deg)',opacity:1,offset:0},{transform:'perspective(1400px) rotateX(4deg) rotateY(-10deg) rotateZ(-.5deg)',opacity:1,offset:.22},{transform:'perspective(1400px) rotateX(4deg) rotateY(-10deg) translateY(-15px)',opacity:0,offset:.57},{opacity:0,offset:1}]);
  destination.style.transform=`translateY(${-offset}px)`;
  for(const [i,key]of ['home','about','content'].entries()){
   const node=destination.querySelector('.nav-'+key),dx=[370,0,-370][i];
   animate(node,[{transform:`translate(${dx}px,35px) scale(.82)`,opacity:0,offset:0},{transform:`translate(${dx}px,35px) scale(.82)`,opacity:0,offset:.16},{opacity:1,offset:.43},{transform:'translate(0,0) scale(1)',opacity:1,offset:1}],{duration:900});
   animate(node.querySelector('.nav-title-box'),[{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],{delay:600+i*80,duration:200});
  }
  await animate(destination.querySelector('.choose-heading'),[{opacity:0},{opacity:1}],{delay:840,duration:180}).finished.catch(()=>{});
  if(!disposed)navigate('choose');
 };
 const unfit=fitStage(root);return()=>{disposed=true;clearTimeout(splitSound);animations.forEach(a=>a.cancel());unfit();};
}
