import {chromium, expect} from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch({channel: 'msedge', headless: true, args: ['--autoplay-policy=document-user-activation-required']});
const page = await browser.newPage({viewport: {width: 1440, height: 900}});
const errors = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
const open = async id => {
 await page.goto(`http://localhost:5173/#/project/${id}`);
 await page.locator('video.demo-media').scrollIntoViewIfNeeded();
 await page.waitForFunction(() => document.querySelector('video.demo-media')?.readyState >= 2);
};
const paused = () => page.locator('video.demo-media').evaluate(video => video.paused);
try {
 // Exercise the browser-policy rejection path even when headless Edge allows sound.
 await page.addInitScript(() => {
  let needsGesture = true;
  const originalPlay = HTMLMediaElement.prototype.play;
  document.addEventListener('pointerdown', () => { needsGesture = false; }, {capture: true});
  HTMLMediaElement.prototype.play = function () {
   if (needsGesture && !this.muted) return Promise.reject(new DOMException('Sound needs a gesture', 'NotAllowedError'));
   return originalPlay.call(this);
  };
 });
 await open('nuofield');
 await expect(page.locator('.demo-start')).toBeVisible();
 expect(await page.locator('video').evaluate(v => v.muted)).toBe(false);
 await page.locator('.demo-start').click();
 await expect.poll(paused).toBe(false);
 await expect.poll(() => page.locator('video').evaluate(v => v.webkitAudioDecodedByteCount)).toBeGreaterThan(0);
 checks.push('Nuo soundtrack decodes with sound enabled; simulated autoplay rejection recovers after clicking play');

 for (const id of ['woodlab', 'nuofield', 'beeflow']) {
  await open(id);
  if (await paused()) await page.locator('.demo-toggle').click();
  await expect.poll(paused).toBe(false);
  await page.locator('.demo-toggle').click();
  await expect.poll(paused).toBe(true);
  await page.locator('.book-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await page.locator('.video-demo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  expect(await paused()).toBe(true);
  const progress = page.locator('.demo-progress');
  await progress.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.locator('video').evaluate(v => v.currentTime)).toBeGreaterThan(0);
  const volume = page.locator('.demo-volume');
  await volume.focus();
  await page.keyboard.press('Home');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  expect(await page.locator('video').evaluate(v => ({volume: v.volume, muted: v.muted}))).toEqual({volume: .2, muted: false});
  await page.locator('.demo-mute').click();
  expect(await page.locator('video').evaluate(v => v.muted)).toBe(true);
  await page.locator('.demo-mute').click();
  expect(await page.locator('video').evaluate(v => v.muted)).toBe(false);
  await page.locator('video').evaluate(v => new Promise(resolve => {
   v.addEventListener('seeked', resolve, {once: true});
   v.currentTime = v.duration - .3;
  }));
  await page.locator('.demo-toggle').click();
  await expect.poll(() => page.locator('video').evaluate(v => v.currentTime), {timeout: 15000}).toBeLessThan(2);
  await page.locator('.demo-toggle').click();
  await page.locator('video').evaluate(v => new Promise(resolve => {
   v.addEventListener('seeked', resolve, {once: true}); v.currentTime = 3;
  }));
  const geometry = await page.locator('.demo-viewport').evaluate(e => {
   const v = e.querySelector('video'), b = v.getBoundingClientRect();
   const [l,t,r,d] = e.dataset.crop.split(',').map(Number);
   return {source: v.videoWidth/v.videoHeight, rendered: b.width/b.height,
    cropped: (v.videoWidth-l-r)/(v.videoHeight-t-d), viewport: e.clientWidth/e.clientHeight};
  });
  expect(Math.abs(geometry.source - geometry.rendered)).toBeLessThan(.001);
  expect(Math.abs(geometry.cropped - geometry.viewport)).toBeLessThan(.005);
  await page.locator('.video-demo').screenshot({path: `qa/screenshots/${id}-player-framed.png`});
  checks.push(`${id}: pause survives scrolling, play/seek/volume/mute/loop work, crop preserves pixel proportions`);
 }
 await open('pawtern');
 await expect.poll(paused).toBe(false);
 expect(await page.locator('video').evaluate(v => v.muted && !v.controls && v.loop)).toBe(true);
 await expect(page.locator('.demo-controls')).toHaveCount(0);
 checks.push('PAWTERN remains automatic, silent, looping, with no manual controls');
 await page.setViewportSize({width: 844, height: 390});
 await open('woodlab');
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.locator('.demo-controls').screenshot({path: 'qa/screenshots/media-controls-phone.png'});
 checks.push('Phone landscape controls fit without horizontal overflow');
 expect(errors).toEqual([]);
 const report = {checks, errors};
 await fs.writeFile('qa/media-verification.json', JSON.stringify(report, null, 2));
 console.log(JSON.stringify(report, null, 2));
} finally {await browser.close();}
