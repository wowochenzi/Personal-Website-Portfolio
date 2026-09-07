import {reducedMotion} from './shared.js';
import {AudioManager} from './audio-manager.js';

const paperEase = 'cubic-bezier(.22,.72,.24,1)';
const inkEase = 'cubic-bezier(.18,.78,.22,1)';
// Fixed offsets give each sheet its own weight without changing its final pose.
const poses = [[-5,18,-.7],[4,16,.5],[8,16,.4],[-2,14,-1],[5,18,.6],[-4,16,-.45],[3,14,.35]];

function lineBands(node, scale, grouped) {
 const height = node.offsetHeight, width = node.offsetWidth;
 if (grouped) return {width, bands: [[-2, height + 4]]};
 const top = node.getBoundingClientRect().top, centers = [];
 const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
 for (let text; (text = walker.nextNode());) {
  if (!text.textContent.trim()) continue;
  const range = document.createRange(); range.selectNodeContents(text);
  for (const rect of range.getClientRects()) {
   if (!rect.width || !rect.height) continue;
   const y = (rect.top + rect.height / 2 - top) / scale;
   if (!centers.some(other => Math.abs(other-y) < 3)) centers.push(y);
  }
 }
 centers.sort((a,b) => a-b);
 if (centers.length < 2) return {width, bands: [[-2, height + 4]]};
 const boundaries = [-2, ...centers.slice(1).map((y,i) => (centers[i]+y)/2), height+2];
 return {width, bands: centers.map((_,i) => [boundaries[i], boundaries[i+1]-boundaries[i]])};
}

function inkFrames(node, stageScale, {grouped, title, reduced}) {
 const {width, bands} = lineBands(node, stageScale, grouped || reduced);
 // Extend left to include the existing round bullets outside the text box.
 const pad = 36, feather = reduced ? 0 : 16, maskWidth = width + pad + feather;
 const maskImage = bands.map(() => `linear-gradient(90deg,#000 0px,#000 ${maskWidth-feather}px,transparent ${maskWidth}px)`).join(',');
 const maskSize = bands.map(([,height]) => `${maskWidth}px ${height}px`).join(',');
 const steps = 24, stagger = bands.length > 1 ? Math.min(.1, .32/(bands.length-1)) : 0;
 return Array.from({length: steps+1}, (_,i) => {
  const t = i/steps;
  return {offset:t, maskImage, maskSize, maskRepeat:'no-repeat', maskClip:'no-clip', maskOrigin:'border-box',
   maskPosition: bands.map(([y],line) => {
    const progress = Math.max(0, Math.min(1, (t-line*stagger)/(1-(bands.length-1)*stagger)));
    return `${-maskWidth-pad+maskWidth*progress}px ${y}px`;
   }).join(','), ...(title ? {opacity:t} : {})};
 });
}

function sequence(stage, items) {
 let disposed = false, started = false, animations = [], soundTimers = [];
 const reduced = reducedMotion.matches, phone = innerWidth < 1024;
 const timeScale = phone ? .7 : 1, distance = phone ? .6 : innerWidth < 1280 ? .85 : 1;
 const entries = items.filter(item => item.node);
 stage.dataset.revealState = 'preparing'; stage.dataset.archiveLocked = 'true'; stage.inert = true;
 entries.forEach(({node,kind}) => { node.dataset.revealItem = kind; });
 const unlock = () => { stage.inert = false; delete stage.dataset.archiveLocked; };
 const finish = () => {
  soundTimers.forEach(clearTimeout);soundTimers=[];
  animations.forEach(animation => animation.cancel()); animations = [];
  stage.dataset.revealState = 'complete'; unlock();
 };
 const onPreference = () => { if (reducedMotion.matches) { disposed = true; finish(); } };
 reducedMotion.addEventListener('change', onPreference);
 const run = () => {
  if (disposed || started || !stage.getBoundingClientRect().width) return;
  started = true;
  const stageScale = stage.getBoundingClientRect().width / 1568;
  const completions = [];
  // Three light contacts at most, even when a page contains many paper pieces.
  entries.filter(item=>item.kind==='paper').filter((_,i)=>[0,2,4].includes(i)).forEach(item=>{
   const delay=reduced?item.at*.06+180:(item.at+320)*timeScale;
   const due=performance.now()+delay;
   soundTimers.push(setTimeout(()=>{if(!disposed&&performance.now()-due<120)AudioManager.play('paperDrop',{volume:.65});},delay));
  });
  for (const item of entries) {
   const {node,kind,at,duration = kind === 'paper' ? 440 : 620} = item;
   const delay = reduced ? (kind === 'paper' ? at*.06 : 210+at*.06) : at*timeScale;
   const ms = reduced ? (kind === 'paper' ? 200 : 240) : duration*timeScale;
   let frames;
   if (kind === 'paper') {
    const [x,y,rotation] = poses[item.pose || 0];
    frames = reduced ? [{opacity:0,translate:'0 5px'},{opacity:1,translate:'0 0'}] : [
     {offset:0,opacity:0,translate:`${x*distance}px ${y*distance}px`,rotate:`${rotation}deg`,scale:item.photo ? .97 : .99},
     {offset:.72,opacity:1,translate:'0 0',rotate:'0deg',scale:1},
     {offset:.86,opacity:1,translate:`0 ${1.5*distance}px`,rotate:'0deg',scale:1},
     {offset:1,opacity:1,translate:'0 0',rotate:'0deg',scale:1}
    ];
   } else frames = inkFrames(node, stageScale, {...item, reduced});
   const animation = node.animate(frames, {delay, duration:ms, fill:'both', easing:kind === 'paper' ? paperEase : inkEase});
   animation.id = `archive-reveal-${kind}`; animations.push(animation);
   completions.push(animation.finished.then(() => {
    animation.cancel();
    if (!disposed && item.unlock) unlock();
   }).catch(() => {}));
  }
  stage.dataset.revealState = 'playing';
  Promise.all(completions).then(() => { if (!disposed) finish(); });
 };
 // Hide only the participating elements while their local artwork/fonts decode.
 // The background remains visible, and no frame can flash the completed layout.
 const ready = Promise.all([document.fonts.ready, ...[...stage.querySelectorAll('img')].map(image => image.decode().catch(() => {}))]);
 // End an active sequence on resize, or resume one opened behind the portrait gate.
 let initialWidth = stage.getBoundingClientRect().width;
 const resize = new ResizeObserver(() => {
  const width = stage.getBoundingClientRect().width;
  if (Math.abs(width-initialWidth) < 1) return;
  initialWidth = width;
  if (started) { disposed = true; finish(); } else ready.then(run);
 });
 resize.observe(stage.parentElement);
 // fitStage and initial scroll settle before measuring wrapped text lines.
 ready.then(() => requestAnimationFrame(() => requestAnimationFrame(run)));
 return () => {
  disposed = true; resize.disconnect(); animations.forEach(animation => animation.cancel());
  soundTimers.forEach(clearTimeout);
  reducedMotion.removeEventListener('change', onPreference);
  unlock();
 };
}

export function revealAbout(stage) {
 const items = [], one = selector => stage.querySelector(selector);
 const paper = (selector,at,pose,photo=false) => items.push({node:one(selector),kind:'paper',at,pose,photo});
 const ink = (node,at,duration=620,grouped=false,title=false) => items.push({node,kind:'ink',at,duration,grouped,title});
 paper('[data-about-asset="03_ABOUT_FOLDER_KRAFT_BACK"]',0,0);
 paper('[data-about-asset="03_ABOUT_BLUE_CARD_BG"]',120,1);
 paper('[data-about-asset="03_ABOUT_BLUE_CARD_HOLE_EDGE"]',240,2);
 paper('[data-about-asset="03_ABOUT_PROFILE_PHOTO"]',360,3,true);
 paper('.about-contact-paper',480,4);
 ink(one('.about-title'),800,430,true,true);
 const leftGroups = [['3:174','3:175'],['3:176','3:181','3:178','3:179'],['3:177','3:182'],['3:183','3:180']];
 leftGroups.forEach((ids,i) => ids.forEach(id => ink(one(`[data-node-id="${id}"]`),880+i*80)));
 const right = {'3:198':1080,'3:188':1120,'3:199':1140,'3:187':1160,'3:189':1200,'3:190':1240,'3:191':1280,'22:9':1320};
 Object.entries(right).forEach(([id,at]) => ink(one(`[data-node-id="${id}"]`),at,id==='3:198'?440:620));
 ink(one('.about-publications > h2'),1200,440);
 stage.querySelectorAll('.about-publications article').forEach((article,i) => article.querySelectorAll('p').forEach((p,j) => ink(p,1240+i*90+j*45,600)));
 ink(one('.about-research-result h2'),1400,440); ink(one('.about-research-result p'),1460,560);
 ink(one('[data-node-id="3:207"]'),1280,440);
 stage.querySelectorAll('.about-skills > p').forEach((p,i) => ink(p,1340+i*80,560));
 stage.querySelectorAll('.about-contact-details > div').forEach((p,i) => ink(p,1260+i*80,560,true));
 ink(one('.about-browse-projects'),1490,560,true);
 return sequence(stage,items);
}

export function revealArchive(stage, restore=false) {
 if (restore) {
  stage.dataset.revealState = 'restoring';
  const fade = stage.animate([{opacity:0},{opacity:1}], {duration:reducedMotion.matches?100:180,easing:'ease-out'});
  fade.finished.then(() => {stage.dataset.revealState='complete';fade.cancel();}).catch(() => {});
  return () => fade.cancel();
 }
 const items = [
  {node:stage.querySelector('.archive-directory'),kind:'paper',at:0,pose:0},
  {node:stage.querySelector('.archive-paper'),kind:'paper',at:110,pose:2},
  {node:stage.querySelector('.archive-mask'),kind:'paper',at:110,pose:1}
 ];
 stage.querySelectorAll('.archive-object').forEach((node,i) => items.push({node,kind:'paper',at:240+i*110,pose:(i+2)%poses.length,unlock:i===4}));
 items.push({node:stage.querySelector('.archive-title'),kind:'ink',at:1140,duration:430,grouped:true,title:true});
 stage.querySelectorAll('.archive-index a').forEach((node,i) => items.push({node,kind:'ink',at:1200+i*80,duration:580,grouped:true}));
 stage.querySelectorAll('.archive-caption').forEach((node,i) => items.push({node,kind:'ink',at:1170+i*70,duration:570,grouped:true}));
 items.push({node:stage.querySelector('.archive-hint'),kind:'ink',at:1500,duration:550,grouped:true});
 return sequence(stage,items);
}
