// Test the actual paper alpha, not its large transparent rectangular image box.
export function folderHitAreas(stage){
 const links=[...stage.querySelectorAll('.nav-folder')].reverse(),pixels=new Map();let disposed=false;
 function localPoint(node,x,y){
  const r=node.getBoundingClientRect(),w=node.offsetWidth,h=node.offsetHeight;
  const m=new DOMMatrix(getComputedStyle(node).transform),extent=Math.abs(m.a*w)+Math.abs(m.c*h),scale=r.width/extent;
  if(!scale)return null;
  const p=m.inverse().transformPoint(new DOMPoint((x-r.left-r.width/2)/scale,(y-r.top-r.height/2)/scale));
  return{x:p.x+w/2,y:p.y+h/2,w,h};
 }
 const inside=p=>p&&p.x>=0&&p.y>=0&&p.x<p.w&&p.y<p.h;
 function pick(x,y){
  if(stage.inert)return null;
  for(const link of links){
   if(inside(localPoint(link.querySelector('.nav-title'),x,y)))return link;
   const image=link.querySelector('img'),data=pixels.get(image),p=localPoint(image,x,y);
   if(data&&inside(p)&&data.rgba[(Math.floor(p.y/p.h*data.h)*data.w+Math.floor(p.x/p.w*data.w))*4+3]>48)return link;
  }return null;
 }
 function highlight(link){links.forEach(a=>{a.classList.toggle('is-hovered',a===link);a.style.pointerEvents=a===link?'auto':'none';});stage.style.cursor=link?'pointer':'';}
 const move=e=>{if(e.pointerType!=='touch')highlight(pick(e.clientX,e.clientY));};
 const leave=()=>highlight(null);
 const click=e=>{if(e.detail===0)return;const hit=pick(e.clientX,e.clientY);if(!hit){e.preventDefault();e.stopPropagation();return;}if(e.target.closest('a')!==hit){e.preventDefault();e.stopPropagation();hit.click();}};
 links.forEach(link=>{link.style.pointerEvents='none';const image=link.querySelector('img');image.decode().then(()=>{
  if(disposed)return;const canvas=document.createElement('canvas');canvas.width=Math.min(1024,image.naturalWidth);canvas.height=Math.round(image.naturalHeight*canvas.width/image.naturalWidth);const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,canvas.width,canvas.height);pixels.set(image,{rgba:ctx.getImageData(0,0,canvas.width,canvas.height).data,w:canvas.width,h:canvas.height});
 }).catch(()=>{});});
 stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',leave);stage.addEventListener('click',click,true);
 return()=>{disposed=true;pixels.clear();stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);stage.removeEventListener('click',click,true);};
}
