# CODEX PROMPT｜曹雨晨的PORTFOLIO

请根据当前仓库中的全部 SPEC、SKILL 与以下 Figma 文件，完整开发我的 HTML 个人作品集网站。

Figma：
https://www.figma.com/design/I0vjlstlIsfglzKtYf6oK3/PORTFOLIO_WEB_ASSETS?node-id=0-1

网站 `<title>` 必须为：

**曹雨晨的PORTFOLIO**

## 开发前

请先完整阅读：

- `README.md`
- `00_MASTER_SPEC.md`
- `01_FIGMA_SOURCE_MAP.md`
- `02_INFORMATION_ARCHITECTURE.md`
- `03_VISUAL_SPEC.md`
- `04_INTERACTION_MOTION_SPEC.md`
- `05_RESPONSIVE_SPEC.md`
- `06_ARCHIVE_PROJECT_SELECTION_SPEC.md`
- `07_PROJECT_BOOK_SPEC.md`
- `08_OTHER_WORKS_SPEC.md`
- `09_CONTENT_COPY.md`
- `10_TECHNICAL_IMPLEMENTATION_SPEC.md`
- `11_QA_ACCEPTANCE_SPEC.md`
- `skills/portfolio-book-viewer/SKILL.md`
- `skills/portfolio-folder-stack/SKILL.md`

不要只根据这段提示词自行理解后跳过 SPEC。

## Figma

必须使用 Figma MCP 读取对应 Page / Frame，并将需要的 Figma 资产下载到项目本地。

最终 Figma Reference 基准为 **1568×900**，Other Works Active Reference 为 **1568×1510**。

不要：
- 自行重绘独特纸张素材
- 用 AI 素材替换 Figma
- 根据截图近似临摹
- 长期直接引用会过期的 Figma MCP asset URL

## 技术

优先使用：
- HTML
- CSS
- Vanilla JavaScript
- `page-flip` / StPageFlip 实现项目真实翻书

除非仓库已有其他前端框架，否则不要引入 React / Vue / Tailwind。

代码必须模块化，不要把所有逻辑塞进一个 HTML 文件。

## 必须实现的场景

1. Cover
2. 2.5D Folder Navigation
3. About Me
4. Archive / Content
5. PAWTERN Book + Demo
6. WoodLab Book + Demo
7. NuoFeild Book + Demo
8. 追花为生 Book + Demo
9. Other Works

当前 Figma 没有独立 End / Contact Page，不要擅自新增。

## Cover

严格参考 `01_COVER_REFERENCE_FULL`。

点击“点击打开档案”后：
先表现轻微文件夹打开，再进入 `02_FOLDER_NAV`。

## Folder Navigation

严格参考 `02_FOLDER_NAV_REFERENCE_DEFAULT` 和三个 Hover Reference。

三项：
- Home Page
- About Me
- Content

Hover 时文件与标题作为同一个整体向上浮动。
点击分别进入 Cover / About / Archive。

不要改成普通三卡片导航。

## About

严格参考 `03_ABOUT_REFERENCE_FULL`。
保留蓝卡、牛皮纸、右侧米白履历纸和照片的层级。
注意当前 `03_ABOUT_BLUE_CARD_HOLE_EDGE` 实际是右侧大米白纸视觉素材。

## Archive

严格参考 `04_ARCHIVE_REFERENCE_DEFAULT_LAYOUT`。

四个主项目意象与 Other：
- 可自由拖拽
- 点击提升 z-index
- 返回页面时保持用户拖拽位置
- 底部 `底部文件夹遮罩` 必须保持前景遮挡关系

Desktop 双击主项目直接进入 Book。
不要加入项目封套。

## Book Viewer

严格执行：

`skills/portfolio-book-viewer/SKILL.md`

尤其注意：

**书摊开时，内页下方必须能看到略微向左右外侧和底部凸出的封面 / 封底承托层。**

虽然不展示独立封面内容，但必须靠这层凸边、页堆厚度、书脊、阴影让它明确看起来是一“本书”。

不得做成两张平面图片或普通 carousel。

书页必须直接使用 Figma：
- PAWTERN 18 页
- WoodLab 10 页
- NuoFeild 8 页
- 追花为生 8 页

不要拉伸或裁切文字。

## Project Info / Demo

项目说明使用 `09_CONTENT_COPY.md`。

PAWTERN：
- Book 下方
- 左侧 `05_PAWTERN_PHONE_FRAME`
- 手机内部播放独立 GIF / MP4
- 右侧项目说明

WoodLab / NuoFeild / 追花为生：
- Book 下方先项目说明
- 再 16:9 Demo Video

外链 URL 在 `content/projects.json` 中为空时隐藏按钮，不允许发明 URL。

## Other Works

严格执行：

`skills/portfolio-folder-stack/SKILL.md`

分类固定：
- A 品牌设计
- B 商业创新设计
- C AIGC插画
- D 空间构成

虽然 Active Reference 没写分类文字，但网页必须一直保留这些标签。

点击文件夹后：
- 依据对应 Active Reference 调整四层文件夹位置
- active 上方层向上
- active 下方层向下
- 页面展开到可滚动的 1510 reference 高度
- active 文件夹内部显示作品长条

直接使用：
- `09_OTHER_STRIP_A`
- `09_OTHER_STRIP_B`
- `09_OTHER_STRIP_C`
- `09_OTHER_STRIP_D`

不要重新拼它们内部的小图。

滚动窗口一次约展示两张作品，继续匀速横向自动滚动；Hover / Drag 暂停。

A 下方显示：
**东一品牌焕新策略全案**
及 SPEC 中说明。

B 下方显示：
**香印香氛疗愈丝巾**
及 SPEC 中说明。

C/D 不额外强制说明。

## Responsive

Source canvas 为 1568×900。

必须验证：
- 1920×1080
- 1440×900
- 常见 Laptop
- iPad Landscape
- Phone Landscape

Phone / iPad Portrait：
只显示“请旋转至横屏查看作品集”。

Phone Landscape 的主项目 Book 默认单页模式。

## 交付要求

完成后：

1. 启动本地预览
2. 按 `11_QA_ACCEPTANCE_SPEC.md` 自检
3. 修复明显偏差
4. 确保无严重 console error
5. 确保资源使用本地文件
6. 确保所有场景可返回
7. 不要修改我的 Figma 文件

最终向我说明：
- 项目文件结构
- 启动方式
- 哪些媒体 / 外链仍需要我补充
- 是否有任何 Figma 资产无法读取
