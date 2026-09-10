# 00 MASTER SPEC

## 1. 网站标题

浏览器 `<title>`：
**曹雨晨的PORTFOLIO**

## 2. 产品定位

将个人作品集做成一套“可打开、整理、翻阅”的数字档案体验，而不是传统纵向滚动作品集。

视觉关键词：

**复古档案 / 蓝色文件夹 / 哑光特种纸 / 编辑设计 / 纸张叠层 / 收藏 / 编目 / 克制拟物 / Analog-Digital Hybrid**

## 3. 核心流程

```text
COVER
  ↓ 点击打开档案
FOLDER_NAV
  ├─ Home Page → COVER
  ├─ About Me → ABOUT
  └─ Content → ARCHIVE

ARCHIVE
  ├─ 双击 PAWTERN → PROJECT_BOOK
  ├─ 双击 WoodLab → PROJECT_BOOK
  ├─ 双击 NuoField → PROJECT_BOOK
  ├─ 双击 追花为生 → PROJECT_BOOK
  └─ 点击 Other → OTHER_WORKS
```

项目内部：

```text
BOOK VIEWER
↓
项目短说明
↓
DEMO / GIF / VIDEO
↓
线上项目入口（如有）
```

## 4. 重要约束

- 首页打开档案后必须先进入 `02_FOLDER_NAV`，不能直接进入 About。
- 项目不再有“项目文件夹封套”，双击意象后直接进入书籍。
- 主项目翻书不需要 Figma 翻书参考；Figma 只提供实际书页。
- Other Works 不使用主项目翻书结构。
- iPad / 手机以横屏为正式体验；竖屏只显示旋转提示。
- 页面需适配不同电脑 viewport，不针对具体型号写死。
- 未在 Figma 或 SPEC 中出现的视觉内容不得自行扩展。

## 5. 项目顺序

1. PAWTERN 爪织
2. WoodLab 木玩工坊
3. NuoField 傩场
4. 追花为生
5. Other Works

## 6. 当前 Figma 无独立 End / Contact Page

V1 不擅自增加新的封底场景。
联系方式可保留在 About 或后续另行补充。
