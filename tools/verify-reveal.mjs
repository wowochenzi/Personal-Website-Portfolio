import {chromium, expect} from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage({viewport:{width:1568,height:900}});
const checks = [], errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', e => {if(e.type()==='error')errors.push(e.text());});
const enter = async scene => {
 const url = `http://localhost:5173/#/${scene}`;
 if(page.url()===url)await page.reload();else await page.goto(url);
 await page.waitForFunction(() => document.querySelector('.stage')?.dataset.revealState === 'playing');
};
const done = () => page.waitForFunction(() => document.querySelector('.stage')?.dataset.revealState === 'complete');
const timing = () => page.evaluate(() => document.getAnimations().filter(a => a.id.startsWith('archive-reveal')).map(a => {
 const {target} = a.effect, t = a.effect.getTiming();
 return {kind:target.dataset.revealItem,asset:target.dataset.aboutAsset,project:target.dataset.project,cls:target.className,
  delay:t.delay,duration:t.duration,frames:a.effect.getKeyframes().map(f=>({rotate:f.rotate,translate:f.translate,scale:f.scale,maskPosition:f.maskPosition}))};
}));
const staticSnapshot = () => page.locator('.stage').evaluate(el => [...el.querySelectorAll('.about-layer,.about-copy,.about-publications,.about-publications h2,.about-publications p,.about-skills,.about-contact,.about-contact-details,.about-title,.about-browse-projects,.archive-paper,.archive-directory,.archive-index,.archive-index a,.archive-object,.archive-caption,.archive-mask,.archive-title')].map(e => {
 const r=e.getBoundingClientRect(),s=getComputedStyle(e);
 return {tag:e.tagName,cls:e.className,x:r.x,y:r.y,w:r.width,h:r.height,transform:s.transform,z:s.zIndex,font:s.fontSize,text:e.textContent};
}));
try {
 const before = JSON.parse(await fs.readFile('qa/reveal-static-before.json','utf8'));
 await enter('about');
 const about = await timing();
 expect(about.filter(a=>a.asset).sort((a,b)=>a.delay-b.delay).map(a=>a.asset)).toEqual([
  '03_ABOUT_FOLDER_KRAFT_BACK','03_ABOUT_BLUE_CARD_BG','03_ABOUT_BLUE_CARD_HOLE_EDGE','03_ABOUT_PROFILE_PHOTO'
 ]);
 expect(Math.max(...about.map(a=>a.delay+a.duration))).toBeLessThanOrEqual(2100);
 expect(about.filter(a=>a.kind==='ink').every(a=>a.delay>=800)).toBe(true);
 await done();
 // Student Work keeps the same visual geometry while grouping resume text and
 // raising the personal card over the closed folder. DOM order/z are intentional.
 const aboutLayout=rows=>rows.map(({z,...row})=>row).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 expect(aboutLayout(await staticSnapshot())).toEqual(aboutLayout(before.about));
 expect(await page.locator('.stage').evaluate(e => e.inert)).toBe(false);
 expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
 checks.push('About: ordered sheets/photo, delayed line masks, <=2.1s, exact original final layout, no continuing motion');

 await page.locator('.back-link').click();
 await page.locator('.nav-about').focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/choose$/);
 expect(await page.locator('.stage').evaluate(e=>e.inert)).toBe(true);
 await expect(page).toHaveURL(/about$/);await done();
 await page.locator('.about-browse-projects').click();
 await expect(page).toHaveURL(/choose$/);await expect(page).toHaveURL(/archive$/);
 await page.waitForFunction(()=>document.querySelector('.stage')?.dataset.revealState==='playing');
 checks.push('Choose exit remains continuous; About replays on reopening; browse-projects journey still reaches Archive');

 await enter('archive');
 const archive = await timing();
 expect(archive.filter(a=>a.project).sort((a,b)=>a.delay-b.delay).map(a=>a.project)).toEqual(['pawtern','woodlab','nuofield','beeflow','other']);
 expect(Math.max(...archive.map(a=>a.delay+a.duration))).toBeLessThanOrEqual(2100);
 expect(await page.locator('.stage').evaluate(e=>e.inert&&e.dataset.archiveLocked==='true')).toBe(true);
 const stateBefore = await page.evaluate(()=>({pos:localStorage.getItem('portfolio_archive_positions'),z:localStorage.getItem('portfolio_archive_z')}));
 await page.locator('[data-project="woodlab"]').dispatchEvent('pointerdown',{button:0,pointerId:1,clientX:800,clientY:400,pointerType:'mouse'});
 await page.locator('[data-project="woodlab"]').dispatchEvent('dblclick');
 expect(await page.evaluate(()=>({pos:localStorage.getItem('portfolio_archive_positions'),z:localStorage.getItem('portfolio_archive_z')}))).toEqual(stateBefore);
 await expect(page).toHaveURL(/archive$/);await done();
 expect(await staticSnapshot()).toEqual(before.archive);
 const drag = async (selector, dx, dy) => {
  const el=page.locator(selector), rect=await el.boundingBox();
  await page.mouse.move(rect.x+rect.width*.45,rect.y+rect.height*.18);
  await page.mouse.down();await page.mouse.move(rect.x+rect.width*.45+dx,rect.y+rect.height*.18+dy,{steps:8});await page.mouse.up();
 };
 await drag('.archive-directory',36,-30);
 await drag('[data-project="woodlab"]',60,30);
 await page.locator('[data-project="woodlab"]').dblclick({position:{x:80,y:80}});
 await expect(page).toHaveURL(/project\/woodlab$/);
 const saved = await page.evaluate(()=>({pos:JSON.parse(localStorage.getItem('portfolio_archive_positions')),z:JSON.parse(localStorage.getItem('portfolio_archive_z'))}));
 expect(saved.pos.directory).toBeTruthy();expect(saved.pos.woodlab).toBeTruthy();
 await page.keyboard.press('Escape');await expect(page).toHaveURL(/archive$/);await done();
 await expect(page.locator('[data-reveal-item]')).toHaveCount(0);
 for(const id of ['directory','woodlab']){
  const selector=id==='directory'?'.archive-directory':`[data-project="${id}"]`;
  const restored=await page.locator(selector).evaluate(e=>({x:parseFloat(e.style.left)/1568,y:parseFloat(e.style.top)/900,z:Number(e.style.zIndex)}));
  expect(restored).toEqual({...saved.pos[id],z:saved.z[id]});
 }
 checks.push('Archive: input blocked until landing, then directory/project drag and double-click work; return restores positions/z with no replay');

 await page.goto('http://localhost:5173/#/choose');await page.locator('.nav-content').focus();await page.keyboard.press('Enter');
 await page.keyboard.press('Escape');await page.waitForTimeout(450);await expect(page).toHaveURL(/choose$/);
 expect(await page.locator('.stage').evaluate(e=>e.inert)).toBe(false);
 await page.locator('.nav-content').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/archive$/);await done();
 await page.goto('http://localhost:5173/#/choose');await page.locator('.nav-home').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/cover$/);
 checks.push('Choose transitions cancel cleanly with Escape; subsequent navigation and reverse Home transition remain usable');

 for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[844,390]]){
  await page.setViewportSize({width,height});
  await enter('about');const a=await timing();
  expect(Math.max(...a.map(x=>x.delay+x.duration))).toBeLessThanOrEqual(width<1024?1500:2100);
  await done();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await enter('archive');const ar=await timing();
  expect(Math.max(...ar.map(x=>x.delay+x.duration))).toBeLessThanOrEqual(width<1024?1500:2100);await done();
 }
 checks.push('All five landscape sizes fit; phone reveals finish under 1.5s');
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await enter('about');const reduced=await timing();
 expect(reduced.filter(a=>a.kind==='paper').every(a=>a.frames.every(f=>!f.rotate&&!f.scale))).toBe(true);
 expect(reduced.filter(a=>a.kind==='ink').every(a=>a.duration>=200&&a.duration<=300)).toBe(true);await done();
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:768,height:1024});await page.goto('http://localhost:5173/#/about');await expect(page.locator('#orientation-message')).toBeVisible();
 await page.setViewportSize({width:1024,height:768});await done();
 await enter('about');await page.keyboard.press('Escape');await expect(page).toHaveURL(/choose$/);
 await page.waitForTimeout(2200);await expect(page).toHaveURL(/choose$/);
 checks.push('Reduced motion has no rotation/settling; portrait-to-landscape and mid-entry navigation clean up correctly');
 expect(errors).toEqual([]);
 await fs.writeFile('qa/reveal-verification.json',JSON.stringify({checks,errors},null,2));
 console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
