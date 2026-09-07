# 公开发布验收

目标仓库：`wowochenzi/Personal-Website-Portfolio`，公开静态站点地址：

https://wowochenzi.github.io/Personal-Website-Portfolio/

## 发布包

`npm run build` 输出 `dist/`，只包含网站运行文件，不含本地工具、测试截图、原始下载地址或大体积原片。当前 182 文件、498.4 MiB，均低于 GitHub Pages 容量限制，每个文件低于 GitHub 100 MiB 限制。资源路径全部为相对路径，支持项目子目录部署。

傩场原片 `assets/media/nuofield-demo.mp4` 保留在本地并被 Git 忽略。发布版 `nuofield-demo-web.mp4` 使用 H.264 CRF 18 / slow、yuv420p、faststart，原有 1920×1080、60fps、62.066939 秒保持不变，由 138,165,438 降至 58,272,692 字节。音乐流直接复制，无重新编码；前后音轨 SHA-256 相同。

对全片每秒抽样比较（62 帧），SSIM 均值 0.99484、最低 0.98485。其他三个视频只将 MP4 的 moov 索引移至 mdat 前，使用 stream copy，无重新编码；处理前后的视频流和音频流 SHA-256 全部相同，原始封装备份在本地 .cache/media-original。录屏黑边通过已有容器裁切参数处理，画面不拉伸。

首次线上复验发现原先三个 MP4 索引在文件尾部，冷加载时 PAWTERN 解码超过 60 秒，因此统一改为 faststart。构建脚本现在会拒绝索引放在文件尾部的 MP4，避免后续媒体替换再次引入此问题。

## 本地验收

- `verify-student-work.mjs`：学生工作档案袋及原项目按钮保护，鼠标/键盘/触摸/六种横屏/Reduced Motion。
- `verify-opening.mjs`：五次首页硬刷新、八种深链的首次加载和刷新无 Cover 闪现、开屏时序、六种尺寸、声音回退。
- `verify-reveal.mjs`：About/Archive 原有逐层铺开动画、最终布局及交互保持。
- `verify.mjs`、`verify-touch.mjs`：场景导航、拖拽保存、翻书、Other、横竖屏及本地资源。
- `verify-spreads.mjs`：44 页组成的全部跨页对齐、同缩放比例、无中缝空隙。
- `verify-media.mjs`：视频比例、播放/暂停/循环/音量、傩场声音及浏览器自动播放限制回退。
- `verify-deployment.mjs`：真实发布子路径下导航、刷新、翻书、视频解码与 Range 请求；可通过 `PORTFOLIO_URL` 指向线上网址复验。

自动化结果分别写入同目录 JSON。交互音效 16 个 MP3 尚待提供；视觉动画与傩场视频配乐不受影响。
