import{chromium,expect}from'@playwright/test';
import fs from'node:fs/promises';
await fs.mkdir('qa/screenshots/iteration',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1568,height:900},deviceScaleFactor:2});
const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const shot=n=>page.screenshot({path:`qa/screenshots/iteration/${n}.png`});
try{
 await page.goto('http://localhost:5173/#/cover');await page.locator('.cover-navigation img').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));
 await page.locator('.cover-open').click();await page.waitForTimeout(300);await expect(page).toHaveURL(/cover$/);await expect(page.locator('.cover-open')).toBeDisabled();await shot('cover-split');await expect(page).toHaveURL(/choose$/);checks.push('Cover retains route while splitting, repeated clicks disabled');
 await page.mouse.move(5,5);await page.locator('.nav-home').hover({position:{x:150,y:450}});await page.waitForTimeout(350);
 expect(await page.locator('.nav-about').evaluate(e=>getComputedStyle(e).opacity)).toBe('0.7');expect(await page.locator('.nav-home').evaluate(e=>getComputedStyle(e).transform)).toContain('-42');await shot('choose-hover');checks.push('Folder hover -42px, inactive opacity 0.7');
 await page.goto('http://localhost:5173/#/project/woodlab');await page.locator('.book-page img').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));await page.waitForTimeout(450);await shot('book-rest');
 await page.evaluate(()=>{window.spineFrames=[];const start=performance.now();function tick(t){const s=document.querySelector('.book-shell');window.spineFrames.push({t:t-start,state:s.dataset.flipping,opacity:getComputedStyle(s.querySelector('.book-spine')).opacity});if(t-start<900)requestAnimationFrame(tick);}requestAnimationFrame(tick);});
 await page.locator('.next').click();await page.waitForTimeout(140);await shot('book-turn-early');await page.waitForTimeout(120);await shot('book-turn-middle');await page.waitForTimeout(650);
 const frames=await page.evaluate(()=>window.spineFrames);expect(frames.filter(f=>f.state==='true').length).toBeGreaterThan(2);expect(frames.filter(f=>f.state==='true').every(f=>f.opacity==='0')).toBe(true);expect(await page.locator('.book-spine').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');await fs.writeFile('qa/spine-frames.json',JSON.stringify(frames,null,2));checks.push('Spine hidden throughout turning frames, restored at rest');
 await page.goto('http://localhost:5173/#/other');
 for(const k of 'ABCD'){
  await page.locator('.label-'+k).click();await page.waitForTimeout(1000);
  const view=page.locator('#gallery-'+k+' .strip-window');await view.locator('img').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));
  const r=await view.boundingBox();expect(Math.abs(r.y+r.height/2-900*.48)).toBeLessThan(3);
  const im=await view.locator('img').first().evaluate(e=>({w:e.naturalWidth,h:e.naturalHeight,rendered:e.getBoundingClientRect().width}));expect(im.h).toBe(736);expect(im.w).toBeGreaterThan(11000);
  await expect(page.locator('#gallery-'+k+' h2')).toBeVisible();await shot('other-'+k);
 }
 checks.push('All four folders auto-center; A/B/C/D copy visible; local 2x images decoded at DPR2');
 const track=page.locator('#gallery-D .strip-track');await page.mouse.move(5,5);await page.waitForTimeout(900);
 const x=()=>track.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
 const first=await x(),start=Date.now();await page.waitForTimeout(550);const speed=Math.abs((await x())-first)/((Date.now()-start)/1000);expect(speed).toBeGreaterThan(31);expect(speed).toBeLessThan(41);
 await page.locator('#gallery-D .strip-window').hover();await page.waitForTimeout(100);const stopped=await x();await page.waitForTimeout(250);expect(await x()).toBe(stopped);checks.push('HD strip loop stays 32–40 CSS px/s; hover pauses');
 for(const [w,h]of [[1920,1080],[1024,768],[844,390]]){
  await page.setViewportSize({width:w,height:h});await page.goto('http://localhost:5173/#/cover');await page.goto('http://localhost:5173/#/other');await page.locator('.label-C').click();await page.waitForTimeout(950);const r=await page.locator('#gallery-C .strip-window').boundingBox();expect(Math.abs(r.y+r.height/2-h*.48)).toBeLessThan(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 }checks.push('Desktop, iPad and phone landscape auto-centering and no horizontal overflow');
 expect(errors).toEqual([]);
}finally{await fs.writeFile('qa/iteration-verification.json',JSON.stringify({checks,errors},null,2));console.log({checks,errors});await browser.close();}
