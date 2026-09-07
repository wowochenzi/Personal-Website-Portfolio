import{chromium}from'@playwright/test';
import fs from'node:fs/promises';
const out='qa/screenshots/iteration/flip-frames';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1568,height:900}});
await page.goto('http://localhost:5173/#/project/woodlab');await page.locator('.book-page img').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));await page.waitForTimeout(500);
const cdp=await page.context().newCDPSession(page),frames=[],writes=[];let start;
cdp.on('Page.screencastFrame',event=>{start??=event.metadata.timestamp;const file=`${out}/${String(frames.length).padStart(3,'0')}.jpg`;frames.push({file,t:event.metadata.timestamp-start});writes.push(fs.writeFile(file,Buffer.from(event.data,'base64')));void cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId});});
await cdp.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:1568,maxHeight:900,everyNthFrame:1});
await page.keyboard.press('ArrowRight');await page.waitForTimeout(1000);await cdp.send('Page.stopScreencast');await Promise.all(writes);await fs.writeFile('qa/flip-recording-frames.json',JSON.stringify(frames,null,2));console.log(frames);await browser.close();
