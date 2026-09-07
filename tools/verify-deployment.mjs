import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';

const base=process.env.PORTFOLIO_URL||'http://localhost:5173/dist/index.html';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const files=new Set();page.on('request',r=>{if(/figma.com\/api\/mcp/.test(r.url()))errors.push('Temporary Figma URL: '+r.url());files.add(r.url());});
const visit=async route=>{
 await page.goto(base+'#/'+route);
 await expect(page.locator('#app')).toHaveAttribute('data-scene',route.split('/')[0]);
};
try{
 await visit('cover');await page.waitForFunction(()=>document.querySelector('.cover')?.dataset.ready==='true');
 await expect(page).toHaveTitle('曹雨晨的PORTFOLIO');
 expect(await page.locator('.cover-open').evaluate(e=>parseFloat(getComputedStyle(e).top))).toBe(667);
 await page.locator('.cover-open').click();await expect(page).toHaveURL(/choose$/);
 await page.locator('.nav-about').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/about$/);
 await page.waitForFunction(()=>document.querySelector('.about')?.dataset.revealState==='complete');
 await page.reload();await page.waitForFunction(()=>document.querySelector('.about')?.dataset.revealState==='complete');
 await expect(page.locator('.cover,.opening-sequence')).toHaveCount(0);
 await page.locator('.student-work-trigger').focus();await page.keyboard.press('Enter');
 await expect(page.locator('.about')).toHaveAttribute('data-student-work-state','open');await page.keyboard.press('Escape');
 await expect(page.locator('.about')).toHaveAttribute('data-student-work-state','closed');
 await page.locator('.about-browse-projects').click();await expect(page).toHaveURL(/archive$/);
 checks.push('Published-path title, raised Cover CTA, folder navigation, direct About refresh, Student Work and project journey.');
 const data=await (await page.request.get(new URL('content/projects.json',base).href)).json();
 for(const project of data.projects){
  await visit('project/'+project.id);await expect(page.locator('.flipbook')).toBeVisible();
  await page.locator('.next').click();await page.waitForTimeout(800);
  await page.locator('video.demo-media').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('video.demo-media')?.readyState>=2,null,{timeout:60000});
  const video=await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,error:v.error?.code,src:v.currentSrc}));
  expect(video.error).toBeUndefined();expect([video.width,video.height]).toEqual(project.demoSize);
  expect(video.src).toBe(new URL(project.demoSrc,base).href);
  const range=await page.request.get(video.src,{headers:{Range:'bytes=0-1023'}});
  expect(range.status()).toBe(206);expect((await range.body()).length).toBe(1024);
 }
 checks.push('All four project books turn; all four local videos decode at their original sizes; server byte ranges work.');
 await visit('other');
 for(const category of 'ABCD'){
  await page.locator('.label-'+category).click();
  await expect(page.locator('#gallery-'+category+' .strip-window')).toBeVisible();
 }
 checks.push('Other Works A/B/C/D expand under the deployment subdirectory.');
 expect(errors).toEqual([]);
}finally{
 const result={base,checks,errors,localRequests:files.size};
 await fs.writeFile('qa/deployment-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
}
