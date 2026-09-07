export function cropStyle(width, height, crop = [0, 0, 0, 0]) {
 const [left, top, right, bottom] = crop;
 const visibleWidth = width - left - right, visibleHeight = height - top - bottom;
 return `aspect-ratio:${visibleWidth}/${visibleHeight};--media-width:${width / visibleWidth * 100}%;--media-height:${height / visibleHeight * 100}%;--media-left:${-left / visibleWidth * 100}%;--media-top:${-top / visibleHeight * 100}%`;
}

const timeLabel = seconds => {
 const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
 return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
};

export function prepareVideo(video, signal) {
 const shell = video.closest('.video-demo');
 const start = shell?.querySelector('.demo-start'), toggle = shell?.querySelector('.demo-toggle');
 const progress = shell?.querySelector('.demo-progress'), clock = shell?.querySelector('.demo-time');
 const mute = shell?.querySelector('.demo-mute'), volume = shell?.querySelector('.demo-volume');
 let visible = false, manualPause = false, pendingPlay = null, scrubbing = false;
 let lastVolume = 1;
 const listen = (target, type, handler) => target?.addEventListener(type, handler, {signal});
 const syncPlayback = () => {
  if (!shell) return;
  toggle.textContent = video.paused ? '播放' : '暂停';
  toggle.setAttribute('aria-label', video.paused ? '播放视频' : '暂停视频');
  if (!video.paused) start.hidden = true;
 };
 const syncTime = () => {
  if (!shell) return;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  progress.disabled = duration <= 0;
  progress.max = duration || 1;
  if (!scrubbing) progress.value = video.currentTime;
  progress.setAttribute('aria-valuetext', `${timeLabel(video.currentTime)}，共 ${timeLabel(duration)}`);
  clock.textContent = `${timeLabel(video.currentTime)} / ${timeLabel(duration)}`;
 };
 const syncVolume = () => {
  if (!shell) return;
  const silent = video.muted || video.volume === 0;
  volume.value = silent ? 0 : video.volume;
  volume.setAttribute('aria-valuetext', `${Math.round(Number(volume.value) * 100)}%`);
  mute.textContent = silent ? '开启声音' : '静音';
  mute.setAttribute('aria-label', silent ? '开启声音' : '静音');
 };
 const play = () => {
  if (signal.aborted || pendingPlay) return;
  pendingPlay = video.play().then(() => {
   if (!visible || document.hidden || signal.aborted) video.pause();
  }).catch(error => {
   // If sound requires a gesture, preserve the soundtrack and offer play.
   if (!signal.aborted && error.name === 'NotAllowedError' && start) start.hidden = false;
  }).finally(() => { pendingPlay = null; syncPlayback(); });
 };
 const reconcile = () => {
  if (visible && !document.hidden && !manualPause && video.getAttribute('src')) play();
  else video.pause();
 };
 const togglePlayback = () => {
  if (video.paused) { manualPause = false; play(); }
  else { manualPause = true; video.pause(); }
 };
 if (shell) {
  video.controls = false;
  shell.querySelector('.demo-controls').hidden = false;
  listen(toggle, 'click', togglePlayback);
  listen(video, 'click', togglePlayback);
  listen(start, 'click', () => { manualPause = false; play(); });
  listen(progress, 'input', () => {
   scrubbing = true;
   video.currentTime = Number(progress.value);
   syncTime();
  });
  listen(progress, 'change', () => { scrubbing = false; syncTime(); });
  listen(volume, 'input', () => {
   video.volume = Number(volume.value);
   video.muted = video.volume === 0;
   if (video.volume > 0) lastVolume = video.volume;
  });
  listen(mute, 'click', () => {
   if (video.muted || video.volume === 0) { video.volume = lastVolume; video.muted = false; }
   else { lastVolume = video.volume; video.muted = true; }
  });
  listen(video, 'volumechange', syncVolume);
  listen(video, 'timeupdate', syncTime);
  listen(video, 'durationchange', syncTime);
  listen(video, 'play', syncPlayback);
  listen(video, 'pause', syncPlayback);
  syncPlayback(); syncVolume(); syncTime();
 }
 listen(video, 'loadedmetadata', () => {
  const viewport = shell?.querySelector('.demo-viewport');
  if (viewport) viewport.style.cssText = cropStyle(video.videoWidth, video.videoHeight, viewport.dataset.crop.split(',').map(Number));
  syncTime(); reconcile();
 });
 listen(document, 'visibilitychange', reconcile);
 return {setVisible(value) { visible = value; reconcile(); }, reconcile};
}
