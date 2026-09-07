export const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
export const portrait=()=>matchMedia('(orientation: portrait) and (max-width: 1366px)').matches;
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const storage={read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}};
export let assets={};
export function setAssets(data){assets=data;}
export function asset(name){if(!assets[name])throw Error(`Figma asset missing: ${name}`);return assets[name].path;}
export function img(name,cls='',alt=''){return `<img class="${cls}" src="${asset(name)}" alt="${escapeHTML(alt)}" draggable="false">`;}
export function place(x,y,w,h){return `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;}
export function stage(scene){return `<div class="stage-shell"><section class="stage ${scene}" aria-label="${scene}"></section></div>`;}
export function fitStage(root,expanded=false){
  const shell=root.querySelector('.stage-shell'), el=root.querySelector('.stage');if(!shell)return()=>{};
  // Fill the available width without stretching artwork. Short windows scroll
  // vertically instead of shrinking the entire composition into side gutters.
  const fit=()=>{
    const width=shell.clientWidth;
    const scale=width/1568,h=expanded?1510:900;
    el.style.transform=`scale(${scale})`;
    el.style.height=`${h}px`;
    shell.style.height=`${h*scale}px`;
    el.style.setProperty('--scale',scale);
  };
  fit();const observer=new ResizeObserver(fit);observer.observe(shell);
  return()=>observer.disconnect();
}
export function backLink(route,label){return `<a class="back-link" href="#/${route}">${label}</a>`;}
export function creamPaper(){return `<div class="cream-transform"><div class="cream-crop">${img('raw-archive-img172')}</div></div>`;}
