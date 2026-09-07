import{reducedMotion}from'./shared.js';
export function showcaseScroller(){
 let frame=0,version=0;
 const cancel=()=>{version++;cancelAnimationFrame(frame);};
 const clamp=y=>Math.max(0,Math.min(y,document.documentElement.scrollHeight-innerHeight));
 const to=(target)=>{
  cancel();const token=version,startY=scrollY,started=performance.now(),end=clamp(target),over=clamp(end+(end>=startY?16:-16));
  if(reducedMotion.matches){window.scrollTo({top:end,behavior:'instant'});return;}
  const tick=now=>{if(token!==version)return;const elapsed=now-started;
   const first=elapsed<590,t=Math.min(1,first?elapsed/590:(elapsed-590)/160),ease=first?1-Math.pow(1-t,3):t*t*(3-2*t);
   window.scrollTo({top:first?startY+(over-startY)*ease:over+(end-over)*ease,behavior:'instant'});
   if(elapsed<750)frame=requestAnimationFrame(tick);
  };frame=requestAnimationFrame(tick);
 };
 return{to,cancel};
}
