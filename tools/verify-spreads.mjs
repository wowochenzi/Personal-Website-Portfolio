import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:2148,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const id of ['pawtern','woodlab','nuofield','beeflow']){
  await page.goto('http://localhost:5173/#/project/'+id);
  await page.locator('.book-page img').first().waitFor();
  await page.locator('.book-page img').evaluateAll(a=>Promise.all(a.map(i=>i.decode())));
  const count=await page.locator('.book-page').count();
  for(let i=0;i<count;i+=2){
   const geometry=await page.locator('.book-page').evaluateAll((pages,start)=>pages.slice(start,start+2).map(e=>({page:e.getBoundingClientRect().toJSON(),images:[...e.querySelectorAll('img')].map(img=>({rect:img.getBoundingClientRect().toJSON(),ratio:img.naturalWidth/img.naturalHeight}))})),i);
   const [left,right]=geometry;
   expect(Math.abs(left.page.right-right.page.left)).toBeLessThan(.1);
   for(let j=0;j<2;j++){
    expect(Math.abs(left.images[j].rect.top-right.images[j].rect.top)).toBeLessThan(.1);
    expect(Math.abs(left.images[j].rect.left-right.images[j].rect.left)).toBeLessThan(.1);
    expect(left.images[j].rect.width/left.images[j].rect.height).toBeCloseTo(left.images[j].ratio,3);
   }
   expect(Math.abs(left.images[0].rect.right-left.images[1].rect.left)).toBeLessThan(.1);
   if(i+2<count){await page.locator('.next').click();await page.waitForTimeout(750);}
  }
  console.log(id+': all spreads continuous, same scale, no center gap');
 }
 expect(errors).toEqual([]);
}finally{await browser.close();}
