import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[],checks=[],remote=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('request',r=>{if(!r.url().startsWith('http://localhost:5173/')&&!r.url().startsWith('data:'))remote.push(r.url());});
const goto=async route=>{await page.goto('http://localhost:5173/#/'+route);await page.waitForFunction(()=>!document.body.dataset.opening);await page.waitForTimeout(400);if(['about','archive'].includes(route))await page.waitForFunction(()=>document.querySelector('.stage')?.dataset.revealState==='complete');};
try{
 await goto('cover');expect((await page.locator('.cover-open').boundingBox()).height).toBeGreaterThanOrEqual(43.9);await page.locator('.cover-open').tap();await expect(page).toHaveURL(/choose$/);checks.push('Phone cover tap target >=44px and opens navigation');
 await goto('archive');await page.locator('[data-project="woodlab"]').tap({position:{x:30,y:30}});await expect(page).toHaveURL(/project\/woodlab$/);await expect(page.locator('.page-counter')).toHaveText('01 / 10');
 const r=await page.locator('.book-shell').boundingBox();await page.touchscreen.tap(r.x+r.width*.85,r.y+r.height*.5);await expect(page.locator('.page-counter')).toHaveText('02 / 10');checks.push('Touch archive opens book; one tap turns exactly one page');
 const cdp=await context.newCDPSession(page),x=r.x+r.width*.85,y=r.y+r.height*.6;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-r.width*.65*i/8,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(page.locator('.page-counter')).toHaveText('03 / 10');checks.push('Native touch swipe turns page');
 await page.setViewportSize({width:390,height:844});await expect(page.locator('#orientation-message')).toBeVisible();await page.setViewportSize({width:844,height:390});await expect(page.locator('.flipbook')).toBeVisible();await page.waitForTimeout(350);await expect(page.locator('.page-counter')).toHaveText('03 / 10');checks.push('Rotation preserves page and restores book');
 await page.locator('.back-link').tap();await expect(page).toHaveURL(/archive$/);await page.goBack();await expect(page).toHaveURL(/project\/woodlab$/);await expect(page.locator('.flipbook')).toBeVisible();await page.goForward();await expect(page).toHaveURL(/archive$/);checks.push('Browser back and forward restore scenes');
 await page.setViewportSize({width:1568,height:900});await goto('project/beeflow');const b=await page.locator('.book-shell').boundingBox();await page.mouse.click(b.x+b.width*.9,b.y+b.height*.5);await expect(page.locator('.page-counter')).toHaveText('03–04 / 8');checks.push('Desktop click advances exactly one spread');
 const manifest=JSON.parse(await fs.readFile('content/assets.json','utf8'));for(const a of Object.values(manifest)){expect(a.path).not.toMatch(/^https?:/);await fs.access(a.path);}
 const data=JSON.parse(await fs.readFile('content/projects.json','utf8'));expect(data.projects.map(p=>p.pages.length)).toEqual([18,10,8,8]);checks.push(`${Object.keys(manifest).length} manifest assets local; 44 book pages available`);
 expect(remote).toEqual([]);expect(errors).toEqual([]);
}finally{await fs.writeFile('qa/touch-verification.json',JSON.stringify({checks,errors,remote},null,2));console.log(JSON.stringify({checks,errors,remote},null,2));await browser.close();}
