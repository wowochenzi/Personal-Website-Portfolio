import {storage} from './shared.js';

export const soundCatalog = {
 paperUnroll:['paper_unroll',.37],paperSettle:['paper_settle',.19],
 folderSlide:['folder_slide',.28],folderOpen:['folder_open',.26],folderSplit:['folder_split',.26],
 clip1:['paperclip_drop_01',.21],clip2:['paperclip_drop_02',.20],clip3:['paperclip_drop_03',.22],
 paperGrab:['paper_grab',.21],paperDrop:['paper_drop',.20],
 pageFlip1:['page_flip_01',.27],pageFlip2:['page_flip_02',.26],pageFlip3:['page_flip_03',.28],
 click:['ui_click_soft',.17],otherOpen:['other_folder_open',.24],otherClose:['other_folder_close',.22]
};

class ArchiveAudio {
 constructor() {
  this.muted=storage.read('portfolio_sound_muted',false);this.volume=.54;
  this.buffers=new Map();this.active=new Set();this.lastPlayed=new Map();this.context=null;
 }
 init() {
  if(this.initialized)return;this.initialized=true;
  this.events=new AbortController();const options={capture:true,passive:true,signal:this.events.signal};
  const unlock=()=>this.unlock();
  for(const type of ['pointerdown','touchstart','click','keydown'])window.addEventListener(type,unlock,options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stopAll();},{signal:this.events.signal});
  window.addEventListener('storage',e=>{if(e.key==='portfolio_sound_muted')this.setMuted(e.newValue==='true',false);},{signal:this.events.signal});
  this.preload();
 }
 ensureContext() {
  if(this.context)return this.context;
  try {
   const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;
   this.context=new Context();this.master=this.context.createGain();
   this.master.gain.value=this.muted?0:this.volume;this.master.connect(this.context.destination);
  } catch {return null;}
  return this.context;
 }
 async preload() {
  // Only declared local files are requested: an incomplete sound pack stays quiet,
  // without a cascade of 404s. npm run audio:sync discovers newly supplied files.
  try {
   const response=await fetch('assets/audio/manifest.json');if(!response.ok)return;
   const {available=[]}=await response.json();if(this.disposed||!available.length)return;
   const context=this.ensureContext();if(!context)return;
   await Promise.allSettled(Object.entries(soundCatalog).filter(([, [file]])=>available.includes(file+'.mp3')).map(async([key,[file]])=>{
    const response=await fetch(`assets/audio/${file}.mp3`);if(!response.ok)return;
    const buffer=await context.decodeAudioData(await response.arrayBuffer());if(!this.disposed)this.buffers.set(key,buffer);
   }));
  } catch { /* Missing/unsupported audio never blocks the portfolio. */ }
 }
 unlock() {
  if(this.muted||this.disposed)return;
  const context=this.ensureContext();if(context?.state==='suspended')context.resume().catch(()=>{});
 }
 setMuted(value,persist=true) {
  this.muted=!!value;if(persist)storage.write('portfolio_sound_muted',this.muted);
  if(this.master)this.master.gain.value=this.muted?0:this.volume;
  if(this.muted)this.stopAll();else this.unlock();this.onChange?.();
 }
 setVolume(value) {
  this.volume=Math.max(0,Math.min(1,value));if(this.master)this.master.gain.value=this.muted?0:this.volume;
 }
 play(key,{duration,volume=1}={}) {
  const buffer=this.buffers.get(key),context=this.context;
  // Never queue a blocked/missing opening sound for a later user gesture.
  if(this.disposed||this.muted||document.hidden||!buffer||context?.state!=='running')return null;
  const now=context.currentTime;if(now-(this.lastPlayed.get(key)??-Infinity)<.09)return null;
  if(this.active.size>=3)this.active.values().next().value.stop();
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;
  const seconds=Math.min(buffer.duration,duration?duration/1000:buffer.duration),level=soundCatalog[key][1]*volume;
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+Math.min(.015,seconds/3));
  gain.gain.setValueAtTime(level,now+Math.max(.015,seconds-.055));gain.gain.linearRampToValueAtTime(0,now+seconds);
  source.connect(gain);gain.connect(this.master);
  const entry={stop:()=>{try{source.stop();}catch{}this.active.delete(entry);source.disconnect();gain.disconnect();}};
  source.onended=entry.stop;this.active.add(entry);this.lastPlayed.set(key,now);
  source.start(now);source.stop(now+seconds);return entry;
 }
 playRandom(keys=['pageFlip1','pageFlip2','pageFlip3']) {
  const choices=keys.filter(key=>key!==this.lastVariant),key=choices[Math.floor(Math.random()*choices.length)]||keys[0];
  this.lastVariant=key;return this.play(key);
 }
 stopAll(){for(const sound of [...this.active])sound.stop();}
 dispose(){this.disposed=true;this.stopAll();this.events?.abort();this.buffers.clear();this.context?.close().catch(()=>{});}
}
export const AudioManager=new ArchiveAudio();

export function installSoundToggle() {
 AudioManager.init();const button=document.createElement('button');button.className='sound-toggle';
 button.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><g class="sound-waves"><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></g><path class="sound-cross" d="m17 9 5 6m0-6-5 6"/></svg>';
 const paint=()=>{button.dataset.muted=String(AudioManager.muted);button.setAttribute('aria-pressed',String(!AudioManager.muted));button.setAttribute('aria-label',AudioManager.muted?'Sound Off · 开启交互音效':'Sound On · 关闭交互音效');button.title=AudioManager.muted?'Sound Off':'Sound On';};
 AudioManager.onChange=paint;paint();button.onclick=()=>AudioManager.setMuted(!AudioManager.muted);document.body.append(button);
 return()=>{button.remove();AudioManager.onChange=null;AudioManager.dispose();};
}
