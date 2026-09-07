# 曹雨晨的PORTFOLIO · 交付与启动

网站采用 HTML、CSS、Vanilla JavaScript 和本地 StPageFlip；本地启动无需构建，公开发布使用 `npm.cmd run build` 打包。页面标题为“曹雨晨的PORTFOLIO”。

在线入口：[预览作品集](https://wowochenzi.github.io/Personal-Website-Portfolio/)。仓库：[Personal-Website-Portfolio](https://github.com/wowochenzi/Personal-Website-Portfolio)。最新学生工作档案袋、内页刷新与首页按钮修复见 qa/STUDENT_WORK.md，部署与媒体体积处理见 qa/RELEASE.md。

最新交互与高清媒体迭代记录见 qa/INTERACTION_ITERATION.md，包含十项实现、长图实际导出尺寸、录屏帧检查及素材限制。

About / Content 新增逐层落纸与笔记揭示入场，具体顺序、适配与检查见 qa/ARCHIVE_REVEAL.md。Project 返回 Archive 只短淡入并恢复原位置；两个页面的最终静态构图保持不变。

## PowerShell 启动

当前电脑已经安装 Node.js。在 PowerShell 逐行执行：

```powershell
cd "C:\Users\ASUS\Documents\ChatGPT\个人作品集网站"
npm.cmd run dev
```

浏览器打开 **http://localhost:5173/**。保持这个 PowerShell 窗口运行；按 `Ctrl+C` 停止服务。使用 `npm.cmd` 可避免 PowerShell 对 npm.ps1 的执行策略限制。不要直接双击 index.html：模块和 JSON 需要通过 HTTP 加载。

如果预览已经在运行，直接打开上述地址即可。若端口被其他程序占用，可以执行：

```powershell
$env:PORT="5174"
npm.cmd run dev
```

此时打开 http://localhost:5174/。关闭该 PowerShell 窗口后，临时端口设置随之结束。

在另一台电脑上，需要先安装 Node.js；预览服务器仅使用 Node 内置模块，运行网站无需安装依赖。重新安装开发与测试依赖时执行 `npm.cmd ci`。

## 文件结构

```text
index.html                    网站入口
styles/                       基础、场景、翻书、Other、响应式样式
scripts/                      路由及各场景模块、拖拽、媒体加载
content/projects.json         项目文案、书页顺序、Demo 路径、外链
content/assets.json           Figma 资产名称与本地文件映射
assets/                       本地纸张、照片、项目页、作品长条
  raw/                        Figma 原始图像
  vendor/                     StPageFlip 及许可证
  fonts/                      Arvo 字体及 OFL 许可证
  media/                      四个项目的本地高清录屏
design/figma-trees.json        Figma 节点数据；About 运行时需要
tools/server.mjs              本地预览服务器
tools/verify.mjs              场景与尺寸回归检查
tools/verify-touch.mjs        触控、旋转、历史导航及资源检查
tools/inspect.mjs             截图与图片加载检查
qa/                           验收说明及检查结果
00–11 SPEC / skills/           原始开发规范
```

推送到 GitHub 的 main 分支后，Pages 工作流自动构建并发布。构建只复制网站运行文件至 dist，保留相对路径；不打包 node_modules、tools、qa、临时导出文件和傩场大体积原片。

## 场景和操作

场景按窗口可用宽度等比例展开，移除了原先受高度限制产生的左右空白。内容高于窗口时可向下滚动，素材和文字不会被横向拉伸。

- Cover 点击打开档案，轻微开合后进入三层文件导航。
- Home Page / About Me / Content 分别进入封面、个人介绍、档案桌面。
- Archive 五个物件可拖拽；位置与层级保存在当前浏览器。电脑双击主项目打开书；触屏轻点打开；键盘 Enter 也可打开。
- 四本书分别为 18、10、8、8 页。桌面和 iPad 横屏双页，手机横屏单页。支持按钮、左右方向键、点击页边和触控滑动。
- Other Works 保留四个分类标签，点击展开对应文件夹；作品长条自动横移，悬停和拖拽时暂停。
- 各场景提供返回入口；Escape 可返回上层。手机和 iPad 竖屏只显示旋转提示。

## 已配置的线上项目

| 项目 | 外链 |
| --- | --- |
| PAWTERN | https://wowochenzi.github.io/Pawtern/ |
| WoodLab | https://www.wanghuaisen.com/ |
| NuoFeild | https://wowochenzi.github.io/nuo-field/ |
| 追花为生 | https://liuyiling021122-jpg.github.io/visual-analysis/ |

这些地址通过项目说明中的按钮打开。它们是外部网站，不会被当作本地视频或嵌入的 iframe。

## 项目演示媒体

四个项目的原始高清录屏均已保存在 `assets/media` 并写入 `content/projects.json`。PAWTERN 在圆角手机样机内静音自动循环播放，无人工控制。WoodLab、NuoFeild 与追花为生使用简约米色圆角边框，提供播放/暂停、进度与音量控制；WoodLab 和追花为生精确裁去录屏的外侧黑边，并按裁后比例显示，源文件不转码或拉伸。傩场默认开启配乐，浏览器限制有声自动播放时可点击“播放影片 · 开启配乐”。离开视口或切换后台时暂停，手动暂停后不会因滚动回来而自动重启。

## Figma 与字体

已通过 Figma MCP 读取所需 Page / Reference，下载运行所需图片；44 张书页和 A/B/C/D 四条作品长图均使用本地 Figma 资产。未修改 Figma，也未使用 AI 图片替代。初始选区读取失败已通过具体 Frame 定位解决，目前没有阻塞交付的不可读取图片资产。素材映射清单共 124 项，另有联系方式及学生工作等独立本地素材。

源设计的 GeoSlab 字体文件未提供，网页可编辑英文标题使用本地 OFL Arvo 替代，因此字形仍有差异。封面字样使用 Figma 导出的图像。中文按设备字体回退；若需要字体完全一致，仍需提供可用于网页的授权字体文件。

## 验收与复测

先启动 5173 预览，再在另一个 PowerShell 窗口执行：

```powershell
cd "C:\Users\ASUS\Documents\ChatGPT\个人作品集网站"
npm.cmd ci
npm.cmd run verify
node tools/verify-touch.mjs
```

测试使用电脑上已安装的 Microsoft Edge。详情见 qa/ACCEPTANCE_REPORT.md；机器结果保存在 qa/verification.json、qa/touch-verification.json。四段真实 Demo 已完成本地解码、自动播放、循环和比例检查；真机 Safari 仍建议在交付设备上复核一次。
