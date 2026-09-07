# 04 INTERACTION & MOTION SPEC

## 1. 总原则

动效来自“纸张 / 文件夹 / 书”的物理逻辑。

允许：
- Slide
- Fold
- Page Flip
- Slight Rotation
- Layer Change
- Soft Scale
- Subtle Parallax
- Opacity

避免：
- Bounce
- 弹性过冲
- 粒子
- 光晕
- 360° 旋转
- 炫技式转场

## 2. Cover → Choose

点击“点击打开档案”：

1. 首页文件夹前层轻微下压 / 打开
2. 内部纸层有轻微抽出感
3. 500–800ms 内转入 `02_FOLDER_NAV`
4. 不经过 About

## 3. Folder Nav Hover

每个 `Home / About / Content` 文件与标题放在同一个交互容器。

Hover：
```css
transform: translateY(-22px) scale(1.01);
transition: 260ms cubic-bezier(.22,.72,.24,1);
```

实际位移可在 18–26px 之间微调，以 Figma Hover Reference 为准。

点击：
- Home → Cover
- About → About
- Content → Archive

## 4. Archive Drag

主项目意象支持自由拖拽：
- pointer down：提升 z-index
- dragging：允许 ±0.6° 微旋转
- pointer up：保存当前位置
- 不使用惯性甩动
- 不做磁吸

拖拽坐标保存为 0–1 normalized position，便于不同 viewport 恢复。

## 5. Archive Open Project

Desktop：
双击项目意象。

Touch：
单击选中后打开，不要求双击。

过渡：
1. 当前意象轻微放大
2. 其他意象 opacity 降低
3. Archive 淡出
4. Book Viewer 直接出现

**没有项目文件夹封套。**

## 6. Project

Book 下方自然滚动进入项目说明和 Demo。
不将 Demo 做成独立场景。

## 7. Return

项目返回 Archive：
1. Book 轻微合拢 / 缩小
2. Project 淡出
3. Archive 恢复
4. 拖拽位置与层级保持

## 8. Reduced Motion

尊重：
`prefers-reduced-motion: reduce`

此时：
- Scene 过渡改短 fade
- Book 改为短切页
- 取消 parallax
- 保留拖拽和结构
