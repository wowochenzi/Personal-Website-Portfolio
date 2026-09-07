# 10 TECHNICAL IMPLEMENTATION SPEC

## 1. 技术栈

优先：

- HTML5
- CSS3
- Vanilla JavaScript
- `page-flip`（StPageFlip）用于主项目翻书
- 可选 GSAP 仅用于复杂场景过渡；若 CSS 足够则不引入

不要为了实现该网站主动改成 React / Vue。

## 2. 建议目录

```text
portfolio/
├─ index.html
├─ styles/
│  ├─ base.css
│  ├─ scenes.css
│  ├─ cover.css
│  ├─ choose.css
│  ├─ about.css
│  ├─ archive.css
│  ├─ book.css
│  ├─ other.css
│  └─ responsive.css
├─ scripts/
│  ├─ app.js
│  ├─ router.js
│  ├─ cover.js
│  ├─ choose.js
│  ├─ archive.js
│  ├─ drag.js
│  ├─ book.js
│  ├─ other.js
│  └─ media.js
├─ content/
│  └─ projects.json
└─ assets/
   ├─ global/
   ├─ cover/
   ├─ choose/
   ├─ about/
   ├─ archive/
   ├─ projects/
   ├─ other/
   └─ media/
```

## 3. Figma 资产

必须使用 Figma MCP / Figma 导出获取原始资产。

禁止：
- 截图后二次临摹
- 用 CSS 重新绘制独特纸张素材
- 用 AI 图替换 Figma 素材

Figma MCP 临时 URL 会过期，因此生产代码必须把资产保存到项目本地。

## 4. State

```js
const state = {
  scene: 'cover',
  activeProject: null,
  activeOtherFolder: null,
  archivePositions: {},
  archiveZ: {},
  bookPage: {},
  reducedMotion: false,
};
```

## 5. Router

Hash Router 即可。

刷新项目路由后，应能直接进入对应 Project。

## 6. Archive Persistence

localStorage 可保存：

```text
portfolio_archive_positions
portfolio_archive_z
portfolio_archive_hint_seen
```

## 7. Media

视频：

```html
<video
  muted
  playsinline
  preload="metadata"
  poster="..."
></video>
```

接近视区再加载。

用户离开视频区域时可暂停。

## 8. PAWTERN 手机 Demo

建议结构：

```html
<div class="phone-demo">
  <video class="phone-demo__screen"></video>
  <img class="phone-demo__frame" ...>
</div>
```

`05_PAWTERN_PHONE_FRAME` 在最上层。
屏幕区域通过 CSS `overflow:hidden` / border-radius 精确定位。

## 9. Accessibility

必须支持：
- Tab focus
- Enter / Space 打开交互项
- Esc 返回
- ArrowLeft / ArrowRight 翻书
- 图片 alt
- 视频可操作
- `prefers-reduced-motion`

## 10. Performance

首屏只加载：
- Global
- Cover
- Choose 必要资源

About / Archive 按场景预加载。
Project Book 在打开项目后加载。
Other strip 在进入 Other Works 后加载。

不要首屏一次请求所有书页与四条长 strip。

## 11. SEO / Meta

```html
<title>曹雨晨的PORTFOLIO</title>
<meta name="description" content="曹雨晨个人设计作品集，涵盖服务设计、AI辅助设计、交互体验、数字文化与数据可视化。">
```

## 12. External URL

`projects.json` 中 URL 为空时不显示按钮。
所有外链：

```html
target="_blank"
rel="noopener noreferrer"
```

## 13. Error Handling

媒体加载失败：
- 保留 poster / 占位纸张
- 不破坏布局

Figma asset 未找到：
- 停止并报告缺失 frame
- 不自行生成替代视觉
