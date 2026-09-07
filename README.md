# 曹雨晨的PORTFOLIO

**[点击在线预览作品集 →](https://wowochenzi.github.io/Personal-Website-Portfolio/)**

纸质档案夹风格的个人设计作品集，包含 About Me、学生工作档案袋、可拖拽项目目录、四本真实翻页项目书及高清演示视频、Other Works 分类浏览。建议使用横屏。

## 本地启动（PowerShell）

```powershell
cd "C:\Users\ASUS\Documents\ChatGPT\个人作品集网站"
npm.cmd install
npm.cmd run dev
```

打开 [http://localhost:5173](http://localhost:5173)。停止服务按 `Ctrl+C`。从 GitHub 下载到其他目录时，将第一行替换为实际目录。

## 文件与发布

- `index.html`、`styles/`、`scripts/`：模块化 HTML、CSS、Vanilla JavaScript。
- `content/`：项目文案、书页素材映射和外链；`design/figma-trees.json`：Figma 布局数据。
- `assets/`：本地图片、书页、视频、字体和翻书组件；`skills/` 与编号 SPEC：设计规范。
- `tools/`：本地服务器、构建与验收；`qa/`：验证记录。
- `.github/workflows/pages.yml`：推送 `main` 后构建并发布到 GitHub Pages。

运行 `npm.cmd run build` 生成 `dist/`。构建只复制网站运行文件，自动检查素材存在性和文件体积。站点使用相对资源路径及 Hash 路由，各页面刷新会直接打开当前页面。

四个演示视频和项目外链均已接入。傩场发布视频保持 1920×1080、60fps 和原音乐音轨；本地原片不提交 Git。交互音效的 16 个 MP3 尚待提供，缺失时静默运行，不影响动画和视频配乐，详见 [音效清单](assets/audio/README.md)。

## 原始设计 SPEC

Figma Source:
https://www.figma.com/design/I0vjlstlIsfglzKtYf6oK3/PORTFOLIO_WEB_ASSETS?node-id=0-1

## 已扫描并确认的 Figma Page

- `00_GLOBAL`
- `01_COVER`
- `02_FOLDER_NAV`
- `03_ABOUT`
- `04_ARCHIVE`
- `05_PROJECT_PAWTERN`
- `06_PROJECT_WOODLAB`
- `07_PROJECT_NUOFIELD`
- `08_PROJECT_BEEFLOW`
- `09_OTHER_WORKS`

当前最终完整 Reference Frame 以 **1568 × 900** 为主要设计基准；`09_OTHER_WORKS` 激活态 Reference 为 **1568 × 1510**。开发时不得继续沿用旧的 1440 × 900 假设。

## 核心体验

**Cover → 2.5D Folder Navigation → About / Content → Archive Desk → Project Book → Project Info + Demo**

Other Works 为独立的多层文件夹展开交互。

## 使用顺序

Codex 开发前必须依次阅读：

1. `00_MASTER_SPEC.md`
2. `01_FIGMA_SOURCE_MAP.md`
3. `02_INFORMATION_ARCHITECTURE.md`
4. `03_VISUAL_SPEC.md`
5. `04_INTERACTION_MOTION_SPEC.md`
6. `05_RESPONSIVE_SPEC.md`
7. `06_ARCHIVE_PROJECT_SELECTION_SPEC.md`
8. `07_PROJECT_BOOK_SPEC.md`
9. `08_OTHER_WORKS_SPEC.md`
10. `09_CONTENT_COPY.md`
11. `10_TECHNICAL_IMPLEMENTATION_SPEC.md`
12. `11_QA_ACCEPTANCE_SPEC.md`
13. `skills/portfolio-book-viewer/SKILL.md`
14. `skills/portfolio-folder-stack/SKILL.md`

最后执行 `CODEX_PROMPT.md`。

## 技术方向

目标为纯静态、可部署网站：

- HTML5
- CSS3
- Vanilla JavaScript
- `page-flip` / StPageFlip 用于真实翻页
- 不使用 React / Vue，除非现有代码仓库已经明确采用框架
- 所有 Figma 资产下载到本地，禁止长期引用会过期的 Figma MCP URL

## 视觉原则

Figma 是视觉真值来源；SPEC 是行为与逻辑真值来源。

禁止：
- SaaS Landing Page
- Glassmorphism
- 霓虹 / 科技渐变
- 大面积圆角卡片
- Dashboard
- 普通图片轮播代替翻书
- 擅自生成或替换 Figma 素材
