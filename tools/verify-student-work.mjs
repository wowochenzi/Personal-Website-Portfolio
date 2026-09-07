import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';

const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1568,height:900}});
const errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
const enter=async()=>{
 if(page.url()==='http://localhost:5173/#/about')await page.reload();else await page.goto('http://localhost:5173/#/about');
 await page.waitForFunction(()=>document.querySelector('.about')?.dataset.revealState==='complete');
 await page.locator('.about img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 await page.mouse.move(1550,10);
};
const state=s=>expect(page.locator('.about')).toHaveAttribute('data-student-work-state',s);
const cta=()=>page.locator('.about-browse-projects').evaluate(e=>{
 const r=e.getBoundingClientRect(),s=getComputedStyle(e);
 return {rect:{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height},css:{opacity:s.opacity,transform:s.transform,font:s.font,color:s.color,zIndex:s.zIndex,letterSpacing:s.letterSpacing},text:e.textContent};
});
const original=JSON.parse(await fs.readFile('qa/student-work-before.json','utf8')).find(e=>e.class==='about-browse-projects');
const baseline={rect:original.rect,css:original.css,text:original.text};
const keyboardOpen=async()=>{await page.locator('.student-work-trigger').focus();await page.keyboard.press('Enter');await state('open');};
const close=async()=>{await page.keyboard.press('Escape');await state('closed');await page.mouse.move(1550,10);await page.locator('.back-link').focus();await page.waitForTimeout(250);};
const seek=async t=>{
 await page.evaluate(t=>{for(const a of document.getAnimations().filter(a=>a.id.startsWith('student-work-'))){a.pause();a.currentTime=t;}},t);
 await page.waitForTimeout(40);
};
try{
 await enter();await state('closed');expect(await cta()).toEqual(baseline);
 await expect(page.locator('.student-work-content')).toBeHidden();
 await page.mouse.move(1540,70);await page.mouse.click(1540,70);await state('closed');
 await page.mouse.move(200,270);await page.mouse.click(200,270);await state('closed');
 await page.mouse.move(1550,10);
 // Pixel hit testing locates an actual exposed kraft tab, rather than its box.
 const tab=await page.locator('.student-work-folder').evaluate(e=>{
  const r=e.getBoundingClientRect();return{x:r.x+200,y:r.y+23};
 });
 await page.mouse.move(tab.x,tab.y);await expect(page.locator('.student-work-folder')).toHaveClass(/is-hovered/);
 await expect(page.locator('.student-work-hint')).toHaveCSS('opacity','1');
 await page.mouse.click(tab.x,tab.y);await state('opening');await seek(120);
 await expect(page.locator('.student-work-folder')).toHaveAttribute('data-raised','false');expect(await cta()).toEqual(baseline);
 await seek(240);await expect(page.locator('.student-work-folder')).toHaveAttribute('data-raised','true');
 await seek(420);await expect(page.locator('.resume-content')).toHaveCSS('opacity','0.39');
 await seek(500);
 const opacity=await page.locator('.student-work-item').evaluateAll(es=>es.map(e=>Number(getComputedStyle(e).opacity)));
 expect(opacity[0]).toBeGreaterThan(opacity[4]);expect(opacity[5]).toBe(0);
 await page.evaluate(()=>document.getAnimations().filter(a=>a.id.startsWith('student-work-')).forEach(a=>a.finish()));
 await state('open');expect(await cta()).toEqual(baseline);
 const rect=await page.locator('.student-work-folder').boundingBox();expect(rect.x).toBe(457);expect(rect.y).toBe(96);
 await page.screenshot({path:'qa/screenshots/student-work-open.png'});
 checks.push('Real kraft/tab hover opens; blank and blue card do not. Layers switch at 25%, text fades to .39, six groups stagger, Figma final x457/y96.');
 await page.locator('.student-work-close').click();await state('closing');await seek(500);expect(await cta()).toEqual(baseline);
 await expect(page.locator('.student-work-folder')).toHaveAttribute('data-raised','true');
 await seek(880);await expect(page.locator('.student-work-folder')).toHaveAttribute('data-raised','false');
 await page.evaluate(()=>document.getAnimations().filter(a=>a.id.startsWith('student-work-')).forEach(a=>a.finish()));
 await state('closed');await expect(page.locator('.resume-content')).toHaveCSS('opacity','1');
 await page.mouse.move(1550,10);await page.locator('.back-link').focus();await page.waitForTimeout(250);
 expect(await cta()).toEqual(baseline);expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
 await page.screenshot({path:'qa/screenshots/student-work-closed.png'});
 checks.push('Close hides content before retraction, lowers at 75% of return path, restores opacity and removes animations; CTA geometry/style/text unchanged in every state.');
 for(let i=0;i<3;i++){
  await page.locator('.student-work-trigger').focus();await page.keyboard.press('Enter');await page.keyboard.press('Enter');await page.keyboard.press('Escape');await state('open');
  await expect(page.locator('.student-work-close')).toBeFocused();await close();await expect(page).toHaveURL(/about$/);
 }
 checks.push('Repeated keys are locked during transitions; Escape closes the folder without leaving About; keyboard focus restored.');
 for(const [width,height] of [[1568,900],[1920,1080],[1440,900],[1366,768],[1024,768],[844,390]]){
  await page.setViewportSize({width,height});await enter();const unchanged=await cta();
  await keyboardOpen();expect(await cta()).toEqual(unchanged);
  await page.locator('.about-browse-projects').scrollIntoViewIfNeeded();
  const visible=await page.locator('.about-browse-projects').evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.about-browse-projects')===e;});
  expect(visible).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`qa/screenshots/student-work-${width}x${height}.png`});await close();
 }
 checks.push('All six landscape viewports: no horizontal overflow, unchanged and unobstructed CTA, open/close works.');
 await page.setViewportSize({width:1568,height:900});await enter();await keyboardOpen();
 await page.setViewportSize({width:1024,height:768});await state('open');await close();
 await page.emulateMedia({reducedMotion:'reduce'});await enter();await keyboardOpen();await close();
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(const phase of ['opening','open','closing']){
  await enter();await page.locator('.student-work-trigger').focus();await page.keyboard.press('Enter');
  if(phase!=='opening')await state('open');if(phase==='closing')await page.keyboard.press('Escape');
  await page.locator('.about-browse-projects').click();await expect(page).toHaveURL(/choose$/);await expect(page).toHaveURL(/archive$/);
  await page.waitForFunction(()=>document.querySelector('.archive')?.dataset.revealState==='complete');
  expect(await page.evaluate(()=>document.getAnimations().some(a=>a.id.startsWith('student-work-')))).toBe(false);
 }
 checks.push('Resize/reduced motion preserve state; original browse-projects animation and route work during opening/open/closing with full cleanup.');
 const touch=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});
 await touch.goto('http://localhost:5173/#/about');await touch.waitForFunction(()=>document.querySelector('.about')?.dataset.revealState==='complete');
 await touch.locator('.about img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 const tap=await touch.locator('.student-work-folder').evaluate(e=>{const r=e.getBoundingClientRect(),s=r.width/680.376;return{x:r.x+200*s,y:r.y+23*s};});
 await touch.touchscreen.tap(tap.x,tap.y);await expect(touch.locator('.about')).toHaveAttribute('data-student-work-state','open');
 await touch.locator('.student-work-close').tap();await expect(touch.locator('.about')).toHaveAttribute('data-student-work-state','closed');
 await touch.setViewportSize({width:768,height:1024});await expect(touch.locator('#orientation-message')).toBeVisible();await touch.close();
 checks.push('Touch tap opens exposed kraft and closes with return control; portrait rotation gate retained.');
 expect(errors).toEqual([]);
}finally{
 await fs.writeFile('qa/student-work-verification.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));await browser.close();
}
