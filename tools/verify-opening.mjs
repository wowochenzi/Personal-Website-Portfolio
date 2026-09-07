import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';

const browser=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=user-gesture-required']});
const page=await browser.newPage({viewport:{width:1568,height:900}}),errors=[],requests=[],checks=[],timings=[];
page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
page.on('request',request=>requests.push(request.url()));
const url='http://localhost:5173/#/cover';
const started=()=>page.waitForFunction(()=>document.body.dataset.opening==='playing');
const finished=()=>page.waitForFunction(()=>!document.body.dataset.opening);
const seek=async time=>{await page.evaluate(t=>{for(const a of document.getAnimations()){a.pause();a.currentTime=t;}},time);await page.waitForTimeout(40);};
try {
 await page.goto(url);const cdp=await page.context().newCDPSession(page);
 for(let i=0;i<5;i++) {
  if(i){await cdp.send('Network.clearBrowserCache');await Promise.all([page.waitForEvent('domcontentloaded'),cdp.send('Page.reload',{ignoreCache:true})]);}
  await started();const start=await page.evaluate(()=>performance.now());
  await expect(page.locator('.cover')).toHaveAttribute('data-ready','false');
  await page.keyboard.press('Escape');await page.mouse.click(780,735);
  await expect(page).toHaveURL(url);await finished();
  timings.push(Math.round(await page.evaluate(()=>performance.now())-start));
  await expect(page.locator('.cover')).toHaveAttribute('data-ready','true');
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await expect(page.locator('.opening-sequence')).toHaveCount(0);
 }
 checks.push('Five cache-bypassing reloads replay a complete opening; early click/Escape cannot navigate; no residual animations');
 await page.locator('.cover-open').click();await page.waitForURL('**/#/choose');
 await page.locator('.nav-home').focus();await page.keyboard.press('Enter');await page.waitForURL('**/#/cover');
 expect(await page.evaluate(()=>document.body.dataset.opening)).toBeUndefined();await expect(page.locator('.cover')).toHaveAttribute('data-ready','true');
 checks.push('Existing Cover split and reverse Home transition work without replaying opening');

 await page.locator('.sound-toggle').click();expect(await page.evaluate(()=>localStorage.getItem('portfolio_sound_muted'))).toBe('true');
 await page.reload();await started();await expect(page.locator('.sound-toggle')).toHaveAttribute('data-muted','true');await finished();
 checks.push('Sound Off persists across refresh, independently of visual opening');

 for(const [width,height] of [[1568,900],[1920,1080],[1440,900],[1366,768],[1024,768],[844,390]]) {
  await page.setViewportSize({width,height});await page.reload();await started();await seek(100);
  const box=await page.locator('.opening-paper__surface').boundingBox();expect(box.width/width).toBeGreaterThan(.08);expect(box.width/width).toBeLessThan(.12);expect(Math.abs(box.x+box.width/2-width/2)).toBeLessThan(2);
  await seek(1110);
  // At the exact flattened pose, both texture layers must match the underlying
  // page pixel for pixel, including its scaled stage and viewport background.
  await page.evaluate(()=>{const p=document.querySelector('.opening-paper');p.style.cssText='--paper-left:0px;--paper-width:100%;--curl-opacity:0';});
  const a=await page.screenshot();await page.locator('.opening-paper').evaluate(el=>el.style.visibility='hidden');const b=await page.screenshot();
  const diff=await page.evaluate(async([a,b])=>{
   const load=src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i);i.src='data:image/png;base64,'+src;});
   const images=await Promise.all([load(a),load(b)]);const canvas=document.createElement('canvas');canvas.width=images[0].width;canvas.height=images[0].height;const c=canvas.getContext('2d');
   const data=images.map(image=>{c.drawImage(image,0,0);return c.getImageData(0,0,canvas.width,canvas.height).data;});let sum=0,count=0;
   for(let i=0;i<data[0].length;i++){const d=Math.abs(data[0][i]-data[1][i]);sum+=d;if(d>2)count++;}return {mean:sum/data[0].length,changed:count/data[0].length};
  },[a.toString('base64'),b.toString('base64')]);
  expect(diff.mean).toBeLessThan(.03);expect(diff.changed).toBeLessThan(.002);
  await page.locator('.opening-paper').evaluate(el=>el.style.visibility='');await seek(1400);await page.screenshot({path:`qa/screenshots/welcome-${width}x${height}.png`});
  await page.evaluate(()=>document.getAnimations().forEach(a=>a.play()));await finished();
  await page.screenshot({path:`qa/screenshots/opening-final-${width}x${height}.png`});
 }
 checks.push('Six required landscape viewports: centered strip, seamless texture pixel comparison, final Cover and cleanup');

 await page.setViewportSize({width:390,height:844});await page.reload();await started();await page.waitForTimeout(300);
 await expect(page.locator('#orientation-message')).toBeVisible();await expect(page.locator('.opening-sequence')).toBeHidden();
 expect(await page.evaluate(()=>document.getAnimations().every(a=>a.playState==='paused'))).toBe(true);
 await page.setViewportSize({width:844,height:390});await finished();
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await started();await expect(page.locator('.opening-paper__curl')).toHaveCount(0);await finished();
 checks.push('Portrait pauses opening behind rotation gate; landscape resumes; reduced motion retains a shorter narrative without curls');

 await page.setViewportSize({width:1568,height:900});await page.emulateMedia({reducedMotion:'no-preference'});
 // Record transient DOM too: a final scene assertion alone misses a Cover flash.
 await page.addInitScript(()=>{
  window.coverFlash=false;
  new MutationObserver(()=>{if(document.querySelector('.cover,.opening-sequence'))window.coverFlash=true;}).observe(document,{childList:true,subtree:true});
 });
 for(const route of ['choose','about','archive','other','project/pawtern','project/woodlab','project/nuofield','project/beeflow']){
  await page.goto('about:blank');
  await page.goto('http://localhost:5173/#/'+route);
  for(let pass=0;pass<2;pass++){
   if(pass)await page.reload();
   await expect(page.locator('#app')).toHaveAttribute('data-scene',route.split('/')[0]);
   await page.waitForTimeout(150);
   expect(await page.evaluate(()=>window.coverFlash)).toBe(false);
   expect(await page.evaluate(()=>document.body.dataset.opening)).toBeUndefined();
  }
 }
 checks.push('All eight deep routes load and refresh directly; DOM observer detects no transient Cover or opening');
 await page.goto('http://localhost:5173/#/project/woodlab');await expect(page.locator('.flipbook')).toBeVisible();

 // Observe real interactions, without supplying or inventing production sounds.
 await page.evaluate(async()=>{const {AudioManager:a}=await import('./scripts/audio-manager.js');window.soundCalls=[];const original=a.play.bind(a);a.play=(key,options)=>{window.soundCalls.push(key);return original(key,options);};});
 await page.locator('.next').click();await expect(page.locator('.page-counter')).toHaveText('03–04 / 10');await page.waitForTimeout(100);
 await page.locator('.prev').click();await expect(page.locator('.page-counter')).toHaveText('01–02 / 10');await page.waitForTimeout(100);
 const flips=await page.evaluate(()=>window.soundCalls.filter(key=>key.startsWith('pageFlip')));expect(flips).toHaveLength(2);expect(flips[0]).not.toBe(flips[1]);
 await page.goto('http://localhost:5173/#/archive');await page.waitForFunction(()=>document.querySelector('.archive')?.dataset.revealState==='complete');
 await page.evaluate(()=>window.soundCalls=[]);const obj=page.locator('[data-project="woodlab"]'),box=await obj.boundingBox();
 await page.mouse.move(box.x+70,box.y+70);await page.mouse.down();await page.mouse.move(box.x+110,box.y+45,{steps:6});await page.mouse.up();
 expect(await page.evaluate(()=>window.soundCalls)).toEqual(['paperGrab','paperDrop']);
 await page.goto('http://localhost:5173/#/other');await page.evaluate(()=>window.soundCalls=[]);
 await page.locator('.label-A').click();await page.locator('.label-B').click();await page.locator('.label-B').click();
 expect(await page.evaluate(()=>window.soundCalls)).toEqual(['otherOpen','otherOpen','otherClose']);
 checks.push('Real book turns play one nonrepeating variant; drag grab/drop; Other direct switch plays only new open');

 await page.locator('.sound-toggle').click();
 const engine=await page.evaluate(async()=>{
  const {AudioManager:a,soundCatalog}=await import('./scripts/audio-manager.js');await a.context.resume();
  // Silent in-memory buffers exercise the engine without creating audio assets.
  for(const key of Object.keys(soundCatalog))a.buffers.set(key,a.context.createBuffer(1,a.context.sampleRate,a.context.sampleRate));
  for(const key of ['paperGrab','paperDrop','folderSlide','otherOpen'])a.play(key);
  const concurrent=a.active.size,volume=a.master.gain.value;a.setMuted(true);const muted=a.active.size;
  a.setMuted(false);await a.context.suspend();const blocked=a.play('click');await a.context.resume();const queued=a.active.size;
  return{concurrent,volume,muted,blocked,queued};
 });
 expect(engine.concurrent).toBe(3);expect(engine.volume).toBeCloseTo(.54,5);expect(engine.muted).toBe(0);expect(engine.blocked).toBeNull();expect(engine.queued).toBe(0);
 expect(requests.filter(url=>url.endsWith('.mp3'))).toEqual([]);expect(errors).toEqual([]);
 checks.push('Gain/three-voice cap/mute stop verified with silent test buffers; blocked sounds never queue; missing pack makes zero MP3 requests/errors');
} finally {
 await fs.writeFile('qa/opening-verification.json',JSON.stringify({checks,timings,errors},null,2));console.log(JSON.stringify({checks,timings,errors},null,2));await browser.close();
}
