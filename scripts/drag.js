import{storage,portrait}from'./shared.js';
import{AudioManager}from'./audio-manager.js';
export function makeDraggable(el,{id,stage,onOpen,touchOpen=false,captureOnPress=true}){
 let drag=null,moved=false,suppressClick=false;const key='portfolio_archive_positions', zkey='portfolio_archive_z';
 const saved=storage.read(key,{}), zs=storage.read(zkey,{});
 if(saved[id]){el.style.left=`${saved[id].x*1568}px`;el.style.top=`${saved[id].y*900}px`;}el.style.zIndex=zs[id]||10;
 const elevate=()=>{const z=storage.read(zkey,{});z[id]=Math.max(10,...Object.values(z))+1;if(z[id]>900){Object.keys(z).sort((a,b)=>z[a]-z[b]).forEach((k,i)=>z[k]=10+i);}el.style.zIndex=z[id];storage.write(zkey,z);};
 el.addEventListener('pointerdown',e=>{if(e.button!==0||portrait()||stage.dataset.archiveLocked==='true')return;AudioManager.play('paperGrab');elevate();moved=false;suppressClick=false;drag={x:e.clientX,y:e.clientY,left:parseFloat(el.style.left),top:parseFloat(el.style.top),type:e.pointerType};if(captureOnPress)el.setPointerCapture(e.pointerId);});
 el.addEventListener('pointermove',e=>{if(!drag)return;const s=stage.getBoundingClientRect().width/1568,dx=(e.clientX-drag.x)/s,dy=(e.clientY-drag.y)/s;if(Math.hypot(dx,dy)>7)moved=true;if(moved){if(!el.hasPointerCapture(e.pointerId))el.setPointerCapture(e.pointerId);el.classList.add('dragging');el.style.left=`${Math.max(0,Math.min(1568-el.offsetWidth,drag.left+dx))}px`;el.style.top=`${Math.max(40,Math.min(760-el.offsetHeight/2,drag.top+dy))}px`;}});
 const finish=e=>{if(!drag)return;AudioManager.play('paperDrop');const type=drag.type;drag=null;el.classList.remove('dragging');if(moved){const p=storage.read(key,{});p[id]={x:parseFloat(el.style.left)/1568,y:parseFloat(el.style.top)/900};storage.write(key,p);suppressClick=true;}else if(type!=='mouse'&&touchOpen){onOpen();}if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);};
 el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',e=>{drag=null;el.classList.remove('dragging');});
 el.addEventListener('click',e=>{if(suppressClick||stage.dataset.archiveLocked==='true'){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}},true);
 el.addEventListener('pointerleave',()=>{if(!captureOnPress&&!moved)drag=null;});
 el.addEventListener('dragstart',e=>e.preventDefault());
 el.addEventListener('dblclick',()=>{if(!moved&&stage.dataset.archiveLocked!=='true')onOpen?.();});
 el.addEventListener('keydown',e=>{if(onOpen&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(stage.dataset.archiveLocked==='true')return;elevate();onOpen();}});
}
