import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1568,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
for(const route of ['cover','choose','about','archive','project/pawtern','project/woodlab','project/nuofield','project/beeflow','other']){
 await page.goto('http://localhost:5173/#/'+route);await page.waitForTimeout(700);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
 await page.screenshot({path:`qa/screenshots/${route.replace('/','-')}.png`});
 console.log(route,await page.locator('img').evaluateAll(a=>({images:a.length,broken:a.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)})));
}
for(const k of ['A','B','C','D']){await page.locator('.label-'+k).click();await page.waitForTimeout(700);await page.screenshot({path:`qa/screenshots/other-${k}.png`,fullPage:true});}
console.log('errors',errors);await fs.writeFile('qa/browser-errors.json',JSON.stringify(errors,null,2));await browser.close();
