import {img, escapeHTML} from './shared.js';
import {cropStyle, prepareVideo} from './video-player.js';

export function mediaMarkup(project) {
 const source = project.demoSrc, phone = project.demoType === 'phone';
 const isVideo = source && !source.endsWith('.gif');
 const media = !source ? '<div class="media-pending">交互演示待补充</div>' : !isVideo
  ? `<img class="demo-media" data-src="${escapeHTML(source)}" alt="${escapeHTML(project.title)}交互演示">`
  : `<video class="demo-media" data-src="${escapeHTML(source)}" ${project.demoAudio && !phone ? '' : 'muted'} ${phone ? '' : 'controls'} loop playsinline preload="metadata" aria-label="${escapeHTML(project.title)}交互演示" ${project.poster ? `poster="${escapeHTML(project.poster)}"` : ''}></video>`;
 if (phone) return `<div class="phone-demo"><div class="phone-screen">${media}</div>${img('05_PAWTERN_PHONE_FRAME', 'phone-frame', 'PAWTERN 手机样机')}</div>`;
 const crop = project.demoCrop || [0, 0, 0, 0], [width, height] = project.demoSize || [16, 9];
 return `<div class="video-demo" role="group" aria-label="${escapeHTML(project.title)}视频播放器">
  <div class="demo-viewport" data-crop="${crop.join(',')}" style="${cropStyle(width, height, crop)}">${media}
   ${isVideo ? `<button class="demo-start" hidden>${project.demoAudio ? '播放影片 · 开启配乐' : '播放影片'} <span aria-hidden="true">▶</span></button>` : ''}
  </div>
  ${isVideo ? `<div class="demo-controls" hidden>
   <button class="demo-toggle" aria-label="播放视频">播放</button>
   <input class="demo-progress" type="range" min="0" max="1" step="0.1" value="0" aria-label="播放进度" disabled>
   <output class="demo-time" aria-live="off">0:00 / 0:00</output>
   <button class="demo-mute" aria-label="开启声音">声音</button>
   <input class="demo-volume" type="range" min="0" max="1" step="0.05" value="${project.demoAudio ? '1' : '0'}" aria-label="音量">
  </div>` : ''}
 </div>`;
}

export function observeMedia(root) {
 const controller = new AbortController(), players = new Map();
 const playback = new IntersectionObserver(entries => {
  for (const entry of entries) players.get(entry.target)?.setVisible(entry.isIntersecting && entry.intersectionRatio >= .05);
 }, {threshold: [0, .05]});
 const loader = new IntersectionObserver(entries => {
  for (const entry of entries) {
   const media = entry.target;
   if (!entry.isIntersecting || !media.dataset.src) continue;
   media.src = media.dataset.src;
   delete media.dataset.src;
   loader.unobserve(media);
   players.get(media)?.reconcile();
  }
 }, {rootMargin: '160px'});
 root.querySelectorAll('[data-src]').forEach(media => {
  if (media.tagName === 'VIDEO') {
   players.set(media, prepareVideo(media, controller.signal));
   playback.observe(media);
  }
  loader.observe(media);
  media.addEventListener('error', () => {
   const message = document.createElement('div');
   message.className = 'media-pending';
   message.textContent = '演示暂时无法播放';
   const shell = media.closest('.video-demo');
   if (shell) { shell.querySelector('.demo-controls').hidden = true; shell.querySelector('.demo-start').hidden = true; }
   media.replaceWith(message);
  }, {once: true, signal: controller.signal});
 });
 return () => {
  controller.abort(); loader.disconnect(); playback.disconnect();
  for (const media of players.keys()) media.pause();
 };
}
